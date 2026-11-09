import { Task, TaskStatus, TaskPriority, Assignee, TaskCategory, MonthPeriod } from '../types/wedding';

export function getTaskStatus(task: Task): TaskStatus {
  if (task.status) return task.status;
  return task.completed ? 'completed' : 'todo';
}

export interface StatusConfig {
  id: TaskStatus;
  label: string;
  pillClasses: string;
  bgLight: string;
  borderColor: string;
  dotColor: string;
  headerAccent: string;
  countBadge: string;
}

export const STATUS_CONFIGS: Record<TaskStatus, StatusConfig> = {
  todo: {
    id: 'todo',
    label: 'TO DO',
    pillClasses: 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border-slate-200',
    bgLight: 'bg-white',
    borderColor: 'border-slate-200',
    dotColor: 'bg-slate-400',
    headerAccent: 'bg-slate-400',
    countBadge: 'bg-slate-200/70 text-slate-700',
  },
  in_progress: {
    id: 'in_progress',
    label: 'IN PROGRESS',
    pillClasses: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200/80',
    bgLight: 'bg-blue-50/20',
    borderColor: 'border-blue-200/80',
    dotColor: 'bg-blue-600',
    headerAccent: 'bg-blue-600',
    countBadge: 'bg-blue-100/80 text-blue-800',
  },
  review: {
    id: 'review',
    label: 'IN REVIEW',
    pillClasses: 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200/80',
    bgLight: 'bg-amber-50/20',
    borderColor: 'border-amber-200/80',
    dotColor: 'bg-amber-600',
    headerAccent: 'bg-amber-600',
    countBadge: 'bg-amber-100/80 text-amber-900',
  },
  completed: {
    id: 'completed',
    label: 'COMPLETE',
    pillClasses: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200/80',
    bgLight: 'bg-emerald-50/20',
    borderColor: 'border-emerald-200/80',
    dotColor: 'bg-emerald-600',
    headerAccent: 'bg-emerald-600',
    countBadge: 'bg-emerald-100/80 text-emerald-800',
  },
};

export const STATUS_LIST: TaskStatus[] = ['todo', 'in_progress', 'review', 'completed'];

export interface PriorityConfig {
  id: TaskPriority;
  label: string;
  flagColor: string;
  badgeClasses: string;
}

export const PRIORITY_CONFIGS: Record<TaskPriority, PriorityConfig> = {
  urgent: {
    id: 'urgent',
    label: 'Urgent',
    flagColor: 'text-rose-600',
    badgeClasses: 'bg-rose-50 text-rose-700 border-rose-200/80',
  },
  high: {
    id: 'high',
    label: 'High',
    flagColor: 'text-amber-500',
    badgeClasses: 'bg-amber-50 text-amber-700 border-amber-200/80',
  },
  medium: {
    id: 'medium',
    label: 'Normal',
    flagColor: 'text-blue-500',
    badgeClasses: 'bg-blue-50 text-blue-700 border-blue-200/80',
  },
  low: {
    id: 'low',
    label: 'Low',
    flagColor: 'text-slate-400',
    badgeClasses: 'bg-slate-100 text-slate-600 border-slate-200',
  },
};

export const PRIORITY_LIST: TaskPriority[] = ['urgent', 'high', 'medium', 'low'];

export interface AssigneeConfig {
  id: Assignee;
  label: string;
  avatarBg: string;
  initials: string;
  emoji: string;
}

export const ASSIGNEE_CONFIGS: Record<Assignee, AssigneeConfig> = {
  Groom: {
    id: 'Groom',
    label: 'Groom (Parth)',
    avatarBg: 'bg-blue-600 text-white',
    initials: 'P',
    emoji: '🤵',
  },
  Bride: {
    id: 'Bride',
    label: 'Bride (Nisha)',
    avatarBg: 'bg-rose-600 text-white',
    initials: 'N',
    emoji: '👰',
  },
  Both: {
    id: 'Both',
    label: 'Both (Parth & Nisha)',
    avatarBg: 'bg-[#B89230] text-white',
    initials: 'P&N',
    emoji: '🤝',
  },
  Family: {
    id: 'Family',
    label: 'Family & Elders',
    avatarBg: 'bg-amber-600 text-white',
    initials: 'F',
    emoji: '👨‍👩‍👧',
  },
};

export const ASSIGNEE_LIST: Assignee[] = ['Groom', 'Bride', 'Both', 'Family'];

export interface CategoryConfig {
  id: TaskCategory;
  label: string;
  badgeClasses: string;
}

