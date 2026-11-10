import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Trash2, 
  FileText,
  Calendar,
  Layers,
  Heart,
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
  MonthPeriod,
  EventSide
} from '../../types/wedding';
import { EditableText } from '../EditableText';
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
  getMonthPeriodFromDate,
  getDefaultDateForMonth,
  getDateBadgeStyle
} from '../../utils/taskHelpers';

interface TaskListViewProps {
  tasks: Task[];
  milestones: MonthMilestone[];
  selectedMonth: MonthPeriod | 'ALL';
  onSelectTask: (task: Task) => void;
  onToggleTask: (taskId: string) => void;
  onEditTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  milestones,
  selectedMonth,
  onSelectTask,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
}) => {
  // Collapsible groups state
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  
  // Quick Add input state per group
  const [quickAddStatus, setQuickAddStatus] = useState<TaskStatus | null>(null);
  const [quickAddTitle, setQuickAddTitle] = useState('');

  const toggleGroupCollapse = (statusId: string) => {
    setCollapsedGroups(prev => ({ ...prev, [statusId]: !prev[statusId] }));
  };

  const handleQuickAddSubmit = (status: TaskStatus) => {
    if (!quickAddTitle.trim()) {
      setQuickAddStatus(null);
      return;
    }

    const defaultMonth = selectedMonth === 'ALL' ? 'oct-2026' : selectedMonth;
    const isCompleted = status === 'completed';

    onAddTask({
      title: quickAddTitle.trim(),
      category: 'rituals',
      assignedTo: 'Both',
      monthId: defaultMonth,
      dueDate: getDefaultDateForMonth(defaultMonth),
      completed: isCompleted,
      status: status,
      priority: 'medium',
      description: '',
      notes: '',
      subtasks: [],
      comments: [],
    });

    setQuickAddTitle('');
    setQuickAddStatus(null);
  };

  return (
    <div className="space-y-4">
      {STATUS_LIST.map((statusKey) => {
        const config = STATUS_CONFIGS[statusKey];
        const groupTasks = tasks
          .filter((t) => getTaskStatus(t) === statusKey)
          .sort((a, b) => {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.localeCompare(b.dueDate);
          });
        const isCollapsed = collapsedGroups[statusKey];
        const isQuickAdding = quickAddStatus === statusKey;

        // Don't hide groups if empty, keep consistent ClickUp layout
        return (
          <div
            key={statusKey}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-all"
          >
            {/* Group Header (Editorial style) */}
            <div
              onClick={() => toggleGroupCollapse(statusKey)}
              className="px-4 py-3 bg-slate-50 hover:bg-slate-100/70 border-b border-slate-200/70 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                  title={isCollapsed ? 'Expand group' : 'Collapse group'}
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 stroke-[1.5]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 stroke-[1.5]" />
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                  <span className="text-xs font-serif font-bold uppercase tracking-wider text-slate-800">
                    {config.label}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${config.countBadge}`}>
                    {groupTasks.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => {
                    setQuickAddStatus(isQuickAdding ? null : statusKey);
                    setQuickAddTitle('');
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold text-slate-500 hover:text-slate-900 px-3 py-1 rounded-full hover:bg-white transition-colors border border-transparent hover:border-slate-200/60 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>New Task</span>
                </button>
              </div>
            </div>

            {/* Group Table Body */}
            {!isCollapsed && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 min-w-[750px]">
                  {/* Table Header Row */}
                  <thead>
                    <tr className="border-b border-slate-200/70 text-[10px] font-sans font-semibold text-slate-400 bg-slate-50/60 uppercase tracking-[0.16em]">
                      <th className="py-3 pl-4 pr-2 w-10"></th>
                      <th className="py-3 px-2 font-medium">Task Name</th>
                      <th className="py-3 px-2 font-medium w-28">Assignee</th>
                      <th className="py-3 px-2 font-medium w-32">Due Date</th>
                      <th className="py-3 px-2 font-medium w-24">Priority</th>
                      <th className="py-3 px-2 font-medium w-28">Category</th>
                      <th className="py-3 px-2 font-medium w-24">Side</th>
                      <th className="py-3 px-2 font-medium w-28">Status</th>
                      <th className="py-3 pl-2 pr-4 text-right w-16">Actions</th>
                    </tr>
                  </thead>

                  {/* Task Rows */}
                  <tbody className="divide-y divide-slate-100">
                    {groupTasks.map((task) => {
                      const isCompleted = task.completed;
                      const milestone = milestones.find((m) => m.id === task.monthId);
                      const currentTaskStatus = getTaskStatus(task);

                      return (
                        <tr
                          key={task.id}
                          className={`group hover:bg-slate-50/70 transition-colors ${
                            isCompleted ? 'bg-slate-50/40 text-slate-400' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-3.5 pl-4 pr-2 align-middle">
                            <button
                              type="button"
                              onClick={() => onToggleTask(task.id)}
                              className="text-slate-300 hover:text-emerald-600 transition-colors p-0.5 cursor-pointer"
                              title={isCompleted ? 'Mark pending' : 'Mark completed'}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 stroke-[1.5]" />
                              ) : (
                                <Circle className="w-4 h-4 hover:stroke-slate-400 stroke-[1.5]" />
                              )}
                            </button>
                          </td>

                          {/* Task Name & Note */}
                          <td className="py-3 px-2 align-middle max-w-sm">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span
                                  onClick={() => onSelectTask(task)}
                                  className={`font-medium cursor-pointer hover:text-[#9A7B2C] transition-colors truncate text-xs ${
                                    isCompleted ? 'line-through text-slate-400 font-normal' : 'text-slate-900'
                                  }`}
                                  title={task.title}
                                >
                                  {task.title}
                                </span>
                                {task.comments && task.comments.length > 0 && (
                                  <span 
                                    className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 border border-amber-200/70 px-1.5 py-0.5 rounded font-semibold shrink-0"
                                    title={`${task.comments.length} comment${task.comments.length > 1 ? 's' : ''}`}
                                  >
                                    <MessageSquare className="w-2.5 h-2.5 text-[#B89230] stroke-[1.5]" />
                                    <span>{task.comments.length}</span>
                                  </span>
                                )}
                              </div>

                              {(task.description || task.notes) && (
                                <span className="text-[11px] text-slate-400 truncate mt-0.5 font-normal flex items-center gap-1">
                                  <span className="text-slate-400 font-medium">Desc:</span>
                                  <span>{task.description || task.notes}</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Assignee */}
                          <td className="py-3 px-2 align-middle">
                            <ClickUpAssigneeDropdown
                              assignedTo={task.assignedTo}
                              onChange={(a) => onEditTask(task.id, { assignedTo: a })}
                              size="sm"
                            />
                          </td>

                          {/* Due Date (Interactive Day-Level Date Picker) */}
                          <td className="py-3 px-2 align-middle">
                            <div className="relative group/date inline-flex items-center">
                              <input
                                type="date"
                                value={task.dueDate || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const newMonth = getMonthPeriodFromDate(val) || task.monthId;
                                  onEditTask(task.id, { dueDate: val, monthId: newMonth });
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                title="Click to change date"
                              />
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] transition-all cursor-pointer shadow-2xs group-hover/date:ring-1 group-hover/date:ring-[#D4AF37]/40 ${
                                  task.dueDate
                                    ? getDateBadgeStyle(task.dueDate, isCompleted)
                                    : 'bg-slate-100 text-slate-500 border-slate-200/60'
                                }`}
                              >
                                <Calendar className="w-3 h-3 shrink-0 stroke-[1.5]" />
                                <span>{task.dueDate ? formatTaskDate(task.dueDate) : (milestone?.monthLabel || 'Set date')}</span>
                              </span>
                            </div>
                          </td>

                          {/* Priority */}
                          <td className="py-3 px-2 align-middle">
                            <ClickUpPriorityDropdown
                              priority={task.priority}
                              onChange={(p) => onEditTask(task.id, { priority: p })}
                              size="sm"
                            />
                          </td>

                          {/* Category */}
                          <td className="py-3 px-2 align-middle">
                            <select
                              value={task.category}
                              onChange={(e) => onEditTask(task.id, { category: e.target.value as any })}
                              className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded-full border uppercase focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer ${
                                CATEGORY_CONFIGS[task.category]?.badgeClasses || 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {CATEGORY_LIST.map((c) => (
                                <option key={c} value={c}>
                                  {CATEGORY_CONFIGS[c]?.label || c}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Side */}
                          <td className="py-3 px-2 align-middle">
                            <select
                              value={task.side || 'Both'}
                              onChange={(e) => onEditTask(task.id, { side: e.target.value as EventSide })}
                              className="text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200/80 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
                            >
                              <option value="Both">Joint</option>
                              <option value="Boy">Groom (Parth)</option>
                              <option value="Girl">Bride (Nisha)</option>
                            </select>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-2 align-middle">
                            <ClickUpStatusDropdown
                              status={currentTaskStatus}
                              onChange={(newStatus) => {
                                onEditTask(task.id, {
                                  status: newStatus,
                                  completed: newStatus === 'completed',
                                });
                              }}
                              size="sm"
                              align="right"
                            />
                          </td>

                          {/* Actions */}
                          <td className="py-3 pl-2 pr-4 align-middle text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => onSelectTask(task)}
                                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Open ClickUp details modal"
                              >
                                <Edit3 className="w-3.5 h-3.5 stroke-[1.5]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteTask(task.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete task"
                              >
                                <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {/* Quick Add Row inside table */}
                    {isQuickAdding && (
                      <tr className="bg-slate-50/80">
                        <td className="py-2.5 pl-4 pr-2 align-middle">
                          <Plus className="w-4 h-4 text-indigo-500 animate-pulse" />
                        </td>
                        <td colSpan={8} className="py-2 px-2 align-middle pr-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              autoFocus
                              placeholder="Task name... (press Enter to save, Esc to cancel)"
                              value={quickAddTitle}
                              onChange={(e) => setQuickAddTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleQuickAddSubmit(statusKey);
                                } else if (e.key === 'Escape') {
                                  setQuickAddStatus(null);
                                }
                              }}
                              className="flex-1 bg-white border border-indigo-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleQuickAddSubmit(statusKey)}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-2xs"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuickAddStatus(null)}
                              className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Empty Group State */}
                    {groupTasks.length === 0 && !isQuickAdding && (
                      <tr>
                        <td colSpan={9} className="py-4 text-center text-xs text-slate-400 font-medium italic">
                          No tasks in {config.label}.{' '}
                          <button
                            type="button"
                            onClick={() => {
                              setQuickAddStatus(statusKey);
                              setQuickAddTitle('');
                            }}
                            className="text-indigo-600 hover:underline font-semibold not-italic"
                          >
                            + Add a task
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
