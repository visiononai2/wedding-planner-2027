import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Scissors, 
  Plus, 
  Trash2, 
  Edit3, 
  Tag, 
  Search
} from 'lucide-react';
import { DressItem } from '../types/wedding';
import { EditableText } from './EditableText';

interface DressesTrackerProps {
  dresses: DressItem[];
  onUpdateDress: (id: string, updates: Partial<DressItem>) => void;
  onAddDress: (dress: Omit<DressItem, 'id'>) => void;
  onDeleteDress: (id: string) => void;
}

export const DressesTracker: React.FC<DressesTrackerProps> = ({
  dresses,
  onUpdateDress,
  onAddDress,
  onDeleteDress
}) => {
  const [personFilter, setPersonFilter] = useState<'ALL' | 'Groom' | 'Bride'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState('Haldi / Pithi Rasam');
  const [newDate, setNewDate] = useState('Feb 20, 2027 09:30 AM');
  const [newPerson, setNewPerson] = useState<'Groom' | 'Bride'>('Groom');
  const [newGarment, setNewGarment] = useState('');
  const [newTheme, setNewTheme] = useState('');
  const [newAction, setNewAction] = useState<'Buy' | 'Tailor / Stitch' | 'Rent'>('Buy');
  const [newCost, setNewCost] = useState<number>(0);
  const [newAdvance, setNewAdvance] = useState<number>(0);
  const [newStore, setNewStore] = useState('');
  const [newTrialDate, setNewTrialDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Edit Modal State
  const [editingDress, setEditingDress] = useState<DressItem | null>(null);

  // Calculations
  const totalCost = dresses.reduce((acc, d) => acc + (d.costEstimated || 0), 0);
  const totalAdvance = dresses.reduce((acc, d) => acc + (d.advancePaid || 0), 0);
  const totalDue = totalCost - totalAdvance;

  const groomCount = dresses.filter(d => d.person === 'Groom').length;
  const groomReady = dresses.filter(d => d.person === 'Groom' && d.status === 'Ready').length;
  const groomPending = groomCount - groomReady;

  const brideCount = dresses.filter(d => d.person === 'Bride').length;
  const brideReady = dresses.filter(d => d.person === 'Bride' && d.status === 'Ready').length;
  const bridePending = brideCount - brideReady;

  const filteredDresses = dresses.filter(d => {
    if (personFilter !== 'ALL' && d.person !== personFilter) return false;
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
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">Ready</span>;
      case 'Trial Done':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">Trial Done</span>;
      case 'At Tailor':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800">At Tailor</span>;
      case 'Fabric Bought':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">Fabric Bought</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">To Buy</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Numbers Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-gray-400">Total Wardrobe Cost</div>
          <div className="text-lg font-bold text-gray-900 mt-0.5">
            ₹{totalCost.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">{dresses.length} total wedding outfits</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-gray-400">Advance Paid</div>
          <div className="text-lg font-bold text-emerald-700 mt-0.5">
            ₹{totalAdvance.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Paid to shops / tailors</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-gray-400">Balance Pending</div>
          <div className="text-lg font-bold text-amber-700 mt-0.5">
            ₹{totalDue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-amber-600 mt-0.5">Pay on delivery/trials</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-400">Readiness Count</div>
            <div className="text-xs font-semibold text-gray-800 mt-0.5">
              Groom: {groomReady}/{groomCount} ready ({groomPending} left)
            </div>
            <div className="text-xs font-semibold text-gray-800">
              Bride: {brideReady}/{brideCount} ready ({bridePending} left)
            </div>
          </div>
          <Scissors className="w-5 h-5 text-gray-400 shrink-0" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search dress / event / theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1 bg-gray-50 border border-gray-300 rounded text-xs text-gray-900 w-36 sm:w-48 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div className="flex items-center space-x-1 bg-gray-100 p-0.5 rounded-lg">
            <button
              onClick={() => setPersonFilter('ALL')}
              className={`px-2.5 py-1 rounded text-xs transition ${personFilter === 'ALL' ? 'bg-white font-bold shadow text-gray-900' : 'text-gray-600'}`}
            >
              All ({dresses.length})
            </button>
            <button
              onClick={() => setPersonFilter('Groom')}
              className={`px-2.5 py-1 rounded text-xs transition ${personFilter === 'Groom' ? 'bg-gray-900 text-white font-bold shadow' : 'text-gray-600'}`}
            >
              Groom ({groomCount})
            </button>
            <button
              onClick={() => setPersonFilter('Bride')}
              className={`px-2.5 py-1 rounded text-xs transition ${personFilter === 'Bride' ? 'bg-gray-900 text-white font-bold shadow' : 'text-gray-600'}`}
            >
              Bride ({brideCount})
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-gray-800"
          >
            <option value="ALL">All Status</option>
            <option value="To Buy">To Buy</option>
            <option value="Fabric Bought">Fabric Bought</option>
            <option value="At Tailor">At Tailor</option>
            <option value="Trial Done">Trial Done</option>
            <option value="Ready">Ready</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Dress
        </button>
      </div>

      {/* Dresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredDresses.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-xl p-8 text-center border border-gray-200 text-xs text-gray-500">
            No outfits match your filter.
          </div>
        ) : (
          filteredDresses.map((dress) => {
            const balance = dress.costEstimated - dress.advancePaid;
            const isGroom = dress.person === 'Groom';
            return (
              <div 
                key={dress.id}
                className="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-gray-300 transition shadow-sm space-y-2"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold px-2 py-0.2 rounded text-[10px] bg-gray-100 text-gray-800">
                      {dress.person}
                    </span>
                    <EditableText
                      value={dress.event}
                      onSave={(val) => onUpdateDress(dress.id, { event: val })}
                      className="font-bold text-gray-900"
                    />
                  </div>
                  <EditableText
                    value={dress.date}
                    onSave={(val) => onUpdateDress(dress.id, { date: val })}
                    className="text-[11px] text-gray-400 font-medium"
                  />
                </div>

                {/* Garment Name & Theme */}
                <div>
                  <EditableText
                    value={dress.garmentName}
                    onSave={(val) => onUpdateDress(dress.id, { garmentName: val })}
                    className="text-sm sm:text-base font-bold text-gray-900"
                  />
                  <div className="text-xs text-gray-600 font-medium flex items-center mt-0.5">
                    <Tag className="w-3 h-3 mr-1 text-gray-400" />
                    <EditableText
                      value={dress.colorTheme}
                      onSave={(val) => onUpdateDress(dress.id, { colorTheme: val })}
                      className="text-gray-700 font-medium"
                    />
                  </div>
                </div>

                {/* Status & Edit Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 p-2 rounded-lg text-xs">
                  <div className="flex items-center space-x-1.5">
                    {getStatusBadge(dress.status)}
                    <span className="text-[10px] text-gray-500">({dress.action})</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <select
                      value={dress.status}
                      onChange={(e) => onUpdateDress(dress.id, { status: e.target.value as any })}
                      className="text-xs bg-white border border-gray-300 rounded px-2 py-0.5 text-gray-800"
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
                      className="p-1 text-gray-400 hover:text-gray-700 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteDress(dress.id)}
                      title="Delete dress"
                      className="p-1 text-gray-300 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Financials */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-900 flex items-center">
                      ₹
                      <EditableText
                        type="number"
                        value={dress.costEstimated}
                        onSave={(val) => onUpdateDress(dress.id, { costEstimated: Number(val) || 0 })}
                        className="font-semibold text-gray-900"
                      />
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold flex items-center">
                      Paid: ₹
                      <EditableText
                        type="number"
                        value={dress.advancePaid}
                        onSave={(val) => onUpdateDress(dress.id, { advancePaid: Number(val) || 0 })}
                        className="font-semibold text-emerald-600"
                      />
                    </span>
                    <span>•</span>
                    <span className={`font-semibold ${balance > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      Due: ₹{balance.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-500 flex items-center">
                    <span>Store:</span>
                    <EditableText
                      value={dress.storeOrTailor || ''}
                      placeholder="add tailor..."
                      onSave={(val) => onUpdateDress(dress.id, { storeOrTailor: val })}
                      className="text-gray-700 ml-1 font-medium"
                    />
                  </div>
                </div>

                {/* Notes & Trial Date Inline */}
                <div className="text-[11px] text-gray-500 bg-gray-50 p-1.5 rounded border border-gray-200 flex flex-wrap justify-between gap-1">
                  <div className="flex items-center">
                    <span className="font-bold mr-1 text-gray-700">Trial Date:</span>
                    <EditableText
                      value={dress.trialDate || ''}
                      placeholder="set trial date..."
                      onSave={(val) => onUpdateDress(dress.id, { trialDate: val })}
                      className="text-gray-700"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-1 text-gray-700">Note:</span>
                    <EditableText
                      value={dress.notes || ''}
                      placeholder="add note..."
                      onSave={(val) => onUpdateDress(dress.id, { notes: val })}
                      className="text-gray-700"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Dress Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Add Dress / Outfit to Tracker</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-700">&times;</button>
            </div>

            <form onSubmit={handleCreateDress} className="mt-3 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">For Whom *</label>
                  <select
                    value={newPerson}
                    onChange={(e) => setNewPerson(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  >
                    <option value="Groom">Groom</option>
                    <option value="Bride">Bride</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Action Type</label>
                  <select
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  >
                    <option value="Buy">Buy Ready-made</option>
                    <option value="Tailor / Stitch">Custom Tailor / Stitch</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Function / Event</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Haldi / Garba / Lagan"
                    value={newEvent}
                    onChange={(e) => setNewEvent(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Date & Time</label>
                  <input
                    type="text"
                    placeholder="e.g. Feb 20, 2027 09:30 AM"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Garment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kurta Pajama / Royal Jodhpuri Suit / Lagan Suit / Panetar"
                  value={newGarment}
                  onChange={(e) => setNewGarment(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Color / Theme Palette</label>
                <input
                  type="text"
                  placeholder="e.g. Blue, White, Lavender theme"
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    value={newCost || ''}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Advance Paid (₹)</label>
                  <input
                    type="number"
                    value={newAdvance || ''}
                    onChange={(e) => setNewAdvance(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Store / Tailor</label>
                  <input
                    type="text"
                    placeholder="Store name / address"
                    value={newStore}
                    onChange={(e) => setNewStore(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Trial Date</label>
                  <input
                    type="date"
                    value={newTrialDate}
                    onChange={(e) => setNewTrialDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Fabric bought, lining pending"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-gray-200">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3 py-1.5 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-gray-900 text-white rounded font-semibold">Save Dress</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Dress Modal */}
      {editingDress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Edit Dress Parameters</h3>
              <button onClick={() => setEditingDress(null)} className="text-gray-400 hover:text-gray-700">&times;</button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-3 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">For Whom *</label>
                  <select
                    value={editingDress.person}
                    onChange={(e) => setEditingDress({ ...editingDress, person: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  >
                    <option value="Groom">Groom</option>
                    <option value="Bride">Bride</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Action Type</label>
                  <select
                    value={editingDress.action}
                    onChange={(e) => setEditingDress({ ...editingDress, action: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  >
                    <option value="Buy">Buy Ready-made</option>
                    <option value="Tailor / Stitch">Custom Tailor / Stitch</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Garment Name *</label>
                <input
                  type="text"
                  required
                  value={editingDress.garmentName}
                  onChange={(e) => setEditingDress({ ...editingDress, garmentName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Function / Event</label>
                  <input
                    type="text"
                    required
                    value={editingDress.event}
                    onChange={(e) => setEditingDress({ ...editingDress, event: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Color / Theme</label>
                  <input
                    type="text"
                    value={editingDress.colorTheme}
                    onChange={(e) => setEditingDress({ ...editingDress, colorTheme: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Cost (₹)</label>
                  <input
                    type="number"
                    value={editingDress.costEstimated || ''}
                    onChange={(e) => setEditingDress({ ...editingDress, costEstimated: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Paid (₹)</label>
                  <input
                    type="number"
                    value={editingDress.advancePaid || ''}
                    onChange={(e) => setEditingDress({ ...editingDress, advancePaid: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={editingDress.status}
                    onChange={(e) => setEditingDress({ ...editingDress, status: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  >
                    <option value="To Buy">To Buy</option>
                    <option value="Fabric Bought">Fabric Bought</option>
                    <option value="At Tailor">At Tailor</option>
                    <option value="Trial Done">Trial Done</option>
                    <option value="Ready">Ready</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Store / Tailor</label>
                  <input
                    type="text"
                    value={editingDress.storeOrTailor || ''}
                    onChange={(e) => setEditingDress({ ...editingDress, storeOrTailor: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Trial Date</label>
                  <input
                    type="date"
                    value={editingDress.trialDate || ''}
                    onChange={(e) => setEditingDress({ ...editingDress, trialDate: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={editingDress.notes || ''}
                  onChange={(e) => setEditingDress({ ...editingDress, notes: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-gray-200">
                <button type="button" onClick={() => setEditingDress(null)} className="px-3 py-1.5 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-gray-900 text-white rounded font-semibold">Update Dress</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
