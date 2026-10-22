import React, { useState } from 'react';
import { 
  CalendarRange, 
  Truck, 
  ShoppingBag, 
  Clock, 
  HelpCircle, 
  FileText, 
  Users, 
  Camera,
  Search,
  MoreHorizontal,
  X
} from 'lucide-react';
import { WeddingSide } from '../types/wedding';

export type TabType = 'month-tracker' | 'pre-wedding' | 'rentals' | 'dresses' | 'itinerary' | 'decisions' | 'notes';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  activeSide: WeddingSide;
  onSideChange: (side: WeddingSide) => void;
  tasksRemainingCount: number;
  preWeddingRemainingCount?: number;
  rentalsPendingCount: number;
  dressesToBuyCount: number;
  decisionsPendingCount: number;
  scheduleItemsCount: number;
  notesCount: number;
  onOpenSearch?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  activeSide,
  onSideChange,
  tasksRemainingCount,
  preWeddingRemainingCount = 0,
  rentalsPendingCount,
  dressesToBuyCount,
  decisionsPendingCount,
  scheduleItemsCount,
  notesCount,
  onOpenSearch
}) => {
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  const tabs = [
    {
      id: 'month-tracker' as TabType,
      label: 'Tasks',
      fullLabel: 'Month-by-Month Tasks',
      icon: CalendarRange,
      countBadge: tasksRemainingCount > 0 ? `${tasksRemainingCount} left` : 'All done',
      badgeColor: tasksRemainingCount > 0 ? 'bg-amber-100 text-amber-900 border border-amber-200/60' : 'bg-emerald-100 text-emerald-900 border border-emerald-200/60'
    },
    {
      id: 'pre-wedding' as TabType,
      label: 'Pre-Wedding',
      fullLabel: 'Pre-Wedding Shoot (2–7 Days Trip)',
      icon: Camera,
      countBadge: preWeddingRemainingCount > 0 ? `${preWeddingRemainingCount} tasks` : 'Shoot Trip',
      badgeColor: 'bg-indigo-100 text-indigo-900 border border-indigo-200/60'
    },
    {
      id: 'itinerary' as TabType,
      label: 'Run-Sheet',
      fullLabel: 'Run-Sheet (Feb 18–21)',
      icon: Clock,
      countBadge: `${scheduleItemsCount} cues`,
      badgeColor: 'bg-slate-100 text-slate-800 border border-slate-200/60'
    },
    {
      id: 'dresses' as TabType,
      label: 'Outfits',
      fullLabel: 'Outfits & Dresses',
      icon: ShoppingBag,
      countBadge: dressesToBuyCount > 0 ? `${dressesToBuyCount} to buy` : 'All ready',
      badgeColor: dressesToBuyCount > 0 ? 'bg-purple-100 text-purple-900 border border-purple-200/60' : 'bg-emerald-100 text-emerald-900 border border-emerald-200/60'
    },
    {
      id: 'rentals' as TabType,
      label: 'Rentals & DJ',
      fullLabel: 'Rentals & DJ Sound Rigs',
      icon: Truck,
      countBadge: rentalsPendingCount > 0 ? `${rentalsPendingCount} pending` : 'All booked',
      badgeColor: rentalsPendingCount > 0 ? 'bg-blue-100 text-blue-900 border border-blue-200/60' : 'bg-emerald-100 text-emerald-900 border border-emerald-200/60'
    },
    {
      id: 'decisions' as TabType,
      label: 'Decisions',
      fullLabel: 'Decisions Tracker',
      icon: HelpCircle,
      countBadge: decisionsPendingCount > 0 ? `${decisionsPendingCount} pending` : 'Decided',
      badgeColor: decisionsPendingCount > 0 ? 'bg-amber-100 text-amber-900 border border-amber-200/60' : 'bg-emerald-100 text-emerald-900 border border-emerald-200/60'
    },
    {
      id: 'notes' as TabType,
      label: 'Notes',
      fullLabel: 'Planning Notes',
      icon: FileText,
      countBadge: `${notesCount} notes`,
      badgeColor: 'bg-slate-100 text-slate-800 border border-slate-200/60'
    }
  ];

  return (
    <>
      <nav 
        className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200"
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Control Bar: Perspective Switcher & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 pb-2 border-b border-slate-100">
            {/* Perspective Switcher */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Perspective:</span>
              <div 
                role="radiogroup" 
                aria-label="View perspective" 
                className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70"
              >
                <button
                  role="radio"
                  aria-checked={activeSide === 'ALL'}
                  onClick={() => onSideChange('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none ${
                    activeSide === 'ALL'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-slate-600" />
                  <span>Both Sides (Joint)</span>
                </button>

                <button
                  role="radio"
                  aria-checked={activeSide === 'BOY'}
                  onClick={() => onSideChange('BOY')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none ${
                    activeSide === 'BOY'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span>👦</span>
                  <span>Boy's Side</span>
                </button>

                <button
                  role="radio"
                  aria-checked={activeSide === 'GIRL'}
                  onClick={() => onSideChange('GIRL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500 focus:outline-none ${
                    activeSide === 'GIRL'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span>👧</span>
                  <span>Girl's Side</span>
                </button>
              </div>
            </div>

            {/* Quick Context & Search */}
            <div className="flex items-center space-x-2">
              <div className="text-[11px] text-slate-500 hidden md:block">
                {activeSide === 'ALL' && <span>Showing unified checklist for Groom & Bride</span>}
                {activeSide === 'BOY' && <span className="text-blue-700 font-semibold">Filtered for Groom & Boy's family rituals</span>}
                {activeSide === 'GIRL' && <span className="text-rose-600 font-semibold">Filtered for Bride & Girl's family rituals</span>}
              </div>

              {onOpenSearch && (
                <button
                  onClick={onOpenSearch}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
                  aria-label="Open search command palette"
                >
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Search</span>
                  <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                    ⌘K
                  </kbd>
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Desktop Tabs */}
          <div 
            role="tablist" 
            aria-label="Dashboard views"
            className="flex space-x-1.5 sm:space-x-2 overflow-x-auto py-2 scrollbar-none"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 active:scale-98 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus:outline-none ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1.5 opacity-80 shrink-0" />
                  <span>{tab.fullLabel}</span>
                  {tab.countBadge && (
                    <span
                      className={`ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : tab.badgeColor
                      }`}
                    >
                      {tab.countBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Ergonomic Mobile Bottom Action Dock */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1 flex items-center justify-around no-print">
        <button
          onClick={() => onTabChange('month-tracker')}
          className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center text-[10px] font-bold rounded-xl transition-colors ${
            activeTab === 'month-tracker' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Tasks"
        >
          <CalendarRange className="w-5 h-5 mb-0.5" />
          <span>Tasks</span>
        </button>

        <button
          onClick={() => onTabChange('pre-wedding')}
          className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center text-[10px] font-bold rounded-xl transition-colors ${
            activeTab === 'pre-wedding' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Pre-Wedding"
        >
          <Camera className="w-5 h-5 mb-0.5" />
          <span>Shoot</span>
        </button>

        <button
          onClick={() => onTabChange('itinerary')}
          className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center text-[10px] font-bold rounded-xl transition-colors ${
            activeTab === 'itinerary' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Run-Sheet"
        >
          <Clock className="w-5 h-5 mb-0.5" />
          <span>Run-Sheet</span>
        </button>

        <button
          onClick={() => onTabChange('dresses')}
          className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center text-[10px] font-bold rounded-xl transition-colors ${
            activeTab === 'dresses' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Outfits"
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>Outfits</span>
        </button>

        <button
          onClick={() => setIsMobileMoreOpen(true)}
          className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center text-[10px] font-bold rounded-xl transition-colors ${
            isMobileMoreOpen ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="More views"
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </div>

      {/* Mobile More Sheet */}
      {isMobileMoreOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end p-4 animate-in fade-in duration-150"
          onClick={() => setIsMobileMoreOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl p-5 space-y-4 shadow-2xl max-w-sm mx-auto w-full animate-in slide-in-from-bottom-5 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">All Modules & Views</span>
              <button 
                onClick={() => setIsMobileMoreOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isSelected = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      onTabChange(t.id);
                      setIsMobileMoreOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl font-semibold transition-colors text-left ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 opacity-80" />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {onOpenSearch && (
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  onOpenSearch();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Search Anything (⌘K)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
