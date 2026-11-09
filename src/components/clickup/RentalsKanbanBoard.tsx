import React, { useState } from 'react';
import { 
  Plus, 
  Truck, 
  Clock, 
  MapPin, 
  Phone, 
  IndianRupee, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  RotateCcw,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RentalItem, WeddingSide, EventSide } from '../../types/wedding';

export type RentalsGroupBy = 'status' | 'side';

interface RentalsKanbanBoardProps {
  rentals: RentalItem[];
  groupBy?: RentalsGroupBy;
  onUpdateRental: (id: string, updates: Partial<RentalItem>) => void;
  onAddRental: (rental: Omit<RentalItem, 'id'>) => void;
  onDeleteRental: (id: string) => void;
  onEditRental: (rental: RentalItem) => void;
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
    id: 'To Book',
    label: 'TO BOOK / ENQUIRE',
    sublabel: 'Vendor contacted, price quote pending',
    accentDot: 'bg-rose-400',
    badgeClasses: 'bg-rose-50 text-rose-700 border border-rose-200/60',
  },
  {
    id: 'Reserved',
    label: 'RESERVED & ADVANCE',
    sublabel: 'Booking locked with token / advance',
    accentDot: 'bg-stone-400',
    badgeClasses: 'bg-stone-100 text-stone-700 border border-stone-200/80',
  },
  {
    id: 'Picked Up',
    label: 'PICKED UP / ON-SITE',
    sublabel: 'Equipment deployed at Silver Farm / Home',
    accentDot: 'bg-[#A36A36]',
    badgeClasses: 'bg-[#A36A36]/10 text-[#A36A36] border border-[#A36A36]/20',
  },
  {
    id: 'Returned',
    label: 'RETURNED TO VENDOR',
    sublabel: 'Gear handed back, inspecting condition',
    accentDot: 'bg-[#3B6281]',
    badgeClasses: 'bg-[#3B6281]/10 text-[#3B6281] border border-[#3B6281]/20',
  },
  {
    id: 'Settled',
    label: 'SETTLED & CLOSED',
    sublabel: 'Deposit refunded & account zeroed',
    accentDot: 'bg-emerald-500',
    badgeClasses: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
  },
];

const SIDE_COLUMNS: ColumnDef[] = [
  {
    id: 'Boy',
    label: "GROOM / BOY'S SIDE",
    sublabel: 'Generator & Sound rigs for Haldi & Jaan',
    accentDot: 'bg-[#3B6281]',
    badgeClasses: 'bg-[#3B6281]/10 text-[#3B6281] border border-[#3B6281]/20',
  },
  {
    id: 'Girl',
    label: "BRIDE / GIRL'S SIDE",
    sublabel: 'Bridal mandvo & pithi sound setup',
    accentDot: 'bg-[#A84A5B]',
    badgeClasses: 'bg-[#A84A5B]/10 text-[#A84A5B] border border-[#A84A5B]/20',
  },
  {
    id: 'Both',
    label: "JOINT / SHARED EVENT",
    sublabel: 'Silver Farm common sound & lighting',
    accentDot: 'bg-[#B89230]',
    badgeClasses: 'bg-[#B89230]/10 text-[#B89230] border border-[#B89230]/20',
  },
];

