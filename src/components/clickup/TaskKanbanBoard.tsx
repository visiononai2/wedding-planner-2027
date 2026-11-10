import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Trash2, 
  CheckSquare, 
  Calendar,
  AlertCircle,
  FileText,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  Task, 
  MonthMilestone, 
  TaskStatus, 
  TaskPriority, 
  Assignee, 
  TaskCategory,
  MonthPeriod
} from '../../types/wedding';
import { ClickUpStatusDropdown } from './ClickUpStatusDropdown';
import { ClickUpPriorityDropdown } from './ClickUpPriorityDropdown';
import { ClickUpAssigneeDropdown } from './ClickUpAssigneeDropdown';
import { 
  STATUS_CONFIGS, 
  STATUS_LIST, 
  PRIORITY_CONFIGS, 
  PRIORITY_LIST,
  ASSIGNEE_CONFIGS, 
  ASSIGNEE_LIST,
  CATEGORY_CONFIGS, 
  CATEGORY_LIST,
  getTaskStatus,
  formatTaskDate,
  getDateBadgeStyle,
  getDefaultDateForMonth
} from '../../utils/taskHelpers';

export type KanbanGroupBy = 'status' | 'priority' | 'assignee' | 'category' | 'month';

interface TaskKanbanBoardProps {
  tasks: Task[];
  milestones: MonthMilestone[];
  selectedMonth: MonthPeriod | 'ALL';
  groupBy: KanbanGroupBy;
  onSelectTask: (task: Task) => void;
  onToggleTask: (taskId: string) => void;
  onEditTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

export const TaskKanbanBoard: React.FC<TaskKanbanBoardProps> = ({
  tasks,
  milestones,
  selectedMonth,
  groupBy,
  onSelectTask,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  
  // Inline quick-add per column
  const [quickAddColumnId, setQuickAddColumnId] = useState<string | null>(null);
  const [quickAddTitle, setQuickAddTitle] = useState('');

  // Define columns based on groupBy
  interface ColumnDef {
    id: string;
    label: string;
    headerColor: string;
    accentDot?: string;
    badgeClasses?: string;
  }

  const columns: ColumnDef[] = React.useMemo(() => {
    if (groupBy === 'status') {
      return STATUS_LIST.map((s) => ({
        id: s,
        label: STATUS_CONFIGS[s].label,
        headerColor: 'text-slate-700',
        accentDot: STATUS_CONFIGS[s].dotColor,
        badgeClasses: STATUS_CONFIGS[s].countBadge,
      }));
    }
    if (groupBy === 'priority') {
      return PRIORITY_LIST.map((p) => ({
        id: p,
        label: PRIORITY_CONFIGS[p].label.toUpperCase(),
        headerColor: 'text-slate-700',
        accentDot: p === 'urgent' ? 'bg-rose-500' : p === 'high' ? 'bg-amber-500' : p === 'medium' ? 'bg-blue-500' : 'bg-slate-400',
        badgeClasses: PRIORITY_CONFIGS[p].badgeClasses,
      }));
    }
    if (groupBy === 'assignee') {
      return ASSIGNEE_LIST.map((a) => ({
        id: a,
        label: ASSIGNEE_CONFIGS[a].label.toUpperCase(),
        headerColor: 'text-slate-700',
        accentDot: a === 'Groom' ? 'bg-indigo-600' : a === 'Bride' ? 'bg-rose-500' : a === 'Both' ? 'bg-purple-600' : 'bg-amber-600',
        badgeClasses: 'bg-slate-100 text-slate-700',
      }));
    }
    if (groupBy === 'category') {
      return CATEGORY_LIST.map((c) => ({
        id: c,
        label: CATEGORY_CONFIGS[c].label.toUpperCase(),
        headerColor: 'text-slate-700',
        accentDot: 'bg-indigo-500',
        badgeClasses: CATEGORY_CONFIGS[c].badgeClasses,
      }));
    }
    if (groupBy === 'month') {
      return milestones.map((m) => ({
        id: m.id,
        label: m.monthLabel.toUpperCase(),
        headerColor: 'text-slate-700',
        accentDot: 'bg-indigo-600',
        badgeClasses: 'bg-indigo-50 text-indigo-700',
      }));
    }
    return [];
  }, [groupBy, milestones]);

  // Group tasks by column sorted chronologically by day
  const getTasksForColumn = (columnId: string): Task[] => {
    return tasks
      .filter((task) => {
        if (groupBy === 'status') {
          return getTaskStatus(task) === columnId;
        }
        if (groupBy === 'priority') {
          return task.priority === columnId;
        }
        if (groupBy === 'assignee') {
          return task.assignedTo === columnId;
        }
        if (groupBy === 'category') {
          return task.category === columnId;
        }
        if (groupBy === 'month') {
          return task.monthId === columnId;
        }
        return false;
      })
      .sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
  };

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumnId !== colId) {
      setDragOverColumnId(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, colId: string) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverColumnId === colId) {
      setDragOverColumnId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    setDragOverColumnId(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDraggedTaskId(null);

    if (!taskId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (groupBy === 'status') {
      const newStatus = targetColId as TaskStatus;
      if (getTaskStatus(task) !== newStatus) {
        const isCompleted = newStatus === 'completed';
        onEditTask(taskId, {
          status: newStatus,
          completed: isCompleted,
        });
        if (isCompleted && !task.completed) {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }
      }
    } else if (groupBy === 'priority') {
      const newPriority = targetColId as TaskPriority;
      if (task.priority !== newPriority) {
        onEditTask(taskId, { priority: newPriority });
      }
    } else if (groupBy === 'assignee') {
      const newAssignee = targetColId as Assignee;
      if (task.assignedTo !== newAssignee) {
        onEditTask(taskId, { assignedTo: newAssignee });
      }
    } else if (groupBy === 'category') {
      const newCategory = targetColId as TaskCategory;
      if (task.category !== newCategory) {
        onEditTask(taskId, { category: newCategory });
      }
    } else if (groupBy === 'month') {
      const newMonth = targetColId as MonthPeriod;
      if (task.monthId !== newMonth) {
        onEditTask(taskId, { monthId: newMonth });
      }
    }
  };

  // Quick Add task in column
  const handleQuickAddSubmit = (colId: string) => {
    if (!quickAddTitle.trim()) {
      setQuickAddColumnId(null);
      return;
    }

    const defaultMonth = selectedMonth === 'ALL' ? 'oct-2026' : selectedMonth;
    const taskMonth = groupBy === 'month' ? (colId as MonthPeriod) : defaultMonth;
    const newTaskData: Omit<Task, 'id'> = {
      title: quickAddTitle.trim(),
      category: groupBy === 'category' ? (colId as TaskCategory) : 'rituals',
      assignedTo: groupBy === 'assignee' ? (colId as Assignee) : 'Both',
      monthId: taskMonth,
      dueDate: getDefaultDateForMonth(taskMonth),
      completed: groupBy === 'status' && colId === 'completed',
      status: groupBy === 'status' ? (colId as TaskStatus) : 'todo',
      priority: groupBy === 'priority' ? (colId as TaskPriority) : 'medium',
      description: '',
      notes: '',
      subtasks: [],
      comments: [],
    };

    onAddTask(newTaskData);
    setQuickAddTitle('');
    setQuickAddColumnId(null);
  };

  return (
    <div className="w-full overflow-x-auto pb-4 pt-1">
      <div className="flex gap-5 min-w-[950px] items-start">
        {columns.map((col) => {
          const colTasks = getTasksForColumn(col.id);
          const isDragOver = dragOverColumnId === col.id;
          const isQuickAdding = quickAddColumnId === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex-1 min-w-[280px] max-w-[350px] rounded-2xl flex flex-col transition-all duration-200 border ${
                isDragOver
                  ? 'bg-amber-50/40 border-[#D4AF37] ring-2 ring-[#D4AF37]/20 shadow-md'
                  : 'bg-slate-50/50 border-slate-200/70'
              }`}
            >
              {/* Column Header (Clean style) */}
              <div className="px-4 py-3 border-b border-slate-200/60 flex items-center justify-between gap-2.5 shrink-0 bg-transparent rounded-t-2xl">
                <div className="flex items-center gap-2 truncate">
                  {col.accentDot && (
                    <span className={`w-2 h-2 rounded-full ${col.accentDot} shrink-0`} />
                  )}
                  <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-slate-800 truncate">
                    {col.label}
                  </h3>
                  <span className={`text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded-full ${col.badgeClasses || 'bg-slate-100 text-slate-600 border border-slate-200/60'}`}>
                    {colTasks.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setQuickAddColumnId(isQuickAdding ? null : col.id);
                    setQuickAddTitle('');
                  }}
                  className="p-1 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title={`Add task to ${col.label}`}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
              </div>

              {/* Column Content / Cards List */}
              <div className="p-3 space-y-3 flex-1 min-h-[180px]">
                {/* Inline Quick Add Input */}
                {isQuickAdding && (
                  <div className="bg-white rounded-xl p-3.5 border-2 border-[#D4AF37] shadow-md animate-in fade-in zoom-in-95 duration-100">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Task name... (hit Enter)"
                      value={quickAddTitle}
                      onChange={(e) => setQuickAddTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleQuickAddSubmit(col.id);
                        } else if (e.key === 'Escape') {
                          setQuickAddColumnId(null);
                        }
                      }}
                      className="w-full text-xs font-semibold text-slate-900 border-0 p-0 focus:ring-0 outline-none placeholder-slate-400"
                    />
                    <div className="mt-2.5 flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setQuickAddColumnId(null)}
                        className="px-2.5 py-1 text-[11px] text-slate-500 hover:text-slate-700 font-medium rounded-full cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAddSubmit(col.id)}
                        className="px-3 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-full shadow-xs cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Task Cards */}
                {colTasks.map((task) => {
                  const status = getTaskStatus(task);
                  const isCompleted = task.completed;
                  const isBeingDragged = draggedTaskId === task.id;
                  const milestone = milestones.find((m) => m.id === task.monthId);
                  const subtasksCount = task.subtasks?.length || 0;
                  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => onSelectTask(task)}
                      className={`group bg-white rounded-xl p-4 border transition-all duration-150 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 hover:z-20 focus-within:z-30 has-[[data-open="true"]]:z-40 relative ${
                        isBeingDragged
                          ? 'opacity-40 border-dashed border-[#D4AF37]'
                          : isCompleted
                          ? 'bg-slate-50/50 border-slate-200/60 text-slate-400'
                          : 'border-slate-200/80'
                      }`}
                    >
                      {/* Top Badges Row */}
                      <div className="flex items-center justify-between gap-1.5 mb-2 text-[10px]">
                        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                          {/* Category Tag */}
                          <span
                            className={`px-2 py-0.5 rounded-md font-semibold border ${
                              CATEGORY_CONFIGS[task.category]?.badgeClasses || 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            #{task.category}
                          </span>

                          {/* Side Badge */}
                          {task.side === 'Boy' && (
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80 font-semibold">
                              Groom
                            </span>
                          )}
                          {task.side === 'Girl' && (
                            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 font-semibold">
                              Bride
                            </span>
                          )}
                          {task.side === 'Both' && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/70 font-semibold">
                              Joint
                            </span>
                          )}

                          {/* Extra Domain Tags */}
                          {task.tags && task.tags.length > 0 && task.tags.slice(0, 1).map((tg, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 font-medium text-[9px] truncate max-w-[100px]">
                              {tg}
                            </span>
                          ))}
                        </div>

                        {/* Priority Flag */}
                        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                          <ClickUpPriorityDropdown
                            priority={task.priority}
                            onChange={(p) => onEditTask(task.id, { priority: p })}
                            size="sm"
                            showLabel={task.priority === 'urgent' || task.priority === 'high'}
                            align="right"
                          />
                        </div>
                      </div>

                      {/* Card Title */}
                      <h4
                        className={`text-xs sm:text-sm font-semibold leading-snug mb-2 group-hover:text-amber-800 transition-colors ${
                          isCompleted ? 'line-through text-slate-400 font-normal' : 'text-slate-900'
                        }`}
                        title={task.title}
                      >
                        {task.title}
                      </h4>

                      {/* Description Snippet: Clean unboxed text */}
                      {(task.description || task.notes) && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 font-normal leading-relaxed">
                          {task.description || task.notes}
                        </p>
                      )}

                      {/* Subtask checklist progress & Comments count */}
                      {(subtasksCount > 0 || (task.comments && task.comments.length > 0)) && (
                        <div className="flex items-center justify-between gap-2 mb-3 text-[10px] text-slate-500 font-medium">
                          {subtasksCount > 0 ? (
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <CheckSquare className="w-3 h-3 text-[#B89230] shrink-0" />
                              <span className="shrink-0 font-mono">
                                {completedSubtasks}/{subtasksCount}
                              </span>
                              <div className="flex-1 bg-slate-100 h-1 rounded-full overflow-hidden max-w-[60px]">
                                <div
                                  className="bg-[#B89230] h-full rounded-full"
                                  style={{ width: `${(completedSubtasks / subtasksCount) * 100}%` }}
                                />
                              </div>
                            </div>
                          ) : <div />}

                          {task.comments && task.comments.length > 0 && (
                            <span 
                              className="flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-md shrink-0 font-semibold font-mono"
                              title={`${task.comments.length} comment${task.comments.length > 1 ? 's' : ''}`}
                            >
                              <MessageSquare className="w-3 h-3 text-[#B89230]" />
                              <span>{task.comments.length}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Bottom Bar: Due Date on Left, Status + Avatar on Right */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px]">
                        {/* Due Date Indicator */}
                        <div className="min-w-0">
                          {task.dueDate ? (
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                                isCompleted ? 'text-slate-400' : 'text-slate-600'
                              }`}
                              title={`Due Date: ${formatTaskDate(task.dueDate)} (${milestone?.monthLabel || ''})`}
                            >
                              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{formatTaskDate(task.dueDate)}</span>
                            </span>
                          ) : milestone ? (
                            <span className="text-[11px] text-slate-400 font-medium truncate block">
                              {milestone.monthLabel}
                            </span>
                          ) : <div />}
                        </div>

                        {/* Status + Avatar Controls */}
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          {/* Circular complete checkbox */}
                          <button
                            type="button"
                            onClick={() => onToggleTask(task.id)}
                            title={isCompleted ? 'Mark pending' : 'Mark complete'}
                            className="text-slate-300 hover:text-emerald-600 transition-colors"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-4 h-4 hover:stroke-slate-400" />
                            )}
                          </button>

                          {/* Quick Status Pill */}
                          <ClickUpStatusDropdown
                            status={status}
                            onChange={(newStatus) => {
                              onEditTask(task.id, {
                                status: newStatus,
                                completed: newStatus === 'completed',
                              });
                            }}
                            size="sm"
                            align="right"
                          />

                          {/* Assignee Avatar */}
                          <ClickUpAssigneeDropdown
                            assignedTo={task.assignedTo}
                            onChange={(a) => onEditTask(task.id, { assignedTo: a })}
                            size="sm"
                            showLabel={false}
                            align="right"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Empty State in Column */}
                {colTasks.length === 0 && !isQuickAdding && (
                  <div className="py-8 px-4 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
                    <p className="font-serif italic text-xs text-slate-400">No tasks in this stage</p>
                  </div>
                )}
              </div>

              {/* Column Bottom Add Button */}
              {!isQuickAdding && (
                <div className="p-2 border-t border-slate-200/60 shrink-0 bg-transparent rounded-b-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setQuickAddColumnId(col.id);
                      setQuickAddTitle('');
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-800 hover:bg-white/80 rounded-xl transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Add Task</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
