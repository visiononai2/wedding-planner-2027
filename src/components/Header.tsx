import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ShoppingBag, 
  IndianRupee, 
  Download, 
  Printer, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Task, RentalItem, DressItem, DecisionPoint, PlanningNote } from '../types/wedding';

interface HeaderProps {
  tasks: Task[];
  rentals: RentalItem[];
  dresses: DressItem[];
  decisions: DecisionPoint[];
  notes?: PlanningNote[];
  weddingYear: number;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tasks,
  rentals,
  dresses,
  decisions,
  notes = [],
  weddingYear,
  onResetData
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 122, hours: 1, minutes: 47, seconds: 0 });

  useEffect(() => {
    // Target: Feb 21, 2027, 05:00 AM IST
    const targetDate = new Date(`2027-02-21T05:00:00+05:30`).getTime();

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

  // Real-time calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const remainingTasks = totalTasks - completedTasks;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalRentals = rentals.reduce((acc, r) => acc + (r.totalCost || 0), 0);
  const totalRentalAdvance = rentals.reduce((acc, r) => acc + (r.advancePaid || 0), 0);
  const rentalsPendingPickup = rentals.filter(r => r.status === 'To Book' || r.status === 'Reserved').length;
  const rentalsBalanceDue = totalRentals - totalRentalAdvance;

  const totalDresses = dresses.reduce((acc, d) => acc + (d.costEstimated || 0), 0);
  const totalDressAdvance = dresses.reduce((acc, d) => acc + (d.advancePaid || 0), 0);
  const dressesToFinish = dresses.filter(d => d.status !== 'Ready').length;
  const dressesBalanceDue = totalDresses - totalDressAdvance;

  const grandTotalCost = totalRentals + totalDresses;
  const grandTotalPaid = totalRentalAdvance + totalDressAdvance;
  const grandTotalDue = grandTotalCost - grandTotalPaid;

  const handleExportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      currentDate: '2026-10-22',
      weddingDate: '2027-02-21',
      tasks,
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
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Wedding Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Feb 20–21, 2027
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
              <span className="font-medium text-gray-700">Today: Oct 22, 2026</span>
              <span>•</span>
              <span>Marriage: Feb 21, 2027</span>
              <span>•</span>
              <span>Silver Farm, Surat</span>
            </div>
          </div>

          {/* Clean Countdown & Utility Actions */}
          <div className="flex items-center space-x-3">
            {/* Countdown Badge */}
            <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg flex items-center space-x-2 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>
                <strong>{timeLeft.days} days</strong>, {timeLeft.hours}h {timeLeft.minutes}m to Feb 21, 2027
              </span>
            </div>

            <button
              onClick={() => window.print()}
              title="Print Tracker"
              className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium transition"
            >
              <Printer className="w-3.5 h-3.5 inline mr-1 text-gray-500" />
              Print
            </button>

            <button
              onClick={handleExportJSON}
              title="Backup JSON"
              className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium transition"
            >
              <Download className="w-3.5 h-3.5 inline mr-1 text-gray-500" />
              Backup
            </button>

            <button
              onClick={onResetData}
              title="Reset data back to defaults"
              className="p-1.5 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
          {/* Tasks Summary */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Tasks Progress</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg font-bold text-gray-900 mt-1">
              {completedTasks} / {totalTasks} <span className="text-xs text-gray-500 font-normal">Done ({progressPercent}%)</span>
            </div>
            <div className="text-xs text-amber-700 font-medium mt-0.5">
              {remainingTasks} tasks remaining
            </div>
          </div>

          {/* Rentals Summary */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Rentals (Pickups & Drops)</span>
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-gray-900 mt-1">
              {rentalsPendingPickup} / {rentals.length} <span className="text-xs text-gray-500 font-normal">Pending Pickup</span>
            </div>
            <div className="text-xs text-gray-600 mt-0.5">
              ₹{rentalsBalanceDue.toLocaleString('en-IN')} balance to pay
            </div>
          </div>

          {/* Outfits Summary */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Dresses & Tailoring</span>
              <ShoppingBag className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-gray-900 mt-1">
              {dressesToFinish} / {dresses.length} <span className="text-xs text-gray-500 font-normal">To Finish</span>
            </div>
            <div className="text-xs text-gray-600 mt-0.5">
              ₹{dressesBalanceDue.toLocaleString('en-IN')} pending at tailors
            </div>
          </div>

          {/* Overall Financials */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Total Budget & Due</span>
              <IndianRupee className="w-4 h-4 text-gray-700" />
            </div>
            <div className="text-lg font-bold text-gray-900 mt-1">
              ₹{grandTotalDue.toLocaleString('en-IN')} <span className="text-xs text-gray-500 font-normal">Due</span>
            </div>
            <div className="text-xs text-emerald-700 font-medium mt-0.5">
              Paid: ₹{grandTotalPaid.toLocaleString('en-IN')} of ₹{grandTotalCost.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
