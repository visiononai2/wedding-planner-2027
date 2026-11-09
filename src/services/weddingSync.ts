import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  Unsubscribe 
} from 'firebase/firestore';
import { getFirestoreDb, isFirebaseConfigured } from './firebase';
import { 
  Task, 
  RentalItem, 
  DressItem, 
  DecisionPoint, 
  EventDaySchedule, 
  PlanningNote, 
  WeddingSide, 
  PreWeddingTripPlan 
} from '../types/wedding';

export interface WeddingDataset {
  tasks: Task[];
  rentals: RentalItem[];
  dresses: DressItem[];
  days: EventDaySchedule[];
  decisions: DecisionPoint[];
  notes: PlanningNote[];
  preWeddingPlan: PreWeddingTripPlan;
  activeSide: WeddingSide;
  weddingYear: number;
  lastUpdated?: string;
}

export type SyncStatus = 
  | 'unconfigured' 
  | 'connecting' 
  | 'syncing' 
  | 'synced' 
  | 'offline' 
  | 'error';

const COLLECTION_NAME = 'wedding_planner';
const DOCUMENT_ID = 'wedding_2027';
const CACHE_KEY = 'wedding_dataset_cache_v2';

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let activeUnsubscribe: Unsubscribe | null = null;

/**
 * Remove undefined values to prevent Firestore serialization errors
 */
export function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (_, value) => {
    return value === undefined ? null : value;
  }));
}

/**
 * Read cached dataset from localStorage for instant, zero-flicker launch
 */
export function loadCachedWeddingData(): WeddingDataset | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.tasks)) {
      return parsed as WeddingDataset;
    }
  } catch (err) {
    console.warn('Failed to parse cached wedding dataset:', err);
  }
  return null;
}

/**
 * Write dataset to localStorage cache
 */
export function saveCachedWeddingData(data: WeddingDataset): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to cache wedding dataset locally:', err);
  }
}

/**
 * Cancel any scheduled cloud save
 */
export function cancelScheduledCloudSave(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}

/**
 * Save dataset immediately to Firestore (Authoritative Prod Write)
 */
export async function saveWeddingDataToFirestore(
  data: WeddingDataset,
  onStatusChange?: (status: SyncStatus) => void
): Promise<{ success: boolean; error?: string }> {
  cancelScheduledCloudSave();
  const db = getFirestoreDb();
  if (!db) {
    return { success: false, error: 'Firebase is not initialized' };
  }

  try {
    if (onStatusChange) onStatusChange('syncing');

    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const cleanPayload = sanitizeForFirestore({
      ...data,
      lastUpdated: new Date().toISOString()
    });

    // Write directly to Firestore document without merge to ensure deleted items are purged
    await setDoc(docRef, cleanPayload);
    saveCachedWeddingData(cleanPayload);

    if (onStatusChange) onStatusChange('synced');
    return { success: true };
  } catch (err: any) {
    if (onStatusChange) onStatusChange('error');
    console.error('Failed to save data to Firebase:', err);
    return { success: false, error: err.message || 'Failed to save to Firebase' };
  }
}

/**
 * Fetch cloud dataset once from Firestore
 */
export async function fetchCloudData(): Promise<{ 
  exists: boolean; 
  data?: WeddingDataset; 
  error?: string 
}> {
  const db = getFirestoreDb();
  if (!db) return { exists: false, error: 'Firebase not configured' };

  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { exists: true, data: snap.data() as WeddingDataset };
    }
    return { exists: false };
  } catch (err: any) {
    console.error('Error fetching cloud data:', err);
    return { exists: false, error: err.message };
  }
}

/**
 * Debounced push of user changes to Firestore (e.g. for rapid text input)
 */
export function scheduleCloudSave(
  data: WeddingDataset,
  onStatusChange?: (status: SyncStatus) => void,
  delayMs = 400
): void {
  if (!isFirebaseConfigured()) return;
  const db = getFirestoreDb();
  if (!db) return;

  cancelScheduledCloudSave();

  if (onStatusChange) onStatusChange('syncing');

  debounceTimer = setTimeout(async () => {
    debounceTimer = null;
    await saveWeddingDataToFirestore(data, onStatusChange);
  }, delayMs);
}

/**
 * Reset Firestore document back to clean defaults
 */
export async function resetCloudData(
  defaultData: WeddingDataset
): Promise<boolean> {
  cancelScheduledCloudSave();
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const cleanPayload = sanitizeForFirestore({
      ...defaultData,
      lastUpdated: new Date().toISOString()
    });
    await setDoc(docRef, cleanPayload);
    saveCachedWeddingData(cleanPayload);
    return true;
  } catch (err) {
    console.error('Error resetting cloud data in Firestore:', err);
    return false;
  }
}

/**
 * Initialize real-time synchronization with Firestore
 */
export function initWeddingSync({
  initialFallbackData,
  onRemoteUpdate,
  onStatusChange,
  onInitialLoaded
}: {
  initialFallbackData: WeddingDataset;
  onRemoteUpdate: (remoteData: WeddingDataset) => void;
  onStatusChange: (status: SyncStatus) => void;
  onInitialLoaded?: () => void;
}): () => void {
  if (activeUnsubscribe) {
    activeUnsubscribe();
    activeUnsubscribe = null;
  }

  if (!isFirebaseConfigured()) {
    onStatusChange('unconfigured');
    if (onInitialLoaded) onInitialLoaded();
    return () => {};
  }

  const db = getFirestoreDb();
  if (!db) {
    onStatusChange('error');
    if (onInitialLoaded) onInitialLoaded();
    return () => {};
  }

  onStatusChange('connecting');

  const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
  let hasHandledInitial = false;

  try {
    activeUnsubscribe = onSnapshot(docRef, { includeMetadataChanges: true }, (snapshot) => {
      // Ignore metadata-only changes for pending local writes
      if (snapshot.metadata.hasPendingWrites) {
        return;
      }

      if (!hasHandledInitial) {
        hasHandledInitial = true;
        if (onInitialLoaded) onInitialLoaded();
      }

      if (snapshot.exists()) {
        const remoteData = snapshot.data() as WeddingDataset;
        // Fresh remote update confirmed: cancel any stale debounce timers
        cancelScheduledCloudSave();
        // Update local cache
        saveCachedWeddingData(remoteData);
        // Dispatch to app
        onRemoteUpdate(remoteData);
        onStatusChange('synced');
      } else {
        // Document literally does not exist in Firestore yet: seed it once with fallback
        saveWeddingDataToFirestore(initialFallbackData, onStatusChange);
      }
    }, (error) => {
      console.warn('Realtime Firestore sync listener error:', error);
      onStatusChange('error');
      if (!hasHandledInitial) {
        hasHandledInitial = true;
        if (onInitialLoaded) onInitialLoaded();
      }
    });
  } catch (err) {
    console.error('Failed to attach realtime Firestore listener:', err);
    onStatusChange('error');
    if (!hasHandledInitial) {
      hasHandledInitial = true;
      if (onInitialLoaded) onInitialLoaded();
    }
  }

  return () => {
    if (activeUnsubscribe) {
      activeUnsubscribe();
      activeUnsubscribe = null;
    }
    cancelScheduledCloudSave();
  };
}
