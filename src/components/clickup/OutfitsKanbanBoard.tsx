import React, { useState } from 'react';
import { 
  Plus, 
  ShoppingBag, 
  Scissors, 
  Sparkles, 
  Calendar, 
  MapPin, 
  IndianRupee, 
  Edit3, 
  Trash2, 
  Tag, 
  CheckCircle2, 
  Circle,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DressItem, WeddingSide } from '../../types/wedding';

export type OutfitsGroupBy = 'status' | 'person' | 'action';

interface OutfitsKanbanBoardProps {
  dresses: DressItem[];
  activeSide?: WeddingSide;
  groupBy?: OutfitsGroupBy;
  onUpdateDress: (id: string, updates: Partial<DressItem>) => void;
  onAddDress: (dress: Omit<DressItem, 'id'>) => void;
  onDeleteDress: (id: string) => void;
  onEditDress: (dress: DressItem) => void;
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
    id: 'To Buy',
    label: 'TO BUY / SOURCING',
    sublabel: 'Fabric & Ready-to-wear scouting',
    accentDot: 'bg-rose-400',
    badgeClasses: 'bg-rose-50 text-rose-700 border border-rose-200/60',
  },
  {
    id: 'Fabric Bought',
    label: 'FABRIC BOUGHT',
    sublabel: 'Raw cloth acquired, ready for master tailor',
    accentDot: 'bg-slate-400',
    badgeClasses: 'bg-slate-100 text-slate-700 border border-slate-200/80',
  },
  {
    id: 'At Tailor',
    label: 'AT TAILOR / STITCHING',
    sublabel: 'Under stitching, embroidery & work',
    accentDot: 'bg-[#A36A36]',
    badgeClasses: 'bg-[#A36A36]/10 text-[#A36A36] border border-[#A36A36]/20',
  },
  {
    id: 'Trial Done',
    label: 'TRIAL & FITTINGS',
    sublabel: 'First fitting done, alterations in progress',
    accentDot: 'bg-[#3B6281]',
    badgeClasses: 'bg-[#3B6281]/10 text-[#3B6281] border border-[#3B6281]/20',
  },
  {
    id: 'Ready',
    label: 'READY & PACKED',
    sublabel: 'Ironed, tagged and packed in wedding kit',
    accentDot: 'bg-emerald-500',
    badgeClasses: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
  },
];

const PERSON_COLUMNS: ColumnDef[] = [
  {
    id: 'Groom',
    label: "GROOM'S WARDROBE",
    sublabel: 'Suits, Kurtas, Sherwani, Safa & Mojdi',
    accentDot: 'bg-[#3B6281]',
    badgeClasses: 'bg-[#3B6281]/10 text-[#3B6281] border border-[#3B6281]/20',
  },
  {
    id: 'Bride',
    label: "BRIDE'S WARDROBE",
    sublabel: 'Panetar, Chaniya Choli, Haldi Pithi, Sangeet',
    accentDot: 'bg-[#A84A5B]',
    badgeClasses: 'bg-[#A84A5B]/10 text-[#A84A5B] border border-[#A84A5B]/20',
  },
];

const ACTION_COLUMNS: ColumnDef[] = [
  {
    id: 'Buy',
    label: 'PURCHASE OFF-THE-RACK',
    sublabel: 'Direct retail store purchases',
    accentDot: 'bg-slate-800',
    badgeClasses: 'bg-slate-100 text-slate-800 border border-slate-200/80',
  },
  {
    id: 'Tailor / Stitch',
    label: 'CUSTOM BESPOKE STITCHING',
    sublabel: 'Fabric sourcing & boutique tailoring',
    accentDot: 'bg-[#B89230]',
    badgeClasses: 'bg-[#B89230]/10 text-[#B89230] border border-[#B89230]/20',
  },
  {
    id: 'Rent',
    label: 'RENTAL ATTIRE',
    sublabel: 'Jewellery / Sherwani / Accessories',
    accentDot: 'bg-[#A36A36]',
    badgeClasses: 'bg-[#A36A36]/10 text-[#A36A36] border border-[#A36A36]/20',
  },
];

