import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
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
  INITIAL_MILESTONES, 
  INITIAL_TASKS, 
  INITIAL_RENTALS, 
  INITIAL_DRESSES, 
  INITIAL_DAY_SCHEDULES, 
  INITIAL_DECISION_POINTS,
  INITIAL_NOTES,
  INITIAL_PREWEDDING_PLAN,
  NATIONAL_PREWEDDING_PRESET,
  INTERNATIONAL_PREWEDDING_PRESET,
  REGIONAL_PREWEDDING_PRESET
} from './data/weddingData';
import { loadFromStorage, saveToStorage } from './utils/storage';
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
  PreWeddingTripType
} from './types/wedding';

export const App: React.FC = () => {
  // Global Side Switcher state ('ALL' | 'BOY' | 'GIRL')
  const [activeSide, setActiveSide] = useState<WeddingSide>(() => 
    loadFromStorage<WeddingSide>('vivah_side_v5', 'ALL')
  );

  // Load state from localStorage with smart migration preserving completed checkmarks
  const [tasks, setTasks] = useState<Task[]>(() => {
    const v5 = loadFromStorage<Task[] | null>('vivah_tasks_v5', null);
    if (v5 && v5.length > 0) return v5;

    // Migrate from v4 preserving completed checkmarks
    const stored = loadFromStorage<Task[]>('vivah_tasks_v4', []);
    if (!stored || stored.length === 0) return INITIAL_TASKS;

    const completedIds = new Set(stored.filter(t => t.completed).map(t => t.id));
    const completedTitles = new Set(stored.filter(t => t.completed).map(t => t.title.toLowerCase().trim()));

    // Custom user-added tasks that aren't in INITIAL_TASKS
    const initialIds = new Set(INITIAL_TASKS.map(t => t.id));
    const customTasks = stored.filter(t => !initialIds.has(t.id));

    const merged = INITIAL_TASKS.map(task => ({
      ...task,
      completed: completedIds.has(task.id) || completedTitles.has(task.title.toLowerCase().trim())
    }));

    return [...merged, ...customTasks];
  });

  const [rentals, setRentals] = useState<RentalItem[]>(() => {
    const v5 = loadFromStorage<RentalItem[] | null>('vivah_rentals_v5', null);
    if (v5 && v5.length > 0) return v5;
    const v4 = loadFromStorage<RentalItem[] | null>('vivah_rentals_v4', null);
    return v4 && v4.length > 0 ? v4 : INITIAL_RENTALS;
  });

  const [dresses, setDresses] = useState<DressItem[]>(() => {
    const v5 = loadFromStorage<DressItem[] | null>('vivah_dresses_v5', null);
    if (v5 && v5.length > 0) return v5;
    const v4 = loadFromStorage<DressItem[] | null>('vivah_dresses_v4', null);
    return v4 && v4.length > 0 ? v4 : INITIAL_DRESSES;
  });

  const [days, setDays] = useState<EventDaySchedule[]>(() => {
    const v5 = loadFromStorage<EventDaySchedule[] | null>('vivah_days_v5', null);
    if (v5 && v5.length > 0) return v5;
    return INITIAL_DAY_SCHEDULES;
  });

  const [decisions, setDecisions] = useState<DecisionPoint[]>(() => {
    const v5 = loadFromStorage<DecisionPoint[] | null>('vivah_decisions_v5', null);
    if (v5 && v5.length > 0) return v5;
    const v4 = loadFromStorage<DecisionPoint[] | null>('vivah_decisions_v4', null);
    return v4 && v4.length > 0 ? v4 : INITIAL_DECISION_POINTS;
  });

  const [notes, setNotes] = useState<PlanningNote[]>(() => {
    const v5 = loadFromStorage<PlanningNote[] | null>('vivah_notes_v5', null);
    if (v5 && v5.length > 0) return v5;
    const v4 = loadFromStorage<PlanningNote[] | null>('vivah_notes_v4', null);
    return v4 && v4.length > 0 ? v4 : INITIAL_NOTES;
  });

  const [weddingYear, setWeddingYear] = useState<number>(() => 
    loadFromStorage('vivah_year_v5', 2027)
  );

  const [preWeddingPlan, setPreWeddingPlan] = useState<PreWeddingTripPlan>(() => 
    loadFromStorage<PreWeddingTripPlan>('vivah_prewedding_v5', INITIAL_PREWEDDING_PLAN)
  );

  const [activeTab, setActiveTab] = useState<TabType>('month-tracker');

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

  // LocalStorage Persistence
  useEffect(() => { 
    saveToStorage('vivah_tasks_v5', tasks); 
    saveToStorage('vivah_tasks_v4', tasks); 
  }, [tasks]);
  useEffect(() => { saveToStorage('vivah_prewedding_v5', preWeddingPlan); }, [preWeddingPlan]);
  useEffect(() => { saveToStorage('vivah_rentals_v5', rentals); }, [rentals]);
  useEffect(() => { saveToStorage('vivah_dresses_v5', dresses); }, [dresses]);
  useEffect(() => { saveToStorage('vivah_days_v5', days); }, [days]);
  useEffect(() => { saveToStorage('vivah_decisions_v5', decisions); }, [decisions]);
  useEffect(() => { saveToStorage('vivah_notes_v5', notes); }, [notes]);
  useEffect(() => { saveToStorage('vivah_year_v5', weddingYear); }, [weddingYear]);
  useEffect(() => { saveToStorage('vivah_side_v5', activeSide); }, [activeSide]);

  // Pre-Wedding Handlers
  const handleUpdatePreWeddingPlan = (updates: Partial<PreWeddingTripPlan>) => {
    setPreWeddingPlan(prev => ({ ...prev, ...updates }));
    showToast('Pre-wedding shoot plan updated', 'success');
  };

  const handleResetPreWeddingPreset = (presetType: PreWeddingTripType) => {
    if (presetType === 'NATIONAL') {
      setPreWeddingPlan(NATIONAL_PREWEDDING_PRESET);
      showToast('Loaded National Trip preset (Udaipur / Goa, 2–3 Days)', 'info');
    } else if (presetType === 'INTERNATIONAL') {
      setPreWeddingPlan(INTERNATIONAL_PREWEDDING_PRESET);
      showToast('Loaded International Trip preset (Dubai / Bali, 1 Week)', 'info');
    } else if (presetType === 'REGIONAL') {
      setPreWeddingPlan(REGIONAL_PREWEDDING_PRESET);
      showToast('Loaded Regional Gujarat preset (Vadodara / Dumas / Sets)', 'info');
    }
  };

  // Task Handlers (Interactive, Editable, Deletable with Undo)
  const handleToggleTask = (taskId: string) => {
    let nextStatus = false;
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        nextStatus = !t.completed;
        return { ...t, completed: nextStatus };
      }
      return t;
    }));
    showToast(nextStatus ? 'Task completed! 🎉' : 'Task marked pending', 'success');
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const created: Task = { ...newTask, id: `t-${Date.now()}` };
    setTasks(prev => [created, ...prev]);
    showToast(`Task "${created.title.slice(0, 28)}..." added`, 'success');
  };

  const handleEditTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast(`Task "${taskToDelete.title.slice(0, 28)}..." deleted`, 'undo', () => {
      setTasks(prev => [taskToDelete, ...prev]);
      showToast('Task restored!', 'success');
    });
  };

  // Rental Handlers (Interactive, Editable, Deletable with Undo)
  const handleUpdateRental = (id: string, updates: Partial<RentalItem>) => {
    setRentals(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const handleAddRental = (newRental: Omit<RentalItem, 'id'>) => {
    const created: RentalItem = { ...newRental, id: `rent-${Date.now()}` };
    setRentals(prev => [...prev, created]);
    showToast(`Rental item added`, 'success');
  };

  const handleDeleteRental = (id: string) => {
    const item = rentals.find(r => r.id === id);
    if (!item) return;
    setRentals(prev => prev.filter(r => r.id !== id));
    showToast(`Rental "${item.item.slice(0, 24)}..." deleted`, 'undo', () => {
      setRentals(prev => [...prev, item]);
      showToast('Rental item restored!', 'success');
    });
  };

  // Dress Handlers (Interactive, Editable, Deletable with Undo)
  const handleUpdateDress = (id: string, updates: Partial<DressItem>) => {
    setDresses(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const handleAddDress = (newDress: Omit<DressItem, 'id'>) => {
    const created: DressItem = { ...newDress, id: `dr-${Date.now()}` };
    setDresses(prev => [...prev, created]);
    showToast(`Outfit "${created.garmentName}" added`, 'success');
  };

  const handleDeleteDress = (id: string) => {
    const item = dresses.find(d => d.id === id);
    if (!item) return;
    setDresses(prev => prev.filter(d => d.id !== id));
    showToast(`Outfit "${item.garmentName}" deleted`, 'undo', () => {
      setDresses(prev => [...prev, item]);
      showToast('Outfit restored!', 'success');
    });
  };

  // Schedule Handlers (Interactive, Editable, Deletable with Undo)
  const handleAddScheduleItem = (dayId: string, item: ScheduleEvent) => {
    setDays(prev => prev.map(day => {
      if (day.id === dayId) {
        return { ...day, items: [...day.items, item] };
      }
      return day;
    }));
    showToast(`Event cue "${item.title.slice(0, 24)}..." added`, 'success');
  };

  const handleEditScheduleItem = (dayId: string, itemId: string, updates: Partial<ScheduleEvent>) => {
    setDays(prev => prev.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          items: day.items.map(it => it.id === itemId ? { ...it, ...updates } : it)
        };
      }
      return day;
    }));
  };

  const handleDeleteScheduleItem = (dayId: string, itemId: string) => {
    const day = days.find(d => d.id === dayId);
    const item = day?.items.find(i => i.id === itemId);
    if (!item) return;
    setDays(prev => prev.map(d => d.id === dayId ? { ...d, items: d.items.filter(i => i.id !== itemId) } : d));
    showToast(`Event cue "${item.title.slice(0, 24)}..." deleted`, 'undo', () => {
      setDays(prev => prev.map(d => d.id === dayId ? { ...d, items: [...d.items, item] } : d));
      showToast('Event cue restored!', 'success');
    });
  };

  // Decision Handlers (Interactive, Editable, Deletable with Undo)
  const handleUpdateDecision = (id: string, updates: Partial<DecisionPoint>) => {
    setDecisions(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    showToast('Decision recorded', 'success');
  };

  const handleAddDecision = (newDec: Omit<DecisionPoint, 'id'>) => {
    const created: DecisionPoint = { ...newDec, id: `dec-${Date.now()}` };
    setDecisions(prev => [...prev, created]);
    showToast('New decision topic added', 'success');
  };

  const handleDeleteDecision = (id: string) => {
    const item = decisions.find(d => d.id === id);
    if (!item) return;
    setDecisions(prev => prev.filter(d => d.id !== id));
    showToast(`Decision topic deleted`, 'undo', () => {
      setDecisions(prev => [...prev, item]);
      showToast('Decision restored!', 'success');
    });
  };

  // Planning Notes Handlers (Interactive, Editable, Deletable with Undo)
  const handleAddNote = (newNote: Omit<PlanningNote, 'id' | 'updatedAt'>) => {
    const created: PlanningNote = {
      ...newNote,
      id: `note-${Date.now()}`,
      updatedAt: '2026-10-22'
    };
    setNotes(prev => [created, ...prev]);
    showToast(`Note "${created.title}" added`, 'success');
  };

  const handleUpdateNote = (id: string, updates: Partial<PlanningNote>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: '2026-10-22' } : n));
  };

  const handleDeleteNote = (id: string) => {
    const item = notes.find(n => n.id === id);
    if (!item) return;
    setNotes(prev => prev.filter(n => n.id !== id));
    showToast(`Note "${item.title}" deleted`, 'undo', () => {
      setNotes(prev => [item, ...prev]);
      showToast('Note restored!', 'success');
    });
  };

  // Global Reset with Confirmation Modal
  const handleConfirmReset = () => {
    setTasks(INITIAL_TASKS);
    setPreWeddingPlan(INITIAL_PREWEDDING_PLAN);
    setRentals(INITIAL_RENTALS);
    setDresses(INITIAL_DRESSES);
    setDays(INITIAL_DAY_SCHEDULES);
    setDecisions(INITIAL_DECISION_POINTS);
    setNotes(INITIAL_NOTES);
    setActiveSide('ALL');
    setWeddingYear(2027);
    localStorage.clear();
    setIsResetModalOpen(false);
    showToast('Dashboard reset to clean default state', 'info');
  };

  // Perspective switcher with feedback toast
  const handleSideChange = (side: WeddingSide) => {
    setActiveSide(side);
    showToast(
      side === 'ALL'
        ? 'Showing Unified Joint View (Both Sides)'
        : side === 'BOY'
        ? "Switched to Boy's Side Focus (Groom)"
        : "Switched to Girl's Side Focus (Bride)",
      'info'
    );
  };

  // Filter tasks dynamically based on active side for header & nav badges
  const filteredTasks = tasks.filter(t => {
    if (activeSide === 'ALL') return true;
    if (activeSide === 'BOY') return t.side === 'Boy' || t.side === 'Both' || !t.side || t.assignedTo === 'Groom' || t.assignedTo === 'Both';
    if (activeSide === 'GIRL') return t.side === 'Girl' || t.side === 'Both' || !t.side || t.assignedTo === 'Bride' || t.assignedTo === 'Both';
    return true;
  });

  const filteredRentals = rentals.filter(r => {
    if (activeSide === 'ALL') return true;
    if (activeSide === 'BOY') return r.side === 'Boy' || r.side === 'Both' || !r.side;
    if (activeSide === 'GIRL') return r.side === 'Girl' || r.side === 'Both' || !r.side;
    return true;
  });

  const filteredDresses = dresses.filter(d => {
    if (activeSide === 'ALL') return true;
    if (activeSide === 'BOY') return d.person === 'Groom';
    if (activeSide === 'GIRL') return d.person === 'Bride';
    return true;
  });

  const filteredScheduleCount = days.reduce((acc, d) => {
    const items = d.items.filter(it => {
      if (activeSide === 'ALL') return true;
      if (activeSide === 'BOY') return it.side === 'Boy' || it.side === 'Both' || !it.side;
      if (activeSide === 'GIRL') return it.side === 'Girl' || it.side === 'Both' || !it.side;
      return true;
    });
    return acc + items.length;
  }, 0);

  // Smooth live numerical calculations
  const tasksRemainingCount = filteredTasks.filter(t => !t.completed).length;
  const preWeddingRemainingCount = preWeddingPlan.checklist.filter(c => !c.completed).length;
  const rentalsPendingCount = filteredRentals.filter(r => r.status === 'To Book' || r.status === 'Reserved').length;
  const dressesToBuyCount = filteredDresses.filter(d => d.status !== 'Ready').length;
  const decisionsPendingCount = decisions.filter(d => d.status === 'Pending').length;
  const scheduleItemsCount = filteredScheduleCount;
  const notesCount = notes.length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans pb-20 sm:pb-8">
      {/* Dynamic Header with Live Counters & Perspective */}
      <Header
        tasks={tasks}
        rentals={rentals}
        dresses={dresses}
        decisions={decisions}
        notes={notes}
        preWeddingPlan={preWeddingPlan}
        activeSide={activeSide}
        weddingYear={weddingYear}
        onResetData={() => setIsResetModalOpen(true)}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Tab Navigation with Perspective Switcher & Remaining Count Badges */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeSide={activeSide}
        onSideChange={handleSideChange}
        tasksRemainingCount={tasksRemainingCount}
        preWeddingRemainingCount={preWeddingRemainingCount}
        rentalsPendingCount={rentalsPendingCount}
        dressesToBuyCount={dressesToBuyCount}
        decisionsPendingCount={decisionsPendingCount}
        scheduleItemsCount={scheduleItemsCount}
        notesCount={notesCount}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {activeTab === 'month-tracker' && (
          <MonthTracker
            milestones={INITIAL_MILESTONES}
            tasks={tasks}
            activeSide={activeSide}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === 'pre-wedding' && (
          <PreWeddingPlanner
            plan={preWeddingPlan}
            activeSide={activeSide}
            onUpdatePlan={handleUpdatePreWeddingPlan}
            onResetPlanToPreset={handleResetPreWeddingPreset}
          />
        )}

        {activeTab === 'rentals' && (
          <RentalsTracker
            rentals={rentals}
            onUpdateRental={handleUpdateRental}
            onAddRental={handleAddRental}
            onDeleteRental={handleDeleteRental}
          />
        )}

        {activeTab === 'dresses' && (
          <DressesTracker
            dresses={dresses}
            activeSide={activeSide}
            onUpdateDress={handleUpdateDress}
            onAddDress={handleAddDress}
            onDeleteDress={handleDeleteDress}
          />
        )}

        {activeTab === 'itinerary' && (
          <EventItinerary
            days={days}
            activeSide={activeSide}
            onAddScheduleItem={handleAddScheduleItem}
            onEditScheduleItem={handleEditScheduleItem}
            onDeleteScheduleItem={handleDeleteScheduleItem}
          />
        )}

        {activeTab === 'decisions' && (
          <DecisionsTracker
            decisions={decisions}
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

      {/* Minimal Footer */}
      <footer className="bg-white text-gray-500 border-t border-gray-200 py-3.5 text-center text-xs no-print mt-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="font-semibold text-gray-700">Wedding Operational Dashboard</span>
          <span>•</span>
          <span>Surat & Bhavnagar (Feb 18–21, 2027)</span>
          <span>•</span>
          <span>Auto-saved locally • Press ⌘K for command search</span>
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
        onTabChange={setActiveTab}
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
