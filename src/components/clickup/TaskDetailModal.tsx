import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Trash2, 
  CheckSquare, 
  Plus, 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Circle, 
  Heart,
  ChevronRight,
  Sparkles,
  AlignLeft,
  MessageSquare,
  Send,
  Edit3,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  Task, 
  MonthMilestone, 
  Subtask, 
  TaskStatus, 
  TaskPriority, 
  Assignee, 
  EventSide,
  TaskComment,
  CommentAuthorRole
} from '../../types/wedding';
import { ClickUpStatusDropdown } from './ClickUpStatusDropdown';
import { ClickUpPriorityDropdown } from './ClickUpPriorityDropdown';
import { ClickUpAssigneeDropdown } from './ClickUpAssigneeDropdown';
import { 
  CATEGORY_CONFIGS, 
  CATEGORY_LIST, 
  getTaskStatus,
  formatTaskDate,
  getMonthPeriodFromDate,
  getDateBadgeStyle
} from '../../utils/taskHelpers';

interface TaskDetailModalProps {
  task: Task;
  milestones: MonthMilestone[];
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

interface RoleConfig {
  role: CommentAuthorRole;
  label: string;
  shortLabel: string;
  emoji: string;
  badgeBg: string;
  avatarBg: string;
}

const AUTHOR_ROLES: RoleConfig[] = [
  { 
    role: 'Groom', 
    label: 'Groom (Parth)', 
    shortLabel: 'Groom',
    emoji: '🤵', 
    badgeBg: 'bg-[#3B6281]/10 border-[#3B6281]/30 text-[#3B6281]',
    avatarBg: 'bg-[#3B6281] text-white'
  },
  { 
    role: 'Bride', 
    label: 'Bride (Nisha)', 
    shortLabel: 'Bride',
    emoji: '👰', 
    badgeBg: 'bg-[#A84A5B]/10 border-[#A84A5B]/30 text-[#A84A5B]',
    avatarBg: 'bg-[#A84A5B] text-white'
  },
  { 
    role: 'Family', 
    label: 'Family (Elders)', 
    shortLabel: 'Family',
    emoji: '👨‍👩‍👧', 
    badgeBg: 'bg-[#A36A36]/10 border-[#A36A36]/30 text-[#A36A36]',
    avatarBg: 'bg-[#A36A36] text-white'
  },
  { 
    role: 'Planner', 
    label: 'Wedding Planner', 
    shortLabel: 'Planner',
    emoji: '✨', 
    badgeBg: 'bg-slate-100 border-slate-200/80 text-slate-700',
    avatarBg: 'bg-slate-800 text-slate-100'
  },
  { 
    role: 'Both', 
    label: 'Joint (Couple)', 
    shortLabel: 'Joint',
    emoji: '🤝', 
    badgeBg: 'bg-[#B89230]/10 border-[#B89230]/30 text-[#B89230]',
    avatarBg: 'bg-[#B89230] text-white'
  }
];

const getRoleConfig = (role?: string): RoleConfig => {
  return AUTHOR_ROLES.find(r => r.role === role) || AUTHOR_ROLES[2]; // Default to Family
};

const getAuthorDisplayName = (role: CommentAuthorRole): string => {
  const cfg = AUTHOR_ROLES.find(r => r.role === role);
  return cfg ? cfg.label : role;
};

const formatCommentTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return isoString;
  }
};

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  milestones,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [title, setTitle] = useState(task.title);
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);
  // Replace notes with task description, preserving legacy notes seamlessly
  const [description, setDescription] = useState(task.description ?? task.notes ?? '');
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Comments state
  const [comments, setComments] = useState<TaskComment[]>(task.comments || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  // Author selection for comments
  const [commentAuthorRole, setCommentAuthorRole] = useState<CommentAuthorRole>(() => {
    if (task.assignedTo === 'Groom') return 'Groom';
    if (task.assignedTo === 'Bride') return 'Bride';
    return 'Family';
  });

  const currentStatus = getTaskStatus(task);
  const currentMilestone = milestones.find((m) => m.id === task.monthId);

  // Sync state if task changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description ?? task.notes ?? '');
    setSubtasks(task.subtasks || []);
    setComments(task.comments || []);
  }, [task]);

  // Auto-resize title textarea so the full title is always visible without truncation
  useEffect(() => {
    if (titleTextareaRef.current) {
      titleTextareaRef.current.style.height = 'auto';
      titleTextareaRef.current.style.height = `${titleTextareaRef.current.scrollHeight}px`;
    }
  }, [title]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleTitleBlur = () => {
    if (title.trim() && title !== task.title) {
      onUpdate(task.id, { title: title.trim() });
    }
  };

  const handleDescriptionBlur = () => {
    const currentVal = task.description ?? task.notes ?? '';
    if (description !== currentVal) {
      // Update both description and notes to preserve current data across all systems
      onUpdate(task.id, { 
        description: description.trim(),
        notes: description.trim()
      });
    }
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    const isCompleted = newStatus === 'completed';
    onUpdate(task.id, { 
      status: newStatus,
      completed: isCompleted 
    });
    if (isCompleted && !task.completed) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handlePriorityChange = (newPriority: TaskPriority) => {
    onUpdate(task.id, { priority: newPriority });
  };

  const handleAssigneeChange = (newAssignee: Assignee) => {
    onUpdate(task.id, { assignedTo: newAssignee });
  };

  // Subtask management
  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSubtask: Subtask = {
      id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };

    const updated = [...subtasks, newSubtask];
    setSubtasks(updated);
    setNewSubtaskTitle('');
    onUpdate(task.id, { subtasks: updated });
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updated = subtasks.map((st) => {
      if (st.id === subtaskId) {
        const next = !st.completed;
        if (next) {
          confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
        }
        return { ...st, completed: next };
      }
      return st;
    });
    setSubtasks(updated);
    onUpdate(task.id, { subtasks: updated });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updated = subtasks.filter((st) => st.id !== subtaskId);
    setSubtasks(updated);
    onUpdate(task.id, { subtasks: updated });
  };

  // Comments management
  const handleAuthorRoleChange = (role: CommentAuthorRole) => {
    setCommentAuthorRole(role);
  };

  const handleAddComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCommentText.trim();
    if (!trimmed) return;

    const newComment: TaskComment = {
      id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      author: getAuthorDisplayName(commentAuthorRole),
      role: commentAuthorRole,
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    const updated = [...comments, newComment];
    setComments(updated);
    setNewCommentText('');
    onUpdate(task.id, { comments: updated });
  };

  const handleStartEditComment = (comment: TaskComment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.content);
  };

  const handleSaveEditComment = (commentId: string) => {
    if (!editingCommentText.trim()) return;
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          content: editingCommentText.trim(),
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    setComments(updated);
    setEditingCommentId(null);
    setEditingCommentText('');
    onUpdate(task.id, { comments: updated });
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
    const updated = comments.filter((c) => c.id !== commentId);
    setComments(updated);
    onUpdate(task.id, { comments: updated });
  };

  const completedSubtasksCount = subtasks.filter((st) => st.completed).length;
  const subtasksPercent = subtasks.length > 0 ? Math.round((completedSubtasksCount / subtasks.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_24px_70px_rgba(15,23,42,0.18)] border border-slate-200/90 overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header / Breadcrumb Bar */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 truncate">
            <span className="flex items-center gap-1.5 text-[#B89230] font-semibold tracking-wide uppercase text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tasks</span>
            </span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-700 font-medium truncate">
              {currentMilestone?.monthLabel || 'All Months'}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-600 text-[11px] font-semibold font-sans uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
              #{task.category}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-all cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body: 2 Columns on desktop */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
          {/* Main Left Content (2 Cols on lg) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Title (Auto-resizing multiline so full title is always visible) */}
            <div>
              <textarea
                ref={titleTextareaRef}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onBlur={handleTitleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
                rows={1}
                placeholder="Task title..."
                className="w-full text-xl sm:text-2xl font-bold font-cormorant text-slate-900 border-0 border-b border-transparent hover:border-slate-200 focus:border-[#D4AF37] focus:ring-0 bg-transparent px-1 py-1 transition-all outline-none resize-none overflow-hidden leading-snug break-words"
              />
            </div>

            {/* Task Description Section (Replaces Notes section, preserving current data) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500 font-mono">
                  <AlignLeft className="w-3.5 h-3.5 text-[#B89230]" />
                  <span>Task Description</span>
                </label>
                <span className="text-[10px] text-slate-400 font-normal">
                  Auto-saved on blur
                </span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionBlur}
                rows={3}
                placeholder="Add detailed task description, instructions, specifications, price quotes, or contact numbers..."
                className="w-full bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all leading-relaxed"
              />
            </div>

            {/* Subtasks / Checklist Section (ClickUp style) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-3.5 h-3.5 text-[#B89230]" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    Subtasks / Checklist
                  </span>
                  {subtasks.length > 0 && (
                    <span className="text-[10px] font-medium text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded-full">
                      {completedSubtasksCount}/{subtasks.length}
                    </span>
                  )}
                </div>

                {subtasks.length > 0 && (
                  <span className="text-[11px] font-semibold text-[#B89230]">
                    {subtasksPercent}%
                  </span>
                )}
              </div>

              {/* Progress bar */}
              {subtasks.length > 0 && (
                <div className="w-full bg-slate-200/70 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-[#B89230] h-full rounded-full transition-all duration-300"
                    style={{ width: `${subtasksPercent}%` }}
                  />
                </div>
              )}

              {/* Subtask list */}
              <div className="space-y-1.5">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="group flex items-center justify-between gap-2 p-2.5 rounded-xl border border-slate-200/60 bg-white/60 hover:border-slate-300 hover:bg-white transition-all text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(st.id)}
                      className="shrink-0 text-slate-400 hover:text-slate-800 cursor-pointer"
                    >
                      {st.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                      )}
                    </button>

                    <span
                      className={`flex-1 truncate ${
                        st.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'
                      }`}
                    >
                      {st.title}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteSubtask(st.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-600 rounded-md transition-opacity cursor-pointer"
                      title="Delete subtask"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Inline Add Subtask Input */}
              <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="+ Add a subtask (press Enter)..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="flex-1 bg-slate-50/70 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
                />
                <button
                  type="submit"
                  disabled={!newSubtaskTitle.trim()}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-50 disabled:opacity-30 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>
            </div>

            {/* Comments & Activity Section */}
            <div className="space-y-3 pt-4 border-t border-slate-200/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#B89230]" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    Comments & Discussion
                  </span>
                  {comments.length > 0 && (
                    <span className="text-[10px] font-medium text-[#B89230] bg-[#B89230]/10 border border-[#B89230]/20 px-2 py-0.5 rounded-full">
                      {comments.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-2.5">
                {comments.length === 0 ? (
                  <div className="py-4 text-center text-slate-400 text-xs">
                    <p className="font-serif italic text-slate-400">No comments yet · Leave notes, updates, or decisions below</p>
                  </div>
                ) : (
                  comments.map((comment) => {
                    const config = getRoleConfig(comment.role);
                    const isEditing = editingCommentId === comment.id;

                    return (
                      <div
                        key={comment.id}
                        className="group p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 hover:border-slate-300/80 transition-all text-xs"
                      >
                        {/* Comment Header */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${config.avatarBg} shrink-0`}>
                              {config.emoji}
                            </span>
                            <span className="font-medium text-slate-800 truncate">
                              {comment.author}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium border ${config.badgeBg}`}>
                              {config.shortLabel}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                              {formatCommentTime(comment.createdAt)}
                            </span>
                            {comment.updatedAt && (
                              <span className="text-[10px] text-slate-400 italic">
                                (edited)
                              </span>
                            )}
                          </div>

                          {/* Action buttons (Edit & Delete) */}
                          {!isEditing && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleStartEditComment(comment)}
                                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
                                title="Edit comment"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(comment.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete comment"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Comment Body */}
                        {isEditing ? (
                          <div className="space-y-2 mt-2">
                            <textarea
                              value={editingCommentText}
                              onChange={(e) => setEditingCommentText(e.target.value)}
                              rows={2}
                              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                              autoFocus
                            />
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={handleCancelEditComment}
                                className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEditComment(comment.id)}
                                className="px-2.5 py-1 text-[11px] font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                                <span>Save</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed break-words pl-7">
                            {comment.content}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* New Comment Composer */}
              <form onSubmit={handleAddComment} className="pt-1">
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden focus-within:ring-2 focus-within:ring-[#D4AF37]/20 focus-within:border-[#D4AF37] transition-all">
                  {/* Author selector strip */}
                  <div className="px-3.5 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Commenting as:</span>
                      <select
                        value={commentAuthorRole}
                        onChange={(e) => handleAuthorRoleChange(e.target.value as CommentAuthorRole)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[11px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
                      >
                        {AUTHOR_ROLES.map((r) => (
                          <option key={r.role} value={r.role}>
                            {r.emoji} {r.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-[10px] text-slate-400 hidden sm:inline font-mono">
                      Enter ↵ to send • Shift+Enter for new line
                    </span>
                  </div>

                  {/* Comment Input */}
                  <div className="p-3">
                    <textarea
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment();
                        }
                      }}
                      placeholder="Write a comment, question, or update..."
                      rows={2}
                      className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent resize-none focus:outline-none leading-relaxed"
                    />

                    <div className="flex items-center justify-between pt-1.5">
                      <div className="flex items-center gap-1">
                        {AUTHOR_ROLES.slice(0, 3).map((r) => (
                          <button
                            key={r.role}
                            type="button"
                            onClick={() => handleAuthorRoleChange(r.role)}
                            title={`Switch to ${r.label}`}
                            className={`text-xs px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                              commentAuthorRole === r.role
                                ? `${r.badgeBg} font-medium shadow-2xs`
                                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {r.emoji}
                          </button>
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={!newCommentText.trim()}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-slate-50 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar Custom Fields (ClickUp signature layout) */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4 self-start text-xs shadow-2xs">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 pb-2 border-b border-slate-200/70 font-mono">
              Task Details
            </div>

            {/* Status */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Status
              </span>
              <ClickUpStatusDropdown status={currentStatus} onChange={handleStatusChange} size="sm" align="right" />
            </div>

            {/* Assignee */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Assignee
              </span>
              <ClickUpAssigneeDropdown assignedTo={task.assignedTo} onChange={handleAssigneeChange} size="sm" align="right" />
            </div>

            {/* Priority */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Priority
              </span>
              <ClickUpPriorityDropdown priority={task.priority} onChange={handlePriorityChange} size="sm" align="right" />
            </div>

            {/* Month Phase */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/60">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Month Phase
              </span>
              <select
                value={task.monthId}
                onChange={(e) => onUpdate(task.id, { monthId: e.target.value as any })}
                className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              >
                {milestones.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.monthLabel}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/60">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Category
              </span>
              <select
                value={task.category}
                onChange={(e) => onUpdate(task.id, { category: e.target.value as any })}
                className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium uppercase focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              >
                {CATEGORY_LIST.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_CONFIGS[c]?.label || c}
                  </option>
                ))}
              </select>
            </div>

            {/* Perspective / Side */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/60">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-slate-400" />
                Perspective / Side
              </span>
              <select
                value={task.side || 'Both'}
                onChange={(e) => onUpdate(task.id, { side: e.target.value as EventSide })}
                className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              >
                <option value="Both">🤝 Joint (Both)</option>
                <option value="Boy">👦 Boy's Side</option>
                <option value="Girl">👧 Girl's Side</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/60">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Due Date
              </span>
              <input
                type="date"
                value={task.dueDate || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const newMonth = getMonthPeriodFromDate(val);
                  const updates: Partial<Task> = { dueDate: val };
                  if (newMonth && newMonth !== task.monthId) {
                    updates.monthId = newMonth;
                  }
                  onUpdate(task.id, updates);
                }}
                className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            {/* Delete button */}
            <div className="pt-3 border-t border-slate-200/70">
              {showDeleteConfirm ? (
                <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3 space-y-2">
                  <p className="text-[11px] font-medium text-rose-800">
                    Permanently delete this task?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(task.id);
                        onClose();
                      }}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 rounded-xl border border-rose-200/70 transition-all font-medium text-xs cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Task</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white/70 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="font-mono text-[11px] text-slate-400">Changes are saved automatically</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-50 font-medium rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
