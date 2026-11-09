import { 
  Task, 
  DressItem, 
  RentalItem, 
  PreWeddingChecklistItem, 
  MonthPeriod, 
  TaskStatus, 
  TaskPriority, 
  Assignee, 
  EventSide,
  MonthMilestone
} from '../types/wedding';

// Month & due date defaults for the 18 outfits
const DRESS_MONTH_MAPPING: Record<string, { monthId: MonthPeriod; dueDate: string }> = {
  'dr-1': { monthId: 'nov-2026', dueDate: '2026-11-10' },
  'dr-2': { monthId: 'nov-2026', dueDate: '2026-11-15' },
  'dr-3': { monthId: 'dec-2026', dueDate: '2026-12-05' },
  'dr-3b': { monthId: 'dec-2026', dueDate: '2026-12-10' },
  'dr-3c': { monthId: 'dec-2026', dueDate: '2026-12-15' },
  'dr-3d': { monthId: 'jan-2027', dueDate: '2027-01-08' },
  'dr-4': { monthId: 'jan-2027', dueDate: '2027-01-15' },
  'dr-5': { monthId: 'feb-prep', dueDate: '2027-02-05' },
  'dr-6': { monthId: 'feb-days', dueDate: '2027-02-21' },
  'dr-7': { monthId: 'nov-2026', dueDate: '2026-11-08' },
  'dr-7b': { monthId: 'nov-2026', dueDate: '2026-11-12' },
  'dr-7c': { monthId: 'dec-2026', dueDate: '2026-12-08' },
  'dr-8': { monthId: 'dec-2026', dueDate: '2026-12-18' },
  'dr-9b': { monthId: 'jan-2027', dueDate: '2027-01-12' },
  'dr-9c': { monthId: 'jan-2027', dueDate: '2027-01-20' },
  'dr-10': { monthId: 'jan-2027', dueDate: '2027-01-25' },
  'dr-11': { monthId: 'feb-prep', dueDate: '2027-02-08' },
  'dr-12': { monthId: 'feb-days', dueDate: '2027-02-21' },
};

// Month & due date defaults for the 7 rentals
const RENTAL_MONTH_MAPPING: Record<string, { monthId: MonthPeriod; dueDate: string }> = {
  'rent-1': { monthId: 'oct-2026', dueDate: '2026-10-18' },
  'rent-2': { monthId: 'oct-2026', dueDate: '2026-10-18' },
  'rent-4': { monthId: 'nov-2026', dueDate: '2026-11-15' },
  'rent-5': { monthId: 'nov-2026', dueDate: '2026-11-20' },
  'rent-6': { monthId: 'dec-2026', dueDate: '2026-12-15' },
  'rent-7': { monthId: 'dec-2026', dueDate: '2026-12-20' },
  'rent-3': { monthId: 'jan-2027', dueDate: '2027-01-20' },
};

// Month & due date defaults for the 16 pre-wedding shoot tasks
const PREWEDDING_MONTH_MAPPING: Record<string, { monthId: MonthPeriod; dueDate: string }> = {
  'pw-chk-1': { monthId: 'oct-2026', dueDate: '2026-10-15' },
  'pw-chk-2': { monthId: 'oct-2026', dueDate: '2026-10-22' },
  'pw-chk-3': { monthId: 'oct-2026', dueDate: '2026-10-28' },
  'pw-chk-4': { monthId: 'oct-2026', dueDate: '2026-10-30' },
  'pw-chk-5': { monthId: 'nov-2026', dueDate: '2026-11-05' },
  'pw-chk-6': { monthId: 'nov-2026', dueDate: '2026-11-12' },
  'pw-chk-7': { monthId: 'nov-2026', dueDate: '2026-11-18' },
  'pw-chk-8': { monthId: 'nov-2026', dueDate: '2026-11-25' },
  'pw-chk-9': { monthId: 'dec-2026', dueDate: '2026-12-05' },
  'pw-chk-10': { monthId: 'dec-2026', dueDate: '2026-12-12' },
  'pw-chk-11': { monthId: 'dec-2026', dueDate: '2026-12-18' },
  'pw-chk-12': { monthId: 'jan-2027', dueDate: '2027-01-05' },
  'pw-chk-13': { monthId: 'jan-2027', dueDate: '2027-01-05' },
  'pw-chk-14': { monthId: 'jan-2027', dueDate: '2027-01-05' },
  'pw-chk-15': { monthId: 'jan-2027', dueDate: '2027-01-10' },
  'pw-chk-16': { monthId: 'jan-2027', dueDate: '2027-01-15' },
};

/**
 * Maps DressItem.status to ClickUp TaskStatus
 */
