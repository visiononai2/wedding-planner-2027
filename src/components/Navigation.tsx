import React from 'react';
import { 
  CalendarRange, 
  Clock, 
  HelpCircle, 
  FileText, 
  Users, 
  Search
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
  const isTasksActive = activeTab === 'month-tracker' || activeTab === 'dresses' || activeTab === 'rentals' || activeTab === 'pre-wedding';

  const tabs = [
    {
      id: 'month-tracker' as TabType,
      label: 'General Tasks',
      fullLabel: 'General Tasks',
      icon: CalendarRange,
      countBadge: tasksRemainingCount > 0 ? `${tasksRemainingCount} left` : 'All done',
      badgeColor: tasksRemainingCount > 0 ? 'bg-amber-50 text-amber-800 border border-amber-200/70' : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
    },
    {
      id: 'itinerary' as TabType,
      label: 'Event Schedule',
      fullLabel: 'Event Schedule (Feb 15–21)',
      icon: Clock,
      countBadge: `${scheduleItemsCount} cues`,
      badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200/60'
    },
    {
      id: 'decisions' as TabType,
      label: 'Decisions',
      fullLabel: 'Decisions Tracker',
      icon: HelpCircle,
      countBadge: decisionsPendingCount > 0 ? `${decisionsPendingCount} pending` : 'Decided',
      badgeColor: decisionsPendingCount > 0 ? 'bg-amber-50 text-amber-800 border border-amber-200/70' : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
    },
    {
      id: 'notes' as TabType,
      label: 'Notes',
      fullLabel: 'Planning Notes',
      icon: FileText,
      countBadge: `${notesCount} notes`,
      badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200/60'
    }
  ];

  return (
    <>
      <nav 
        className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
        aria-label="Main Navigation"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* Top Control Bar: Perspective Switcher & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 pb-2 border-b border-slate-200/50">
            {/* Perspective Switcher */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-sans font-medium text-slate-400 uppercase tracking-[0.16em]">Perspective:</span>
              <div 
                role="radiogroup" 
                aria-label="View perspective" 
                className="inline-flex items-center bg-slate-100/80 p-1 rounded-full border border-slate-200/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <button
                  role="radio"
                  aria-checked={activeSide === 'ALL'}
                  onClick={() => onSideChange('ALL')}
                  className={`px-3 py-1 rounded-full text-[11px] font-sans tracking-wider uppercase transition-all flex items-center gap-1.5 focus:outline-none ${
                    activeSide === 'ALL'
                      ? 'bg-white text-slate-900 font-medium shadow-[0_1px_4px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04]'
                      : 'text-slate-500 hover:text-slate-800 font-normal'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeSide === 'ALL' ? 'bg-[#B89230]' : 'bg-slate-300'}`} />
                  <span>Joint</span>
                </button>

                <button
                  role="radio"
                  aria-checked={activeSide === 'BOY'}
                  onClick={() => onSideChange('BOY')}
                  className={`px-3 py-1 rounded-full text-[11px] font-sans tracking-wider uppercase transition-all flex items-center gap-1.5 focus:outline-none ${
                    activeSide === 'BOY'
                      ? 'bg-white text-slate-900 font-medium shadow-[0_1px_4px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04]'
                      : 'text-slate-500 hover:text-slate-800 font-normal'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeSide === 'BOY' ? 'bg-[#3B6281]' : 'bg-slate-300'}`} />
                  <span>Groom</span>
                </button>

                <button
                  role="radio"
                  aria-checked={activeSide === 'GIRL'}
                  onClick={() => onSideChange('GIRL')}
                  className={`px-3 py-1 rounded-full text-[11px] font-sans tracking-wider uppercase transition-all flex items-center gap-1.5 focus:outline-none ${
                    activeSide === 'GIRL'
                      ? 'bg-white text-slate-900 font-medium shadow-[0_1px_4px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04]'
                      : 'text-slate-500 hover:text-slate-800 font-normal'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeSide === 'GIRL' ? 'bg-[#A84A5B]' : 'bg-slate-300'}`} />
                  <span>Bride</span>
                </button>

                <button
                  role="radio"
                  aria-checked={activeSide === 'FAMILY'}
                  onClick={() => onSideChange('FAMILY')}
                  className={`px-3 py-1 rounded-full text-[11px] font-sans tracking-wider uppercase transition-all flex items-center gap-1.5 focus:outline-none ${
                    activeSide === 'FAMILY'
                      ? 'bg-white text-slate-900 font-medium shadow-[0_1px_4px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04]'
                      : 'text-slate-500 hover:text-slate-800 font-normal'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeSide === 'FAMILY' ? 'bg-[#A36A36]' : 'bg-slate-300'}`} />
                  <span>Family</span>
                </button>
              </div>
            </div>

            {/* Quick Context & Search */}
            <div className="flex items-center space-x-2">
              <div className="text-[11px] text-slate-400 font-sans hidden md:block">
                {activeSide === 'ALL' && <span>Showing unified celebration checklist</span>}
                {activeSide === 'BOY' && <span className="text-slate-600 font-medium">Filtered for Groom & Jaan rituals</span>}
                {activeSide === 'GIRL' && <span className="text-slate-600 font-medium">Filtered for Bride & Mandvo rituals</span>}
                {activeSide === 'FAMILY' && <span className="text-slate-600 font-medium">Filtered for Family tasks & catering</span>}
              </div>

              {onOpenSearch && (
                <button
                  onClick={onOpenSearch}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/70 text-xs font-normal transition-all shadow-2xs hover:-translate-y-0.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  aria-label="Open search command palette"
                >
                  <Search className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />
                  <span className="hidden sm:inline font-sans text-xs">Search</span>
                  <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200/60 rounded px-1.5 py-0.5">
                    ⌘K
                  </kbd>
                </button>
              )}
            </div>
          </div>

          {/* Desktop Tabs */}
          <div 
            role="tablist" 
            aria-label="Dashboard views"
            className="flex space-x-3 overflow-x-auto py-2.5 scrollbar-none"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === 'month-tracker' ? isTasksActive : activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-sans tracking-wide uppercase transition-all shrink-0 focus:outline-none ${
                    isActive
                      ? 'bg-slate-900 text-slate-50 font-medium shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 mr-2 shrink-0 stroke-[1.5] ${isActive ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
                  <span>{tab.fullLabel}</span>
                  {tab.countBadge && (
                    <span
                      className={`ml-2 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full ${
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

      {/* Ergonomic Mobile Bottom Action Dock (Clean 4 Core Pillars) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg px-3 py-1.5 flex items-center justify-between no-print">
        <button
          onClick={() => onTabChange('month-tracker')}
          className={`flex-1 py-1 flex flex-col items-center justify-center text-[10px] tracking-wider uppercase font-medium rounded-xl transition-colors ${
            isTasksActive ? 'text-[#8B6E1F] font-semibold' : 'text-slate-400 hover:text-slate-800'
          }`}
          aria-label="General Tasks"
        >
          <CalendarRange className="w-5 h-5 mb-0.5 stroke-[1.5]" />
          <span>Tasks</span>
        </button>

        <button
          onClick={() => onTabChange('itinerary')}
          className={`flex-1 py-1 flex flex-col items-center justify-center text-[10px] tracking-wider uppercase font-medium rounded-xl transition-colors ${
            activeTab === 'itinerary' ? 'text-[#8B6E1F] font-semibold' : 'text-slate-400 hover:text-slate-800'
          }`}
          aria-label="Event Schedule"
        >
          <Clock className="w-5 h-5 mb-0.5 stroke-[1.5]" />
          <span>Schedule</span>
        </button>

        <button
          onClick={() => onTabChange('decisions')}
          className={`flex-1 py-1 flex flex-col items-center justify-center text-[10px] tracking-wider uppercase font-medium rounded-xl transition-colors ${
            activeTab === 'decisions' ? 'text-[#8B6E1F] font-semibold' : 'text-slate-400 hover:text-slate-800'
          }`}
          aria-label="Decisions Tracker"
        >
          <HelpCircle className="w-5 h-5 mb-0.5 stroke-[1.5]" />
          <span>Decisions</span>
        </button>

        <button
          onClick={() => onTabChange('notes')}
          className={`flex-1 py-1 flex flex-col items-center justify-center text-[10px] tracking-wider uppercase font-medium rounded-xl transition-colors ${
            activeTab === 'notes' ? 'text-[#8B6E1F] font-semibold' : 'text-slate-400 hover:text-slate-800'
          }`}
          aria-label="Planning Notes"
        >
          <FileText className="w-5 h-5 mb-0.5 stroke-[1.5]" />
          <span>Notes</span>
        </button>
      </div>
    </>
  );
};
