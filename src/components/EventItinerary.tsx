import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Volume2, 
  AlertTriangle, 
  Printer, 
  Shirt, 
  Plus, 
  Edit3, 
  Trash2,
  Users
} from 'lucide-react';
import { EventDaySchedule, ScheduleEvent, WeddingSide, EventSide } from '../types/wedding';
import { EditableText } from './EditableText';

interface EventItineraryProps {
  days: EventDaySchedule[];
  activeSide: WeddingSide;
  onAddScheduleItem: (dayId: string, item: ScheduleEvent) => void;
  onEditScheduleItem: (dayId: string, itemId: string, updates: Partial<ScheduleEvent>) => void;
  onDeleteScheduleItem: (dayId: string, itemId: string) => void;
}

export const EventItinerary: React.FC<EventItineraryProps> = ({
  days,
  activeSide,
  onAddScheduleItem,
  onEditScheduleItem,
  onDeleteScheduleItem
}) => {
  const [selectedDayId, setSelectedDayId] = useState<string>('feb-18');

  // Add Item Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newGujTitle, setNewGujTitle] = useState('');
  const [newLocation, setNewLocation] = useState('Silver Farm, Surat');
  const [newActionNotes, setNewActionNotes] = useState('');
  const [newSide, setNewSide] = useState<EventSide>('Both');
  const [newSoundRig, setNewSoundRig] = useState('');
  const [newOutfitGroom, setNewOutfitGroom] = useState('');
  const [newUrgentRule, setNewUrgentRule] = useState('');

  // Edit Item Modal
  const [editingItem, setEditingItem] = useState<{ dayId: string; item: ScheduleEvent } | null>(null);

  // Keyboard Escape listener for modals
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAddModalOpen) setIsAddModalOpen(false);
        if (editingItem) setEditingItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen, editingItem]);

  const activeDay = days.find(d => d.id === selectedDayId) || days[0];

  // Filter items by side if selected
  const displayedItems = activeDay.items.filter(item => {
    if (activeSide === 'BOY') {
      return item.side === 'Boy' || item.side === 'Both' || !item.side;
    }
    if (activeSide === 'GIRL') {
      return item.side === 'Girl' || item.side === 'Both' || !item.side;
    }
    return true;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime.trim() || !newTitle.trim()) return;

    onAddScheduleItem(selectedDayId, {
      id: `s-${Date.now()}`,
      time: newTime.trim(),
      title: newTitle.trim(),
      gujaratiTitle: newGujTitle.trim() || undefined,
      location: newLocation.trim(),
      actionNotes: newActionNotes.trim() || newTitle.trim(),
      side: newSide,
      soundRig: newSoundRig.trim() || undefined,
      outfitGroom: newOutfitGroom.trim() || undefined,
      urgentRule: newUrgentRule.trim() || undefined
    });

    setNewTime('');
    setNewTitle('');
    setNewGujTitle('');
    setNewActionNotes('');
    setNewSide('Both');
    setNewSoundRig('');
    setNewOutfitGroom('');
    setNewUrgentRule('');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.item.title.trim()) return;

    onEditScheduleItem(editingItem.dayId, editingItem.item.id, {
      time: editingItem.item.time.trim(),
      title: editingItem.item.title.trim(),
      gujaratiTitle: editingItem.item.gujaratiTitle?.trim() || undefined,
      location: editingItem.item.location.trim(),
      actionNotes: editingItem.item.actionNotes.trim(),
      side: editingItem.item.side || 'Both',
      soundRig: editingItem.item.soundRig?.trim() || undefined,
      outfitGroom: editingItem.item.outfitGroom?.trim() || undefined,
      urgentRule: editingItem.item.urgentRule?.trim() || undefined
    });

    setEditingItem(null);
  };

  const renderSideBadge = (side?: EventSide) => {
    if (side === 'Boy') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1">
          <span>👦</span>
          <span>Boy's Side</span>
        </span>
      );
    }
    if (side === 'Girl') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-200 flex items-center gap-1">
          <span>👧</span>
          <span>Girl's Side</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1">
        <span>🤝</span>
        <span>Joint / Both Sides</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Day Selector and Actions */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {days.map((d) => {
            const isSelected = selectedDayId === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDayId(d.id)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition border ${
                  isSelected
                    ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div>{d.title}</div>
                <div className={`text-[10px] ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                  {d.dayName} • {d.items.length} cues
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5 mr-1 text-gray-500" />
            Print Day
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Event Cue
          </button>
        </div>
      </div>

      {/* Critical Reminders Strip tailored to exact user notes */}
      {selectedDayId === 'feb-18' && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>HOME RITUALS (18 Feb):</strong> 8:00 AM Randel sthapana at Groom home • 10–11 AM Lagan Lakhan at Bride home • 11 AM Bride brothers bring Lagan to Groom home (~100 present) • 12–1 PM Boy Lunch • 4 PM Boy Haldi & Groom photo visit to Girl Mehndi • 6–7 PM Evening Jamanvar. <em>(Note: Couple pre-wedding shoot is planned separately in Nov/Dec as a 2–3 day national or 1-week international trip).</em>
          </span>
        </div>
      )}

      {selectedDayId === 'feb-20' && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>MANDVO & GARBA PROTOCOL (20 Feb):</strong> 11 AM–12 PM Bride Parlour • 2 PM Mandvo (Boy side) with reciprocal mandva & Chandlo • <strong>6:00–6:30 PM JOINT JAMANVAR (both sides dine together)</strong> • 8 PM Raas Garba (Stop at 10 PM if police arrives, else rock till 12:00 AM!).
          </span>
        </div>
      )}

      {selectedDayId === 'feb-21' && (
        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-purple-600 shrink-0" />
          <span>
            <strong>AFTERNOON JAAN & LAGAN PROTOCOL (21 Feb):</strong> <strong>04:00 PM Afternoon Jaan departure</strong> on ICER truck to Katargam (1 km from farm) • 5:30 PM Grand Entry • 6:30 PM Mandap ma besi javanu • Lagan completes around 12:00 AM midnight ➔ <strong>Newlywed couple visits holy temple (Mandir) together!</strong>
          </span>
        </div>
      )}

      {/* Schedule Items Table / Cards with Inline Hover-to-Edit Text */}
      <div className="space-y-2.5">
        {displayedItems.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200 text-xs text-gray-500">
            No cues match the selected perspective ({activeSide === 'BOY' ? "Boy's Side" : "Girl's Side"}). Switch to "Both Sides" to see all events.
          </div>
        ) : (
          displayedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-3.5 sm:p-4 border border-gray-200 hover:border-gray-300 transition shadow-sm space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-gray-100 text-gray-900 border border-gray-200 text-xs font-bold flex items-center">
                    <EditableText
                      value={item.time}
                      onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { time: val })}
                      className="font-bold text-gray-900"
                    />
                  </span>

                  <EditableText
                    value={item.title}
                    onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { title: val })}
                    className="text-sm sm:text-base font-bold text-gray-900"
                  />

                  {/* Side Tag Badge */}
                  {renderSideBadge(item.side)}

                  <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                    (
                    <EditableText
                      value={item.gujaratiTitle || ''}
                      placeholder="ગુજરાતી શીર્ષક..."
                      onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { gujaratiTitle: val })}
                      className="text-gray-600"
                    />
                    )
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <div className="text-gray-400 flex items-center mr-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <EditableText
                      value={item.location}
                      onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { location: val })}
                      className="text-gray-600"
                    />
                  </div>

                  <button
                    onClick={() => setEditingItem({ dayId: selectedDayId, item })}
                    title="Edit full event"
                    className="p-1 text-gray-400 hover:text-gray-900 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteScheduleItem(selectedDayId, item.id)}
                    title="Delete event"
                    className="p-1 text-gray-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Note with Inline Editing */}
              <div className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                <strong className="text-gray-900 mr-1 font-semibold">Key Action:</strong>
                <EditableText
                  value={item.actionNotes}
                  multiline
                  onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { actionNotes: val })}
                  className="text-gray-800"
                />
              </div>

              {/* Badges row with Inline Editing */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {item.soundRig && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 text-[11px] font-medium">
                    <Volume2 className="w-3 h-3 mr-1 text-purple-600" />
                    <EditableText
                      value={item.soundRig}
                      onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { soundRig: val })}
                      className="text-purple-800"
                    />
                  </span>
                )}

                {item.outfitGroom && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-medium">
                    <Shirt className="w-3 h-3 mr-1 text-blue-600" />
                    <span className="mr-1">Groom:</span>
                    <EditableText
                      value={item.outfitGroom}
                      onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { outfitGroom: val })}
                      className="text-blue-800"
                    />
                  </span>
                )}

                {item.outfitBride && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-medium">
                    <Shirt className="w-3 h-3 mr-1 text-rose-600" />
                    <span className="mr-1">Bride:</span>
                    <EditableText
                      value={item.outfitBride}
                      onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { outfitBride: val })}
                      className="text-rose-800"
                    />
                  </span>
                )}

                {item.urgentRule && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-semibold">
                    ⚠️
                    <EditableText
                      value={item.urgentRule}
                      onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { urgentRule: val })}
                      className="text-rose-800 ml-1"
                    />
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Add Cue to {activeDay.title}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-lg">&times;</button>
            </div>

            <form onSubmit={handleCreateItem} className="mt-3 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 04:00 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Side / Family</label>
                  <select
                    value={newSide}
                    onChange={(e) => setNewSide(e.target.value as EventSide)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    <option value="Both">Joint / Both Sides</option>
                    <option value="Boy">Boy's Side</option>
                    <option value="Girl">Girl's Side</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Title (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haldi Rasam at Groom Home"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Gujarati Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. હળદી રસમ"
                  value={newGujTitle}
                  onChange={(e) => setNewGujTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Key Action / Instruction</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Relatives arrive at 4 PM. Haldi vidhi with family."
                  value={newActionNotes}
                  onChange={(e) => setNewActionNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sound Rig Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Base, 2 Top"
                    value={newSoundRig}
                    onChange={(e) => setNewSoundRig(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Groom Outfit Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Haldi Kurta Pajama"
                    value={newOutfitGroom}
                    onChange={(e) => setNewOutfitGroom(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Urgent Alert / Rule</label>
                <input
                  type="text"
                  placeholder="e.g. Groom takes 1-2 friends for photo at girl venue"
                  value={newUrgentRule}
                  onChange={(e) => setNewUrgentRule(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-gray-200">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-gray-900 text-white rounded font-semibold hover:bg-black">Save Cue</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Edit Schedule Cue</h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-700 text-lg">&times;</button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-3 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.item.time}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, time: e.target.value }
                    })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Side / Family</label>
                  <select
                    value={editingItem.item.side || 'Both'}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, side: e.target.value as EventSide }
                    })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    <option value="Both">Joint / Both Sides</option>
                    <option value="Boy">Boy's Side</option>
                    <option value="Girl">Girl's Side</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editingItem.item.location}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, location: e.target.value }
                  })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editingItem.item.title}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, title: e.target.value }
                  })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Gujarati Title</label>
                <input
                  type="text"
                  value={editingItem.item.gujaratiTitle || ''}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, gujaratiTitle: e.target.value }
                  })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Action Notes</label>
                <textarea
                  rows={2}
                  value={editingItem.item.actionNotes}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, actionNotes: e.target.value }
                  })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sound Rig Tag</label>
                  <input
                    type="text"
                    value={editingItem.item.soundRig || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, soundRig: e.target.value }
                    })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Groom Outfit Tag</label>
                  <input
                    type="text"
                    value={editingItem.item.outfitGroom || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, outfitGroom: e.target.value }
                    })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Urgent Rule / Alert</label>
                <input
                  type="text"
                  value={editingItem.item.urgentRule || ''}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, urgentRule: e.target.value }
                  })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-gray-200">
                <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-gray-900 text-white rounded font-semibold hover:bg-black">Update Cue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