export function dressStatusToTaskStatus(status: DressItem['status']): TaskStatus {
  switch (status) {
    case 'Ready':
      return 'completed';
    case 'Trial Done':
      return 'review';
    case 'Fabric Bought':
    case 'At Tailor':
      return 'in_progress';
    case 'To Buy':
    default:
      return 'todo';
  }
}

/**
 * Maps ClickUp TaskStatus to DressItem.status
 */
export function taskStatusToDressStatus(status: TaskStatus): DressItem['status'] {
  switch (status) {
    case 'completed':
      return 'Ready';
    case 'review':
      return 'Trial Done';
    case 'in_progress':
      return 'At Tailor';
    case 'todo':
    default:
      return 'To Buy';
  }
}

/**
 * Convert DressItem to unified Task
 */
export function dressToTask(d: DressItem): Task {
  const isCompleted = d.status === 'Ready';
  const taskStatus = dressStatusToTaskStatus(d.status);
  const timing = DRESS_MONTH_MAPPING[d.id] || { monthId: 'nov-2026' as MonthPeriod, dueDate: '2026-11-15' };

  const isLaganOrGarba = d.event.includes('Lagan') || d.event.includes('Garba');
  const isRitual = d.event.includes('Haldi') || d.event.includes('Mandvo') || d.event.includes('Vana');
  const priority: TaskPriority = isLaganOrGarba ? 'urgent' : isRitual ? 'high' : 'medium';

  const descLines: string[] = [
    `Event: ${d.event} (${d.date})`,
    `Action: ${d.action} • Color Theme: ${d.colorTheme}`,
    `Store / Master Tailor: ${d.storeOrTailor || 'To select'}`,
    `Estimated Cost: ₹${d.costEstimated || 0} • Advance Paid: ₹${d.advancePaid || 0}`,
  ];
  if (d.trialDate) {
    descLines.push(`Trial / Fitting Date: ${d.trialDate}`);
  }
  if (d.notes) {
    descLines.push(`Notes: ${d.notes}`);
  }

  const subtasks = [
    { 
      id: `${d.id}-sub-1`, 
      title: `Fabric selection & theme matching (${d.colorTheme})`, 
      completed: d.status !== 'To Buy' 
    },
    { 
      id: `${d.id}-sub-2`, 
      title: `${d.action === 'Buy' ? 'Retail purchase' : 'Master tailor body measurements'} (${d.action})`, 
      completed: d.status === 'At Tailor' || d.status === 'Trial Done' || d.status === 'Ready' 
    },
    { 
      id: `${d.id}-sub-3`, 
      title: `Fitting trial & necessary alterations`, 
      completed: d.status === 'Trial Done' || d.status === 'Ready' 
    },
    { 
      id: `${d.id}-sub-4`, 
      title: `Final steam iron & packed in garment kit`, 
      completed: d.status === 'Ready' 
    },
  ];

  return {
    id: d.id,
    title: `${d.person}: ${d.garmentName} (${d.event})`,
    category: 'outfits',
    assignedTo: d.person === 'Bride' ? 'Bride' : 'Groom',
    side: d.person === 'Bride' ? 'Girl' : 'Boy',
    monthId: timing.monthId,
    dueDate: timing.dueDate,
    completed: isCompleted,
    status: taskStatus,
    priority,
    description: descLines.join('\n'),
    notes: d.notes || '',
    subtasks,
    comments: [],
    tags: [d.person, d.action, d.colorTheme]
  };
}

/**
 * Maps RentalItem.status to ClickUp TaskStatus
 */
export function rentalStatusToTaskStatus(status: RentalItem['status']): TaskStatus {
  switch (status) {
    case 'Returned':
    case 'Settled':
      return 'completed';
    case 'Picked Up':
      return 'review';
    case 'Reserved':
      return 'in_progress';
    case 'To Book':
    default:
      return 'todo';
  }
}

/**
 * Maps ClickUp TaskStatus to RentalItem.status
 */
export function taskStatusToRentalStatus(status: TaskStatus): RentalItem['status'] {
  switch (status) {
    case 'completed':
      return 'Settled';
    case 'review':
      return 'Picked Up';
    case 'in_progress':
      return 'Reserved';
    case 'todo':
    default:
      return 'To Book';
  }
}

/**
 * Convert RentalItem to unified Task
 */