export const CATEGORY_CONFIGS: Record<TaskCategory, CategoryConfig> = {
  rituals: {
    id: 'rituals',
    label: 'Rituals',
    badgeClasses: 'bg-amber-50 text-amber-800 border-amber-200/80',
  },
  outfits: {
    id: 'outfits',
    label: 'Outfits',
    badgeClasses: 'bg-rose-50 text-rose-700 border-rose-200/80',
  },
  rentals: {
    id: 'rentals',
    label: 'Rentals',
    badgeClasses: 'bg-blue-50 text-blue-700 border-blue-200/80',
  },
  sound_dj: {
    id: 'sound_dj',
    label: 'DJ & Sound',
    badgeClasses: 'bg-purple-50 text-purple-700 border-purple-200/80',
  },
  catering: {
    id: 'catering',
    label: 'Catering',
    badgeClasses: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  },
  venue: {
    id: 'venue',
    label: 'Venue',
    badgeClasses: 'bg-orange-50 text-orange-800 border-orange-200/80',
  },
  logistics: {
    id: 'logistics',
    label: 'Logistics',
    badgeClasses: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  pre_wedding: {
    id: 'pre_wedding',
    label: 'Pre-Wedding & Photo',
    badgeClasses: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80',
  },
};

export const CATEGORY_LIST: TaskCategory[] = [
  'rituals',
  'outfits',
  'rentals',
  'sound_dj',
  'catering',
  'venue',
  'logistics',
  'pre_wedding',
];

/**
 * Format a YYYY-MM-DD date string to human-friendly display (e.g. "Oct 5, 2026")
 */
export function formatTaskDate(dateStr?: string, includeYear = true): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return dateStr;
  
  const date = new Date(year, month, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {}),
  });
}

/**
 * Map a YYYY-MM-DD date string to the appropriate MonthPeriod milestone
 */
export function getMonthPeriodFromDate(dateStr?: string): MonthPeriod | null {
  if (!dateStr) return null;
  if (dateStr.startsWith('2026-10')) return 'oct-2026';
  if (dateStr.startsWith('2026-11')) return 'nov-2026';
  if (dateStr.startsWith('2026-12')) return 'dec-2026';
  if (dateStr.startsWith('2027-01')) return 'jan-2027';
  if (dateStr.startsWith('2027-02')) {
    const parts = dateStr.split('-');
    const day = parseInt(parts[2], 10);
    if (!isNaN(day) && day >= 15) return 'feb-days';
    return 'feb-prep';
  }
  return null;
}

/**
 * Sensible default date when creating or quick-adding tasks in a specific month
 */
export function getDefaultDateForMonth(monthId: MonthPeriod): string {
  switch (monthId) {
    case 'oct-2026': return '2026-10-15';
    case 'nov-2026': return '2026-11-15';
    case 'dec-2026': return '2026-12-15';
    case 'jan-2027': return '2027-01-15';
    case 'feb-prep': return '2027-02-08';
    case 'feb-days': return '2027-02-20';
    default: return '2026-10-15';
  }
}

/**
 * Distinct badge styling for day-level dates based on milestone urgency & phase
 */
export function getDateBadgeStyle(dateStr?: string, completed?: boolean): string {
  if (completed) {
    return 'bg-slate-100 text-slate-400 border-slate-200 font-normal';
  }
  if (!dateStr) {
    return 'bg-slate-100 text-slate-600 border-slate-200 font-medium';
  }

  // Feb 20-21: Main Wedding, Mandvo & Raas Garba
  if (dateStr.startsWith('2027-02-20') || dateStr.startsWith('2027-02-21')) {
    return 'bg-rose-50 text-rose-700 border-rose-200/90 font-bold';
  }

  // Feb 15-19: Auspicious Home Rituals (Randel, Lagan Lakhan, Haldi, Vana, Mehndi, Mameru, Chab)
  if (dateStr.startsWith('2027-02-1')) {
    return 'bg-purple-50 text-purple-700 border-purple-200/90 font-semibold';
  }

  // Feb 1-14: Final Prep & Fittings
  if (dateStr.startsWith('2027-02-0')) {
    return 'bg-amber-50 text-amber-800 border-amber-200/90 font-semibold';
  }

  // Jan 2027: Ritual prep, permits & final counts
  if (dateStr.startsWith('2027-01')) {
    return 'bg-teal-50 text-teal-800 border-teal-200/90 font-semibold';
  }

  // Oct - Dec 2026: Core planning, outfits, catering
  return 'bg-indigo-50/90 text-indigo-700 border-indigo-200/90 font-semibold';
}

