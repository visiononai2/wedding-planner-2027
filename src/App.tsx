import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GlobalHeader } from './components/GlobalHeader';
import { TabType } from './components/Navigation';
import { MonthTracker } from './components/MonthTracker';
import { PreWeddingPlanner } from './components/PreWeddingPlanner';
import { RentalsTracker } from './components/RentalsTracker';
import { DressesTracker } from './components/DressesTracker';
import { EventItinerary } from './components/EventItinerary';
import { DecisionsTracker } from './components/DecisionsTracker';
import { PlanningNotes } from './components/PlanningNotes';
import { CommandPalette } from './components/CommandPalette';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ConfirmationModal } from './components/ConfirmationModal';
import { 
  SyncStatus, 
  WeddingDataset, 
  initWeddingSync, 
  saveWeddingDataToFirestore,
  scheduleCloudSave,
  cancelScheduledCloudSave,
  resetCloudData,
  loadCachedWeddingData,
  saveCachedWeddingData
} from './services/weddingSync';

import { 
  INITIAL_MILESTONES, 
  INITIAL_TASKS, 
  INITIAL_RENTALS, 
  INITIAL_DRESSES, 
  INITIAL_DAY_SCHEDULES, 
  INITIAL_DECISION_POINTS,
  INITIAL_NOTES,
  INITIAL_PREWEDDING_PLAN,
  SURAT_REGIONAL_PRESET,
  HERITAGE_CIRCUIT_PRESET,
  ANAND_VILLA_PRESET
} from './data/weddingData';
import { 
  Task, 
  RentalItem, 
  DressItem, 
  DecisionPoint, 
  ScheduleEvent, 
  EventDaySchedule,
  PlanningNote,
  WeddingSide,
  PreWeddingTripPlan,
  PreWeddingTripType,
  TaskSubView
} from './types/wedding';