export const OutfitsKanbanBoard: React.FC<OutfitsKanbanBoardProps> = ({
  dresses,
  activeSide = 'ALL',
  groupBy = 'status',
  onUpdateDress,
  onAddDress,
  onDeleteDress,
  onEditDress,
}) => {
  const [draggedDressId, setDraggedDressId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  // Inline quick-add per column
  const [quickAddColumnId, setQuickAddColumnId] = useState<string | null>(null);
  const [quickAddGarment, setQuickAddGarment] = useState('');
  const [quickAddPerson, setQuickAddPerson] = useState<'Groom' | 'Bride'>(() => 
    activeSide === 'GIRL' ? 'Bride' : 'Groom'
  );

  React.useEffect(() => {
    if (activeSide === 'GIRL') setQuickAddPerson('Bride');
    else if (activeSide === 'BOY') setQuickAddPerson('Groom');
  }, [activeSide]);

  const columns = React.useMemo(() => {
    if (groupBy === 'person') return PERSON_COLUMNS;
    if (groupBy === 'action') return ACTION_COLUMNS;
    return STATUS_COLUMNS;
  }, [groupBy]);

  const getDressesForColumn = (colId: string) => {
    return dresses.filter((d) => {
      if (groupBy === 'person') return d.person === colId;
      if (groupBy === 'action') return d.action === colId;
      return d.status === colId;
    });
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, dressId: string) => {
    e.dataTransfer.setData('text/plain', dressId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedDressId(dressId);
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
    const dressId = e.dataTransfer.getData('text/plain') || draggedDressId;
    setDraggedDressId(null);

    if (!dressId) return;

    const dress = dresses.find((d) => d.id === dressId);
    if (!dress) return;

    if (groupBy === 'status') {
      const newStatus = targetColId as DressItem['status'];
      if (dress.status !== newStatus) {
        onUpdateDress(dressId, { status: newStatus });
        if (newStatus === 'Ready') {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }
      }
    } else if (groupBy === 'person') {
      const newPerson = targetColId as 'Groom' | 'Bride';
      if (dress.person !== newPerson) {
        onUpdateDress(dressId, { person: newPerson });
      }
    } else if (groupBy === 'action') {
      const newAction = targetColId as 'Buy' | 'Tailor / Stitch' | 'Rent';
      if (dress.action !== newAction) {
        onUpdateDress(dressId, { action: newAction });
      }
    }
  };

  // Inline Quick Add
  const handleQuickAddSubmit = (colId: string) => {
    if (!quickAddGarment.trim()) {
      setQuickAddColumnId(null);
      return;
    }

    const defaultPerson = groupBy === 'person' ? (colId as 'Groom' | 'Bride') : quickAddPerson;
    const defaultStatus = groupBy === 'status' ? (colId as DressItem['status']) : 'To Buy';
    const defaultAction = groupBy === 'action' ? (colId as 'Buy' | 'Tailor / Stitch' | 'Rent') : 'Buy';

    const newDressData: Omit<DressItem, 'id'> = {
      garmentName: quickAddGarment.trim(),
      person: defaultPerson,
      event: 'Wedding Event',
      date: 'Feb 2027',
      colorTheme: 'Traditional theme',
      action: defaultAction,
      status: defaultStatus,
      costEstimated: 0,
      advancePaid: 0,
      notes: ''
    };

    onAddDress(newDressData);
    setQuickAddGarment('');
    setQuickAddColumnId(null);
  };

  return (
    <div className="w-full overflow-x-auto pb-4 pt-1 scrollbar-thin">
      <div className="flex gap-4 min-w-[1100px] items-start">
        {columns.map((col) => {
          const colDresses = getDressesForColumn(col.id);
          const isDragOver = dragOverColumnId === col.id;
          const isQuickAdding = quickAddColumnId === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex-1 min-w-[280px] max-w-[340px] rounded-2xl flex flex-col transition-all duration-200 border ${
                isDragOver
                  ? 'bg-amber-50/50 border-[#D4AF37] ring-2 ring-[#D4AF37]/20 shadow-md'
                  : 'bg-slate-50/70 border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-200/70 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-2 h-2 rounded-full ${col.accentDot} shrink-0`} />
                  <h3 className="font-semibold text-xs tracking-wider text-slate-800 truncate uppercase">
                    {col.label}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${col.badgeClasses}`}>
                    {colDresses.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setQuickAddColumnId(isQuickAdding ? null : col.id);
                    setQuickAddGarment('');
                  }}
                  className="p-1 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title={`Add outfit to ${col.label}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Column Content / Cards */}
              <div className="p-3 space-y-3 flex-1 min-h-[160px]">
                {/* Inline Quick Add Input */}
                {isQuickAdding && (
                  <div className="bg-white rounded-2xl p-3 border border-[#D4AF37] shadow-md animate-in fade-in zoom-in-95 duration-100 space-y-2.5">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Garment name (e.g. Yellow Kurta)..."
                      value={quickAddGarment}
                      onChange={(e) => setQuickAddGarment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleQuickAddSubmit(col.id);
                        } else if (e.key === 'Escape') {
                          setQuickAddColumnId(null);
                        }
                      }}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] font-medium"
                    />

                    {groupBy !== 'person' && (
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400 font-medium">For:</span>
                        <button
                          type="button"
                          onClick={() => setQuickAddPerson('Groom')}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all ${
                            quickAddPerson === 'Groom'
                              ? 'bg-[#3B6281] text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          👦 Groom
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickAddPerson('Bride')}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all ${
                            quickAddPerson === 'Bride'
                              ? 'bg-[#A84A5B] text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          👧 Bride
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span className="font-mono text-[10px]">Press Enter ↵ to save</span>
                      <button
                        type="button"
                        onClick={() => handleQuickAddSubmit(col.id)}
                        className="px-3 py-1 bg-slate-900 text-slate-50 rounded-xl text-[11px] font-medium hover:bg-slate-800 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Cards List */}
                {colDresses.length === 0 && !isQuickAdding ? (
                  <div className="h-24 rounded-2xl border border-dashed border-slate-200/80 flex items-center justify-center text-xs text-slate-400 font-medium">
                    Drop outfit here
                  </div>
                ) : (
                  colDresses.map((dress) => {
                    const isGroom = dress.person === 'Groom';
                    const balance = (dress.costEstimated || 0) - (dress.advancePaid || 0);

                    return (
                      <div
                        key={dress.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, dress.id)}
                        className={`bg-white/95 rounded-2xl p-4 border border-slate-200/70 hover:border-[#D4AF37]/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-grab active:cursor-grabbing group space-y-3 ${
                          draggedDressId === dress.id ? 'opacity-40 scale-95' : ''
                        }`}
                      >
                        {/* Top Metadata Row: Side & Event */}
                        <div className="flex items-center justify-between gap-1.5 text-[11px]">
                          <div className="flex items-center gap-1.5 truncate">
                            <span
                              className={`px-2 py-0.5 rounded-full font-medium text-[10px] shrink-0 ${
                                isGroom
                                  ? 'bg-[#3B6281]/10 text-[#3B6281] border border-[#3B6281]/20'
                                  : 'bg-[#A84A5B]/10 text-[#A84A5B] border border-[#A84A5B]/20'
                              }`}
                            >
                              {isGroom ? '👦 Groom' : '👧 Bride'}
                            </span>
                            <span className="font-medium text-slate-700 truncate" title={dress.event}>
                              {dress.event}
                            </span>
                          </div>

                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {dress.date}
                          </span>
                        </div>

                        {/* Garment Title */}
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 leading-snug group-hover:text-slate-950 transition-colors">
                            {dress.garmentName}
                          </h4>
                          {dress.colorTheme && (
                            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B89230] shrink-0" />
                              <span className="truncate">{dress.colorTheme}</span>
                            </div>
                          )}
                        </div>

                        {/* Shop / Tailor & Trial Date */}
                        {(dress.storeOrTailor || dress.trialDate) && (
                          <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] space-y-1 text-slate-600 border border-slate-200/70">
                            {dress.storeOrTailor && (
                              <div className="flex items-center gap-1.5 truncate">
                                <Scissors className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="font-medium text-slate-700 truncate">
                                  {dress.storeOrTailor}
                                </span>
                              </div>
                            )}
                            {dress.trialDate && (
                              <div className="flex items-center gap-1.5 text-slate-700 font-mono text-[10px]">
                                <Calendar className="w-3 h-3 text-[#B89230] shrink-0" />
                                <span>Trial: {dress.trialDate}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Financial Snapshot */}
                        <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/60">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900">
                              ₹{(dress.costEstimated || 0).toLocaleString('en-IN')}
                            </span>
                            {balance > 0 ? (
                              <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200/60">
                                Due: ₹{balance.toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/60">
                                Paid Full
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 font-medium border border-slate-200/70">
                            {dress.action}
                          </span>
                        </div>

                        {/* Card Bottom Actions: Status Dropdown & Edit / Delete */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                          {/* Quick Status Dropdown */}
                          <div className="relative">
                            <select
                              value={dress.status}
                              onChange={(e) => {
                                const newSt = e.target.value as DressItem['status'];
                                onUpdateDress(dress.id, { status: newSt });
                                if (newSt === 'Ready') {
                                  confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
                                }
                              }}
                              className="text-[10px] font-medium py-1 pl-2.5 pr-6 bg-slate-50 hover:bg-white border border-slate-200/80 rounded-lg text-slate-800 focus:outline-none cursor-pointer appearance-none transition-colors"
                            >
                              <option value="To Buy">To Buy</option>
                              <option value="Fabric Bought">Fabric Bought</option>
                              <option value="At Tailor">At Tailor</option>
                              <option value="Trial Done">Trial Done</option>
                              <option value="Ready">Ready</option>
                            </select>
                            <ChevronDown className="w-2.5 h-2.5 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
                          </div>

                          {/* Edit / Delete Buttons */}
                          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => onEditDress(dress)}
                              className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit outfit details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete outfit "${dress.garmentName}"?`)) {
                                  onDeleteDress(dress.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete outfit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Bottom Add Outfit Button inside column */}
                <button
                  type="button"
                  onClick={() => {
                    setQuickAddColumnId(col.id);
                    setQuickAddGarment('');
                  }}
                  className="w-full py-2 px-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-white/80 border border-transparent hover:border-slate-200/70 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Outfit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
