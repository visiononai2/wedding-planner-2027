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
  onNavigateTaskSubView?: (subView: 'checklist' | 'outfits' | 'rentals' | 'pre-wedding') => void;
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
  onNavigateTaskSubView,
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
    { id: 'month-tracker', label: 'Go to General Tasks', category: 'Navigation', icon: Calendar, action: () => { onTabChange('month-tracker'); onNavigateTaskSubView?.('checklist'); onClose(); } },
    { id: 'itinerary', label: 'Go to Event Schedule (Feb 15–21 Itinerary)', category: 'Navigation', icon: Clock, action: () => { onTabChange('itinerary'); onClose(); } },
    { id: 'decisions', label: 'Go to Decisions & Questions Tracker', category: 'Navigation', icon: HelpCircle, action: () => { onTabChange('decisions'); onClose(); } },
    { id: 'notes', label: 'Go to Planning Notes', category: 'Navigation', icon: FileText, action: () => { onTabChange('notes'); onClose(); } },
    { id: 'dresses', label: 'Go to Outfits & Tailoring (in Tasks)', category: 'Tasks Workspaces', icon: ShoppingBag, action: () => { onTabChange('month-tracker'); onNavigateTaskSubView?.('outfits'); onClose(); } },
    { id: 'rentals', label: 'Go to Rentals & DJ Sound Rigs (in Tasks)', category: 'Tasks Workspaces', icon: Truck, action: () => { onTabChange('month-tracker'); onNavigateTaskSubView?.('rentals'); onClose(); } },
    { id: 'pre-wedding', label: 'Go to Pre-Wedding Shoot Planner (in Tasks)', category: 'Tasks Workspaces', icon: Camera, action: () => { onTabChange('month-tracker'); onNavigateTaskSubView?.('pre-wedding'); onClose(); } },
  ];

  // Perspective Switchers
  const sideItems = [
    { id: 'side-all', label: 'Switch to: Both Sides (Joint Perspective)', category: 'Perspective', icon: Users, action: () => { onSideChange('ALL'); onClose(); } },
    { id: 'side-boy', label: "Switch to: Boy's Side (Groom Focus)", category: 'Perspective', icon: Users, action: () => { onSideChange('BOY'); onClose(); } },
    { id: 'side-girl', label: "Switch to: Girl's Side (Bride Focus)", category: 'Perspective', icon: Users, action: () => { onSideChange('GIRL'); onClose(); } },
    { id: 'side-family', label: "Switch to: Family's Side (Family & Elders Focus)", category: 'Perspective', icon: Users, action: () => { onSideChange('FAMILY'); onClose(); } },
  ];

  // Quick Actions
  const actionItems = [
    { id: 'act-add-task', label: 'Create New Task...', category: 'Quick Action', icon: Plus, action: () => { onTabChange('month-tracker'); onOpenAddTask?.(); onClose(); } },
    { id: 'act-export', label: 'Export Full Backup JSON', category: 'Quick Action', icon: Download, action: () => { onExportJSON?.(); onClose(); } },
  ];

  // Search Results across Tasks
  const taskResults = tasks
    .filter(t => !normalizedQuery || t.title.toLowerCase().includes(normalizedQuery) || t.description?.toLowerCase().includes(normalizedQuery) || t.notes?.toLowerCase().includes(normalizedQuery))
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
            category: 'Event Schedule Cues',
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
        onTabChange('month-tracker');
        onNavigateTaskSubView?.('outfits');
        onClose();
      }
    }));

  // Search Results across Rentals
  const rentalResults = rentals
    .filter(r => !normalizedQuery || r.item.toLowerCase().includes(normalizedQuery) || r.vendor?.toLowerCase().includes(normalizedQuery))
    .slice(0, 3)
    .map(r => ({
      id: `rental-${r.id}`,
      label: r.item,
      sublabel: `${r.vendor || 'Equipment'} • ${r.status}`,
      category: 'Rentals',
      icon: Truck,
      iconColor: 'text-blue-500',
      action: () => {
        onTabChange('month-tracker');
        onNavigateTaskSubView?.('rentals');
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
    ...rentalResults,
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command search palette"
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_25px_70px_rgba(15,23,42,0.2)] border border-slate-200/90 overflow-hidden flex flex-col max-h-[80vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-6 py-4.5 border-b border-slate-100 bg-white gap-3.5">
          <Search className="w-5 h-5 text-slate-400 shrink-0 stroke-[1.5]" />
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
            className="flex-1 bg-transparent border-none text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 font-sans"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[1.5]" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200/70 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-3 divide-y divide-slate-100 max-h-[60vh]"
        >
          {allResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-sans">
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
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-slate-900 text-white font-medium shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Icon className={`w-4 h-4 shrink-0 stroke-[1.5] ${'iconColor' in item ? (isSelected ? 'text-[#D4AF37]' : item.iconColor) : (isSelected ? 'text-[#D4AF37]' : 'text-slate-400')}`} />
                    <div className="min-w-0 flex-1">
                      <div className={`truncate font-medium ${isSelected ? 'text-white' : 'text-slate-900'}`}>{item.label}</div>
                      {'sublabel' in item && (
                        <div className={`truncate text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>{item.sublabel}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className={`text-[10px] font-sans font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-slate-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                    }`}>
                      {item.category}
                    </span>
                    {isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] stroke-[1.5] animate-in slide-in-from-left-1 duration-150" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Command Bar Footer with Shortcuts */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 text-[11px] text-slate-500 font-sans flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200/80 rounded text-[10px] font-mono text-slate-600 mr-1 shadow-2xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200/80 rounded text-[10px] font-mono text-slate-600 mr-1 shadow-2xs">↓</kbd>
              navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200/80 rounded text-[10px] font-mono text-slate-600 mr-1 shadow-2xs">↵</kbd>
              select
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200/80 rounded text-[10px] font-mono text-slate-600 shadow-2xs">⌘K</kbd> anywhere
          </span>
        </div>
      </div>
    </div>
  );
};