export const RentalsKanbanBoard: React.FC<RentalsKanbanBoardProps> = ({
  rentals,
  groupBy = 'status',
  onUpdateRental,
  onAddRental,
  onDeleteRental,
  onEditRental,
}) => {
  const [draggedRentalId, setDraggedRentalId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  // Inline quick-add per column
  const [quickAddColumnId, setQuickAddColumnId] = useState<string | null>(null);
  const [quickAddItem, setQuickAddItem] = useState('');
  const [quickAddVendor, setQuickAddVendor] = useState('');

  const columns = React.useMemo(() => {
    if (groupBy === 'side') return SIDE_COLUMNS;
    return STATUS_COLUMNS;
  }, [groupBy]);

  const getRentalsForColumn = (colId: string) => {
    return rentals.filter((r) => {
      if (groupBy === 'side') {
        const sideVal = r.side || 'Both';
        return sideVal === colId;
      }
      return r.status === colId;
    });
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, rentalId: string) => {
    e.dataTransfer.setData('text/plain', rentalId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedRentalId(rentalId);
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
    const rentalId = e.dataTransfer.getData('text/plain') || draggedRentalId;
    setDraggedRentalId(null);

    if (!rentalId) return;

    const rental = rentals.find((r) => r.id === rentalId);
    if (!rental) return;

    if (groupBy === 'status') {
      const newStatus = targetColId as RentalItem['status'];
      if (rental.status !== newStatus) {
        onUpdateRental(rentalId, { status: newStatus });
        if (newStatus === 'Returned' || newStatus === 'Settled') {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }
      }
    } else if (groupBy === 'side') {
      const newSide: EventSide = targetColId === 'Boy' ? 'Boy' : targetColId === 'Girl' ? 'Girl' : 'Both';
      if (rental.side !== newSide) {
        onUpdateRental(rentalId, { side: newSide });
      }
    }
  };

  // Inline Quick Add
  const handleQuickAddSubmit = (colId: string) => {
    if (!quickAddItem.trim()) {
      setQuickAddColumnId(null);
      return;
    }

    const defaultStatus = groupBy === 'status' ? (colId as RentalItem['status']) : 'To Book';
    const defaultSide: EventSide = groupBy === 'side' ? (colId === 'Boy' ? 'Boy' : colId === 'Girl' ? 'Girl' : 'Both') : 'Both';

    const newRentalData: Omit<RentalItem, 'id'> = {
      item: quickAddItem.trim(),
      vendor: quickAddVendor.trim() || 'Vendor',
      phone: '',
      pickupDate: '2027-02-20',
      pickupTime: '08:00 AM',
      dropDate: '2027-02-21',
      dropTime: '05:00 PM',
      pickupLocation: 'Silver Farm, Surat',
      totalCost: 0,
      advancePaid: 0,
      securityDeposit: 0,
      status: defaultStatus,
      side: defaultSide,
      notes: ''
    };

    onAddRental(newRentalData);
    setQuickAddItem('');
    setQuickAddVendor('');
    setQuickAddColumnId(null);
  };

  return (
    <div className="w-full overflow-x-auto pb-4 pt-1 scrollbar-thin">
      <div className="flex gap-4 min-w-[1100px] items-start">
        {columns.map((col) => {
          const colRentals = getRentalsForColumn(col.id);
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
              <div className="p-3.5 border-b border-stone-200/70 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-2 h-2 rounded-full ${col.accentDot} shrink-0`} />
                  <h3 className="font-semibold text-xs tracking-wider text-stone-800 truncate uppercase">
                    {col.label}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${col.badgeClasses}`}>
                    {colRentals.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setQuickAddColumnId(isQuickAdding ? null : col.id);
                    setQuickAddItem('');
                    setQuickAddVendor('');
                  }}
                  className="p-1 text-stone-400 hover:text-stone-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title={`Add rental equipment to ${col.label}`}
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
                      placeholder="Equipment name (e.g. 125 KVA Generator)..."
                      value={quickAddItem}
                      onChange={(e) => setQuickAddItem(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleQuickAddSubmit(col.id);
                        } else if (e.key === 'Escape') {
                          setQuickAddColumnId(null);
                        }
                      }}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] font-medium"
                    />

                    <input
                      type="text"
                      placeholder="Vendor name (e.g. Dhaval Sound)..."
                      value={quickAddVendor}
                      onChange={(e) => setQuickAddVendor(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleQuickAddSubmit(col.id);
                        } else if (e.key === 'Escape') {
                          setQuickAddColumnId(null);
                        }
                      }}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    />

                    <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                      <span className="font-mono text-[10px]">Press Enter ↵ to save</span>
                      <button
                        type="button"
                        onClick={() => handleQuickAddSubmit(col.id)}
                        className="px-3 py-1 bg-stone-900 text-stone-50 rounded-xl text-[11px] font-medium hover:bg-stone-800 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Cards List */}
                {colRentals.length === 0 && !isQuickAdding ? (
                  <div className="h-24 rounded-2xl border border-dashed border-stone-200/80 flex items-center justify-center text-xs text-stone-400 font-medium">
                    Drop rental here
                  </div>
                ) : (
                  colRentals.map((rental) => {
                    const balance = (rental.totalCost || 0) - (rental.advancePaid || 0);
                    const isBoySide = rental.side === 'Boy';
                    const isGirlSide = rental.side === 'Girl';

                    return (
                      <div
                        key={rental.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, rental.id)}
                        className={`bg-white/95 rounded-2xl p-4 border border-stone-200/70 hover:border-[#D4AF37]/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-grab active:cursor-grabbing group space-y-3 ${
                          draggedRentalId === rental.id ? 'opacity-40 scale-95' : ''
                        }`}
                      >
                        {/* Top Metadata Row: Side & Status */}
                        <div className="flex items-center justify-between gap-1.5 text-[11px]">
                          <span
                            className={`px-2 py-0.5 rounded-full font-medium text-[10px] shrink-0 ${
                              isBoySide
                                ? 'bg-[#3B6281]/10 text-[#3B6281] border border-[#3B6281]/20'
                                : isGirlSide
                                ? 'bg-[#A84A5B]/10 text-[#A84A5B] border border-[#A84A5B]/20'
                                : 'bg-[#B89230]/10 text-[#B89230] border border-[#B89230]/20'
                            }`}
                          >
                            {isBoySide ? "👦 Boy's Side" : isGirlSide ? "👧 Girl's Side" : '🤝 Joint / Venue'}
                          </span>

                          <span className="text-[10px] text-stone-400 font-mono shrink-0">
                            {rental.pickupDate}
                          </span>
                        </div>

                        {/* Rental Item Title */}
                        <div>
                          <h4 className="text-sm font-medium text-stone-900 leading-snug group-hover:text-stone-950 transition-colors">
                            {rental.item}
                          </h4>
                          <div className="flex items-center justify-between gap-1.5 mt-1 text-[11px] text-stone-600">
                            <span className="font-medium text-stone-700 truncate">
                              {rental.vendor}
                            </span>
                            {rental.phone && (
                              <a
                                href={`tel:${rental.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 font-mono text-[10px] shrink-0"
                              >
                                <Phone className="w-3 h-3 text-[#B89230]" />
                                <span>{rental.phone}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Timing & Location */}
                        <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] space-y-1 text-slate-600 border border-slate-200/70">
                          <div className="flex items-center gap-1.5 text-slate-700 font-mono text-[10px]">
                            <Clock className="w-3 h-3 text-[#B89230] shrink-0" />
                            <span className="truncate">
                              {rental.pickupTime} → {rental.dropTime}
                            </span>
                          </div>
                          {rental.pickupLocation && (
                            <div className="flex items-center gap-1.5 text-slate-500 truncate text-[11px]">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{rental.pickupLocation}</span>
                            </div>
                          )}
                        </div>

                        {/* Financial Snapshot */}
                        <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/60 font-mono">
                          <div>
                            <span className="font-medium text-slate-900">
                              ₹{(rental.totalCost || 0).toLocaleString('en-IN')}
                            </span>
                            {balance > 0 && (
                              <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200/60 ml-1.5">
                                Due: ₹{balance.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          {(rental.securityDeposit || 0) > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 font-medium flex items-center gap-1 border border-slate-200/70" title="Security deposit">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>₹{(rental.securityDeposit || 0).toLocaleString('en-IN')} dep</span>
                            </span>
                          )}
                        </div>

                        {/* Card Bottom Actions: Status Dropdown & Edit / Delete */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                          {/* Quick Status Dropdown */}
                          <div className="relative">
                            <select
                              value={rental.status}
                              onChange={(e) => {
                                const newSt = e.target.value as RentalItem['status'];
                                onUpdateRental(rental.id, { status: newSt });
                                if (newSt === 'Returned' || newSt === 'Settled') {
                                  confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
                                }
                              }}
                              className="text-[10px] font-medium py-1 pl-2.5 pr-6 bg-slate-50 hover:bg-white border border-slate-200/80 rounded-lg text-slate-800 focus:outline-none cursor-pointer appearance-none transition-colors"
                            >
                              <option value="To Book">To Book</option>
                              <option value="Reserved">Reserved</option>
                              <option value="Picked Up">Picked Up</option>
                              <option value="Returned">Returned</option>
                              <option value="Settled">Settled</option>
                            </select>
                            <ChevronDown className="w-2.5 h-2.5 text-stone-400 absolute right-1.5 top-2 pointer-events-none" />
                          </div>

                          {/* Edit / Delete Buttons */}
                          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => onEditRental(rental)}
                              className="p-1 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit rental booking"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete booking for "${rental.item}"?`)) {
                                  onDeleteRental(rental.id);
                                }
                              }}
                              className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete rental booking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Bottom Add Rental Button inside column */}
                <button
                  type="button"
                  onClick={() => {
                    setQuickAddColumnId(col.id);
                    setQuickAddItem('');
                    setQuickAddVendor('');
                  }}
                  className="w-full py-2 px-2 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-900 hover:bg-white/80 border border-transparent hover:border-stone-200/70 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Equipment</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
