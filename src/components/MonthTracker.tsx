import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  Task, 
  MonthMilestone, 
  MonthPeriod, 
  TaskCategory, 
  Assignee 
} from '../types/wedding';
import { EditableText } from './EditableText';

interface MonthTrackerProps {
  milestones: MonthMilestone[];
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onEditTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const MonthTracker: React.FC<MonthTrackerProps> = ({
  milestones,
  tasks,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<MonthPeriod | 'ALL'>('oct-2026');
  const [assigneeFilter, setAssigneeFilter] = useState<Assignee | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Task Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('rituals');
  const [newAssignee, setNewAssignee] = useState<Assignee>('Both');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newNotes, setNewNotes] = useState('');
  const [targetMonth, setTargetMonth] = useState<MonthPeriod>('oct-2026');

  // Edit Task Modal
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const getMilestoneStats = (mId: MonthPeriod) => {
    const mTasks = tasks.filter(t => t.monthId === mId);
    const total = mTasks.length;
    const completed = mTasks.filter(t => t.completed).length;
    const remaining = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, remaining, percent };
  };

  const handleToggle = (taskId: string) => {
    onToggleTask(taskId);
    
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      const remaining = tasks
        .filter(t => t.monthId === task.monthId && t.id !== taskId && !t.completed)
        .length;
      
      if (remaining === 0) {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      }
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      category: newCategory,
      assignedTo: newAssignee,
      monthId: targetMonth,
      completed: false,
      priority: newPriority,
      notes: newNotes.trim()
    });

    setNewTitle('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) return;

    onEditTask(editingTask.id, {
      title: editingTask.title.trim(),
      category: editingTask.category,
      assignedTo: editingTask.assignedTo,
      monthId: editingTask.monthId,
      priority: editingTask.priority,
      notes: editingTask.notes?.trim()
    });

    setEditingTask(null);
  };

  // Filter tasks
  const displayedTasks = tasks.filter(task => {
    if (selectedMonth !== 'ALL' && task.monthId !== selectedMonth) return false;
    if (assigneeFilter !== 'ALL' && task.assignedTo !== assigneeFilter) return false;
    if (categoryFilter !== 'ALL' && task.category !== categoryFilter) return false;
    if (statusFilter === 'PENDING' && task.completed) return false;
    if (statusFilter === 'COMPLETED' && !task.completed) return false;
    if (searchQuery.trim() && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Month-by-Month Overview Cards */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-700" />
              <span>Full Period Overview (Oct 2026 → Feb 2027)</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Click any month below to focus on its specific tasks, or click "View All Months" for the complete roadmap.
            </p>
          </div>

          <button
            onClick={() => setSelectedMonth('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              selectedMonth === 'ALL'
                ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            View All Months ({tasks.length} Total)
          </button>
        </div>

        {/* 6 Month Milestone Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {milestones.map((m) => {
            const stats = getMilestoneStats(m.id);
            const isSelected = selectedMonth === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMonth(m.id)}
                className={`p-3 rounded-lg text-left transition border ${
                  isSelected
                    ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                    : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>{m.monthLabel}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : stats.remaining > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {stats.remaining > 0 ? `${stats.remaining} left` : 'Done'}
                  </span>
                </div>

                <div className={`text-[11px] truncate ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                  {stats.completed}/{stats.total} done ({stats.percent}%)
                </div>

                {/* Progress line */}
                <div className="mt-2 w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isSelected ? 'bg-blue-400' : 'bg-gray-900'
                    }`}
                    style={{ width: `${stats.percent}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Immediate Focus Callout for Cognitive Ease & Psychological Relief */}
      {selectedMonth === 'oct-2026' && (
        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
          <div>
            <div className="font-bold flex items-center gap-1.5 text-blue-950">
              <span className="text-sm">🎯</span>
              <span>October 2026 Focus: 6 Core Dependencies</span>
            </div>
            <p className="text-blue-800 text-[11px] mt-0.5">
              Don't worry about all 36 tasks today. Prioritize these 6 questions and vendor contacts first. Once these are locked, clothes shopping and catering will fall smoothly into place.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="font-semibold text-blue-950 bg-white px-2.5 py-1 rounded border border-blue-200 shadow-2xs text-[11px]">
              {tasks.filter(t => t.monthId === 'oct-2026' && !t.completed).length} pending this month
            </span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1 bg-gray-50 border border-gray-300 rounded text-xs text-gray-900 w-36 sm:w-48 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Owner Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value as any)}
            className="bg-gray-50 border border-gray-300 text-gray-800 rounded px-2 py-1"
          >
            <option value="ALL">All Owners</option>
            <option value="Groom">Groom</option>
            <option value="Bride">Bride</option>
            <option value="Both">Both (Couple)</option>
            <option value="Family">Family</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="bg-gray-50 border border-gray-300 text-gray-800 rounded px-2 py-1"
          >
            <option value="ALL">All Categories</option>
            <option value="rituals">Rituals</option>
            <option value="outfits">Outfits</option>
            <option value="rentals">Rentals</option>
            <option value="sound_dj">DJ & Sound</option>
            <option value="catering">Catering</option>
            <option value="venue">Venue</option>
            <option value="logistics">Logistics</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-gray-50 border border-gray-300 text-gray-800 rounded px-2 py-1"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending Only</option>
            <option value="COMPLETED">Completed Only</option>
          </select>

          <span className="text-gray-500 font-medium ml-1 hidden sm:inline">
            Showing <strong>{displayedTasks.length}</strong> tasks
          </span>
        </div>

        <button
          onClick={() => {
            setTargetMonth(selectedMonth === 'ALL' ? 'oct-2026' : selectedMonth);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {displayedTasks.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200 text-xs text-gray-500">
            No tasks match the filter. Click "+ Add Task" to create one.
          </div>
        ) : (
          displayedTasks.map((task) => {
            const milestone = milestones.find(m => m.id === task.monthId);
            return (
              <div
                key={task.id}
                className={`p-3 rounded-lg border transition shadow-sm flex items-center justify-between gap-3 ${
                  task.completed 
                    ? 'bg-gray-50/70 border-gray-200 text-gray-400' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* Complete Checkbox */}
                  <button
                    onClick={() => handleToggle(task.id)}
                    title={task.completed ? "Mark pending" : "Mark completed"}
                    className="shrink-0 text-gray-400 hover:text-gray-900 transition"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 hover:text-gray-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Inline Editable Task Title */}
                      <EditableText
                        value={task.title}
                        onSave={(val) => onEditTask(task.id, { title: val })}
                        className={`text-sm font-semibold truncate ${
                          task.completed ? 'line-through text-gray-400' : 'text-gray-900'
                        }`}
                      />

                      {/* Month badge if in 'View All' mode */}
                      {selectedMonth === 'ALL' && milestone && (
                        <span className="text-[10px] px-2 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                          {milestone.monthLabel}
                        </span>
                      )}

                      {task.priority === 'high' && !task.completed && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                          Urgent
                        </span>
                      )}

                      <select
                        value={task.assignedTo}
                        onChange={(e) => onEditTask(task.id, { assignedTo: e.target.value as any })}
                        className="text-[10px] px-1 py-0.2 rounded bg-gray-100 text-gray-700 border border-gray-200"
                      >
                        <option value="Groom">Groom</option>
                        <option value="Bride">Bride</option>
                        <option value="Both">Both</option>
                        <option value="Family">Family</option>
                      </select>

                      <select
                        value={task.category}
                        onChange={(e) => onEditTask(task.id, { category: e.target.value as any })}
                        className="text-[10px] px-1 py-0.2 rounded bg-gray-100 text-gray-700 border border-gray-200 uppercase"
                      >
                        <option value="rituals">Rituals</option>
                        <option value="outfits">Outfits</option>
                        <option value="rentals">Rentals</option>
                        <option value="sound_dj">DJ & Sound</option>
                        <option value="catering">Catering</option>
                        <option value="venue">Venue</option>
                        <option value="logistics">Logistics</option>
                      </select>
                    </div>

                    {/* Inline Editable Notes */}
                    <div className="mt-0.5 text-xs text-gray-500">
                      <span className="text-gray-400 mr-1">Note:</span>
                      <EditableText
                        value={task.notes || ''}
                        placeholder="+ add note..."
                        onSave={(val) => onEditTask(task.id, { notes: val })}
                        className="text-gray-600 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Buttons */}
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => setEditingTask(task)}
                    title="Edit task parameters"
                    className="p-1 text-gray-400 hover:text-gray-700 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    title="Delete task"
                    className="p-1 text-gray-300 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Add Task</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-700">&times;</button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-3 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Confirm generator pickup date"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Month Phase *</label>
                  <select
                    value={targetMonth}
                    onChange={(e) => setTargetMonth(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1.5"
                  >
                    {milestones.map(m => (
                      <option key={m.id} value={m.id}>{m.monthLabel} ({m.timeframe})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Assigned To</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1.5"
                  >
                    <option value="Groom">Groom</option>
                    <option value="Bride">Bride</option>
                    <option value="Both">Both (Couple)</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1.5"
                  >
                    <option value="rituals">Rituals</option>
                    <option value="outfits">Outfits</option>
                    <option value="rentals">Rentals</option>
                    <option value="sound_dj">DJ & Sound</option>
                    <option value="catering">Catering</option>
                    <option value="venue">Venue</option>
                    <option value="logistics">Logistics</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1.5"
                  >
                    <option value="high">High / Urgent</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Phone number, store address"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-gray-200">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3 py-1.5 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-gray-900 text-white rounded font-semibold">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Edit Task Details</h3>
              <button onClick={() => setEditingTask(null)} className="text-gray-400 hover:text-gray-700">&times;</button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-3 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Month Phase</label>
                  <select
                    value={editingTask.monthId}
                    onChange={(e) => setEditingTask({ ...editingTask, monthId: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1.5"
                  >
                    {milestones.map(m => (
                      <option key={m.id} value={m.id}>{m.monthLabel} ({m.timeframe})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Assigned To</label>
                  <select
                    value={editingTask.assignedTo}
                    onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1.5"
                  >
                    <option value="Groom">Groom</option>
                    <option value="Bride">Bride</option>
                    <option value="Both">Both (Couple)</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={editingTask.category}
                    onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1.5"
                  >
                    <option value="rituals">Rituals</option>
                    <option value="outfits">Outfits</option>
                    <option value="rentals">Rentals</option>
                    <option value="sound_dj">DJ & Sound</option>
                    <option value="catering">Catering</option>
                    <option value="venue">Venue</option>
                    <option value="logistics">Logistics</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Priority</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1.5"
                  >
                    <option value="high">High / Urgent</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={editingTask.notes || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, notes: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-gray-200">
                <button type="button" onClick={() => setEditingTask(null)} className="px-3 py-1.5 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-gray-900 text-white rounded font-semibold">Update Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