export const App: React.FC = () => {
  // Global Side Switcher state ('ALL' | 'BOY' | 'GIRL')
  const [activeSide, setActiveSide] = useState<WeddingSide>(() => {
    try {
      const stored = localStorage.getItem('wedding_preferred_side');
      if (stored === 'BOY' || stored === 'GIRL' || stored === 'ALL' || stored === 'FAMILY') {
        return stored as WeddingSide;
      }
    } catch {}
    return 'ALL';
  });

  // Load cached dataset synchronously for zero-flicker startup
  const initialCache = useMemo(() => loadCachedWeddingData(), []);

  // Core Wedding Planning State (Authoritative source: Prod Firebase Firestore)
  const [tasks, setTasks] = useState<Task[]>(() => initialCache?.tasks || INITIAL_TASKS);
  const [rentals, setRentals] = useState<RentalItem[]>(() => initialCache?.rentals || INITIAL_RENTALS);
  const [dresses, setDresses] = useState<DressItem[]>(() => initialCache?.dresses || INITIAL_DRESSES);
  const [days, setDays] = useState<EventDaySchedule[]>(() => initialCache?.days || INITIAL_DAY_SCHEDULES);
  const [decisions, setDecisions] = useState<DecisionPoint[]>(() => initialCache?.decisions || INITIAL_DECISION_POINTS);
  const [notes, setNotes] = useState<PlanningNote[]>(() => initialCache?.notes || INITIAL_NOTES);
  const [weddingYear, setWeddingYear] = useState<number>(() => initialCache?.weddingYear || 2027);
  const [preWeddingPlan, setPreWeddingPlan] = useState<PreWeddingTripPlan>(() => initialCache?.preWeddingPlan || INITIAL_PREWEDDING_PLAN);
  const [isCloudLoading, setIsCloudLoading] = useState<boolean>(() => !initialCache);

  // Clear legacy pre-Firebase localStorage keys safely without touching modern cache or auth
  useEffect(() => {
    try {
      const legacyKeys = [
        'vivah_tasks_v6', 'vivah_tasks_v5', 'vivah_tasks_v4',
        'vivah_rentals_v6', 'vivah_dresses_v6', 'vivah_side_v5'
      ];
      legacyKeys.forEach(k => localStorage.removeItem(k));
    } catch {}
  }, []);

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    try {
      const hash = window.location.hash.replace('#', '');
      if (['month-tracker', 'itinerary', 'decisions', 'notes'].includes(hash)) {
        return hash as TabType;
      }
    } catch {}
    return 'month-tracker';
  });
  const [taskSubView, setTaskSubView] = useState<TaskSubView>('checklist');
  const [tasksResetSignal, setTasksResetSignal] = useState<number>(0);
  const [itineraryResetSignal, setItineraryResetSignal] = useState<number>(0);

  const handleNavigateTaskSubView = (subView: TaskSubView) => {
    setActiveTab('month-tracker');
    setTaskSubView(subView);
    window.location.hash = 'month-tracker';
    if (subView === 'checklist') {
      setTasksResetSignal(prev => prev + 1);
    }
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === 'month-tracker') {
      setActiveTab('month-tracker');
      setTaskSubView('checklist');
      window.location.hash = 'month-tracker';
      setTasksResetSignal(prev => prev + 1);
    } else if (tab === 'itinerary') {
      setActiveTab('itinerary');
      window.location.hash = 'itinerary';
      setItineraryResetSignal(prev => prev + 1);
    } else if (tab === 'dresses') {
      setActiveTab('month-tracker');
      setTaskSubView('outfits');
      window.location.hash = 'month-tracker';
    } else if (tab === 'rentals') {
      setActiveTab('month-tracker');
      setTaskSubView('rentals');
      window.location.hash = 'month-tracker';
    } else if (tab === 'pre-wedding') {
      setActiveTab('month-tracker');
      setTaskSubView('pre-wedding');
      window.location.hash = 'month-tracker';
    } else {
      setActiveTab(tab);
      window.location.hash = tab;
    }
  };

  // UI States (Command Palette, Toasts, Confirmation Dialog)
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Toast Helpers
  const showToast = (message: string, type: 'success' | 'info' | 'undo' = 'success', onUndo?: () => void) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type, onUndo }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Firebase Cloud Sync State
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('connecting');

  // Ref to always hold the freshest dataset across renders & async closures
  const latestDatasetRef = useRef<WeddingDataset>({
    tasks,
    rentals,
    dresses,
    days,
    decisions,
    notes,
    preWeddingPlan,
    activeSide,
    weddingYear
  });

  // Keep latestDatasetRef synchronized with current render state
  latestDatasetRef.current = {
    tasks,
    rentals,
    dresses,
    days,
    decisions,
    notes,
    preWeddingPlan,
    activeSide,
    weddingYear
  };

  /**
   * Helper to persist user modifications immediately or debounced to Prod Firebase & local cache.
   * This is ONLY triggered by explicit user actions, preventing accidental overwrites on reload.
   */
  const syncToCloud = useCallback((updates: Partial<WeddingDataset>, immediate = false) => {
    const fullDataset: WeddingDataset = {
      ...latestDatasetRef.current,
      ...updates
    };
    latestDatasetRef.current = fullDataset;

    // Immediately persist to local cache
    saveCachedWeddingData(fullDataset);

    // Save directly to Prod Firebase
    if (immediate) {
      cancelScheduledCloudSave();
      saveWeddingDataToFirestore(fullDataset, setSyncStatus);
    } else {
      scheduleCloudSave(fullDataset, setSyncStatus, 400);
    }
  }, []);

  // Apply verified remote data from Prod Firebase to local state
  const handleApplyCloudData = useCallback((remote: WeddingDataset) => {
    cancelScheduledCloudSave();

    if (remote.tasks && Array.isArray(remote.tasks)) setTasks(remote.tasks);
    if (remote.rentals && Array.isArray(remote.rentals)) setRentals(remote.rentals);
    if (remote.dresses && Array.isArray(remote.dresses)) setDresses(remote.dresses);
    if (remote.days && Array.isArray(remote.days)) setDays(remote.days);
    if (remote.decisions && Array.isArray(remote.decisions)) setDecisions(remote.decisions);
    if (remote.notes && Array.isArray(remote.notes)) setNotes(remote.notes);
    if (remote.preWeddingPlan) setPreWeddingPlan(remote.preWeddingPlan);
    if (remote.weddingYear) setWeddingYear(remote.weddingYear);

    // Update ref and cache with fresh server state
    latestDatasetRef.current = {
      tasks: remote.tasks || latestDatasetRef.current.tasks,
      rentals: remote.rentals || latestDatasetRef.current.rentals,
      dresses: remote.dresses || latestDatasetRef.current.dresses,
      days: remote.days || latestDatasetRef.current.days,
      decisions: remote.decisions || latestDatasetRef.current.decisions,
      notes: remote.notes || latestDatasetRef.current.notes,
      preWeddingPlan: remote.preWeddingPlan || latestDatasetRef.current.preWeddingPlan,
      activeSide: latestDatasetRef.current.activeSide,
      weddingYear: remote.weddingYear || latestDatasetRef.current.weddingYear
    };
    saveCachedWeddingData(latestDatasetRef.current);
  }, []);

  // Initialize Firebase sync on mount and listen to Prod Firestore in real time
  useEffect(() => {
    const unsub = initWeddingSync({
      initialFallbackData: latestDatasetRef.current,
      onRemoteUpdate: (remote) => {
        handleApplyCloudData(remote);
      },
      onStatusChange: (status) => {
        setSyncStatus(status);
      },
      onInitialLoaded: () => {
        setIsCloudLoading(false);
      }
    });

    return () => {
      unsub();
    };
  }, [handleApplyCloudData]);

  // Pre-Wedding Handlers
  const handleUpdatePreWeddingPlan = (updates: Partial<PreWeddingTripPlan>) => {
    const nextPlan = { ...preWeddingPlan, ...updates };
    setPreWeddingPlan(nextPlan);
    syncToCloud({ preWeddingPlan: nextPlan }, false);
    showToast('Pre-wedding shoot plan updated', 'success');
  };

  const handleResetPreWeddingPreset = (presetType: PreWeddingTripType) => {
    let nextPlan = SURAT_REGIONAL_PRESET;
    let label = 'Surat & Daman Road Trip plan';
    if (presetType === 'HERITAGE_CIRCUIT') {
      nextPlan = HERITAGE_CIRCUIT_PRESET;
      label = 'Vadodara & Champaner Heritage plan';
    } else if (presetType === 'ANAND_VILLA') {
      nextPlan = ANAND_VILLA_PRESET;
      label = 'The Rustic Villa (Anand) plan';
    }
    setPreWeddingPlan(nextPlan);
    syncToCloud({ preWeddingPlan: nextPlan }, true);
    showToast(`Loaded ${label}`, 'info');
  };

  // Task Handlers (Interactive, Editable, Deletable with Undo - synced to Prod Firebase)
  const handleToggleTask = (taskId: string) => {
    let nextStatus = false;
    const nextTasks: Task[] = tasks.map(t => {
      if (t.id === taskId) {
        nextStatus = !t.completed;
        return { 
          ...t, 
          completed: nextStatus, 
          status: (nextStatus ? 'completed' : 'todo') as Task['status']
        };
      }
      return t;
    });
    setTasks(nextTasks);
    syncToCloud({ tasks: nextTasks }, true);
    showToast(nextStatus ? 'Task completed! 🎉' : 'Task marked pending', 'success');
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const status = newTask.status || (newTask.completed ? 'completed' : 'todo');
    const description = newTask.description ?? newTask.notes ?? '';
    const created: Task = { 
      ...newTask, 
      id: `t-${Date.now()}`,
      status,
      completed: status === 'completed',
      description,
      notes: description,
      subtasks: newTask.subtasks || [],
      comments: newTask.comments || []
    };
    const nextTasks = [created, ...tasks];
    setTasks(nextTasks);
    syncToCloud({ tasks: nextTasks }, true);
    showToast(`Task "${created.title.slice(0, 28)}..." added`, 'success');
  };

  const handleEditTask = (id: string, updates: Partial<Task>) => {
    const nextTasks: Task[] = tasks.map(t => {
      if (t.id === id) {
        const desc = updates.description !== undefined 
          ? updates.description 
          : (updates.notes !== undefined ? updates.notes : (t.description ?? t.notes ?? ''));

        let derivedStatus: Task['status'] = updates.status !== undefined ? updates.status : t.status;
        let derivedCompleted: boolean = updates.completed !== undefined ? updates.completed : t.completed;

        if (updates.status !== undefined) {
          derivedCompleted = updates.status === 'completed';
        } else if (updates.completed !== undefined) {
          derivedStatus = updates.completed ? 'completed' : (t.status === 'completed' ? 'todo' : (t.status || 'todo'));
        }

        const merged: Task = { 
          ...t, 
          ...updates,
          status: derivedStatus,
          completed: derivedCompleted,
          description: desc,
          notes: desc,
          comments: updates.comments !== undefined ? updates.comments : (t.comments || [])
        };
        return merged;
      }
      return t;
    });
    setTasks(nextTasks);
    syncToCloud({ tasks: nextTasks }, false);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;
    const nextTasks = tasks.filter(t => t.id !== taskId);
    setTasks(nextTasks);
    syncToCloud({ tasks: nextTasks }, true);
    showToast(`Task "${taskToDelete.title.slice(0, 28)}..." deleted`, 'undo', () => {
      setTasks(prev => {
        const restored = [taskToDelete, ...prev];
        syncToCloud({ tasks: restored }, true);
        return restored;
      });
      showToast('Task restored!', 'success');
    });
  };

  // Rental Handlers (Synced immediately to Prod Firebase)
  const handleUpdateRental = (id: string, updates: Partial<RentalItem>) => {
    const nextRentals = rentals.map(r => r.id === id ? { ...r, ...updates } : r);
    setRentals(nextRentals);
    syncToCloud({ rentals: nextRentals }, false);
  };

  const handleAddRental = (newRental: Omit<RentalItem, 'id'>) => {
    const created: RentalItem = { ...newRental, id: `rent-${Date.now()}` };
    const nextRentals = [...rentals, created];
    setRentals(nextRentals);
    syncToCloud({ rentals: nextRentals }, true);
    showToast(`Rental item added`, 'success');
  };

  const handleDeleteRental = (id: string) => {
    const item = rentals.find(r => r.id === id);
    if (!item) return;
    const nextRentals = rentals.filter(r => r.id !== id);
    setRentals(nextRentals);
    syncToCloud({ rentals: nextRentals }, true);
    showToast(`Rental "${item.item.slice(0, 24)}..." deleted`, 'undo', () => {
      setRentals(prev => {
        const restored = [...prev, item];
        syncToCloud({ rentals: restored }, true);
        return restored;
      });
      showToast('Rental item restored!', 'success');
    });
  };

  // Dress Handlers (Synced immediately to Prod Firebase)
  const handleUpdateDress = (id: string, updates: Partial<DressItem>) => {
    const nextDresses = dresses.map(d => d.id === id ? { ...d, ...updates } : d);
    setDresses(nextDresses);
    syncToCloud({ dresses: nextDresses }, false);
  };

  const handleAddDress = (newDress: Omit<DressItem, 'id'>) => {
    const created: DressItem = { ...newDress, id: `dr-${Date.now()}` };
    const nextDresses = [...dresses, created];
    setDresses(nextDresses);
    syncToCloud({ dresses: nextDresses }, true);
    showToast(`Outfit "${created.garmentName}" added`, 'success');
  };

  const handleDeleteDress = (id: string) => {
    const item = dresses.find(d => d.id === id);
    if (!item) return;
    const nextDresses = dresses.filter(d => d.id !== id);
    setDresses(nextDresses);
    syncToCloud({ dresses: nextDresses }, true);
    showToast(`Outfit "${item.garmentName}" deleted`, 'undo', () => {
      setDresses(prev => {
        const restored = [...prev, item];
        syncToCloud({ dresses: restored }, true);
        return restored;
      });
      showToast('Outfit restored!', 'success');
    });
  };

  // Schedule Handlers (Synced immediately to Prod Firebase)
  const handleAddScheduleItem = (dayId: string, item: ScheduleEvent) => {
    const nextDays = days.map(day => {
      if (day.id === dayId) {
        return { ...day, items: [...day.items, item] };
      }
      return day;
    });
    setDays(nextDays);
    syncToCloud({ days: nextDays }, true);
    showToast(`Event cue "${item.title.slice(0, 24)}..." added`, 'success');
  };

  const handleEditScheduleItem = (dayId: string, itemId: string, updates: Partial<ScheduleEvent>) => {
    const nextDays = days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          items: day.items.map(it => it.id === itemId ? { ...it, ...updates } : it)
        };
      }
      return day;
    });
    setDays(nextDays);
    syncToCloud({ days: nextDays }, false);
  };

  const handleReorderScheduleItems = (dayId: string, fromIndex: number, toIndex: number) => {
    const nextDays = days.map(day => {
      if (day.id !== dayId) return day;
      const items = [...day.items];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return { ...day, items };
    });
    setDays(nextDays);
    syncToCloud({ days: nextDays }, true);
  };

  const handleDeleteScheduleItem = (dayId: string, itemId: string) => {
    const day = days.find(d => d.id === dayId);
    const item = day?.items.find(i => i.id === itemId);
    if (!item) return;
    const nextDays = days.map(d => d.id === dayId ? { ...d, items: d.items.filter(i => i.id !== itemId) } : d);
    setDays(nextDays);
    syncToCloud({ days: nextDays }, true);
    showToast(`Event cue "${item.title.slice(0, 24)}..." deleted`, 'undo', () => {
      setDays(prev => {
        const restored = prev.map(d => d.id === dayId ? { ...d, items: [...d.items, item] } : d);
        syncToCloud({ days: restored }, true);
        return restored;
      });
      showToast('Event cue restored!', 'success');
    });
  };

  // Decision Handlers (Synced immediately to Prod Firebase)
  const handleUpdateDecision = (id: string, updates: Partial<DecisionPoint>) => {
    const nextDecisions = decisions.map(d => d.id === id ? { ...d, ...updates } : d);
    setDecisions(nextDecisions);
    syncToCloud({ decisions: nextDecisions }, false);
    showToast('Decision recorded', 'success');
  };

  const handleAddDecision = (newDec: Omit<DecisionPoint, 'id'>) => {
    const created: DecisionPoint = { ...newDec, id: `dec-${Date.now()}` };
    const nextDecisions = [...decisions, created];
    setDecisions(nextDecisions);
    syncToCloud({ decisions: nextDecisions }, true);
    showToast('New decision topic added', 'success');
  };

  const handleDeleteDecision = (id: string) => {
    const item = decisions.find(d => d.id === id);
    if (!item) return;
    const nextDecisions = decisions.filter(d => d.id !== id);
    setDecisions(nextDecisions);
    syncToCloud({ decisions: nextDecisions }, true);
    showToast(`Decision topic deleted`, 'undo', () => {
      setDecisions(prev => {
        const restored = [...prev, item];
        syncToCloud({ decisions: restored }, true);
        return restored;
      });
      showToast('Decision restored!', 'success');
    });
  };

  // Planning Notes Handlers (Synced immediately to Prod Firebase)
  const handleAddNote = (newNote: Omit<PlanningNote, 'id' | 'updatedAt'>) => {
    const created: PlanningNote = {
      ...newNote,
      id: `note-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    const nextNotes = [created, ...notes];
    setNotes(nextNotes);
    syncToCloud({ notes: nextNotes }, true);
    showToast(`Note "${created.title}" added`, 'success');
  };

  const handleUpdateNote = (id: string, updates: Partial<PlanningNote>) => {
    const nextNotes = notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : n);
    setNotes(nextNotes);
    syncToCloud({ notes: nextNotes }, false);
  };

  const handleDeleteNote = (id: string) => {
    const item = notes.find(n => n.id === id);
    if (!item) return;
    const nextNotes = notes.filter(n => n.id !== id);
    setNotes(nextNotes);
    syncToCloud({ notes: nextNotes }, true);
    showToast(`Note "${item.title}" deleted`, 'undo', () => {
      setNotes(prev => {
        const restored = [item, ...prev];
        syncToCloud({ notes: restored }, true);
        return restored;
      });
      showToast('Note restored!', 'success');
    });
  };

  // Global Reset with Confirmation Modal (Resets directly in Firebase Firestore)
  const handleConfirmReset = async () => {
    const cleanTasks = INITIAL_TASKS.map(t => ({
      ...t,
      description: t.notes || '',
      notes: t.notes || '',
      comments: []
    }));
    const cleanDataset: WeddingDataset = {
      tasks: cleanTasks,
      preWeddingPlan: INITIAL_PREWEDDING_PLAN,
      rentals: INITIAL_RENTALS,
      dresses: INITIAL_DRESSES,
      days: INITIAL_DAY_SCHEDULES,
      decisions: INITIAL_DECISION_POINTS,
      notes: INITIAL_NOTES,
      activeSide: 'ALL',
      weddingYear: 2027
    };
    handleApplyCloudData(cleanDataset);
    await resetCloudData(cleanDataset);
    setIsResetModalOpen(false);
    showToast('Dashboard reset to clean default state in Firebase', 'info');
  };

  // Perspective switcher with feedback toast
  const handleSideChange = (side: WeddingSide) => {
    setActiveSide(side);
    try {
      localStorage.setItem('wedding_preferred_side', side);
    } catch {}
    showToast(
      side === 'ALL'
        ? 'Showing Unified Joint View (Both Sides)'
        : side === 'BOY'
        ? "Switched to Boy's Side Focus (Groom)"
        : side === 'GIRL'
        ? "Switched to Girl's Side Focus (Bride)"
        : "Switched to Family Side Focus (Family & Elders)",
      'info'
    );
  };

  // Filter tasks dynamically based on active side for header & nav badges
  const filteredTasks = tasks.filter(t => {
    if (activeSide === 'ALL') return true;
    if (activeSide === 'BOY') return t.side === 'Boy' || t.side === 'Both' || !t.side || t.assignedTo === 'Groom' || t.assignedTo === 'Both';
    if (activeSide === 'GIRL') return t.side === 'Girl' || t.side === 'Both' || !t.side || t.assignedTo === 'Bride' || t.assignedTo === 'Both';
    if (activeSide === 'FAMILY') return t.assignedTo === 'Family';
    return true;
  });

  const filteredRentals = rentals.filter(r => {
    if (activeSide === 'ALL') return true;
    if (activeSide === 'BOY') return r.side === 'Boy' || r.side === 'Both' || !r.side;
    if (activeSide === 'GIRL') return r.side === 'Girl' || r.side === 'Both' || !r.side;
    if (activeSide === 'FAMILY') return r.side === 'Both' || !r.side;
    return true;
  });

  const filteredDresses = dresses.filter(d => {
    if (activeSide === 'ALL') return true;
    if (activeSide === 'BOY') return d.person === 'Groom';
    if (activeSide === 'GIRL') return d.person === 'Bride';
    return true;
  });

  const filteredDecisions = decisions.filter(d => {
    if (activeSide === 'ALL') return true;
    if (activeSide === 'BOY') return d.side === 'Boy' || d.side === 'Both' || !d.side;
    if (activeSide === 'GIRL') return d.side === 'Girl' || d.side === 'Both' || !d.side;
    if (activeSide === 'FAMILY') return d.side === 'Both' || !d.side;
    return true;
  });

  const filteredScheduleCount = days.reduce((acc, d) => {
    const items = d.items.filter(it => {
      if (activeSide === 'ALL') return true;
      if (activeSide === 'BOY') return it.side === 'Boy' || it.side === 'Both' || !it.side;
      if (activeSide === 'GIRL') return it.side === 'Girl' || it.side === 'Both' || !it.side;
      if (activeSide === 'FAMILY') return it.side === 'Both' || !it.side;
      return true;
    });
    return acc + items.length;
  }, 0);

  // Smooth live numerical calculations
  const tasksRemainingCount = filteredTasks.filter(t => !t.completed).length;
  const preWeddingRemainingCount = preWeddingPlan.checklist.filter(c => !c.completed).length;
  const rentalsPendingCount = filteredRentals.filter(r => r.status === 'To Book' || r.status === 'Reserved').length;
  const dressesToBuyCount = filteredDresses.filter(d => d.status !== 'Ready').length;
  const decisionsPendingCount = filteredDecisions.filter(d => d.status === 'Pending').length;
  const scheduleItemsCount = filteredScheduleCount;
  const notesCount = notes.length;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans pb-24 sm:pb-8">
      {/* Precision Global Command Shell */}
      <GlobalHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        activeSide={activeSide}
        onSideChange={handleSideChange}
        tasks={tasks}
        rentals={rentals}
        dresses={dresses}
        decisions={decisions}
        notes={notes}
        preWeddingPlan={preWeddingPlan}
        weddingYear={weddingYear}
        tasksRemainingCount={tasksRemainingCount}
        preWeddingRemainingCount={preWeddingRemainingCount}
        rentalsPendingCount={rentalsPendingCount}
        dressesToBuyCount={dressesToBuyCount}
        decisionsPendingCount={decisionsPendingCount}
        scheduleItemsCount={scheduleItemsCount}
        notesCount={notesCount}
        syncStatus={syncStatus}
        onResetData={() => setIsResetModalOpen(true)}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onNavigateToTaskSubView={handleNavigateTaskSubView}
      />

      {/* Main Content Area (pb-28 on mobile guarantees content clears fixed bottom dock) */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-8 pb-28 sm:pb-8">
        {(activeTab === 'month-tracker' || activeTab === 'dresses' || activeTab === 'rentals' || activeTab === 'pre-wedding') && (
          <MonthTracker
            milestones={INITIAL_MILESTONES}
            tasks={tasks}
            activeSide={activeSide}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            rentals={filteredRentals}
            onUpdateRental={handleUpdateRental}
            onAddRental={handleAddRental}
            onDeleteRental={handleDeleteRental}
            dresses={filteredDresses}
            onUpdateDress={handleUpdateDress}
            onAddDress={handleAddDress}
            onDeleteDress={handleDeleteDress}
            preWeddingPlan={preWeddingPlan}
            onUpdatePreWeddingPlan={handleUpdatePreWeddingPlan}
            onResetPlanToPreset={handleResetPreWeddingPreset}
            activeTaskSubView={taskSubView}
            onTaskSubViewChange={setTaskSubView}
            resetFilterSignal={tasksResetSignal}
          />
        )}

        {activeTab === 'itinerary' && (
          <EventItinerary
            days={days}
            activeSide={activeSide}
            onAddScheduleItem={handleAddScheduleItem}
            onEditScheduleItem={handleEditScheduleItem}
            onDeleteScheduleItem={handleDeleteScheduleItem}
            onReorderScheduleItems={handleReorderScheduleItems}
            resetEventSignal={itineraryResetSignal}
          />
        )}

        {activeTab === 'decisions' && (
          <DecisionsTracker
            decisions={filteredDecisions}
            onUpdateDecision={handleUpdateDecision}
            onAddDecision={handleAddDecision}
            onDeleteDecision={handleDeleteDecision}
          />
        )}

        {activeTab === 'notes' && (
          <PlanningNotes
            notes={notes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        )}
      </main>

      {/* Editorial Luxury Footer */}
      <footer className="bg-white text-slate-500 border-t border-slate-200/80 py-8 text-center text-xs no-print mt-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 font-sans">
          <div className="flex items-center gap-2.5">
            <span className="font-cormorant font-normal text-slate-900 tracking-wide text-sm">
              Parth <span className="font-serif italic text-[#B89230]">&</span> Nisha
            </span>
            <span className="text-slate-300">·</span>
            <span className="font-mono text-[11px] text-[#8B6E1F]">Feb 15–21, 2027</span>
          </div>
          <div className="text-[11px] text-slate-400 font-sans tracking-wide">
            <span>Ceremonial Planning Suite · Live Cloud Sync · Press <kbd className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-mono text-slate-500">⌘K</kbd> for Command Search</span>
          </div>
        </div>
      </footer>

      {/* Global Linear-Style Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tasks={tasks}
        onToggleTask={handleToggleTask}
        days={days}
        dresses={dresses}
        rentals={rentals}
        notes={notes}
        activeSide={activeSide}
        onSideChange={handleSideChange}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onNavigateTaskSubView={handleNavigateTaskSubView}
        onOpenAddTask={() => {
          // Triggers modal in MonthTracker if active
        }}
        onExportJSON={() => {
          const data = {
            exportedAt: new Date().toISOString(),
            currentDate: '2026-10-22',
            weddingDate: '2027-02-21',
            activeSide,
            tasks,
            preWeddingPlan,
            rentals,
            dresses,
            decisions,
            notes
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `wedding-tracker-2027.json`;
          a.click();
          URL.revokeObjectURL(url);
          showToast('Backup JSON downloaded successfully!', 'success');
        }}
      />

      {/* Global Toast & Undo Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        title="Reset All Wedding Data?"
        description="This will clear your local changes and reset all tasks, outfits, rentals, itinerary cues, and planning notes back to clean default operational settings. This action cannot be reversed."
        confirmLabel="Reset Everything"
        cancelLabel="Keep Data"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
