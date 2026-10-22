import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { MonthTracker } from './components/MonthTracker';
import { RentalsTracker } from './components/RentalsTracker';
import { DressesTracker } from './components/DressesTracker';
import { EventItinerary } from './components/EventItinerary';
import { DecisionsTracker } from './components/DecisionsTracker';
import { PlanningNotes } from './components/PlanningNotes';

import { 
  INITIAL_MILESTONES, 
  INITIAL_TASKS, 
  INITIAL_RENTALS, 
  INITIAL_DRESSES, 
  INITIAL_DAY_SCHEDULES, 
  INITIAL_DECISION_POINTS,
  INITIAL_NOTES
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
  WeddingSide
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

  const [activeTab, setActiveTab] = useState<TabType>('month-tracker');

  // LocalStorage Persistence
  useEffect(() => { 
    saveToStorage('vivah_tasks_v5', tasks); 
    saveToStorage('vivah_tasks_v4', tasks); 
  }, [tasks]);
  useEffect(() => { saveToStorage('vivah_rentals_v5', rentals); }, [rentals]);
  useEffect(() => { saveToStorage('vivah_dresses_v5', dresses); }, [dresses]);
  useEffect(() => { saveToStorage('vivah_days_v5', days); }, [days]);
  useEffect(() => { saveToStorage('vivah_decisions_v5', decisions); }, [decisions]);
  useEffect(() => { saveToStorage('vivah_notes_v5', notes); }, [notes]);
  useEffect(() => { saveToStorage('vivah_year_v5', weddingYear); }, [weddingYear]);
  useEffect(() => { saveToStorage('vivah_side_v5', activeSide); }, [activeSide]);

  // Task Handlers (Interactive, Editable, Deletable)
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    setTasks(prev => [{ ...newTask, id: `t-${Date.now()}` }, ...prev]);
  };

  const handleEditTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Rental Handlers (Interactive, Editable, Deletable)
  const handleUpdateRental = (id: string, updates: Partial<RentalItem>) => {
    setRentals(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const handleAddRental = (newRental: Omit<RentalItem, 'id'>) => {
    setRentals(prev => [...prev, { ...newRental, id: `rent-${Date.now()}` }]);
  };

  const handleDeleteRental = (id: string) => {
    setRentals(prev => prev.filter(r => r.id !== id));
  };

  // Dress Handlers (Interactive, Editable, Deletable)
  const handleUpdateDress = (id: string, updates: Partial<DressItem>) => {
    setDresses(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const handleAddDress = (newDress: Omit<DressItem, 'id'>) => {
    setDresses(prev => [...prev, { ...newDress, id: `dr-${Date.now()}` }]);
  };

  const handleDeleteDress = (id: string) => {
    setDresses(prev => prev.filter(d => d.id !== id));
  };

  // Schedule Handlers (Interactive, Editable, Deletable)
  const handleAddScheduleItem = (dayId: string, item: ScheduleEvent) => {
    setDays(prev => prev.map(day => {
      if (day.id === dayId) {
        return { ...day, items: [...day.items, item] };
      }
      return day;
    }));
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
    setDays(prev => prev.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          items: day.items.filter(it => it.id !== itemId)
        };
      }
      return day;
    }));
  };

  // Decision Handlers (Interactive, Editable, Deletable)
  const handleUpdateDecision = (id: string, updates: Partial<DecisionPoint>) => {
    setDecisions(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const handleAddDecision = (newDec: Omit<DecisionPoint, 'id'>) => {
    setDecisions(prev => [...prev, { ...newDec, id: `dec-${Date.now()}` }]);
  };

  const handleDeleteDecision = (id: string) => {
    setDecisions(prev => prev.filter(d => d.id !== id));
  };

  // Planning Notes Handlers (Interactive, Editable, Deletable)
  const handleAddNote = (newNote: Omit<PlanningNote, 'id' | 'updatedAt'>) => {
    setNotes(prev => [
      {
        ...newNote,
        id: `note-${Date.now()}`,
        updatedAt: '2026-10-22'
      },
      ...prev
    ]);
  };

  const handleUpdateNote = (id: string, updates: Partial<PlanningNote>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: '2026-10-22' } : n));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Global Reset
  const handleResetData = () => {
    if (window.confirm('Reset all tasks, rentals, dresses, cues, decisions, and notes back to clean defaults?')) {
      setTasks(INITIAL_TASKS);
      setRentals(INITIAL_RENTALS);
      setDresses(INITIAL_DRESSES);
      setDays(INITIAL_DAY_SCHEDULES);
      setDecisions(INITIAL_DECISION_POINTS);
      setNotes(INITIAL_NOTES);
      setActiveSide('ALL');
      setWeddingYear(2027);
      localStorage.clear();
    }
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
  const rentalsPendingCount = filteredRentals.filter(r => r.status === 'To Book' || r.status === 'Reserved').length;
  const dressesToBuyCount = filteredDresses.filter(d => d.status !== 'Ready').length;
  const decisionsPendingCount = decisions.filter(d => d.status === 'Pending').length;
  const scheduleItemsCount = filteredScheduleCount;
  const notesCount = notes.length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* Dynamic Header with Live Counters & Perspective */}
      <Header
        tasks={tasks}
        rentals={rentals}
        dresses={dresses}
        decisions={decisions}
        notes={notes}
        activeSide={activeSide}
        weddingYear={weddingYear}
        onResetData={handleResetData}
      />

      {/* Main Tab Navigation with Perspective Switcher & Remaining Count Badges */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeSide={activeSide}
        onSideChange={setActiveSide}
        tasksRemainingCount={tasksRemainingCount}
        rentalsPendingCount={rentalsPendingCount}
        dressesToBuyCount={dressesToBuyCount}
        decisionsPendingCount={decisionsPendingCount}
        scheduleItemsCount={scheduleItemsCount}
        notesCount={notesCount}
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
          <span>Surat & Bhavnagar (Feb 19–21, 2027)</span>
          <span>•</span>
          <span>Auto-saved locally in real time</span>
        </div>
      </footer>
    </div>
  );
};
