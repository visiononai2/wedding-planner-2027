import React from 'react';
import { 
  CalendarRange, 
  Truck, 
  ShoppingBag, 
  Clock, 
  HelpCircle,
  FileText,
  Users,
  UserCheck
} from 'lucide-react';
import { WeddingSide } from '../types/wedding';

export type TabType = 'month-tracker' | 'rentals' | 'dresses' | 'itinerary' | 'decisions' | 'notes';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  activeSide: WeddingSide;
  onSideChange: (side: WeddingSide) => void;
  tasksRemainingCount: number;
  rentalsPendingCount: number;
  dressesToBuyCount: number;
  decisionsPendingCount: number;
  scheduleItemsCount: number;
  notesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  activeSide,
  onSideChange,
  tasksRemainingCount,
  rentalsPendingCount,
  dressesToBuyCount,
  decisionsPendingCount,
  scheduleItemsCount,
  notesCount,
}) => {
  const tabs = [
    {
      id: 'month-tracker' as TabType,
      label: 'Month-by-Month Tasks',
      icon: CalendarRange,
      countBadge: tasksRemainingCount > 0 ? `${tasksRemainingCount} left` : 'All done',
      badgeColor: tasksRemainingCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'itinerary' as TabType,
      label: 'Run-Sheet (Feb 18–21)',
      icon: Clock,
      countBadge: `${scheduleItemsCount} cues`,
      badgeColor: 'bg-gray-100 text-gray-700'
    },
    {
      id: 'dresses' as TabType,
      label: 'Outfits & Dresses',
      icon: ShoppingBag,
      countBadge: dressesToBuyCount > 0 ? `${dressesToBuyCount} to buy` : 'All ready',
      badgeColor: dressesToBuyCount > 0 ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'rentals' as TabType,
      label: 'Rentals & DJ Rigs',
      icon: Truck,
      countBadge: rentalsPendingCount > 0 ? `${rentalsPendingCount} pending` : 'All booked',
      badgeColor: rentalsPendingCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'decisions' as TabType,
      label: 'Decisions',
      icon: HelpCircle,
      countBadge: decisionsPendingCount > 0 ? `${decisionsPendingCount} pending` : 'Decided',
      badgeColor: decisionsPendingCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'notes' as TabType,
      label: 'Planning Notes',
      icon: FileText,
      countBadge: `${notesCount} notes`,
      badgeColor: 'bg-blue-100 text-blue-800'
    }
  ];

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Control Bar: Side Switcher & Tab Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 pb-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Perspective:</span>
            {/* Prominent Boy vs Girl vs Both Side Switcher */}
            <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => onSideChange('ALL')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                  activeSide === 'ALL'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-gray-700" />
                <span>Both Sides (Joint)</span>
              </button>

              <button
                onClick={() => onSideChange('BOY')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                  activeSide === 'BOY'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                <span>👦</span>
                <span>Boy's Side (Groom)</span>
              </button>

              <button
                onClick={() => onSideChange('GIRL')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                  activeSide === 'GIRL'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                <span>👧</span>
                <span>Girl's Side (Bride)</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-gray-500 hidden sm:block">
            {activeSide === 'ALL' && <span>Showing unified checklist for Groom & Bride</span>}
            {activeSide === 'BOY' && <span className="text-blue-700 font-semibold">Filtered for Groom & Boy's family rituals</span>}
            {activeSide === 'GIRL' && <span className="text-rose-700 font-semibold">Filtered for Bride & Girl's family rituals</span>}
          </div>
        </div>

        {/* Scrollable Tabs */}
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center whitespace-nowrap px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition shrink-0 ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-1.5 opacity-80" />
                <span>{tab.label}</span>
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
  );
};
