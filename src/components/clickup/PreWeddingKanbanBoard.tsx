import React, { useState } from 'react';
import { 
  Plus, 
  Camera, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Trash2, 
  Sparkles, 
  MapPin, 
  Film, 
  Shirt, 
  Car, 
  Users,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PreWeddingChecklistItem, WeddingSide } from '../../types/wedding';

export type PreWeddingGroupBy = 'status' | 'stage';

interface PreWeddingKanbanBoardProps {
  checklist: PreWeddingChecklistItem[];
  activeSide?: WeddingSide;
  groupBy?: PreWeddingGroupBy;
  onToggleChecklist: (id: string) => void;
  onUpdateChecklist: (id: string, updates: Partial<PreWeddingChecklistItem>) => void;
  onAddChecklist: (item: Omit<PreWeddingChecklistItem, 'id'>) => void;
  onDeleteChecklist: (id: string) => void;
  onEditChecklist?: (item: PreWeddingChecklistItem) => void;
}

interface ColumnDef {
  id: string;
  label: string;
  sublabel?: string;
  accentDot: string;
  badgeClasses: string;
}

const STATUS_COLUMNS: ColumnDef[] = [
  {
    id: 'todo',
    label: 'TO DO / SOURCING',
    sublabel: 'Pending tasks before shoot trip',
    accentDot: 'bg-[#B89230]',
    badgeClasses: 'bg-[#B89230]/10 text-slate-800 border border-[#B89230]/30',
  },
  {
    id: 'completed',
    label: 'COMPLETED & LOCKED',
    sublabel: 'Executed, contract signed or delivered',
    accentDot: 'bg-slate-700',
    badgeClasses: 'bg-slate-100 text-slate-700 border border-slate-200/80',
  },
];

export const STAGES_LIST = [
  'Location & Scope Decision',
  'Storyboards & 3 Reel Scripts',
  'Wardrobe & Outfits',
  'Photography Crew & Contract',
  'Travel & Lodging',
  'Shoot Day Execution',
  'Post-Production & Garba LED Delivery'
];

const STAGE_CONFIGS: Record<string, { label: string; dot: string; badge: string; icon: any }> = {
  'Location & Scope Decision': {
    label: 'LOCATION & SCOPE',
    dot: 'bg-[#B89230]',
    badge: 'bg-[#B89230]/10 text-slate-800 border border-[#B89230]/30',
    icon: MapPin,
  },
  'Storyboards & 3 Reel Scripts': {
    label: '3 STORY REELS & SCRIPTS',
    dot: 'bg-amber-700',
    badge: 'bg-amber-100/70 text-amber-900 border border-amber-200/70',
    icon: Film,
  },
  'Wardrobe & Outfits': {
    label: 'WARDROBE & LOOKS',
    dot: 'bg-[#A84A5B]',
    badge: 'bg-[#A84A5B]/10 text-slate-800 border border-[#A84A5B]/30',
    icon: Shirt,
  },
  'Photography Crew & Contract': {
    label: 'PHOTO CREW & CONTRACT',
    dot: 'bg-[#3B6281]',
    badge: 'bg-[#3B6281]/10 text-slate-800 border border-[#3B6281]/30',
    icon: Users,
  },
  'Travel & Lodging': {
    label: 'TRAVEL & LOGISTICS',
    dot: 'bg-slate-600',
    badge: 'bg-slate-100 text-slate-800 border border-slate-200/80',
    icon: Car,
  },
  'Shoot Day Execution': {
    label: 'SHOOT DAY EXECUTION',
    dot: 'bg-slate-800',
    badge: 'bg-slate-100 text-slate-900 border border-slate-200/80',
    icon: Camera,
  },
  'Post-Production & Garba LED Delivery': {
    label: 'POST-PRODUCTION & LED REEL',
    dot: 'bg-[#B89230]',
    badge: 'bg-slate-100 text-slate-900 border border-slate-200/80',
    icon: Sparkles,
  },
};

