import React, { useState } from 'react';
import { 
  Truck, 
  Clock, 
  MapPin, 
  Phone, 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw,
  Search
} from 'lucide-react';
import { RentalItem } from '../types/wedding';
import { EditableText } from './EditableText';

interface RentalsTrackerProps {
  rentals: RentalItem[];
  onUpdateRental: (id: string, updates: Partial<RentalItem>) => void;
  onAddRental: (rental: Omit<RentalItem, 'id'>) => void;
  onDeleteRental: (id: string) => void;
}

export const RentalsTracker: React.FC<RentalsTrackerProps> = ({
  rentals,
  onUpdateRental,
  onAddRental,
  onDeleteRental
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [newVendor, setNewVendor] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPickupDate, setNewPickupDate] = useState('2027-02-20');
  const [newPickupTime, setNewPickupTime] = useState('08:00 AM');
  const [newDropDate, setNewDropDate] = useState('2027-02-21');
  const [newDropTime, setNewDropTime] = useState('05:00 PM');
  const [newLocation, setNewLocation] = useState('Silver Farm, Surat');
  const [newCost, setNewCost] = useState<number>(0);
  const [newAdvance, setNewAdvance] = useState<number>(0);
  const [newDeposit, setNewDeposit] = useState<number>(0);
  const [newNotes, setNewNotes] = useState('');

  // Edit Modal State
  const [editingRental, setEditingRental] = useState<RentalItem | null>(null);

  // Keyboard Escape listener for modals
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAddModalOpen) setIsAddModalOpen(false);
        if (editingRental) setEditingRental(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen, editingRental]);

  // Calculations
  const totalCost = rentals.reduce((acc, r) => acc + (r.totalCost || 0), 0);
  const totalAdvance = rentals.reduce((acc, r) => acc + (r.advancePaid || 0), 0);
  const totalDue = totalCost - totalAdvance;
  const totalDeposit = rentals.reduce((acc, r) => acc + (r.securityDeposit || 0), 0);

  const pendingPickups = rentals.filter(r => r.status === 'To Book' || r.status === 'Reserved').length;
  const pickedUpInUse = rentals.filter(r => r.status === 'Picked Up').length;
  const returnedSettled = rentals.filter(r => r.status === 'Returned' || r.status === 'Settled').length;

  const filteredRentals = rentals.filter(r => {
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = r.item.toLowerCase().includes(q) || 
                    r.vendor.toLowerCase().includes(q) || 
                    (r.pickupLocation && r.pickupLocation.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleCreateRental = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    onAddRental({
      item: newItem.trim(),
      vendor: newVendor.trim() || 'Vendor',
      phone: newPhone.trim(),
      pickupDate: newPickupDate,
      pickupTime: newPickupTime,
      dropDate: newDropDate,
      dropTime: newDropTime,
      pickupLocation: newLocation,
      totalCost: Number(newCost) || 0,
      advancePaid: Number(newAdvance) || 0,
      securityDeposit: Number(newDeposit) || 0,
      status: 'Reserved',
      notes: newNotes.trim()
    });

    setNewItem('');
    setNewVendor('');
    setNewPhone('');
    setNewCost(0);
    setNewAdvance(0);
    setNewDeposit(0);
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRental || !editingRental.item.trim()) return;

    onUpdateRental(editingRental.id, {
      item: editingRental.item.trim(),
      vendor: editingRental.vendor.trim(),
      phone: editingRental.phone?.trim(),
      pickupDate: editingRental.pickupDate,
      pickupTime: editingRental.pickupTime,
      dropDate: editingRental.dropDate,
      dropTime: editingRental.dropTime,
      pickupLocation: editingRental.pickupLocation,
      totalCost: Number(editingRental.totalCost) || 0,
      advancePaid: Number(editingRental.advancePaid) || 0,
      securityDeposit: Number(editingRental.securityDeposit) || 0,
      status: editingRental.status,
      notes: editingRental.notes?.trim()
    });

    setEditingRental(null);
  };

  const getStatusBadge = (status: RentalItem['status']) => {
    switch (status) {
      case 'Settled':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">Settled</span>;
      case 'Returned':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">Returned</span>;
      case 'Picked Up':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">In Use</span>;
      case 'Reserved':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">Reserved</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800">To Book</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Financial & Status Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-gray-400">Total Rental Cost</div>
          <div className="text-lg font-bold text-gray-900 mt-0.5">
            ₹{totalCost.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">{rentals.length} items on rent</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-gray-400">Advance Paid</div>
          <div className="text-lg font-bold text-emerald-700 mt-0.5">
            ₹{totalAdvance.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">{returnedSettled} settled / returned</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-gray-400">Balance Remaining</div>
          <div className="text-lg font-bold text-amber-700 mt-0.5">
            ₹{totalDue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-amber-600 mt-0.5">{pendingPickups} pending pickup</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-gray-400">Refundable Deposit</div>
          <div className="text-lg font-bold text-blue-700 mt-0.5">
            ₹{totalDeposit.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-blue-600 mt-0.5">{pickedUpInUse} currently in use</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search rentals / vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1 bg-gray-50 border border-gray-300 rounded text-xs text-gray-900 w-40 sm:w-52 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-800 rounded px-2 py-1"
          >
            <option value="ALL">All Status ({rentals.length})</option>
            <option value="To Book">To Book</option>
            <option value="Reserved">Reserved ({rentals.filter(r => r.status === 'Reserved').length})</option>
            <option value="Picked Up">In Use ({pickedUpInUse})</option>
            <option value="Returned">Returned</option>
            <option value="Settled">Settled ({rentals.filter(r => r.status === 'Settled').length})</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Item to Rent
        </button>
      </div>

      {/* Rentals List */}
      <div className="space-y-3">
        {filteredRentals.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200 text-xs text-gray-500">
            No rental items match your filter.
          </div>
        ) : (
          filteredRentals.map((item) => {
            const balance = item.totalCost - item.advancePaid;
            return (
              <div 
                key={item.id}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition shadow-sm space-y-2.5"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <EditableText
                        value={item.item}
                        onSave={(val) => onUpdateRental(item.id, { item: val })}
                        className="text-sm sm:text-base font-bold text-gray-900"
                      />

                      <div className="text-xs text-gray-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span>Vendor:</span>
                        <EditableText
                          value={item.vendor}
                          onSave={(val) => onUpdateRental(item.id, { vendor: val })}
                          className="font-medium text-gray-800"
                        />
                        <span>•</span>
                        <span>Phone:</span>
                        <EditableText
                          value={item.phone || ''}
                          placeholder="add phone..."
                          onSave={(val) => onUpdateRental(item.id, { phone: val })}
                          className="text-gray-700 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusBadge(item.status)}
                    <select
                      value={item.status}
                      onChange={(e) => onUpdateRental(item.id, { status: e.target.value as any })}
                      className="text-xs bg-gray-50 border border-gray-300 rounded px-2 py-1 text-gray-800"
                    >
                      <option value="To Book">To Book</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Picked Up">In Use</option>
                      <option value="Returned">Returned</option>
                      <option value="Settled">Settled</option>
                    </select>

                    <button
                      onClick={() => setEditingRental(item)}
                      title="Edit rental parameters"
                      className="p-1 text-gray-400 hover:text-gray-700 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteRental(item.id)}
                      title="Delete rental item"
                      className="p-1 text-gray-300 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pickup & Drop Dates Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded-lg text-xs">
                  <div>
                    <div className="flex items-center text-emerald-800 font-bold uppercase tracking-wider text-[10px]">
                      <Clock className="w-3 h-3 mr-1 text-emerald-600" />
                      Pickup / Delivery to Farm:
                    </div>
                    <div className="font-semibold text-gray-900 mt-0.5 flex items-center gap-1">
                      <EditableText
                        value={item.pickupDate}
                        onSave={(val) => onUpdateRental(item.id, { pickupDate: val })}
                        className="text-gray-900 font-semibold"
                      />
                      <span>•</span>
                      <EditableText
                        value={item.pickupTime}
                        onSave={(val) => onUpdateRental(item.id, { pickupTime: val })}
                        className="text-emerald-700 font-semibold"
                      />
                    </div>
                    <div className="text-[11px] text-gray-500 flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                      <EditableText
                        value={item.pickupLocation}
                        onSave={(val) => onUpdateRental(item.id, { pickupLocation: val })}
                        className="text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="sm:border-l sm:border-gray-200 sm:pl-3">
                    <div className="flex items-center text-rose-800 font-bold uppercase tracking-wider text-[10px]">
                      <RotateCcw className="w-3 h-3 mr-1 text-rose-600" />
                      Drop / Return Back By:
                    </div>
                    <div className="font-semibold text-gray-900 mt-0.5 flex items-center gap-1">
                      <EditableText
                        value={item.dropDate}
                        onSave={(val) => onUpdateRental(item.id, { dropDate: val })}
                        className="text-gray-900 font-semibold"
                      />
                      <span>•</span>
                      <EditableText
                        value={item.dropTime}
                        onSave={(val) => onUpdateRental(item.id, { dropTime: val })}
                        className="text-rose-700 font-semibold"
                      />
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Confirm return & collect deposit
                    </div>
                  </div>
                </div>

                {/* Financial Details Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-bold block">Total Rent</span>
                      <span className="text-sm font-bold text-gray-900 flex items-center">
                        ₹
                        <EditableText
                          type="number"
                          value={item.totalCost}
                          onSave={(val) => onUpdateRental(item.id, { totalCost: Number(val) || 0 })}
                          className="font-bold text-gray-900"
                        />
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-bold block">Advance Paid</span>
                      <span className="text-sm font-bold text-emerald-600 flex items-center">
                        ₹
                        <EditableText
                          type="number"
                          value={item.advancePaid}
                          onSave={(val) => onUpdateRental(item.id, { advancePaid: Number(val) || 0 })}
                          className="font-bold text-emerald-600"
                        />
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-bold block">Remaining Due</span>
                      <strong className={`text-sm ${balance > 0 ? 'text-amber-700 font-bold' : 'text-emerald-700'}`}>
                        ₹{balance.toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-bold block">Deposit</span>
                      <span className="text-sm font-bold text-blue-700 flex items-center">
                        ₹
                        <EditableText
                          type="number"
                          value={item.securityDeposit || 0}
                          onSave={(val) => onUpdateRental(item.id, { securityDeposit: Number(val) || 0 })}
                          className="font-bold text-blue-700"
                        />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inline Editable Notes */}
                <div className="text-[11px] text-gray-600 bg-gray-50 px-2.5 py-1 rounded border border-gray-200">
                  <span className="font-bold mr-1 text-gray-700">Note:</span>
                  <EditableText
                    value={item.notes || ''}
                    placeholder="click to add note..."
                    onSave={(val) => onUpdateRental(item.id, { notes: val })}
                    className="text-gray-700"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Add Equipment / Item to Rent</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-700">&times;</button>
            </div>

            <form onSubmit={handleCreateRental} className="mt-3 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DJ Sound Rig / Generator / ICER Truck"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Vendor / Firm</label>
                  <input
                    type="text"
                    placeholder="e.g. Dhaval Jajenwala"
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-emerald-800 mb-1">Pickup Date & Time *</label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="date"
                      value={newPickupDate}
                      onChange={(e) => setNewPickupDate(e.target.value)}
                      className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="08:00 AM"
                      value={newPickupTime}
                      onChange={(e) => setNewPickupTime(e.target.value)}
                      className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-rose-800 mb-1">Drop Date & Time *</label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="date"
                      value={newDropDate}
                      onChange={(e) => setNewDropDate(e.target.value)}
                      className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="05:00 PM"
                      value={newDropTime}
                      onChange={(e) => setNewDropTime(e.target.value)}
                      className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Total Rent (₹)</label>
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
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Deposit (₹)</label>
                  <input
                    type="number"
                    value={newDeposit || ''}
                    onChange={(e) => setNewDeposit(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Pickup / Delivery Location</label>
                <input
                  type="text"
                  placeholder="e.g. Silver Farm / Groom House"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Operator included, check generator wiring"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-gray-200">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3 py-1.5 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-gray-900 text-white rounded font-semibold">Save Rental</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Edit Rental Parameters</h3>
              <button onClick={() => setEditingRental(null)} className="text-gray-400 hover:text-gray-700">&times;</button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-3 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={editingRental.item}
                  onChange={(e) => setEditingRental({ ...editingRental, item: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Vendor / Firm</label>
                  <input
                    type="text"
                    value={editingRental.vendor}
                    onChange={(e) => setEditingRental({ ...editingRental, vendor: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editingRental.phone || ''}
                    onChange={(e) => setEditingRental({ ...editingRental, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-emerald-800 mb-1">Pickup Date & Time</label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="text"
                      value={editingRental.pickupDate}
                      onChange={(e) => setEditingRental({ ...editingRental, pickupDate: e.target.value })}
                      className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                    <input
                      type="text"
                      value={editingRental.pickupTime}
                      onChange={(e) => setEditingRental({ ...editingRental, pickupTime: e.target.value })}
                      className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-rose-800 mb-1">Drop Date & Time</label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="text"
                      value={editingRental.dropDate}
                      onChange={(e) => setEditingRental({ ...editingRental, dropDate: e.target.value })}
                      className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                    <input
                      type="text"
                      value={editingRental.dropTime}
                      onChange={(e) => setEditingRental({ ...editingRental, dropTime: e.target.value })}
                      className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Total Rent (₹)</label>
                  <input
                    type="number"
                    value={editingRental.totalCost || ''}
                    onChange={(e) => setEditingRental({ ...editingRental, totalCost: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Advance Paid (₹)</label>
                  <input
                    type="number"
                    value={editingRental.advancePaid || ''}
                    onChange={(e) => setEditingRental({ ...editingRental, advancePaid: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Deposit (₹)</label>
                  <input
                    type="number"
                    value={editingRental.securityDeposit || ''}
                    onChange={(e) => setEditingRental({ ...editingRental, securityDeposit: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={editingRental.status}
                    onChange={(e) => setEditingRental({ ...editingRental, status: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1.5"
                  >
                    <option value="To Book">To Book</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Picked Up">In Use</option>
                    <option value="Returned">Returned</option>
                    <option value="Settled">Settled</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingRental.pickupLocation}
                    onChange={(e) => setEditingRental({ ...editingRental, pickupLocation: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={editingRental.notes || ''}
                  onChange={(e) => setEditingRental({ ...editingRental, notes: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-gray-200">
                <button type="button" onClick={() => setEditingRental(null)} className="px-3 py-1.5 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-gray-900 text-white rounded font-semibold">Update Rental</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