export function rentalToTask(r: RentalItem): Task {
  const isCompleted = r.status === 'Settled' || r.status === 'Returned';
  const taskStatus = rentalStatusToTaskStatus(r.status);
  const timing = RENTAL_MONTH_MAPPING[r.id] || { monthId: 'oct-2026' as MonthPeriod, dueDate: '2026-10-20' };

  const isCriticalGear = r.item.includes('Generator') || r.item.includes('Garba');
  const priority: TaskPriority = isCriticalGear ? 'urgent' : 'high';

  const category = (r.item.toLowerCase().includes('sound') || r.item.toLowerCase().includes('garba') || r.item.toLowerCase().includes('haldi') || r.item.toLowerCase().includes('icer'))
    ? 'sound_dj'
    : 'rentals';

  const descLines: string[] = [
    `Item: ${r.item}`,
    `Vendor: ${r.vendor} (Contact: ${r.contactPerson || 'Vendor'}${r.phone ? ` • Phone: ${r.phone}` : ''})`,
    `Pickup / Delivery: ${r.pickupDate} at ${r.pickupTime} @ ${r.pickupLocation}`,
    `Drop / Return: ${r.dropDate} at ${r.dropTime}`,
    `Total Cost: ₹${r.totalCost.toLocaleString('en-IN')} • Advance: ₹${r.advancePaid.toLocaleString('en-IN')}${r.securityDeposit ? ` • Security Deposit: ₹${r.securityDeposit.toLocaleString('en-IN')}` : ''}`,
  ];
  if (r.notes) {
    descLines.push(`Notes: ${r.notes}`);
  }

  const subtasks = [
    { 
      id: `${r.id}-sub-1`, 
      title: `Call ${r.vendor} to verify package specifications & sound wattage`, 
      completed: r.status !== 'To Book' 
    },
    { 
      id: `${r.id}-sub-2`, 
      title: `Pay advance token to lock booking with vendor receipt`, 
      completed: r.status === 'Reserved' || r.status === 'Picked Up' || isCompleted 
    },
    { 
      id: `${r.id}-sub-3`, 
      title: `Coordinate pickup / truck delivery & on-site electrical test`, 
      completed: r.status === 'Picked Up' || isCompleted 
    },
    { 
      id: `${r.id}-sub-4`, 
      title: `Return equipment post-event & reclaim security deposit`, 
      completed: isCompleted 
    },
  ];

  return {
    id: r.id,
    title: `${r.item} (${r.vendor})`,
    category,
    assignedTo: r.side === 'Girl' ? 'Bride' : r.side === 'Boy' ? 'Groom' : 'Both',
    side: r.side || 'Both',
    monthId: timing.monthId,
    dueDate: timing.dueDate,
    completed: isCompleted,
    status: taskStatus,
    priority,
    description: descLines.join('\n'),
    notes: r.notes || '',
    subtasks,
    comments: [],
    tags: [r.vendor, r.side || 'Joint', 'Rental Rig']
  };
}

/**
 * Convert PreWeddingChecklistItem to unified Task
 */
export function preWeddingTaskToTask(chk: PreWeddingChecklistItem, idx: number): Task {
  const timing = PREWEDDING_MONTH_MAPPING[chk.id] || { 
    monthId: (idx < 4 ? 'oct-2026' : idx < 8 ? 'nov-2026' : idx < 11 ? 'dec-2026' : 'jan-2027') as MonthPeriod, 
    dueDate: '2026-11-15' 
  };

  const isUrgent = chk.stage.includes('Decision') || chk.stage.includes('Contract') || chk.title.includes('LED');
  const priority: TaskPriority = isUrgent ? 'urgent' : chk.stage.includes('Reel') || chk.stage.includes('Wardrobe') ? 'high' : 'medium';

  const descLines: string[] = [
    `Stage: ${chk.stage}`,
    `Focus: Story Reels & Shoot Execution (Surat / Daman Road Trip / Vadodara / Anand Villa)`,
  ];
  if (chk.notes) {
    descLines.push(`Direct Notes: ${chk.notes}`);
  }

  const subtasks = [
    { 
      id: `${chk.id}-sub-1`, 
      title: `Review requirements & options for "${chk.stage}"`, 
      completed: chk.completed 
    },
    { 
      id: `${chk.id}-sub-2`, 
      title: `Execute shoot requirement & lock with photographer`, 
      completed: chk.completed 
    },
  ];

  return {
    id: chk.id,
    title: chk.title,
    category: 'pre_wedding',
    assignedTo: 'Both',
    side: 'Both',
    monthId: timing.monthId,
    dueDate: timing.dueDate,
    completed: chk.completed,
    status: chk.completed ? 'completed' : 'todo',
    priority,
    description: descLines.join('\n'),
    notes: chk.notes || '',
    subtasks,
    comments: [],
    tags: [chk.stage, 'Pre-Wedding', '3 Story Reels']
  };
}
