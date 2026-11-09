import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, Auth } from 'firebase/auth';
import { FIREBASE_CONFIG } from './firebaseConfig';

export interface FirebaseConfig {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
}

/**
 * Retrieve Firebase configuration strictly from FIREBASE_CONFIG or Vite env
 */
export function getStoredFirebaseConfig(): FirebaseConfig | null {
  if (FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.appId) {
    return FIREBASE_CONFIG;
  }

  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const envAppId = import.meta.env.VITE_FIREBASE_APP_ID;

  if (envApiKey && envProjectId && envAppId) {
    return {
      apiKey: envApiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: envAppId,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
    };
  }

  return null;
}

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;

/**
 * Initialize Firebase
 */
export function initFirebase(): {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
  isConfigured: boolean;
  error?: string;
} {
  const config = getStoredFirebaseConfig();

  if (!config || !config.apiKey || !config.projectId) {
    return { app: null, db: null, auth: null, isConfigured: false };
  }

  try {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApp();
    }

    firestoreDb = getFirestore(firebaseApp);
    firebaseAuth = getAuth(firebaseApp);

    // Attempt anonymous auth silently in background (if rules require authentication)
    signInAnonymously(firebaseAuth).catch((err) => {
      console.info('Anonymous sign-in note:', err.message);
    });

    return {
      app: firebaseApp,
      db: firestoreDb,
      auth: firebaseAuth,
      isConfigured: true
    };
  } catch (err: any) {
    console.error('Failed to initialize Firebase:', err);
    return {
      app: null,
      db: null,
      auth: null,
      isConfigured: false,
      error: err.message || 'Failed to initialize Firebase'
    };
  }
}

export function getFirestoreDb(): Firestore | null {
  if (!firestoreDb) {
    const { db } = initFirebase();
    return db;
  }
  return firestoreDb;
}

export function isFirebaseConfigured(): boolean {
  return !!getStoredFirebaseConfig();
}
