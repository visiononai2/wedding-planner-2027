import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search,
  Plus,
  Filter,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Flag,
  User,
  ShoppingBag,
  Truck,
  Camera,
  CalendarRange,
  IndianRupee,
  MapPin,
  X,
  LayoutGrid,
  List
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  Task, 
  MonthMilestone, 
  MonthPeriod, 
  TaskCategory, 
  Assignee,
  WeddingSide,
  EventSide,
  TaskStatus,
  TaskPriority,
  RentalItem,
  DressItem,
  PreWeddingTripPlan,
  PreWeddingTripType,
  PreWeddingChecklistItem,
  TaskSubView
} from '../types/wedding';
import { TaskKanbanBoard, KanbanGroupBy } from './clickup/TaskKanbanBoard';
import { TaskListView } from './clickup/TaskListView';
import { TaskDetailModal } from './clickup/TaskDetailModal';
import { RentalsTracker } from './RentalsTracker';
import { DressesTracker } from './DressesTracker';
import { PreWeddingPlanner } from './PreWeddingPlanner';
import { 
  getTaskStatus, 
  CATEGORY_CONFIGS, 
  CATEGORY_LIST,
  PRIORITY_CONFIGS, 
  PRIORITY_LIST,
  ASSIGNEE_CONFIGS, 
  ASSIGNEE_LIST,
  STATUS_CONFIGS,
  STATUS_LIST,
  formatTaskDate,
  getMonthPeriodFromDate,
  getDefaultDateForMonth
} from '../utils/taskHelpers';
import { 
  dressToTask, 
  taskStatusToDressStatus, 
  rentalToTask, 
  taskStatusToRentalStatus, 
  preWeddingTaskToTask 
} from '../utils/taskAdapters';

interface MonthTrackerProps {
  milestones: MonthMilestone[];
  tasks: Task[];
  activeSide: WeddingSide;
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onEditTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  rentals: RentalItem[];
  onUpdateRental: (id: string, updates: Partial<RentalItem>) => void;
  onAddRental: (rental: Omit<RentalItem, 'id'>) => void;
  onDeleteRental: (id: string) => void;
  dresses: DressItem[];
  onUpdateDress: (id: string, updates: Partial<DressItem>) => void;
  onAddDress: (dress: Omit<DressItem, 'id'>) => void;
  onDeleteDress: (id: string) => void;
  preWeddingPlan: PreWeddingTripPlan;
  onUpdatePreWeddingPlan: (updates: Partial<PreWeddingTripPlan>) => void;
  onResetPlanToPreset: (presetType: PreWeddingTripType) => void;
  activeTaskSubView?: TaskSubView;
  onTaskSubViewChange?: (view: TaskSubView) => void;
  resetFilterSignal?: number;
}

