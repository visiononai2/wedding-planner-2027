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
  PlanningNote 
} from './types/wedding';

export const App: React.FC = () => {
  // Load state from localStorage with fallback to default clean data (2026-10-22 to 2027-02-21)
  const [tasks, setTasks] = useState<Task[]>(() => 
    loadFromStorage('vivah_tasks_v4', INITIAL_TASKS)
  );

  const [rentals, setRentals] = useState<RentalItem[]>(() => 
    loadFromStorage('vivah_rentals_v4', INITIAL_RENTALS)
  );

  const [dresses, setDresses] = useState<DressItem[]>(() => 
    loadFromStorage('vivah_dresses_v4', INITIAL_DRESSES)
  );

  const [days, setDays] = useState<EventDaySchedule[]>(() => 
    loadFromStorage('vivah_days_v4', INITIAL_DAY_SCHEDULES)
  );

  const [decisions, setDecisions] = useState<DecisionPoint[]>(() => 
    loadFromStorage('vivah_decisions_v4', INITIAL_DECISION_POINTS)
  );

  const [notes, setNotes] = useState<PlanningNote[]>(() => 
    loadFromStorage('vivah_notes_v4', INITIAL_NOTES)
  );

  const [weddingYear, setWeddingYear] = useState<number>(() => 
    loadFromStorage('vivah_year_v4', 2027)
  );

  const [activeTab, setActiveTab] = useState<TabType>('month-tracker');

  // LocalStorage Persistence
  useEffect(() => { saveToStorage('vivah_tasks_v4', tasks); }, [tasks]);
  useEffect(() => { saveToStorage('vivah_rentals_v4', rentals); }, [rentals]);
  useEffect(() => { saveToStorage('vivah_dresses_v4', dresses); }, [dresses]);
  useEffect(() => { saveToStorage('vivah_days_v4', days); }, [days]);
  useEffect(() => { saveToStorage('vivah_decisions_v4', decisions); }, [decisions]);
  useEffect(() => { saveToStorage('vivah_notes_v4', notes); }, [notes]);
  useEffect(() => { saveToStorage('vivah_year_v4', weddingYear); }, [weddingYear]);

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
      setWeddingYear(2027);
      localStorage.clear();
    }
  };

  // Smooth live numerical calculations
  const tasksRemainingCount = tasks.filter(t => !t.completed).length;
  const rentalsPendingCount = rentals.filter(r => r.status === 'To Book' || r.status === 'Reserved').length;
  const dressesToBuyCount = dresses.filter(d => d.status !== 'Ready').length;
  const decisionsPendingCount = decisions.filter(d => d.status === 'Pending').length;
  const scheduleItemsCount = days.reduce((acc, d) => acc + d.items.length, 0);
  const notesCount = notes.length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* Dynamic Header with Live Counters */}
      <Header
        tasks={tasks}
        rentals={rentals}
        dresses={dresses}
        decisions={decisions}
        notes={notes}
        weddingYear={weddingYear}
        onResetData={handleResetData}
      />

      {/* Main Tab Navigation with Remaining Count Badges */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
            onUpdateDress={handleUpdateDress}
            onAddDress={handleAddDress}
            onDeleteDress={handleDeleteDress}
          />
        )}

        {activeTab === 'itinerary' && (
          <EventItinerary
            days={days}
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
