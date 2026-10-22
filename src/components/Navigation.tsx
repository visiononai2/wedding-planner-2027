import React from 'react';
import { 
  CalendarRange, 
  Truck, 
  ShoppingBag, 
  Clock, 
  HelpCircle,
  FileText 
} from 'lucide-react';

export type TabType = 'month-tracker' | 'rentals' | 'dresses' | 'itinerary' | 'decisions' | 'notes';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
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
      label: 'Month-by-Month Overview',
      icon: CalendarRange,
      countBadge: tasksRemainingCount > 0 ? `${tasksRemainingCount} left` : 'All done',
      badgeColor: tasksRemainingCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'rentals' as TabType,
      label: 'Rentals (Pickups & Drops)',
      icon: Truck,
      countBadge: rentalsPendingCount > 0 ? `${rentalsPendingCount} pending` : 'All settled',
      badgeColor: rentalsPendingCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'dresses' as TabType,
      label: 'Dresses & Outfits',
      icon: ShoppingBag,
      countBadge: dressesToBuyCount > 0 ? `${dressesToBuyCount} to finish` : 'All ready',
      badgeColor: dressesToBuyCount > 0 ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'itinerary' as TabType,
      label: 'Run-Sheet (Feb 19–21, 2027)',
      icon: Clock,
      countBadge: `${scheduleItemsCount} cues`,
      badgeColor: 'bg-gray-100 text-gray-700'
    },
    {
      id: 'decisions' as TabType,
      label: 'Family Decisions',
      icon: HelpCircle,
      countBadge: decisionsPendingCount > 0 ? `${decisionsPendingCount} pending` : 'Decided',
      badgeColor: decisionsPendingCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'notes' as TabType,
      label: 'Overall Planning Notes',
      icon: FileText,
      countBadge: `${notesCount} notes`,
      badgeColor: 'bg-blue-100 text-blue-800'
    }
  ];

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center whitespace-nowrap px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-2 opacity-80" />
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
