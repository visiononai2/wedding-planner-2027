export type TaskCategory = 
  | 'rituals'
  | 'outfits'
  | 'rentals'
  | 'sound_dj'
  | 'catering'
  | 'venue'
  | 'logistics'
  | 'pre_wedding';

export type TaskSubView = 'checklist' | 'outfits' | 'rentals' | 'pre-wedding';

export type Assignee = 'Groom' | 'Bride' | 'Family' | 'Both';
export type WeddingSide = 'ALL' | 'BOY' | 'GIRL' | 'FAMILY';
export type EventSide = 'Boy' | 'Girl' | 'Both';

export type MonthPeriod = 
  | 'oct-2026'
  | 'nov-2026'
  | 'dec-2026'
  | 'jan-2027'
  | 'feb-prep'
  | 'feb-days';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type CommentAuthorRole = 'Groom' | 'Bride' | 'Family' | 'Both' | 'Planner';

export interface TaskComment {
  id: string;
  author: string;
  role?: CommentAuthorRole;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  assignedTo: Assignee;
  side?: EventSide;
  monthId: MonthPeriod;
  completed: boolean;
  status?: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  description?: string;
  notes?: string;
  subtasks?: Subtask[];
  comments?: TaskComment[];
  tags?: string[];
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

export type PreWeddingTripType = 'SURAT_REGIONAL' | 'HERITAGE_CIRCUIT' | 'ANAND_VILLA' | 'NATIONAL' | 'INTERNATIONAL' | 'REGIONAL';

export interface StoryReelScene {
  id: string;
  sceneNumber: number;
  locationName: string;
  sceneAction: string;
  shotType?: string;
  lighting?: string;
}

export interface PreWeddingStoryReel {
  id: string;
  reelNumber: number;
  title: string;
  storyTheme: string;
  groomOutfit: string;
  brideOutfit: string;
  outfitStatus: 'To Select' | 'Purchased' | 'Rental Booked' | 'Trial Done & Ready';
  outfitNotes?: string;
  audioSongVibe: string;
  durationTarget: string;
  scenes: StoryReelScene[];
  status: 'Planning' | 'Outfits Ready' | 'Shot Done' | 'Edited';
}

export interface LocationOption {
  id: string;
  name: string;
  tagline: string;
  category: 'Coastal / Heritage' | 'Heritage Palace' | 'Nature & Lake' | 'Film City Studio' | 'Anand Villa (Reluctant)';
  distanceFromSurat: string;
  driveTime: string;
  baseCost: number;
  baseCostLabel: string;
  propCostNotes: string;
  rulesFlexibility: 'Very Flexible' | 'Moderate' | 'Strict (Extra Charges)';
  bestBackdrops: string[];
  pros: string[];
  cons: string[];
  isRecommended?: boolean;
  isReluctant?: boolean;
  status: 'Shortlisted' | 'Selected' | 'Declined' | 'Evaluating';
}

export interface PropItem {
  id: string;
  name: string;
  cost: number;
  selected: boolean;
  notes?: string;
}

export interface PreWeddingLook {
  id: string;
  themeTitle: string;
  groomOutfit: string;
  brideOutfit: string;
  locationBackdrop: string;
  status: 'Planning' | 'Outfits Ready' | 'Shot Done';
}

export interface PreWeddingChecklistItem {
  id: string;
  stage: string;
  title: string;
  completed: boolean;
  notes?: string;
}

export interface PreWeddingTripPlan {
  tripType: PreWeddingTripType;
  destination: string;
  durationLabel: string;
  targetDates: string;
  travelMode?: string;
  flightStatus: 'To Book' | 'Booked' | 'Not Needed';
  hotelStatus: 'To Book' | 'Booked' | 'Not Needed';
  passportVisaStatus: 'Not Needed' | 'Check Validity' | 'Visa Applied' | 'Visa Approved';
  photographerAgency: string;
  contactPerson: string;
  phone: string;
  crewCount: number;
  baseVenueCost?: number;
  propsCost?: number;
  crewCost?: number;
  travelCost?: number;
  totalEstimatedCost: number;
  advancePaid: number;
  deliverables: string[];
  storyReels?: PreWeddingStoryReel[];
  locationOptions?: LocationOption[];
  props?: PropItem[];
  looks: PreWeddingLook[];
  checklist: PreWeddingChecklistItem[];
  notes: string;
}
