import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Truck, 
  ShoppingBag, 
  IndianRupee, 
  Download, 
  RotateCcw,
  Search,
  Heart
} from 'lucide-react';
import { Task, RentalItem, DressItem, DecisionPoint, PlanningNote, WeddingSide, PreWeddingTripPlan } from '../types/wedding';

interface HeaderProps {
  tasks: Task[];
  rentals: RentalItem[];
  dresses: DressItem[];
  decisions: DecisionPoint[];
  notes?: PlanningNote[];
  preWeddingPlan?: PreWeddingTripPlan;
  activeSide?: WeddingSide;
  weddingYear: number;
  onResetData: () => void;
  onOpenSearch?: () => void;
  onNavigateToTaskSubView?: (subView: 'checklist' | 'outfits' | 'rentals' | 'pre-wedding') => void;
}

export const Header: React.FC<HeaderProps> = ({
  tasks,
  rentals,
  dresses,
  decisions,
  notes = [],
  preWeddingPlan,
  activeSide = 'ALL',
  weddingYear,
  onResetData,
  onOpenSearch,
  onNavigateToTaskSubView
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 121, hours: 18, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target: Feb 21, 2027, 04:00 PM IST (4 PM Jaan to Katargam)
    const targetDate = new Date(`2027-02-21T16:00:00+05:30`).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter tasks dynamically based on active perspective
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
  const remainingTasks = totalTasks - completedTasks;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter dresses based on perspective
  const filteredDresses = dresses.filter(d => {
    if (activeSide === 'BOY') return d.person === 'Groom';
    if (activeSide === 'GIRL') return d.person === 'Bride';
    return true;
  });

  // Filter rentals based on perspective
  const filteredRentals = rentals.filter(r => {
    if (activeSide === 'BOY') return r.side === 'Boy' || r.side === 'Both' || !r.side;
    if (activeSide === 'GIRL') return r.side === 'Girl' || r.side === 'Both' || !r.side;
    if (activeSide === 'FAMILY') return r.side === 'Both' || !r.side;
    return true;
  });

  const totalRentals = filteredRentals.reduce((acc, r) => acc + (r.totalCost || 0), 0);
  const totalRentalAdvance = filteredRentals.reduce((acc, r) => acc + (r.advancePaid || 0), 0);
  const rentalsPendingPickup = filteredRentals.filter(r => r.status === 'To Book' || r.status === 'Reserved').length;
  const rentalsBalanceDue = totalRentals - totalRentalAdvance;

  const totalDresses = filteredDresses.reduce((acc, d) => acc + (d.costEstimated || 0), 0);
  const totalDressAdvance = filteredDresses.reduce((acc, d) => acc + (d.advancePaid || 0), 0);
  const dressesToFinish = filteredDresses.filter(d => d.status !== 'Ready').length;
  const dressesBalanceDue = totalDresses - totalDressAdvance;

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
    a.download = `wedding-tracker-2027.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-3.5 sm:py-4">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-indigo-600 to-amber-400 p-[1.5px] shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  Wedding Dashboard
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Oct 22, 2026 – Feb 21, 2027
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <span>Silver Farm, Surat & Katargam</span>
                <span className="text-slate-300">•</span>
                <span>4:00 PM Jaan</span>
              </p>
            </div>
          </div>

          {/* Right Action Hub: Countdown, Search & Actions */}
          <div className="flex items-center gap-2">
            {/* Countdown Badge */}
            <div 
              className="bg-slate-900 text-white px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-xs"
              title="Countdown to 4:00 PM Jaan departure on Feb 21, 2027"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-mono tabular-nums tracking-tight">
                <strong>{timeLeft.days}d</strong> {timeLeft.hours}h {timeLeft.minutes}m
              </span>
            </div>

            {/* Quick Search Button */}
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search</span>
                <kbd className="text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded px-1 py-0.5">⌘K</kbd>
              </button>
            )}

            {/* Backup JSON */}
            <button
              type="button"
              onClick={handleExportJSON}
              title="Download full JSON backup of state"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Backup</span>
            </button>

            {/* Clean Reset */}
            <button
              type="button"
              onClick={onResetData}
              title="Reset dashboard to clean defaults"
              className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="pt-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-500">
              {activeSide === 'BOY' 
                ? "Groom's Rituals & Tasks" 
                : activeSide === 'GIRL' 
                ? "Bride's Rituals & Tasks" 
                : activeSide === 'FAMILY' 
                ? "Family's Rituals & Tasks" 
                : "Overall Wedding Progress"}
            </span>
            <span className="font-bold text-slate-900">
              {completedTasks}/{totalTasks} <span className="text-slate-400 font-normal">tasks completed ({progressPercent}%)</span>
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 4 Clean Metric Cards (Clickable shortcuts to task modules) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-3">
          {/* Tasks Summary */}
          <button
            type="button"
            onClick={() => onNavigateToTaskSubView?.('checklist')}
            className="text-left p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 transition-all hover:border-indigo-400 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 group cursor-pointer"
            title="Click to view General Tasks checklist"
          >
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
              <span className="uppercase tracking-wider text-[11px] font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
                {activeSide === 'BOY' 
                  ? "Boy's Tasks" 
                  : activeSide === 'GIRL' 
                  ? "Girl's Tasks" 
                  : activeSide === 'FAMILY' 
                  ? "Family's Tasks" 
                  : "Tasks Progress"}
              </span>
              <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5">
              {completedTasks} <span className="text-sm font-normal text-slate-400">/ {totalTasks}</span>
            </div>
            <div className="text-xs text-amber-700 font-medium mt-0.5 flex items-center justify-between">
              <span>{remainingTasks} tasks remaining</span>
              <span className="text-[10px] text-indigo-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
            </div>
          </button>

          {/* Rentals Summary */}
          <button
            type="button"
            onClick={() => onNavigateToTaskSubView?.('rentals')}
            className="text-left p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 transition-all hover:border-blue-400 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 group cursor-pointer"
            title="Click to manage Rentals & DJ Sound Rigs in Tasks"
          >
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
              <span className="uppercase tracking-wider text-[11px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors">Rentals & Sound</span>
              <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5">
              {rentalsPendingPickup} <span className="text-sm font-normal text-slate-400">/ {rentals.length}</span>
            </div>
            <div className="text-xs text-slate-600 mt-0.5 flex items-center justify-between">
              <span>₹{rentalsBalanceDue.toLocaleString('en-IN')} balance due</span>
              <span className="text-[10px] text-blue-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Manage →</span>
            </div>
          </button>

          {/* Outfits Summary */}
          <button
            type="button"
            onClick={() => onNavigateToTaskSubView?.('outfits')}
            className="text-left p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 transition-all hover:border-purple-400 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 group cursor-pointer"
            title="Click to manage Outfits & Tailoring in Tasks"
          >
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
              <span className="uppercase tracking-wider text-[11px] font-bold text-slate-500 group-hover:text-purple-600 transition-colors">
                {activeSide === 'BOY' ? "Groom Outfits" : activeSide === 'GIRL' ? "Bride Outfits" : "Outfits & Tailoring"}
              </span>
              <div className="w-6 h-6 rounded-lg bg-purple-50 border border-purple-200/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5">
              {dressesToFinish} <span className="text-sm font-normal text-slate-400">/ {filteredDresses.length}</span>
            </div>
            <div className="text-xs text-slate-600 mt-0.5 flex items-center justify-between">
              <span>₹{dressesBalanceDue.toLocaleString('en-IN')} pending</span>
              <span className="text-[10px] text-purple-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Manage →</span>
            </div>
          </button>

          {/* Overall Financials */}
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 transition-all hover:border-slate-300 hover:bg-white hover:shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
              <span className="uppercase tracking-wider text-[11px] font-bold text-slate-500">Balance Remaining</span>
              <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5">
              ₹{grandTotalDue.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-emerald-700 font-medium mt-0.5">
              Paid: ₹{grandTotalPaid.toLocaleString('en-IN')} / ₹{grandTotalCost.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
