import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  ShoppingBag, 
  Truck, 
  HelpCircle, 
  FileText, 
  Camera, 
  Users, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Plus, 
  Download, 
  Printer, 
  X,
  Compass
} from 'lucide-react';
import { 
  Task, 
  EventDaySchedule, 
  DressItem, 
  RentalItem, 
  PlanningNote, 
  WeddingSide 
} from '../types/wedding';
import { TabType } from './Navigation';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  days: EventDaySchedule[];
  dresses: DressItem[];
  rentals: RentalItem[];
  notes: PlanningNote[];
  activeSide: WeddingSide;
  onSideChange: (side: WeddingSide) => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenAddTask?: () => void;
  onExportJSON?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tasks,
  onToggleTask,
  days,
  dresses,
  rentals,
  notes,
  activeSide,
  onSideChange,
  activeTab,
  onTabChange,
  onOpenAddTask,
  onExportJSON
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle global Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Navigation Items
  const navItems = [
    { id: 'month-tracker', label: 'Go to Month-by-Month Tasks', category: 'Navigation', icon: Calendar, action: () => { onTabChange('month-tracker'); onClose(); } },
    { id: 'pre-wedding', label: 'Go to Pre-Wedding Shoot Planner (2–7 Days Trip)', category: 'Navigation', icon: Camera, action: () => { onTabChange('pre-wedding'); onClose(); } },
    { id: 'itinerary', label: 'Go to Run-Sheet (Feb 18–21 Itinerary)', category: 'Navigation', icon: Clock, action: () => { onTabChange('itinerary'); onClose(); } },
    { id: 'dresses', label: 'Go to Outfits & Dresses Tracker', category: 'Navigation', icon: ShoppingBag, action: () => { onTabChange('dresses'); onClose(); } },
    { id: 'rentals', label: 'Go to Rentals & DJ Sound Rigs', category: 'Navigation', icon: Truck, action: () => { onTabChange('rentals'); onClose(); } },
    { id: 'decisions', label: 'Go to Decisions & Questions', category: 'Navigation', icon: HelpCircle, action: () => { onTabChange('decisions'); onClose(); } },
    { id: 'notes', label: 'Go to Planning Notes', category: 'Navigation', icon: FileText, action: () => { onTabChange('notes'); onClose(); } },
  ];

  // Perspective Switchers
  const sideItems = [
    { id: 'side-all', label: 'Switch to: Both Sides (Joint Perspective)', category: 'Perspective', icon: Users, action: () => { onSideChange('ALL'); onClose(); } },
    { id: 'side-boy', label: "Switch to: Boy's Side (Groom Focus)", category: 'Perspective', icon: Users, action: () => { onSideChange('BOY'); onClose(); } },
    { id: 'side-girl', label: "Switch to: Girl's Side (Bride Focus)", category: 'Perspective', icon: Users, action: () => { onSideChange('GIRL'); onClose(); } },
  ];

  // Quick Actions
  const actionItems = [
    { id: 'act-add-task', label: 'Create New Task...', category: 'Quick Action', icon: Plus, action: () => { onTabChange('month-tracker'); onOpenAddTask?.(); onClose(); } },
    { id: 'act-export', label: 'Export Full Backup JSON', category: 'Quick Action', icon: Download, action: () => { onExportJSON?.(); onClose(); } },
    { id: 'act-print', label: 'Print Current View', category: 'Quick Action', icon: Printer, action: () => { window.print(); onClose(); } },
  ];

  // Search Results across Tasks
  const taskResults = tasks
    .filter(t => !normalizedQuery || t.title.toLowerCase().includes(normalizedQuery) || t.notes?.toLowerCase().includes(normalizedQuery))
    .slice(0, 5)
    .map(t => ({
      id: `task-${t.id}`,
      label: t.title,
      sublabel: `${t.category.toUpperCase()} • ${t.assignedTo} • ${t.completed ? 'Completed' : 'Pending'}`,
      category: 'Tasks',
      icon: t.completed ? CheckCircle2 : Circle,
      iconColor: t.completed ? 'text-emerald-500' : 'text-gray-400',
      action: () => {
        onTabChange('month-tracker');
        onToggleTask(t.id);
        onClose();
      }
    }));

  // Search Results across Event Cues
  const cueResults: Array<{
    id: string;
    label: string;
    sublabel: string;
    category: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor?: string;
    action: () => void;
  }> = [];

  days.forEach(d => {
    d.items.forEach(it => {
      if (!normalizedQuery || it.title.toLowerCase().includes(normalizedQuery) || it.gujaratiTitle?.includes(normalizedQuery) || it.actionNotes.toLowerCase().includes(normalizedQuery)) {
        if (cueResults.length < 4) {
          cueResults.push({
            id: `cue-${it.id}`,
            label: `${it.time}: ${it.title}`,
            sublabel: `${d.dayName} • ${it.location}`,
            category: 'Run-Sheet Cues',
            icon: Clock,
            iconColor: 'text-indigo-500',
            action: () => {
              onTabChange('itinerary');
              onClose();
            }
          });
        }
      }
    });
  });

  // Search Results across Outfits
  const dressResults = dresses
    .filter(d => !normalizedQuery || d.garmentName.toLowerCase().includes(normalizedQuery) || d.event.toLowerCase().includes(normalizedQuery))
    .slice(0, 3)
    .map(d => ({
      id: `dress-${d.id}`,
      label: `${d.person}: ${d.garmentName}`,
      sublabel: `${d.event} • ${d.status}`,
      category: 'Outfits',
      icon: ShoppingBag,
      iconColor: 'text-purple-500',
      action: () => {
        onTabChange('dresses');
        onClose();
      }
    }));

  // Combine results
  const allResults = [
    ...(normalizedQuery ? [] : navItems.slice(0, 4)),
    ...(normalizedQuery ? [] : sideItems),
    ...taskResults,
    ...cueResults,
    ...dressResults,
    ...(normalizedQuery ? navItems.filter(n => n.label.toLowerCase().includes(normalizedQuery)) : []),
    ...(normalizedQuery ? sideItems.filter(s => s.label.toLowerCase().includes(normalizedQuery)) : []),
    ...actionItems.filter(a => !normalizedQuery || a.label.toLowerCase().includes(normalizedQuery))
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % allResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allResults.length) % allResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        allResults[selectedIndex].action();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-gray-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command search palette"
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[80vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-100 bg-gray-50/50 gap-3">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a task, cue, outfit, or command (e.g. 'Haldi', 'Jaan', 'Boy', 'Garba')..."
            className="flex-1 bg-transparent border-none text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-hidden focus:ring-0"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-100 border border-gray-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 divide-y divide-gray-50 max-h-[60vh]"
        >
          {allResults.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              No matching tasks, cues, or commands found for "{query}".
            </div>
          ) : (
            allResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-950 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Icon className={`w-4 h-4 shrink-0 ${'iconColor' in item ? item.iconColor : 'text-gray-400'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-gray-900 font-semibold">{item.label}</div>
                      {'sublabel' in item && (
                        <div className="truncate text-[11px] text-gray-500">{item.sublabel}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100">
                      {item.category}
                    </span>
                    {isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-600 animate-in slide-in-from-left-1 duration-150" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Command Bar Footer with Shortcuts */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono mr-1">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono mr-1">↓</kbd>
              navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono mr-1">↵</kbd>
              select
            </span>
          </div>
          <span className="text-[10px] text-gray-400">
            Press <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">⌘K</kbd> anywhere
          </span>
        </div>
      </div>
    </div>
  );
};
