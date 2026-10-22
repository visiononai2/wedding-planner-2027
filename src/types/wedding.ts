export type TaskCategory = 
  | 'rituals'
  | 'outfits'
  | 'rentals'
  | 'sound_dj'
  | 'catering'
  | 'venue'
  | 'logistics';

export type Assignee = 'Groom' | 'Bride' | 'Family' | 'Both';
export type WeddingSide = 'ALL' | 'BOY' | 'GIRL';
export type EventSide = 'Boy' | 'Girl' | 'Both';

export type MonthPeriod = 
  | 'oct-2026'
  | 'nov-2026'
  | 'dec-2026'
  | 'jan-2027'
  | 'feb-prep'
  | 'feb-days';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  assignedTo: Assignee;
  side?: EventSide;
  monthId: MonthPeriod;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  notes?: string;
}

export interface MonthMilestone {
  id: MonthPeriod;
  name: string;
  monthLabel: string;
  timeframe: string;
  badge: string;
}

export interface RentalItem {
  id: string;
  item: string;
  vendor: string;
  contactPerson?: string;
  phone?: string;
  pickupDate: string;
  pickupTime: string;
  dropDate: string;
  dropTime: string;
  pickupLocation: string;
  totalCost: number;
  advancePaid: number;
  securityDeposit?: number;
  status: 'To Book' | 'Reserved' | 'Picked Up' | 'Returned' | 'Settled';
  side?: EventSide;
  notes?: string;
}

export interface DressItem {
  id: string;
  event: string;
  date: string;
  person: 'Groom' | 'Bride';
  garmentName: string;
  colorTheme: string;
  action: 'Buy' | 'Tailor / Stitch' | 'Rent';
  status: 'To Buy' | 'Fabric Bought' | 'At Tailor' | 'Trial Done' | 'Ready';
  trialDate?: string;
  costEstimated: number;
  advancePaid: number;
  storeOrTailor?: string;
  notes?: string;
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  gujaratiTitle?: string;
  location: string;
  actionNotes: string;
  side?: EventSide;
  soundRig?: string;
  outfitGroom?: string;
  outfitBride?: string;
  urgentRule?: string;
}

export interface EventDaySchedule {
  id: string;
  dateString: string;
  dayName: string;
  title: string;
  location: string;
  items: ScheduleEvent[];
}

export interface DecisionPoint {
  id: string;
  question: string;
  options: string[];
  status: 'Pending' | 'Decided';
  decision?: string;
  side?: EventSide;
}

export type NoteCategory = 
  | 'General'
  | 'Rituals & Traditions'
  | 'Sound & Technical'
  | 'Venue & Food'
  | 'Outfits & Styling'
  | 'Family & Fiance';

export interface PlanningNote {
  id: string;
  title: string;
  category: NoteCategory;
  content: string;
  pinned: boolean;
  side?: EventSide;
  tags?: string[];
  updatedAt: string;
}
