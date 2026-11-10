import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Scissors,
  Plus, 
  Trash2, 
  Edit3, 
  Tag, 
  Search,
  Kanban,
  LayoutList,
  SlidersHorizontal
} from 'lucide-react';
import { DressItem, WeddingSide } from '../types/wedding';
import { EditableText } from './EditableText';
import { OutfitsKanbanBoard, OutfitsGroupBy } from './clickup/OutfitsKanbanBoard';

interface DressesTrackerProps {
  dresses: DressItem[];
  activeSide?: WeddingSide;
  onUpdateDress: (id: string, updates: Partial<DressItem>) => void;
  onAddDress: (dress: Omit<DressItem, 'id'>) => void;
  onDeleteDress: (id: string) => void;
}

export const DressesTracker: React.FC<DressesTrackerProps> = ({
  dresses,
  activeSide = 'ALL',
  onUpdateDress,
  onAddDress,
  onDeleteDress
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Kanban View state
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [groupBy, setGroupBy] = useState<OutfitsGroupBy>('status');

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState('Haldi / Pithi Rasam');
  const [newDate, setNewDate] = useState('Feb 20, 2027 09:30 AM');
  const [newPerson, setNewPerson] = useState<'Groom' | 'Bride'>(() => 
    activeSide === 'GIRL' ? 'Bride' : 'Groom'
  );
  const [newGarment, setNewGarment] = useState('');
  const [newTheme, setNewTheme] = useState('');
  const [newAction, setNewAction] = useState<'Buy' | 'Tailor / Stitch' | 'Rent'>('Buy');
  const [newCost, setNewCost] = useState<number>(0);
  const [newAdvance, setNewAdvance] = useState<number>(0);
  const [newStore, setNewStore] = useState('');
  const [newTrialDate, setNewTrialDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Sync new person default with active side
  React.useEffect(() => {
    if (activeSide === 'GIRL') setNewPerson('Bride');
    else if (activeSide === 'BOY') setNewPerson('Groom');
  }, [activeSide]);

  // Edit Modal State
  const [editingDress, setEditingDress] = useState<DressItem | null>(null);

  // Keyboard Escape listener for modals
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAddModalOpen) setIsAddModalOpen(false);
        if (editingDress) setEditingDress(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen, editingDress]);

  // Side-filtered dresses for calculations and display
  const sideFilteredDresses = dresses.filter(d => {
    if (activeSide === 'BOY') return d.person === 'Groom';
    if (activeSide === 'GIRL') return d.person === 'Bride';
    return true;
  });

  const totalCost = sideFilteredDresses.reduce((acc, d) => acc + (d.costEstimated || 0), 0);
  const totalAdvance = sideFilteredDresses.reduce((acc, d) => acc + (d.advancePaid || 0), 0);
  const totalDue = totalCost - totalAdvance;

  const groomCount = dresses.filter(d => d.person === 'Groom').length;
  const groomReady = dresses.filter(d => d.person === 'Groom' && d.status === 'Ready').length;
  const groomPending = groomCount - groomReady;

  const brideCount = dresses.filter(d => d.person === 'Bride').length;
  const brideReady = dresses.filter(d => d.person === 'Bride' && d.status === 'Ready').length;
  const bridePending = brideCount - brideReady;

  const filteredDresses = sideFilteredDresses.filter(d => {
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = d.garmentName.toLowerCase().includes(q) || 
                    d.event.toLowerCase().includes(q) || 
                    d.colorTheme.toLowerCase().includes(q) ||
                    (d.storeOrTailor && d.storeOrTailor.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleCreateDress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGarment.trim()) return;

    onAddDress({
      event: newEvent.trim(),
      date: newDate.trim(),
      person: newPerson,
      garmentName: newGarment.trim(),
      colorTheme: newTheme.trim() || 'Festive theme',
      action: newAction,
      status: 'To Buy',
      trialDate: newTrialDate || undefined,
      costEstimated: Number(newCost) || 0,
      advancePaid: Number(newAdvance) || 0,
      storeOrTailor: newStore.trim(),
      notes: newNotes.trim()
    });

    setNewGarment('');
    setNewTheme('');
    setNewCost(0);
    setNewAdvance(0);
    setNewStore('');
    setNewTrialDate('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDress || !editingDress.garmentName.trim()) return;

    onUpdateDress(editingDress.id, {
      event: editingDress.event.trim(),
      date: editingDress.date.trim(),
      person: editingDress.person,
      garmentName: editingDress.garmentName.trim(),
      colorTheme: editingDress.colorTheme.trim(),
      action: editingDress.action,
      status: editingDress.status,
      trialDate: editingDress.trialDate,
      costEstimated: Number(editingDress.costEstimated) || 0,
      advancePaid: Number(editingDress.advancePaid) || 0,
      storeOrTailor: editingDress.storeOrTailor?.trim(),
      notes: editingDress.notes?.trim()
    });

    setEditingDress(null);
  };

  const getStatusBadge = (status: DressItem['status']) => {
    switch (status) {
      case 'Ready':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50/80 text-emerald-800 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Ready</span>
          </span>
        );
      case 'Trial Done':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#3B6281]/10 text-[#3B6281] border border-[#3B6281]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B6281]" />
            <span>Trial Done</span>
          </span>
        );
      case 'At Tailor':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#A36A36]/10 text-[#A36A36] border border-[#A36A36]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A36A36]" />
            <span>At Tailor</span>
          </span>
        );
      case 'Fabric Bought':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Fabric Bought</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>To Buy</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Numbers Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Total Wardrobe Cost</div>
          <div className="text-xl sm:text-2xl font-normal font-cormorant text-slate-900 mt-1">
            ₹{totalCost.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {sideFilteredDresses.length} {activeSide === 'BOY' ? "Groom" : activeSide === 'GIRL' ? "Bride" : "wedding"} outfits
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Advance Paid</div>
          <div className="text-xl sm:text-2xl font-normal font-cormorant text-emerald-700 mt-1">
            ₹{totalAdvance.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600/90 mt-0.5">Paid to shops & boutiques</div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Balance Pending</div>
          <div className="text-xl sm:text-2xl font-normal font-cormorant text-amber-700 mt-1">
            ₹{totalDue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-amber-600/90 mt-0.5">Pay on delivery & trials</div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Readiness Count</div>
            {activeSide === 'BOY' ? (
              <div className="text-xs font-medium text-slate-800 mt-1.5">
                Parth (Groom): <span className="font-semibold text-emerald-700">{groomReady}</span>/{groomCount} ready ({groomPending} left)
              </div>
            ) : activeSide === 'GIRL' ? (
              <div className="text-xs font-medium text-slate-800 mt-1.5">
                Nisha (Bride): <span className="font-semibold text-emerald-700">{brideReady}</span>/{brideCount} ready ({bridePending} left)
              </div>
            ) : (
              <>
                <div className="text-xs font-medium text-slate-800 mt-1.5">
                  Parth (Groom): <span className="font-semibold text-emerald-700">{groomReady}</span>/{groomCount} ready
                </div>
                <div className="text-xs font-medium text-slate-800 mt-0.5">
                  Nisha (Bride): <span className="font-semibold text-emerald-700">{brideReady}</span>/{brideCount} ready
                </div>
              </>
            )}
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 text-[#B89230]">
            <Scissors className="w-4 h-4 stroke-[1.5]" />
          </div>
        </div>
      </div>

      {/* Toolbar & View Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        {/* Top Controls Row: View Switcher (Board vs List) + Group By */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Switcher */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/70">
              <button
                type="button"
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'board'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Board (Kanban)</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>Cards View</span>
              </button>
            </div>

            {/* Group By selector (only in Board mode) */}
            {viewMode === 'board' && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">Group:</span>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as OutfitsGroupBy)}
                  className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer"
                >
                  <option value="status">By Outfit Status</option>
                  <option value="person">By Person (Groom / Bride)</option>
                  <option value="action">By Action (Buy / Stitch / Rent)</option>
                </select>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all duration-200 hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Outfit
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search dress / event / theme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 w-36 sm:w-56 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="To Buy">To Buy</option>
              <option value="Fabric Bought">Fabric Bought</option>
              <option value="At Tailor">At Tailor</option>
              <option value="Trial Done">Trial Done</option>
              <option value="Ready">Ready</option>
            </select>
          </div>

          <div className="text-slate-500 font-medium text-xs flex items-center gap-1.5 font-mono">
            <span>Showing</span>
            <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] border border-slate-200/60">
              {filteredDresses.length}
            </span>
            <span className="font-sans">{activeSide === 'BOY' ? "Groom" : activeSide === 'GIRL' ? "Bride" : "wedding"} outfits</span>
          </div>
        </div>
      </div>

      {/* Main Wardrobe View: Kanban Board OR Cards Grid */}
      {viewMode === 'board' ? (
        <OutfitsKanbanBoard
          dresses={filteredDresses}
          activeSide={activeSide}
          groupBy={groupBy}
          onUpdateDress={onUpdateDress}
          onAddDress={onAddDress}
          onDeleteDress={onDeleteDress}
          onEditDress={(d) => setEditingDress(d)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDresses.length === 0 ? (
          <div className="md:col-span-2 bg-white/70 rounded-2xl p-10 text-center border border-dashed border-slate-200/80 text-xs text-slate-400">
            No outfits match your filter.
          </div>
        ) : (
          filteredDresses.map((dress) => {
            const balance = dress.costEstimated - dress.advancePaid;
            const isGroom = dress.person === 'Groom';
            return (
              <div 
                key={dress.id}
                className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-slate-200/70 hover:border-[#D4AF37]/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.08)] hover:-translate-y-0.5 transition-all duration-300 space-y-3.5"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium px-2.5 py-0.5 rounded-full text-[10px] ${
                      isGroom ? 'bg-[#3B6281]/10 text-[#3B6281] border border-[#3B6281]/20' : 'bg-[#A84A5B]/10 text-[#A84A5B] border border-[#A84A5B]/20'
                    }`}>
                      {dress.person}
                    </span>
                    <EditableText
                      value={dress.event}
                      onSave={(val) => onUpdateDress(dress.id, { event: val })}
                      className="font-medium text-slate-900"
                    />
                  </div>
                  <EditableText
                    value={dress.date}
                    onSave={(val) => onUpdateDress(dress.id, { date: val })}
                    className="text-[11px] text-slate-400 font-mono"
                  />
                </div>

                {/* Garment Name & Theme */}
                <div>
                  <EditableText
                    value={dress.garmentName}
                    onSave={(val) => onUpdateDress(dress.id, { garmentName: val })}
                    className="text-base sm:text-lg font-cormorant font-medium text-slate-900 block"
                  />
                  <div className="text-xs text-slate-600 font-medium flex items-center mt-1">
                    <Tag className="w-3 h-3 mr-1 text-[#B89230]" />
                    <EditableText
                      value={dress.colorTheme}
                      onSave={(val) => onUpdateDress(dress.id, { colorTheme: val })}
                      className="text-slate-700 font-medium"
                    />
                  </div>
                </div>

                {/* Status & Edit Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/70 text-xs">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(dress.status)}
                    <span className="text-[10px] font-mono text-slate-500">({dress.action})</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <select
                      value={dress.status}
                      onChange={(e) => onUpdateDress(dress.id, { status: e.target.value as any })}
                      className="text-xs bg-white border border-slate-200/80 rounded-lg px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    >
                      <option value="To Buy">To Buy</option>
                      <option value="Fabric Bought">Fabric Bought</option>
                      <option value="At Tailor">At Tailor</option>
                      <option value="Trial Done">Trial Done</option>
                      <option value="Ready">Ready</option>
                    </select>

                    <button
                      onClick={() => setEditingDress(dress)}
                      title="Edit dress parameters"
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteDress(dress.id)}
                      title="Delete dress"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Financials */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 flex items-center">
                      ₹
                      <EditableText
                        type="number"
                        value={dress.costEstimated}
                        onSave={(val) => onUpdateDress(dress.id, { costEstimated: Number(val) || 0 })}
                        className="font-medium text-slate-900"
                      />
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-700 font-medium flex items-center">
                      Paid: ₹
                      <EditableText
                        type="number"
                        value={dress.advancePaid}
                        onSave={(val) => onUpdateDress(dress.id, { advancePaid: Number(val) || 0 })}
                        className="font-medium text-emerald-700"
                      />
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className={`font-medium ${balance > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      Due: ₹{balance.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center">
                    <span>Store:</span>
                    <EditableText
                      value={dress.storeOrTailor || ''}
                      placeholder="add tailor..."
                      onSave={(val) => onUpdateDress(dress.id, { storeOrTailor: val })}
                      className="text-slate-700 ml-1 font-medium"
                    />
                  </div>
                </div>

                {/* Notes & Trial Date Inline */}
                <div className="text-[11px] text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/70 flex flex-wrap justify-between gap-1">
                  <div className="flex items-center">
                    <span className="font-semibold mr-1 text-slate-700">Trial Date:</span>
                    <EditableText
                      value={dress.trialDate || ''}
                      placeholder="set trial date..."
                      onSave={(val) => onUpdateDress(dress.id, { trialDate: val })}
                      className="text-slate-700 font-medium font-mono"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-1 text-slate-700">Note:</span>
                    <EditableText
                      value={dress.notes || ''}
                      placeholder="add note..."
                      onSave={(val) => onUpdateDress(dress.id, { notes: val })}
                      className="text-slate-700 font-medium"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>
      )}

      {/* Add Dress Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-[0_24px_70px_rgba(15,23,42,0.18)] border border-slate-200/90">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/70">
              <h3 className="font-cormorant text-xl font-normal text-slate-900">Add Outfit to Wardrobe</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-800 text-lg leading-none cursor-pointer">&times;</button>
            </div>

            <form onSubmit={handleCreateDress} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">For Whom *</label>
                  <select
                    value={newPerson}
                    onChange={(e) => setNewPerson(e.target.value as any)}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    <option value="Groom">Groom (Parth)</option>
                    <option value="Bride">Bride (Nisha)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">Action Type</label>
                  <select
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value as any)}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    <option value="Buy">Buy Ready-made</option>
                    <option value="Tailor / Stitch">Custom Tailor / Stitch</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">Function / Event</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Haldi / Garba / Lagan"
                    value={newEvent}
                    onChange={(e) => setNewEvent(e.target.value)}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">Date & Time</label>
                  <input
                    type="text"
                    placeholder="e.g. Feb 20, 2027 09:30 AM"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 text-[11px]">Garment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kurta Pajama / Royal Jodhpuri Suit / Lagan Suit / Panetar"
                  value={newGarment}
                  onChange={(e) => setNewGarment(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 text-[11px]">Color / Theme Palette</label>
                <input
                  type="text"
                  placeholder="e.g. Blue, White, Lavender theme"
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    value={newCost || ''}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">Advance Paid (₹)</label>
                  <input
                    type="number"
                    value={newAdvance || ''}
                    onChange={(e) => setNewAdvance(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">Store / Tailor</label>
                  <input
                    type="text"
                    placeholder="Store name / address"
                    value={newStore}
                    onChange={(e) => setNewStore(e.target.value)}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">Trial Date</label>
                  <input
                    type="date"
                    value={newTrialDate}
                    onChange={(e) => setNewTrialDate(e.target.value)}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 text-[11px]">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Fabric bought, lining pending"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-2.5 border-t border-slate-200/70">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-medium rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-50 rounded-xl font-medium text-xs shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Save Dress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Dress Modal */}
      {editingDress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-[0_24px_70px_rgba(15,23,42,0.18)] border border-slate-200/90">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/70">
              <h3 className="font-cormorant text-xl font-normal text-slate-900">Edit Outfit Parameters</h3>
              <button onClick={() => setEditingDress(null)} className="text-slate-400 hover:text-slate-800 text-lg leading-none cursor-pointer">&times;</button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">For Whom *</label>
                  <select
                    value={editingDress.person}
                    onChange={(e) => setEditingDress({ ...editingDress, person: e.target.value as any })}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    <option value="Groom">Groom (Parth)</option>
                    <option value="Bride">Bride (Nisha)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">Action Type</label>
                  <select
                    value={editingDress.action}
                    onChange={(e) => setEditingDress({ ...editingDress, action: e.target.value as any })}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    <option value="Buy">Buy Ready-made</option>
                    <option value="Tailor / Stitch">Custom Tailor / Stitch</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 text-[11px]">Garment Name *</label>
                <input
                  type="text"
                  required
                  value={editingDress.garmentName}
                  onChange={(e) => setEditingDress({ ...editingDress, garmentName: e.target.value })}
                  className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">Function / Event</label>
                  <input
                    type="text"
                    required
                    value={editingDress.event}
                    onChange={(e) => setEditingDress({ ...editingDress, event: e.target.value })}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">Color / Theme</label>
                  <input
                    type="text"
                    value={editingDress.colorTheme}
                    onChange={(e) => setEditingDress({ ...editingDress, colorTheme: e.target.value })}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">Cost (₹)</label>
                  <input
                    type="number"
                    value={editingDress.costEstimated || ''}
                    onChange={(e) => setEditingDress({ ...editingDress, costEstimated: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">Paid (₹)</label>
                  <input
                    type="number"
                    value={editingDress.advancePaid || ''}
                    onChange={(e) => setEditingDress({ ...editingDress, advancePaid: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">Status</label>
                  <select
                    value={editingDress.status}
                    onChange={(e) => setEditingDress({ ...editingDress, status: e.target.value as any })}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    <option value="To Buy">To Buy</option>
                    <option value="Fabric Bought">Fabric Bought</option>
                    <option value="At Tailor">At Tailor</option>
                    <option value="Trial Done">Trial Done</option>
                    <option value="Ready">Ready</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">Store / Tailor</label>
                  <input
                    type="text"
                    value={editingDress.storeOrTailor || ''}
                    onChange={(e) => setEditingDress({ ...editingDress, storeOrTailor: e.target.value })}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">Trial Date</label>
                  <input
                    type="date"
                    value={editingDress.trialDate || ''}
                    onChange={(e) => setEditingDress({ ...editingDress, trialDate: e.target.value })}
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 text-[11px]">Notes</label>
                <input
                  type="text"
                  value={editingDress.notes || ''}
                  onChange={(e) => setEditingDress({ ...editingDress, notes: e.target.value })}
                  className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-2.5 border-t border-slate-200/70">
                <button 
                  type="button" 
                  onClick={() => setEditingDress(null)} 
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-medium rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-50 rounded-xl font-medium text-xs shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Update Dress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