export const MonthTracker: React.FC<MonthTrackerProps> = ({
  milestones,
  tasks,
  activeSide,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  rentals,
  onUpdateRental,
  onAddRental,
  onDeleteRental,
  dresses,
  onUpdateDress,
  onAddDress,
  onDeleteDress,
  preWeddingPlan,
  onUpdatePreWeddingPlan,
  onResetPlanToPreset,
  activeTaskSubView = 'checklist',
  onTaskSubViewChange,
  resetFilterSignal,
}) => {
  const [internalSubView, setInternalSubView] = useState<TaskSubView>(activeTaskSubView);

  useEffect(() => {
    if (activeTaskSubView) {
      setInternalSubView(activeTaskSubView);
    }
  }, [activeTaskSubView]);

  const taskHubView = activeTaskSubView !== undefined ? activeTaskSubView : internalSubView;
  const setTaskHubView = (view: TaskSubView) => {
    setInternalSubView(view);
    onTaskSubViewChange?.(view);
  };

  // Pre-Wedding sub-view toggle: Tasks Kanban vs Creative Dossier
  const [preWeddingSubMode, setPreWeddingSubMode] = useState<'tasks' | 'dossier'>('tasks');

  // Dedicated month selection per sub-view - by default all sub-views default to ALL
  const [selectedMonthByView, setSelectedMonthByView] = useState<Record<TaskSubView, MonthPeriod | 'ALL'>>({
    checklist: 'ALL',
    outfits: 'ALL',
    rentals: 'ALL',
    'pre-wedding': 'ALL',
  });

  const selectedMonth = selectedMonthByView[taskHubView] || 'ALL';
  const setSelectedMonth = (m: MonthPeriod | 'ALL') => {
    setSelectedMonthByView(prev => ({ ...prev, [taskHubView]: m }));
  };

  // View mode: 'board' (Kanban) or 'list' (ClickUp Table)
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  // Kanban Group By
  const [groupBy, setGroupBy] = useState<KanbanGroupBy>('status');

  // Per-view Search queries
  const [searchQueryByView, setSearchQueryByView] = useState<Record<TaskSubView, string>>({
    checklist: '',
    outfits: '',
    rentals: '',
    'pre-wedding': '',
  });
  const searchQuery = searchQueryByView[taskHubView] || '';
  const setSearchQuery = (q: string) => {
    setSearchQueryByView(prev => ({ ...prev, [taskHubView]: q }));
  };

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');

  // Reset category filter when subview switches
  useEffect(() => {
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
  }, [taskHubView]);

  // Reset all filters to default ('ALL') when tasks tab is selected
  useEffect(() => {
    if (resetFilterSignal !== undefined && resetFilterSignal > 0) {
      setSelectedMonthByView({
        checklist: 'ALL',
        outfits: 'ALL',
        rentals: 'ALL',
        'pre-wedding': 'ALL',
      });
      setCategoryFilter('ALL');
      setStatusFilter('ALL');
      setPriorityFilter('ALL');
      setSearchQueryByView({
        checklist: '',
        outfits: '',
        rentals: '',
        'pre-wedding': '',
      });
    }
  }, [resetFilterSignal]);

  // Selected task for ClickUp Detail Modal
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      return p.get('task');
    } catch {}
    return null;
  });

  // Add Task Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('rituals');
  const [newAssignee, setNewAssignee] = useState<Assignee>(() => 
    activeSide === 'BOY' ? 'Groom' : activeSide === 'GIRL' ? 'Bride' : activeSide === 'FAMILY' ? 'Family' : 'Both'
  );
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newStatus, setNewStatus] = useState<TaskStatus>('todo');
  const [newDescription, setNewDescription] = useState('');
  const [targetMonth, setTargetMonth] = useState<MonthPeriod>('oct-2026');
  const [newDueDate, setNewDueDate] = useState<string>('2026-10-15');

  React.useEffect(() => {
    if (activeSide === 'BOY') setNewAssignee('Groom');
    else if (activeSide === 'GIRL') setNewAssignee('Bride');
    else if (activeSide === 'FAMILY') setNewAssignee('Family');
    else setNewAssignee('Both');
  }, [activeSide]);

  const handleTargetMonthChange = (m: MonthPeriod) => {
    setTargetMonth(m);
    setNewDueDate(getDefaultDateForMonth(m));
  };

  const handleDueDateChange = (d: string) => {
    setNewDueDate(d);
    const m = getMonthPeriodFromDate(d);
    if (m) setTargetMonth(m);
  };

  // 1. Unified Datasets formatted as ClickUp Tasks
  const generalTasks: Task[] = tasks;
  const outfitTasks: Task[] = useMemo(() => dresses.map(dressToTask), [dresses]);
  const rentalTasks: Task[] = useMemo(() => rentals.map(rentalToTask), [rentals]);
  const preWeddingTasks: Task[] = useMemo(() => 
    (preWeddingPlan?.checklist || []).map((chk, idx) => preWeddingTaskToTask(chk, idx)), 
    [preWeddingPlan]
  );

  // Current active dataset
  const activeDataset: Task[] = useMemo(() => {
    switch (taskHubView) {
      case 'outfits':
        return outfitTasks;
      case 'rentals':
        return rentalTasks;
      case 'pre-wedding':
        return preWeddingTasks;
      case 'checklist':
      default:
        return generalTasks;
    }
  }, [taskHubView, outfitTasks, rentalTasks, preWeddingTasks, generalTasks]);

  // Find currently selected task across all datasets
  const activeTask = useMemo(() => {
    if (!selectedTaskId) return null;
    return activeDataset.find(t => t.id === selectedTaskId)
      || generalTasks.find(t => t.id === selectedTaskId)
      || outfitTasks.find(t => t.id === selectedTaskId)
      || rentalTasks.find(t => t.id === selectedTaskId)
      || preWeddingTasks.find(t => t.id === selectedTaskId)
      || null;
  }, [selectedTaskId, activeDataset, generalTasks, outfitTasks, rentalTasks, preWeddingTasks]);

  // Dynamic milestone statistics for whichever sub-view is active
  const getMilestoneStats = (mId: MonthPeriod) => {
    const mTasks = activeDataset.filter(t => {
      if (t.monthId !== mId) return false;
      if (activeSide === 'BOY') {
        return t.side === 'Boy' || t.side === 'Both' || !t.side || t.assignedTo === 'Groom' || t.assignedTo === 'Both';
      }
      if (activeSide === 'GIRL') {
        return t.side === 'Girl' || t.side === 'Both' || !t.side || t.assignedTo === 'Bride' || t.assignedTo === 'Both';
      }
      if (activeSide === 'FAMILY') {
        return t.assignedTo === 'Family';
      }
      return true;
    });
    const total = mTasks.length;
    const completed = mTasks.filter(t => t.completed).length;
    const inProgress = mTasks.filter(t => getTaskStatus(t) === 'in_progress').length;
    const remaining = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, inProgress, total, remaining, percent };
  };

  // Unified Toggle Task handler
  const handleToggle = (taskId: string) => {
    if (taskHubView === 'checklist') {
      onToggleTask(taskId);
      const task = generalTasks.find(t => t.id === taskId);
      if (task && !task.completed) {
        const remaining = generalTasks
          .filter(t => t.monthId === task.monthId && t.id !== taskId && !t.completed)
          .length;
        if (remaining === 0) confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      }
      return;
    }

    if (taskHubView === 'outfits') {
      const dress = dresses.find(d => d.id === taskId);
      if (!dress) return;
      const isReady = dress.status === 'Ready';
      onUpdateDress(taskId, { status: isReady ? 'To Buy' : 'Ready' });
      if (!isReady) confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      return;
    }

    if (taskHubView === 'rentals') {
      const rental = rentals.find(r => r.id === taskId);
      if (!rental) return;
      const isSettled = rental.status === 'Settled' || rental.status === 'Returned';
      onUpdateRental(taskId, { status: isSettled ? 'To Book' : 'Settled' });
      if (!isSettled) confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      return;
    }

    if (taskHubView === 'pre-wedding') {
      const checklist = preWeddingPlan?.checklist || [];
      let completedState = false;
      const updated = checklist.map(c => {
        if (c.id === taskId) {
          completedState = !c.completed;
          return { ...c, completed: completedState };
        }
        return c;
      });
      onUpdatePreWeddingPlan({ checklist: updated });
      if (completedState) confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      return;
    }
  };

  // Unified Edit Task handler
  const handleUnifiedEdit = (taskId: string, updates: Partial<Task>) => {
    if (taskHubView === 'checklist') {
      onEditTask(taskId, updates);
      return;
    }

    if (taskHubView === 'outfits') {
      const dress = dresses.find(d => d.id === taskId);
      if (!dress) return;
      const dressUpdates: Partial<DressItem> = {};
      if (updates.status !== undefined) {
        dressUpdates.status = taskStatusToDressStatus(updates.status);
      } else if (updates.completed !== undefined) {
        dressUpdates.status = updates.completed ? 'Ready' : 'To Buy';
      }
      if (updates.notes !== undefined) dressUpdates.notes = updates.notes;
      if (updates.description !== undefined && !updates.notes) dressUpdates.notes = updates.description;
      if (updates.assignedTo === 'Bride') dressUpdates.person = 'Bride';
      if (updates.assignedTo === 'Groom') dressUpdates.person = 'Groom';
      if (updates.dueDate) dressUpdates.date = updates.dueDate;
      if (updates.title) {
        const parts = updates.title.split(':');
        dressUpdates.garmentName = parts.length > 1 ? parts[1].trim() : updates.title.trim();
      }
      onUpdateDress(taskId, dressUpdates);
      return;
    }

    if (taskHubView === 'rentals') {
      const rental = rentals.find(r => r.id === taskId);
      if (!rental) return;
      const rentalUpdates: Partial<RentalItem> = {};
      if (updates.status !== undefined) {
        rentalUpdates.status = taskStatusToRentalStatus(updates.status);
      } else if (updates.completed !== undefined) {
        rentalUpdates.status = updates.completed ? 'Settled' : 'To Book';
      }
      if (updates.notes !== undefined) rentalUpdates.notes = updates.notes;
      if (updates.description !== undefined && !updates.notes) rentalUpdates.notes = updates.description;
      if (updates.side) rentalUpdates.side = updates.side;
      if (updates.dueDate) rentalUpdates.pickupDate = updates.dueDate;
      if (updates.title) {
        const parts = updates.title.split('(');
        rentalUpdates.item = parts[0].trim();
      }
      onUpdateRental(taskId, rentalUpdates);
      return;
    }

    if (taskHubView === 'pre-wedding') {
      const checklist = preWeddingPlan?.checklist || [];
      const updated = checklist.map(c => {
        if (c.id === taskId) {
          return {
            ...c,
            completed: updates.status !== undefined 
              ? updates.status === 'completed' 
              : (updates.completed !== undefined ? updates.completed : c.completed),
            title: updates.title !== undefined ? updates.title : c.title,
            notes: updates.notes !== undefined 
              ? updates.notes 
              : (updates.description !== undefined ? updates.description : c.notes)
          };
        }
        return c;
      });
      onUpdatePreWeddingPlan({ checklist: updated });
      return;
    }
  };

  // Unified Delete Task handler
  const handleUnifiedDelete = (taskId: string) => {
    if (taskHubView === 'checklist') {
      onDeleteTask(taskId);
      return;
    }
    if (taskHubView === 'outfits') {
      onDeleteDress(taskId);
      return;
    }
    if (taskHubView === 'rentals') {
      onDeleteRental(taskId);
      return;
    }
    if (taskHubView === 'pre-wedding') {
      const checklist = preWeddingPlan?.checklist || [];
      onUpdatePreWeddingPlan({ checklist: checklist.filter(c => c.id !== taskId) });
      return;
    }
  };

  // Unified Add Task handler
  const handleUnifiedAdd = (newTask: Omit<Task, 'id'>) => {
    if (taskHubView === 'checklist') {
      onAddTask(newTask);
      return;
    }

    if (taskHubView === 'outfits') {
      const isBride = newTask.assignedTo === 'Bride' || newTask.side === 'Girl' || (activeSide === 'GIRL');
      onAddDress({
        garmentName: newTask.title,
        event: 'Wedding Event',
        date: newTask.dueDate || 'Feb 20, 2027',
        person: isBride ? 'Bride' : 'Groom',
        colorTheme: 'Festive Ceremonial',
        action: 'Buy',
        status: newTask.status ? taskStatusToDressStatus(newTask.status) : 'To Buy',
        costEstimated: 0,
        advancePaid: 0,
        notes: newTask.description || newTask.notes || '',
      });
      return;
    }

    if (taskHubView === 'rentals') {
      onAddRental({
        item: newTask.title,
        vendor: 'Equipment Vendor',
        pickupDate: newTask.dueDate || '2027-02-20',
        pickupTime: '10:00 AM',
        dropDate: '2027-02-21',
        dropTime: '10:00 PM',
        pickupLocation: 'Silver Farm, Surat',
        totalCost: 0,
        advancePaid: 0,
        status: newTask.status ? taskStatusToRentalStatus(newTask.status) : 'To Book',
        side: newTask.side || 'Both',
        notes: newTask.description || newTask.notes || '',
      });
      return;
    }

    if (taskHubView === 'pre-wedding') {
      const newChk: PreWeddingChecklistItem = {
        id: `pw-chk-${Date.now()}`,
        stage: 'Shoot Day Execution',
        title: newTask.title,
        completed: newTask.status === 'completed' || newTask.completed,
        notes: newTask.description || newTask.notes || '',
      };
      onUpdatePreWeddingPlan({ checklist: [...(preWeddingPlan?.checklist || []), newChk] });
      return;
    }
  };

  const handleCreateTaskFromModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const desc = newDescription.trim();
    handleUnifiedAdd({
      title: newTitle.trim(),
      category: taskHubView === 'outfits' ? 'outfits' : taskHubView === 'rentals' ? 'rentals' : taskHubView === 'pre-wedding' ? 'pre_wedding' : newCategory,
      assignedTo: newAssignee,
      monthId: targetMonth,
      dueDate: newDueDate,
      completed: newStatus === 'completed',
      status: newStatus,
      priority: newPriority,
      description: desc,
      notes: desc,
      subtasks: [],
      comments: [],
    });

    setNewTitle('');
    setNewDescription('');
    setIsAddModalOpen(false);
  };

  // Filter tasks for the active view
  const displayedTasks = activeDataset
    .filter(task => {
      if (selectedMonth !== 'ALL' && task.monthId !== selectedMonth) return false;
      
      // Category / Type filter
      if (categoryFilter !== 'ALL') {
        if (taskHubView === 'checklist' && task.category !== categoryFilter) return false;
        if (taskHubView === 'outfits') {
          if (categoryFilter === 'Groom' && task.assignedTo !== 'Groom') return false;
          if (categoryFilter === 'Bride' && task.assignedTo !== 'Bride') return false;
        }
        if (taskHubView === 'rentals') {
          if (categoryFilter === 'Boy' && task.side !== 'Boy') return false;
          if (categoryFilter === 'Girl' && task.side !== 'Girl') return false;
          if (categoryFilter === 'Both' && task.side !== 'Both') return false;
        }
        if (taskHubView === 'pre-wedding') {
          const matchTag = task.tags?.some(tag => tag.toLowerCase().includes(categoryFilter.toLowerCase()));
          if (!matchTag) return false;
        }
      }

      if (statusFilter !== 'ALL' && getTaskStatus(task) !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false;
      
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(q);
        const descMatch = (task.description || task.notes || '').toLowerCase().includes(q);
        const tagMatch = task.tags?.some(t => t.toLowerCase().includes(q));
        if (!titleMatch && !descMatch && !tagMatch) return false;
      }
      
      // Side perspective filter
      if (activeSide === 'BOY') {
        const isBoy = task.side === 'Boy' || task.side === 'Both' || !task.side || task.assignedTo === 'Groom' || task.assignedTo === 'Both';
        if (!isBoy) return false;
      }
      if (activeSide === 'GIRL') {
        const isGirl = task.side === 'Girl' || task.side === 'Both' || !task.side || task.assignedTo === 'Bride' || task.assignedTo === 'Both';
        if (!isGirl) return false;
      }
      if (activeSide === 'FAMILY') {
        const isFamily = task.assignedTo === 'Family';
        if (!isFamily) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });

  const currentMilestone = selectedMonth !== 'ALL' ? milestones.find(m => m.id === selectedMonth) : null;

  // Perspective-filtered dress, rental, and shoot lists for summary numbers
  const filteredDresses = dresses.filter(d => {
    if (activeSide === 'BOY') return d.person === 'Groom';
    if (activeSide === 'GIRL') return d.person === 'Bride';
    return true;
  });

  const filteredRentals = rentals.filter(r => {
    if (activeSide === 'BOY') return r.side === 'Boy' || r.side === 'Both' || !r.side;
    if (activeSide === 'GIRL') return r.side === 'Girl' || r.side === 'Both' || !r.side;
    return true;
  });

  const sideFilteredTasks = tasks.filter(t => {
    if (activeSide === 'BOY') return t.side === 'Boy' || t.side === 'Both' || !t.side || t.assignedTo === 'Groom' || t.assignedTo === 'Both';
    if (activeSide === 'GIRL') return t.side === 'Girl' || t.side === 'Both' || !t.side || t.assignedTo === 'Bride' || t.assignedTo === 'Both';
    if (activeSide === 'FAMILY') return t.assignedTo === 'Family';
    return true;
  });

  const tasksRemainingCount = sideFilteredTasks.filter(t => !t.completed).length;
  const dressesToBuyCount = filteredDresses.filter(d => d.status !== 'Ready').length;
  const rentalsPendingCount = filteredRentals.filter(r => r.status === 'To Book' || r.status === 'Reserved').length;
  const preWeddingRemainingCount = preWeddingPlan?.checklist ? preWeddingPlan.checklist.filter(c => !c.completed).length : 0;

  // Pre-wedding stages list for filter dropdown
  const PREWEDDING_STAGES = [
    'Location & Scope Decision',
    'Storyboards & 3 Reel Scripts',
    'Wardrobe & Outfits',
    'Photography Crew & Contract',
    'Travel & Lodging',
    'Shoot Day Execution',
    'Post-Production & Garba LED Delivery'
  ];

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Precision Task Command Hub */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 sm:p-5 space-y-3.5">
        
        {/* Tier 1: Workspace Switcher & Primary Actions */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {/* Segmented Workspace Pills */}
          <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 gap-1 overflow-x-auto scrollbar-none w-full xl:w-auto">
            <button
              type="button"
              onClick={() => setTaskHubView('checklist')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-sans tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer focus:outline-none ${
                taskHubView === 'checklist'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60 font-medium'
              }`}
            >
              <CalendarRange className={`w-3.5 h-3.5 stroke-[1.5] ${taskHubView === 'checklist' ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
              <span>General Tasks</span>
              <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full ${
                taskHubView === 'checklist' ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/70 text-slate-600'
              }`}>
                {tasksRemainingCount} left
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTaskHubView('outfits')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-sans tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer focus:outline-none ${
                taskHubView === 'outfits'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60 font-medium'
              }`}
            >
              <ShoppingBag className={`w-3.5 h-3.5 stroke-[1.5] ${taskHubView === 'outfits' ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
              <span>Outfits & Tailoring</span>
              <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full ${
                taskHubView === 'outfits' ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/70 text-slate-600'
              }`}>
                {dressesToBuyCount} to buy
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTaskHubView('rentals')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-sans tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer focus:outline-none ${
                taskHubView === 'rentals'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60 font-medium'
              }`}
            >
              <Truck className={`w-3.5 h-3.5 stroke-[1.5] ${taskHubView === 'rentals' ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
              <span>Rentals & DJ Sound</span>
              <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full ${
                taskHubView === 'rentals' ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/70 text-slate-600'
              }`}>
                {rentalsPendingCount} pending
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTaskHubView('pre-wedding')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-sans tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer focus:outline-none ${
                taskHubView === 'pre-wedding'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60 font-medium'
              }`}
            >
              <Camera className={`w-3.5 h-3.5 stroke-[1.5] ${taskHubView === 'pre-wedding' ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
              <span>Pre-Wedding Shoot</span>
              <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full ${
                taskHubView === 'pre-wedding' ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/70 text-slate-600'
              }`}>
                {preWeddingRemainingCount} tasks
              </span>
            </button>
          </div>

          {/* Right: View Switcher (Board/List) & + Add Task Button */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-end xl:self-auto">
            {/* Pre-Wedding Sub-Mode Toggle (Tasks vs Creative Dossier) */}
            {taskHubView === 'pre-wedding' && (
              <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200/60 text-xs">
                <button
                  type="button"
                  onClick={() => setPreWeddingSubMode('tasks')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    preWeddingSubMode === 'tasks' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Shoot Tasks Kanban"
                >
                  Shoot Tasks
                </button>
                <button
                  type="button"
                  onClick={() => setPreWeddingSubMode('dossier')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    preWeddingSubMode === 'dossier' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Looks & Trip Scope Dossier"
                >
                  Looks & Trip Dossier
                </button>
              </div>
            )}

            {/* Board / List Toggle (Shown when not in dossier mode) */}
            {preWeddingSubMode === 'tasks' && (
              <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200/60 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('board')}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewMode === 'board' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Board View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* + Add Task Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Tier 2: Sleek Milestone Timeline Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89230]" />
            Timeline:
          </span>

          {/* All Months Pill */}
          {(() => {
            const sideFilteredAll = activeDataset.filter(task => {
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
            const allTotal = sideFilteredAll.length;
            const allCompleted = sideFilteredAll.filter(t => t.completed).length;
            const isSelected = selectedMonth === 'ALL';

            return (
              <button
                type="button"
                onClick={() => setSelectedMonth('ALL')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70 hover:border-slate-300'
                }`}
              >
                <span>All Months</span>
                <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                }`}>
                  {allCompleted}/{allTotal}
                </span>
              </button>
            );
          })()}

          {/* The 6 Milestone Month Pills */}
          {milestones.map((m) => {
            const stats = getMilestoneStats(m.id);
            const isSelected = selectedMonth === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMonth(m.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70 hover:border-slate-300'
                }`}
              >
                <span>{m.monthLabel}</span>
                <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                }`}>
                  {stats.completed}/{stats.total}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tier 3: Search & Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input - Clean layout with 40px left padding */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3.5 text-slate-400 stroke-[1.5] pointer-events-none" />
              <input
                type="text"
                placeholder={
                  taskHubView === 'outfits'
                    ? 'Search outfits, events...'
                    : taskHubView === 'rentals'
                    ? 'Search gear, sound rigs...'
                    : taskHubView === 'pre-wedding'
                    ? 'Search shoot tasks...'
                    : 'Search tasks...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3.5 py-1.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 w-48 sm:w-64 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all shadow-2xs"
              />
            </div>

            {/* Category / Sub-scope Filter */}
            {taskHubView === 'checklist' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 hover:bg-white border border-slate-200/80 text-slate-700 rounded-xl px-3 py-1.5 text-xs hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all cursor-pointer font-sans shadow-2xs"
              >
                <option value="ALL">All Categories</option>
                {CATEGORY_LIST.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_CONFIGS[c].label}
                  </option>
                ))}
              </select>
            )}

            {taskHubView === 'outfits' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 hover:bg-white border border-slate-200/80 text-slate-700 rounded-xl px-3 py-1.5 text-xs hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all cursor-pointer font-sans shadow-2xs"
              >
                <option value="ALL">All Wardrobe</option>
                <option value="Groom">Groom's Outfits</option>
                <option value="Bride">Bride's Outfits</option>
              </select>
            )}

            {taskHubView === 'rentals' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 hover:bg-white border border-slate-200/80 text-slate-700 rounded-xl px-3 py-1.5 text-xs hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all cursor-pointer font-sans shadow-2xs"
              >
                <option value="ALL">All Gear Bookings</option>
                <option value="Boy">Boy's Side Gear</option>
                <option value="Both">Joint / Farm Bookings</option>
                <option value="Girl">Bride's Side Gear</option>
              </select>
            )}

            {taskHubView === 'pre-wedding' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 hover:bg-white border border-slate-200/80 text-slate-700 rounded-xl px-3 py-1.5 text-xs hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all cursor-pointer font-sans shadow-2xs"
              >
                <option value="ALL">All Shoot Stages</option>
                {PREWEDDING_STAGES.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            )}

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 hover:bg-white border border-slate-200/80 text-slate-700 rounded-xl px-3 py-1.5 text-xs hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all cursor-pointer font-sans shadow-2xs"
            >
              <option value="ALL">All Status</option>
              {STATUS_LIST.map((s) => (
                <option key={s} value={s}>
                  {STATUS_CONFIGS[s].label}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="bg-slate-50 hover:bg-white border border-slate-200/80 text-slate-700 rounded-xl px-3 py-1.5 text-xs hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all cursor-pointer font-sans shadow-2xs"
            >
              <option value="ALL">All Priorities</option>
              {PRIORITY_LIST.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_CONFIGS[p].label}
                </option>
              ))}
            </select>
          </div>

          {/* Showing Count */}
          <div className="text-slate-400 font-sans text-xs flex items-center gap-1.5">
            <span>Showing</span>
            <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
              {displayedTasks.length}
            </span>
            <span>
              {taskHubView === 'outfits' ? 'outfits' : taskHubView === 'rentals' ? 'equipment rigs' : taskHubView === 'pre-wedding' ? 'shoot tasks' : 'tasks'}
            </span>
            {currentMilestone && (
              <span className="text-slate-400 font-normal">
                in <strong className="text-slate-700 font-medium">{currentMilestone.monthLabel}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 5. Main Content: Pre-Wedding Dossier OR Kanban Board OR List View */}
      {taskHubView === 'pre-wedding' && preWeddingSubMode === 'dossier' ? (
        <PreWeddingPlanner
          plan={preWeddingPlan}
          activeSide={activeSide}
          onUpdatePlan={onUpdatePreWeddingPlan}
          onResetPlanToPreset={onResetPlanToPreset}
        />
      ) : viewMode === 'board' ? (
        <TaskKanbanBoard
          tasks={displayedTasks}
          milestones={milestones}
          selectedMonth={selectedMonth}
          groupBy={groupBy}
          onSelectTask={(task) => setSelectedTaskId(task.id)}
          onToggleTask={handleToggle}
          onEditTask={handleUnifiedEdit}
          onDeleteTask={handleUnifiedDelete}
          onAddTask={handleUnifiedAdd}
        />
      ) : (
        <TaskListView
          tasks={displayedTasks}
          milestones={milestones}
          selectedMonth={selectedMonth}
          onSelectTask={(task) => setSelectedTaskId(task.id)}
          onToggleTask={handleToggle}
          onEditTask={handleUnifiedEdit}
          onDeleteTask={handleUnifiedDelete}
          onAddTask={handleUnifiedAdd}
        />
      )}

      {/* 6. Unified ClickUp Task Detail Modal / Slide-over */}
      {activeTask && (
        <TaskDetailModal
          task={activeTask}
          milestones={milestones}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={handleUnifiedEdit}
          onDelete={handleUnifiedDelete}
        />
      )}

      {/* 7. Unified Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-[0_24px_60px_rgba(15,23,42,0.14)] border border-slate-200/90">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/60">
              <h3 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#B89230] stroke-[1.5]" />
                <span>
                  {taskHubView === 'outfits' 
                    ? 'Add New Outfit' 
                    : taskHubView === 'rentals' 
                    ? 'Add Equipment Rental' 
                    : taskHubView === 'pre-wedding' 
                    ? 'Add Pre-Wedding Shoot Task' 
                    : 'Create New Task'}
                </span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <form onSubmit={handleCreateTaskFromModal} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-sans font-semibold text-slate-700 mb-1.5">
                  {taskHubView === 'outfits' ? 'Outfit / Garment Name *' : taskHubView === 'rentals' ? 'Equipment / Sound Rig *' : 'Task Title *'}
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder={
                    taskHubView === 'outfits'
                      ? 'e.g. Sangeet Indo-Western Sherwani or Chaniya Choli'
                      : taskHubView === 'rentals'
                      ? 'e.g. Haldi Low-Height Stage or Extra Wireless Mics'
                      : 'e.g. Call DJ vendor to confirm sound rig'
                  }
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] focus:bg-white transition-all shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-sans font-semibold text-slate-700 mb-1.5">Due / Target Date *</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => handleDueDateChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] focus:bg-white transition-all shadow-2xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-sans font-semibold text-slate-700 mb-1.5">Month Phase *</label>
                  <select
                    value={targetMonth}
                    onChange={(e) => handleTargetMonthChange(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] focus:bg-white transition-all shadow-2xs"
                  >
                    {milestones.map(m => (
                      <option key={m.id} value={m.id}>{m.monthLabel} ({m.timeframe})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-sans font-semibold text-slate-700 mb-1.5">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] focus:bg-white transition-all shadow-2xs uppercase font-medium"
                  >
                    {STATUS_LIST.map(s => (
                      <option key={s} value={s}>{STATUS_CONFIGS[s].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-sans font-semibold text-slate-700 mb-1.5">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] focus:bg-white transition-all shadow-2xs"
                  >
                    {PRIORITY_LIST.map(p => (
                      <option key={p} value={p}>{PRIORITY_CONFIGS[p].label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-sans font-semibold text-slate-700 mb-1.5">
                    {taskHubView === 'outfits' ? 'Wardrobe Owner' : 'Assigned To'}
                  </label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] focus:bg-white transition-all shadow-2xs"
                  >
                    {ASSIGNEE_LIST.map(a => (
                      <option key={a} value={a}>{ASSIGNEE_CONFIGS[a].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-sans font-semibold text-slate-700 mb-1.5">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] focus:bg-white transition-all shadow-2xs uppercase font-medium"
                  >
                    {CATEGORY_LIST.map(c => (
                      <option key={c} value={c}>{CATEGORY_CONFIGS[c].label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-sans font-semibold text-slate-700 mb-1.5">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder={
                    taskHubView === 'outfits'
                      ? 'e.g. Master tailor name, store address, color theme, measurements...'
                      : taskHubView === 'rentals'
                      ? 'e.g. Vendor contact, deposit amount, pickup time...'
                      : 'e.g. Direct instructions, phone numbers, notes...'
                  }
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] focus:bg-white transition-all shadow-2xs"
                />
              </div>

              <div className="pt-3.5 flex justify-end space-x-2.5 border-t border-slate-200/60">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-sans font-medium rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-sans font-medium text-xs shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
