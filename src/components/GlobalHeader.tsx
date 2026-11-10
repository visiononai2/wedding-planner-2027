import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart,
  Clock, 
  Search, 
  Download, 
  RotateCcw, 
  SlidersHorizontal,
  CalendarRange, 
  HelpCircle, 
  FileText, 
  MoreHorizontal, 
  X,
  CloudCheck,
  Cloud,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { 
  Task, 
  RentalItem, 
  DressItem, 
  DecisionPoint, 
  PlanningNote, 
  WeddingSide, 
  PreWeddingTripPlan,
  TaskSubView
} from '../types/wedding';
import { SyncStatus } from '../services/weddingSync';
import { TabType } from './Navigation';

export interface GlobalHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  activeSide: WeddingSide;
  onSideChange: (side: WeddingSide) => void;
  tasks: Task[];
  rentals: RentalItem[];
  dresses: DressItem[];
  decisions: DecisionPoint[];
  notes?: PlanningNote[];
  preWeddingPlan?: PreWeddingTripPlan;
  weddingYear: number;
  tasksRemainingCount: number;
  preWeddingRemainingCount?: number;
  rentalsPendingCount: number;
  dressesToBuyCount: number;
  decisionsPendingCount: number;
  scheduleItemsCount: number;
  notesCount: number;
  syncStatus?: SyncStatus;
  onResetData: () => void;
  onOpenSearch?: () => void;
  onNavigateToTaskSubView?: (subView: TaskSubView) => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  activeTab,
  onTabChange,
  activeSide,
  onSideChange,
  tasks,
  rentals,
  dresses,
  decisions,
  notes = [],
  preWeddingPlan,
  weddingYear,
  tasksRemainingCount,
  preWeddingRemainingCount = 0,
  rentalsPendingCount,
  dressesToBuyCount,
  decisionsPendingCount,
  scheduleItemsCount,
  notesCount,
  syncStatus = 'unconfigured',
  onResetData,
  onOpenSearch,
  onNavigateToTaskSubView
}) => {
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const utilitiesRef = useRef<HTMLDivElement>(null);

  // Calm countdown targeting Muhurat / Jaan departure
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
  }>({ days: 105, hours: 4, minutes: 17 });

  useEffect(() => {
    // Target: Feb 21, 2027, 04:00 PM IST (4 PM Jaan to Katargam)
    const targetDate = new Date(`2027-02-21T16:00:00+05:30`).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  // Dismiss utilities menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (utilitiesRef.current && !utilitiesRef.current.contains(event.target as Node)) {
        setIsUtilitiesOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUtilitiesOpen(false);
      }
    };

    if (isUtilitiesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUtilitiesOpen]);

  // Perspective-aware task calculations
  const filteredTasks = tasks.filter(task => {
    if (activeSide === 'BOY') {
      return task.side === 'Boy' || task.side === 'Both' || !task.side || task.assignedTo === 'Groom' || task.assignedTo === 'Both';
    }
    if (activeSide === 'GIRL') {
      return task.side === 'Girl' || task.side === 'Both' || !task.side || task.assignedTo === 'Bride' || task.assignedTo === 'Both';
    }
    if (activeSide === 'FAMILY') {
      return task.assignedTo === 'Family';
    }
    return true;
  });

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Perspective-aware financial snapshot for utilities popover
  const filteredRentals = rentals.filter(r => {
    if (activeSide === 'BOY') return r.side === 'Boy' || r.side === 'Both' || !r.side;
    if (activeSide === 'GIRL') return r.side === 'Girl' || r.side === 'Both' || !r.side;
    if (activeSide === 'FAMILY') return r.side === 'Both' || !r.side;
    return true;
  });

  const filteredDresses = dresses.filter(d => {
    if (activeSide === 'BOY') return d.person === 'Groom';
    if (activeSide === 'GIRL') return d.person === 'Bride';
    return true;
  });

  const totalRentals = filteredRentals.reduce((acc, r) => acc + (r.totalCost || 0), 0);
  const totalRentalAdvance = filteredRentals.reduce((acc, r) => acc + (r.advancePaid || 0), 0);
  const totalDresses = filteredDresses.reduce((acc, d) => acc + (d.costEstimated || 0), 0);
  const totalDressAdvance = filteredDresses.reduce((acc, d) => acc + (d.advancePaid || 0), 0);
  const grandTotalCost = totalRentals + totalDresses;
  const grandTotalPaid = totalRentalAdvance + totalDressAdvance;
  const grandTotalDue = grandTotalCost - grandTotalPaid;

  const handleExportJSON = () => {
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
    a.download = `parth-nisha-wedding-2027.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIsUtilitiesOpen(false);
  };

  // Direction B: Editorial Navigation Modules
  const navTabs = [
    {
      id: 'month-tracker' as TabType,
      label: 'Tasks',
      count: tasksRemainingCount,
      icon: CalendarRange
    },
    {
      id: 'itinerary' as TabType,
      label: 'Event Schedule',
      count: scheduleItemsCount,
      icon: Clock
    },
    {
      id: 'decisions' as TabType,
      label: 'Decisions',
      count: decisionsPendingCount,
      icon: HelpCircle
    },
    {
      id: 'notes' as TabType,
      label: 'Planning Notes',
      count: notesCount,
      icon: FileText
    }
  ];

  return (
    <>
      {/* Direction B: Luxury Editorial Atelier Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
          
          {/* Row 1: Monogram Brand, Perspective Switcher & Atelier Utilities */}
          <div className="flex items-center justify-between h-16 border-b border-slate-200/60 gap-4">
            
            {/* Left: Luxury Editorial Crest & Couple Monogram */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onTabChange('month-tracker')}
                className="flex items-center gap-3 text-left group focus:outline-none"
                title="Parth & Nisha Vivah Celebration · Feb 15–21, 2027"
              >
                {/* Gold Seal Monogram Crest */}
                <div className="w-9 h-9 rounded-full bg-white border border-[#D4AF37]/50 shadow-[0_2px_8px_rgba(212,175,55,0.12)] flex items-center justify-center font-cormorant italic text-sm font-semibold text-[#9A7B2C] group-hover:border-[#B89230] group-hover:shadow-[0_2px_12px_rgba(212,175,55,0.22)] group-hover:scale-105 transition-all duration-300">
                  <span className="tracking-tighter">P&N</span>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="font-cormorant text-lg sm:text-xl font-normal tracking-wide text-slate-900 group-hover:text-[#9A7B2C] transition-colors">
                      Parth <span className="font-serif italic text-[#B89230] font-light">&</span> Nisha
                    </span>
                    <span className="hidden lg:inline text-[9px] font-sans font-semibold tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-[#8B6E1F] border border-amber-200/70">
                      Vivah {weddingYear}
                    </span>
                  </div>
                  <span className="text-[10px] tracking-[0.18em] uppercase font-sans font-medium text-slate-400">
                    Feb 15–21, 2027
                  </span>
                </div>
              </button>
            </div>

            {/* Center: Tailored Editorial Perspective Switcher (Desktop >= lg) */}
            <div className="hidden lg:flex items-center justify-center">
              <div 
                role="radiogroup" 
                aria-label="Wedding perspective view"
                className="inline-flex items-center p-1 bg-slate-100 rounded-full border border-slate-200/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
              >
                {/* Joint View */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={activeSide === 'ALL'}
                  onClick={() => onSideChange('ALL')}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                    activeSide === 'ALL'
                      ? 'bg-white text-slate-900 font-semibold shadow-xs ring-1 ring-black/[0.04]'
                      : 'text-slate-500 hover:text-slate-800 font-medium'
                  }`}
                  title="Unified celebration checklist for both Groom & Bride"
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeSide === 'ALL' ? 'bg-[#B89230]' : 'bg-slate-300'}`} />
                  <span>Joint</span>
                </button>

                {/* Groom's Side */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={activeSide === 'BOY'}
                  onClick={() => onSideChange('BOY')}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                    activeSide === 'BOY'
                      ? 'bg-white text-slate-900 font-semibold shadow-xs ring-1 ring-black/[0.04]'
                      : 'text-slate-500 hover:text-slate-800 font-medium'
                  }`}
                  title="Groom's rituals, Jaan & Katargam arrangements"
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeSide === 'BOY' ? 'bg-[#3B6281]' : 'bg-slate-300'}`} />
                  <span>Groom</span>
                </button>

                {/* Bride's Side */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={activeSide === 'GIRL'}
                  onClick={() => onSideChange('GIRL')}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                    activeSide === 'GIRL'
                      ? 'bg-white text-slate-900 font-semibold shadow-xs ring-1 ring-black/[0.04]'
                      : 'text-slate-500 hover:text-slate-800 font-medium'
                  }`}
                  title="Bride's rituals, trousseau & Mandvo arrangements"
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeSide === 'GIRL' ? 'bg-[#A84A5B]' : 'bg-slate-300'}`} />
                  <span>Bride</span>
                </button>

                {/* Family's Side */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={activeSide === 'FAMILY'}
                  onClick={() => onSideChange('FAMILY')}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                    activeSide === 'FAMILY'
                      ? 'bg-white text-slate-900 font-semibold shadow-xs ring-1 ring-black/[0.04]'
                      : 'text-slate-500 hover:text-slate-800 font-medium'
                  }`}
                  title="Family rituals, catering & elders arrangements"
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeSide === 'FAMILY' ? 'bg-[#A36A36]' : 'bg-slate-300'}`} />
                  <span>Family</span>
                </button>
              </div>
            </div>

            {/* Right: Atelier Telemetry & Quick Utilities */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Calm Editorial Countdown Pill */}
              <div 
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-normal border border-slate-200/80 shadow-2xs transition-colors"
                title="Target: Feb 21, 2027 at 4:00 PM IST (Jaan departure to Katargam)"
              >
                <Clock className="w-3.5 h-3.5 text-[#B89230] stroke-[1.5]" />
                <span className="font-serif italic text-slate-400 text-[11px]">Muhurat</span>
                <span className="font-mono text-xs font-semibold text-slate-800 tracking-tight">{timeLeft.days}d {timeLeft.hours}h</span>
              </div>

              {/* Editorial Search Button */}
              {onOpenSearch && (
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200/80 bg-slate-50 hover:bg-white text-slate-600 hover:text-slate-900 text-xs font-medium tracking-wide transition-all shadow-2xs hover:-translate-y-0.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  title="Search everything across tasks, events, and notes (⌘K)"
                >
                  <Search className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />
                  <span className="hidden md:inline font-sans text-xs">Search</span>
                  <kbd className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200/80 rounded px-1.5 py-0.5 ml-0.5">⌘K</kbd>
                </button>
              )}

              {/* Atelier Settings & Utilities Popover Trigger */}
              <div className="relative" ref={utilitiesRef}>
                <button
                  type="button"
                  onClick={() => setIsUtilitiesOpen(prev => !prev)}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none ${
                    isUtilitiesOpen 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                      : 'border-slate-200/80 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-white hover:border-[#D4AF37] hover:-translate-y-0.5 shadow-2xs'
                  }`}
                  aria-label="Atelier settings and utilities"
                  title="Atelier Settings & Cloud Ledger"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>

                {/* Floating Atelier Popover */}
                {isUtilitiesOpen && (
                  <div className="absolute right-0 mt-2 w-84 bg-white rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.14)] border border-slate-200/90 p-5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 space-y-4">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-slate-900 uppercase tracking-widest text-xs">
                          Wedding Atelier
                        </span>
                        <span className="text-[9px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 font-semibold">
                          Vivah {weddingYear}
                        </span>
                      </div>
                      <button 
                        onClick={() => setIsUtilitiesOpen(false)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
                      >
                        <X className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>
                    </div>

                    {/* Section 1: Realtime Replication Telemetry */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {syncStatus === 'synced' ? (
                          <CloudCheck className="w-4 h-4 text-emerald-600 stroke-[1.5]" />
                        ) : syncStatus === 'syncing' ? (
                          <Cloud className="w-4 h-4 text-[#B89230] animate-pulse stroke-[1.5]" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-slate-400 stroke-[1.5]" />
                        )}
                        <div>
                          <div className="font-semibold text-slate-900">
                            {syncStatus === 'synced' ? 'Cloud Synced' : syncStatus === 'syncing' ? 'Syncing to Cloud...' : 'Local Auto-Save'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Firebase Firestore · Realtime cloud replication
                          </div>
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500/80 ring-2 ring-emerald-500/20" />
                    </div>

                    {/* Section 2: Financial Snapshot */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.16em]">
                        Ceremonial Ledger ({activeSide === 'ALL' ? 'Total' : activeSide})
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Balance Due:</span>
                          <span className="font-mono font-bold text-slate-900 text-sm">₹{grandTotalDue.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-200/60">
                          <span>Total Committed:</span>
                          <span className="font-mono text-slate-700 font-medium">₹{grandTotalCost.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-emerald-700 font-medium">
                          <span>Advance Paid:</span>
                          <span className="font-mono">₹{grandTotalPaid.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Data Archives */}
                    <div className="pt-2 border-t border-slate-200/70 space-y-1.5">
                      <button
                        type="button"
                        onClick={handleExportJSON}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Download className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />
                          <span className="font-medium text-xs">Export Archive (JSON)</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">Download</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUtilitiesOpen(false);
                          onResetData();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl text-rose-700 hover:bg-rose-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2">
                          <RotateCcw className="w-3.5 h-3.5 text-rose-500 stroke-[1.5]" />
                          <span className="font-medium text-xs">Reset to Clean Defaults</span>
                        </div>
                        <span className="text-[10px] text-rose-400">Restore</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Mobile & Tablet Perspective Switcher Bar (< lg) */}
          <div className="lg:hidden flex items-center justify-center py-2 border-b border-slate-200/60 overflow-x-auto scrollbar-none bg-slate-50/50">
            <div 
              role="radiogroup" 
              aria-label="Wedding perspective view mobile"
              className="inline-flex items-center p-1 bg-slate-100 rounded-full border border-slate-200/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] shrink-0"
            >
              {/* Joint View */}
              <button
                type="button"
                role="radio"
                aria-checked={activeSide === 'ALL'}
                onClick={() => onSideChange('ALL')}
                className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                  activeSide === 'ALL'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs ring-1 ring-black/[0.04]'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
                title="Unified celebration checklist for both Groom & Bride"
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeSide === 'ALL' ? 'bg-[#B89230]' : 'bg-slate-300'}`} />
                <span>Joint</span>
              </button>

              {/* Groom's Side */}
              <button
                type="button"
                role="radio"
                aria-checked={activeSide === 'BOY'}
                onClick={() => onSideChange('BOY')}
                className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                  activeSide === 'BOY'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs ring-1 ring-black/[0.04]'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
                title="Groom's rituals, Jaan & Katargam arrangements"
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeSide === 'BOY' ? 'bg-[#3B6281]' : 'bg-slate-300'}`} />
                <span>Groom</span>
              </button>

              {/* Bride's Side */}
              <button
                type="button"
                role="radio"
                aria-checked={activeSide === 'GIRL'}
                onClick={() => onSideChange('GIRL')}
                className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                  activeSide === 'GIRL'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs ring-1 ring-black/[0.04]'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
                title="Bride's rituals, trousseau & Mandvo arrangements"
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeSide === 'GIRL' ? 'bg-[#A84A5B]' : 'bg-slate-300'}`} />
                <span>Bride</span>
              </button>

              {/* Family's Side */}
              <button
                type="button"
                role="radio"
                aria-checked={activeSide === 'FAMILY'}
                onClick={() => onSideChange('FAMILY')}
                className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                  activeSide === 'FAMILY'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs ring-1 ring-black/[0.04]'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
                title="Family rituals, catering & elders arrangements"
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeSide === 'FAMILY' ? 'bg-[#A36A36]' : 'bg-slate-300'}`} />
                <span>Family</span>
              </button>
            </div>
          </div>

          {/* Row 2: Editorial Navigation Rail & Progress Telemetry (Desktop & Tablet >= sm) */}
          <div className="hidden sm:flex items-center justify-between h-12 gap-4">
            
            {/* Left: Refined Underline Tabs */}
            <div 
              role="tablist" 
              aria-label="Application modules"
              className="flex items-center space-x-6 sm:space-x-8 overflow-x-auto scrollbar-none h-full"
            >
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.id}`}
                    onClick={() => onTabChange(tab.id)}
                    className={`relative flex items-center whitespace-nowrap h-full text-xs tracking-wider uppercase transition-all shrink-0 focus:outline-none ${
                      isActive
                        ? 'text-slate-900 font-bold after:absolute after:bottom-0 after:left-1 after:right-1 after:h-[2.5px] after:bg-[#B89230] after:rounded-full'
                        : 'text-slate-400 hover:text-slate-700 font-semibold'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 mr-2 shrink-0 stroke-[1.5] transition-colors ${isActive ? 'text-[#B89230]' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={`ml-2 text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full transition-colors ${
                          isActive 
                            ? 'bg-amber-50 text-amber-800 border border-amber-200/70' 
                            : 'bg-slate-100 text-slate-500 border border-slate-200/60'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: Editorial Progress Metric */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <span className="text-[10px] font-sans uppercase tracking-[0.16em] text-slate-400 font-semibold">
                {activeSide === 'ALL' ? 'Progress' : `${activeSide}`}:
              </span>
              <span className="text-xs font-serif italic text-slate-800 font-medium">
                {completedTasks} <span className="text-slate-400 not-italic font-sans text-[11px]">of</span> {totalTasks}
              </span>
              
              {/* Refined Gold Micro Progress Bar */}
              <div className="w-24 h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#B89230] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <span className="text-[10px] font-mono text-slate-500 font-semibold">
                {progressPercent}%
              </span>
            </div>

          </div>

        </div>

        {/* Hairline Bottom Gold Progress Rule (1px) */}
        <div className="w-full bg-slate-200/60 h-[1.5px] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#C5A880] to-[#8B6E1F] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Ergonomic Mobile Bottom Action Dock */}
      <div 
        role="tablist" 
        aria-label="Mobile navigation dock"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg px-2 py-1 flex items-center justify-around no-print pb-safe"
      >
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center text-[10px] tracking-wider uppercase rounded-lg transition-colors ${
                isActive ? 'text-[#8B6E1F] font-semibold' : 'text-slate-400 hover:text-slate-800'
              }`}
              aria-label={tab.label}
            >
              <Icon className="w-4 h-4 mb-0.5 stroke-[1.5]" />
              <span>{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsMobileMoreOpen(true)}
          className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center text-[10px] tracking-wider uppercase rounded-lg transition-colors ${
            isMobileMoreOpen ? 'text-[#8B6E1F] font-semibold' : 'text-slate-400 hover:text-slate-800'
          }`}
          aria-label="More views"
        >
          <MoreHorizontal className="w-4 h-4 mb-0.5 stroke-[1.5]" />
          <span>More</span>
        </button>
      </div>

      {/* Mobile More Sheet */}
      {isMobileMoreOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex flex-col justify-end p-4 animate-in fade-in duration-150"
          onClick={() => setIsMobileMoreOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-5 space-y-3.5 shadow-2xl max-w-sm mx-auto w-full border border-slate-200/90 animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60">
              <span className="font-serif font-bold text-sm text-slate-900 tracking-wider uppercase">Quick Actions</span>
              <button 
                onClick={() => setIsMobileMoreOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  onOpenSearch?.();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-medium border border-slate-200/70 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-slate-400 stroke-[1.5]" />
                  <span>Search Command Palette (⌘K)</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  handleExportJSON();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-medium border border-slate-200/70 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-slate-400 stroke-[1.5]" />
                  <span>Export Wedding Archive (JSON)</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  onResetData();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium border border-rose-200/70 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-rose-500 stroke-[1.5]" />
                  <span>Reset to Clean Defaults</span>
                </div>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