export const PreWeddingKanbanBoard: React.FC<PreWeddingKanbanBoardProps> = ({
  checklist,
  activeSide = 'ALL',
  groupBy = 'status',
  onToggleChecklist,
  onUpdateChecklist,
  onAddChecklist,
  onDeleteChecklist,
  onEditChecklist,
}) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  // Inline quick-add per column
  const [quickAddColumnId, setQuickAddColumnId] = useState<string | null>(null);
  const [quickAddTitle, setQuickAddTitle] = useState('');

  // Editing state for inline editing
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const columns: ColumnDef[] = React.useMemo(() => {
    if (groupBy === 'stage') {
      return STAGES_LIST.map((stage) => {
        const conf = STAGE_CONFIGS[stage] || {
          label: stage.toUpperCase(),
          dot: 'bg-indigo-500',
          badge: 'bg-slate-100 text-slate-800',
        };
        return {
          id: stage,
          label: conf.label,
          accentDot: conf.dot,
          badgeClasses: conf.badge,
        };
      });
    }
    return STATUS_COLUMNS;
  }, [groupBy]);

  const getItemsForColumn = (colId: string) => {
    return checklist.filter((item) => {
      if (groupBy === 'stage') {
        return item.stage === colId;
      }
      if (colId === 'completed') return item.completed;
      return !item.completed;
    });
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItemId(id);
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
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    setDraggedItemId(null);

    if (!itemId) return;

    const item = checklist.find((c) => c.id === itemId);
    if (!item) return;

    if (groupBy === 'status') {
      const markCompleted = targetColId === 'completed';
      if (item.completed !== markCompleted) {
        onUpdateChecklist(itemId, { completed: markCompleted });
        if (markCompleted) {
          confetti({ particleCount: 40, spread: 55, origin: { y: 0.6 } });
        }
      }
    } else if (groupBy === 'stage') {
      if (item.stage !== targetColId) {
        onUpdateChecklist(itemId, { stage: targetColId });
      }
    }
  };

  // Inline Quick Add
  const handleQuickAddSubmit = (colId: string) => {
    if (!quickAddTitle.trim()) {
      setQuickAddColumnId(null);
      return;
    }

    const defaultStage = groupBy === 'stage' ? colId : 'Storyboards & 3 Reel Scripts';
    const isCompleted = groupBy === 'status' && colId === 'completed';

    const newItemData: Omit<PreWeddingChecklistItem, 'id'> = {
      title: quickAddTitle.trim(),
      stage: defaultStage,
      completed: isCompleted,
      notes: ''
    };

    onAddChecklist(newItemData);
    setQuickAddTitle('');
    setQuickAddColumnId(null);
  };

  const startEdit = (item: PreWeddingChecklistItem) => {
    setEditingItemId(item.id);
    setEditTitle(item.title);
    setEditNotes(item.notes || '');
  };

  const saveEdit = (id: string) => {
    if (editTitle.trim()) {
      onUpdateChecklist(id, {
        title: editTitle.trim(),
        notes: editNotes.trim() || undefined
      });
    }
    setEditingItemId(null);
  };

  return (
    <div className="w-full overflow-x-auto pb-4 pt-1 scrollbar-thin">
      <div className={`flex gap-5 items-start ${groupBy === 'stage' ? 'min-w-[1700px]' : 'min-w-[650px]'}`}>
        {columns.map((col) => {
          const colItems = getItemsForColumn(col.id);
          const isDragOver = dragOverColumnId === col.id;
          const isQuickAdding = quickAddColumnId === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex-1 min-w-[280px] max-w-[360px] rounded-3xl flex flex-col transition-all duration-300 border ${
                isDragOver
                  ? 'bg-amber-50/50 border-[#D4AF37] ring-2 ring-[#D4AF37]/20 shadow-md'
                  : 'bg-slate-50/70 border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-200/60 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-2 h-2 rounded-full ${col.accentDot} shrink-0`} />
                  <h3 className="font-mono text-[11px] font-medium tracking-wider uppercase text-slate-800 truncate">
                    {col.label}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${col.badgeClasses}`}>
                    {colItems.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setQuickAddColumnId(isQuickAdding ? null : col.id);
                    setQuickAddTitle('');
                  }}
                  className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
                  title={`Add task to ${col.label}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Column Content / Cards */}
              <div className="p-3 space-y-2.5 flex-1 min-h-[160px]">
                {/* Inline Quick Add Input */}
                {isQuickAdding && (
                  <div className="bg-white rounded-2xl p-3 border border-[#D4AF37] shadow-[0_4px_16px_rgba(212,175,55,0.1)] animate-in fade-in zoom-in-95 duration-150 space-y-2">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Shoot task name (e.g. Rent vintage scooter prop)..."
                      value={quickAddTitle}
                      onChange={(e) => setQuickAddTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleQuickAddSubmit(col.id);
                        } else if (e.key === 'Escape') {
                          setQuickAddColumnId(null);
                        }
                      }}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] font-medium"
                    />

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                      <span>Press Enter ↵ to save</span>
                      <button
                        type="button"
                        onClick={() => handleQuickAddSubmit(col.id)}
                        className="px-3 py-1 bg-slate-900 text-slate-50 rounded-full text-[10px] font-mono tracking-widest uppercase hover:bg-slate-800 transition-colors"
                      >
                        Add Task
                      </button>
                    </div>
                  </div>
                )}

                {/* Cards List */}
                {colItems.length === 0 && !isQuickAdding ? (
                  <div className="h-24 rounded-2xl border border-dashed border-slate-200/80 flex items-center justify-center text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Drop task here
                  </div>
                ) : (
                  colItems.map((item) => {
                    const isEditing = editingItemId === item.id;
                    const stageConf = STAGE_CONFIGS[item.stage] || {
                      label: item.stage,
                      dot: 'bg-slate-500',
                      badge: 'bg-slate-100 text-slate-800 border-slate-200',
                      icon: Camera
                    };
                    const StageIcon = stageConf.icon;

                    return (
                      <div
                        key={item.id}
                        draggable={!isEditing}
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        className={`bg-white/95 rounded-2xl p-3.5 border border-slate-200/70 hover:border-[#D4AF37]/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all cursor-grab active:cursor-grabbing group space-y-2.5 ${
                          draggedItemId === item.id ? 'opacity-40 scale-95' : ''
                        } ${item.completed ? 'bg-slate-50/70 border-slate-200/50' : ''}`}
                      >
                        {isEditing ? (
                          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full text-xs font-medium px-2.5 py-1.5 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900"
                              placeholder="Task title"
                              autoFocus
                            />
                            <textarea
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              className="w-full text-[11px] px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none resize-none h-16 leading-relaxed"
                              placeholder="Notes or instructions..."
                            />
                            <div className="flex items-center justify-end gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingItemId(null)}
                                className="px-2.5 py-1 text-[11px] text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => saveEdit(item.id)}
                                className="px-3 py-1 text-[10px] font-mono tracking-wider uppercase bg-slate-900 text-slate-50 rounded-full hover:bg-slate-800 transition-colors"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Top Stage Tag */}
                            <div className="flex items-center justify-between gap-1.5 text-[11px]">
                              <span
                                className={`px-2 py-0.5 rounded-full font-mono text-[9px] tracking-wider uppercase flex items-center gap-1.5 truncate ${stageConf.badge}`}
                              >
                                <StageIcon className="w-3 h-3 shrink-0" />
                                <span className="truncate">{item.stage}</span>
                              </span>

                              <button
                                type="button"
                                onClick={() => onToggleChecklist(item.id)}
                                className="text-slate-300 hover:text-slate-700 transition-colors shrink-0 cursor-pointer"
                                title={item.completed ? 'Mark pending' : 'Mark completed'}
                              >
                                {item.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-slate-700" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-300 hover:text-[#B89230]" />
                                )}
                              </button>
                            </div>

                            {/* Task Title */}
                            <div>
                              <h4
                                className={`text-xs font-medium leading-snug group-hover:text-slate-900 transition-colors tracking-tight ${
                                  item.completed ? 'line-through text-slate-400' : 'text-slate-800'
                                }`}
                              >
                                {item.title}
                              </h4>
                              {item.notes && (
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                  {item.notes}
                                </p>
                              )}
                            </div>

                            {/* Card Footer: Stage Selector / Toggle & Edit / Delete */}
                            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[11px]">
                              {groupBy === 'stage' ? (
                                <button
                                  type="button"
                                  onClick={() => onToggleChecklist(item.id)}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase transition-colors ${
                                    item.completed
                                      ? 'bg-slate-100 text-slate-700 border border-slate-200'
                                      : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/70'
                                  }`}
                                >
                                  {item.completed ? '✓ Locked' : 'Mark Done'}
                                </button>
                              ) : (
                                <div className="relative">
                                  <select
                                    value={item.stage}
                                    onChange={(e) => onUpdateChecklist(item.id, { stage: e.target.value })}
                                    className="text-[10px] font-mono tracking-wider uppercase py-0.5 pl-2 pr-5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-slate-700 focus:outline-none cursor-pointer appearance-none max-w-[130px] truncate"
                                  >
                                    {STAGES_LIST.map((st) => (
                                      <option key={st} value={st}>
                                        {st}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown className="w-2.5 h-2.5 text-slate-400 absolute right-1.5 top-1.5 pointer-events-none" />
                                </div>
                              )}

                              <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => startEdit(item)}
                                  className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  title="Edit task"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Delete shoot task "${item.title}"?`)) {
                                      onDeleteChecklist(item.id);
                                    }
                                  }}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete task"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Bottom Add Task Button inside column */}
                <button
                  type="button"
                  onClick={() => {
                    setQuickAddColumnId(col.id);
                    setQuickAddTitle('');
                  }}
                  className="w-full py-2 px-3 rounded-xl text-[11px] font-mono uppercase tracking-wider text-slate-500 hover:text-slate-900 hover:bg-white border border-dashed border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
