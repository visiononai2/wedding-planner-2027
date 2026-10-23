import React, { useState, useRef } from 'react';
import { 
  Clock, 
  MapPin, 
  Volume2, 
  AlertTriangle, 
  Shirt, 
  Plus, 
  Edit3, 
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical
} from 'lucide-react';
import { EventDaySchedule, ScheduleEvent, WeddingSide, EventSide } from '../types/wedding';
import { EditableText } from './EditableText';

interface EventItineraryProps {
  days: EventDaySchedule[];
  activeSide: WeddingSide;
  onAddScheduleItem: (dayId: string, item: ScheduleEvent) => void;
  onEditScheduleItem: (dayId: string, itemId: string, updates: Partial<ScheduleEvent>) => void;
  onDeleteScheduleItem: (dayId: string, itemId: string) => void;
  onReorderScheduleItems: (dayId: string, fromIndex: number, toIndex: number) => void;
}

export const EventItinerary: React.FC<EventItineraryProps> = ({
  days,
  activeSide,
  onAddScheduleItem,
  onEditScheduleItem,
  onDeleteScheduleItem,
  onReorderScheduleItems
}) => {
  const [selectedDayId, setSelectedDayId] = useState<string>('feb-15');

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

  // Drag-and-drop state
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  // Filter items by side if selected — keep original indices for reorder
  const displayedItems = activeDay.items
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => {
      if (activeSide === 'BOY') {
        return item.side === 'Boy' || item.side === 'Both' || !item.side;
      }
      if (activeSide === 'GIRL') {
        return item.side === 'Girl' || item.side === 'Both' || !item.side;
      }
      return true;
    });

  // Drag-and-drop handlers (operate on original indices in activeDay.items)
  const handleDragStart = (originalIndex: number) => {
    dragIndexRef.current = originalIndex;
  };

  const handleDragOver = (e: React.DragEvent, displayIndex: number) => {
    e.preventDefault();
    setDragOverIndex(displayIndex);
  };

  const handleDrop = (e: React.DragEvent, targetOriginalIndex: number) => {
    e.preventDefault();
    if (dragIndexRef.current === null || dragIndexRef.current === targetOriginalIndex) {
      setDragOverIndex(null);
      return;
    }
    onReorderScheduleItems(selectedDayId, dragIndexRef.current, targetOriginalIndex);
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleMoveUp = (originalIndex: number) => {
    if (originalIndex === 0) return;
    onReorderScheduleItems(selectedDayId, originalIndex, originalIndex - 1);
  };

  const handleMoveDown = (originalIndex: number) => {
    if (originalIndex === activeDay.items.length - 1) return;
    onReorderScheduleItems(selectedDayId, originalIndex, originalIndex + 1);
  };

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
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200/80 flex items-center gap-1">
          <span>👦</span>
          <span>Boy's Side</span>
        </span>
      );
    }
    if (side === 'Girl') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-200/80 flex items-center gap-1">
          <span>👧</span>
          <span>Girl's Side</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200/80 flex items-center gap-1">
        <span>🤝</span>
        <span>Joint / Both Sides</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Day Selector and Actions */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {days.map((d) => {
            const isSelected = selectedDayId === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDayId(d.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border text-left ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">{d.title}</div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {d.dayName} • {d.items.length} cues
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Event Cue
          </button>
        </div>
      </div>

      {/* Critical Reminders Strip tailored to exact user notes */}
      {selectedDayId === 'jan-20' && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-900 flex items-start sm:items-center space-x-2.5 shadow-sm">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            <strong className="text-amber-950 font-bold">POLICE STATION VISIT (20 Jan):</strong> Visit local police station in Surat to submit venue booking and obtain official sound permission/permit for low-decibel DJ music during the Feb 20 Raas Garba celebration.
          </span>
        </div>
      )}

      {selectedDayId === 'feb-15' && (
        <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200/80 text-xs text-blue-900 flex items-start sm:items-center space-x-2.5 shadow-sm">
          <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            <strong className="text-blue-950 font-bold">FINALIZED HOME RITUALS (15 Feb):</strong> 8:00 AM Randel sthapana at Groom home • 10–11 AM Lagan Lakhan at Bride home • 11 AM Bride brothers bring Lagan to Groom home (~100 present, give shagun covers) • 12–1 PM Boy Lunch Jamanvar • 4 PM Boy Haldi Rasam • 6–7 PM Evening Jamanvar (Bride side has more guests).
          </span>
        </div>
      )}

      {selectedDayId === 'feb-16' && (
        <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-200/80 text-xs text-rose-900 flex items-start sm:items-center space-x-2.5 shadow-sm">
          <Clock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            <strong className="text-rose-950 font-bold">RANDAL TEDVA AT GIRL'S HOUSE (16 Feb):</strong> 8:00 AM – 9:00 AM auspicious Randal Tedva sthapana & puja at Bride's house with girl side family and relatives.
          </span>
        </div>
      )}

      {selectedDayId === 'feb-17' && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-900 flex items-start sm:items-center space-x-2.5 shadow-sm">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            <strong className="text-amber-950 font-bold">VANA RASAM & COUPLE PHOTOSESSION (17 Feb):</strong> Sacred Vana Rasam celebrated at Girl's house • Groom is called upon to participate together in the rasam followed by dedicated couple photoshoot session!
          </span>
        </div>
      )}

      {selectedDayId === 'feb-18' && (
        <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 text-xs text-emerald-900 flex items-start sm:items-center space-x-2.5 shadow-sm">
          <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            <strong className="text-emerald-950 font-bold">MEHNDI RASAM & COUPLE PHOTOSHOOT (18 Feb):</strong> Festive Mehndi at Girl's house • Groom is invited with 1-2 close friends for couple photosession with the Bride in her mehndi attire!
          </span>
        </div>
      )}

      {selectedDayId === 'feb-19' && (
        <div className="p-4 rounded-2xl bg-indigo-50/90 border border-indigo-200/80 text-xs text-indigo-900 flex items-start sm:items-center space-x-2.5 shadow-sm">
          <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            <strong className="text-indigo-950 font-bold">MAMERU, CHAB GIVING & SANJI NA GEET (19 Feb):</strong> 11:00 AM Mameru ceremony (Girl side only with maternal uncle Mama & family) • 4:30 PM Chab Giving by Boy's side (Boy side presents decorated Chab gift items to Girl side) • 9:00 PM Sanji Na Geet wedding song night at Girl's house (Girl side guests only).
          </span>
        </div>
      )}

      {selectedDayId === 'feb-20' && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-900 flex items-start sm:items-center space-x-2.5 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            <strong className="text-amber-950 font-bold">MANDVO & GARBA PROTOCOL (20 Feb):</strong> <strong>09:00–11:00 AM Groom Makeup/Prep</strong> • 11 AM–12 PM Bride Parlour • 2 PM Mandvo (Boy side) with reciprocal mandva & Chandlo • <strong>6:00–6:30 PM JOINT JAMANVAR (both sides dine together)</strong> • 8 PM Raas Garba (Stop at 10 PM if police arrives, else rock till 12:00 AM!).
          </span>
        </div>
      )}

      {selectedDayId === 'feb-21' && (
        <div className="p-4 rounded-2xl bg-purple-50/90 border border-purple-200/80 text-xs text-purple-900 flex items-start sm:items-center space-x-2.5 shadow-sm">
          <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            <strong className="text-purple-950 font-bold">WEDDING DAY RUNSHEET (21 Feb):</strong> 8–10 AM Parlour • 10 AM–12 PM Photography • 1–2 PM Lunch • 2:30 PM Boy Touch-up • 3–4 PM Girl Touch-up • 3 PM Boy Home Vidhi • <strong>4:00 PM Girl Departs to Farm</strong> • <strong>4:00 PM Jaan Kadhvani (Reach Farm by 5:30 PM)</strong> • 5:30 PM Welcoming Rituals • 6:30 PM Varmala • 6:30–9:30 PM Guest Jamanvar • <strong>7:30–9:30 PM Lagan (Hastamelap, Kanyadaan, Phera)</strong> • 9:30 PM Couple Dinner • 10 PM Girl Vidhi • <strong>10:30 PM Viday</strong> • <strong>11:00 PM Mandir Darshan</strong> • 11:30 PM Marriage Couple Gruh Pravesh Vidhi.
          </span>
        </div>
      )}

      {/* Schedule Items Table / Cards with Inline Hover-to-Edit Text */}
      <div className="space-y-3">
        {displayedItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200 text-xs text-slate-400">
            No cues match the selected perspective ({activeSide === 'BOY' ? "Boy's Side" : "Girl's Side"}). Switch to "Both Sides" to see all events.
          </div>
        ) : (
          displayedItems.map(({ item, originalIndex }, displayIndex) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(originalIndex)}
              onDragOver={(e) => handleDragOver(e, displayIndex)}
              onDrop={(e) => handleDrop(e, originalIndex)}
              onDragEnd={handleDragEnd}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all space-y-3 ${
                dragOverIndex === displayIndex
                  ? 'border-indigo-400 shadow-md ring-2 ring-indigo-200 scale-[1.01]'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Drag Handle */}
                  <span
                    className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors shrink-0"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-4 h-4" />
                  </span>

                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-900 border border-slate-200 text-xs font-bold font-mono">
                    <EditableText
                      value={item.time}
                      onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { time: val })}
                      className="font-bold text-slate-900"
                    />
                  </span>

                  <EditableText
                    value={item.title}
                    onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { title: val })}
                    className="text-sm sm:text-base font-bold text-slate-900"
                  />

                  {/* Side Tag Badge */}
                  {renderSideBadge(item.side)}

                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                    (
                    <EditableText
                      value={item.gujaratiTitle || ''}
                      placeholder="ગુજરાતી શીર્ષક..."
                      onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { gujaratiTitle: val })}
                      className="text-slate-600"
                    />
                    )
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <div className="text-slate-400 flex items-center mr-2">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <EditableText
                      value={item.location}
                      onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { location: val })}
                      className="text-slate-600 font-medium"
                    />
                  </div>

                  {/* Up / Down reorder buttons */}
                  <div className="flex flex-col border border-slate-200 rounded-lg overflow-hidden shrink-0">
                    <button
                      onClick={() => handleMoveUp(originalIndex)}
                      disabled={originalIndex === 0}
                      title="Move up"
                      className="px-1.5 py-0.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors border-b border-slate-200"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(originalIndex)}
                      disabled={originalIndex === activeDay.items.length - 1}
                      title="Move down"
                      className="px-1.5 py-0.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => setEditingItem({ dayId: selectedDayId, item })}
                    title="Edit full event"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteScheduleItem(selectedDayId, item.id)}
                    title="Delete event"
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Note with Inline Editing */}
              <div className="text-xs text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                <strong className="text-slate-900 mr-1.5 font-semibold">Key Action:</strong>
                <EditableText
                  value={item.actionNotes}
                  multiline
                  onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { actionNotes: val })}
                  className="text-slate-800"
                />
              </div>

              {/* Badges row with Inline Editing */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                {item.soundRig && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200/80 text-[11px] font-medium">
                    <Volume2 className="w-3 h-3 mr-1 text-purple-600" />
                    <EditableText
                      value={item.soundRig}
                      onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { soundRig: val })}
                      className="text-purple-800"
                    />
                  </span>
                )}

                {item.outfitGroom && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80 text-[11px] font-medium">
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
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200/80 text-[11px] font-medium">
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
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200/80 text-[11px] font-semibold">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Cue to {activeDay.title}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleCreateItem} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 04:00 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Side / Family</label>
                  <select
                    value={newSide}
                    onChange={(e) => setNewSide(e.target.value as EventSide)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Both">Joint / Both Sides</option>
                    <option value="Boy">Boy's Side</option>
                    <option value="Girl">Girl's Side</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haldi Rasam at Groom Home"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gujarati Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. હળદી રસમ"
                  value={newGujTitle}
                  onChange={(e) => setNewGujTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Action / Instruction</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Relatives arrive at 4 PM. Haldi vidhi with family."
                  value={newActionNotes}
                  onChange={(e) => setNewActionNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sound Rig Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Base, 2 Top"
                    value={newSoundRig}
                    onChange={(e) => setNewSoundRig(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Groom Outfit Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Haldi Kurta Pajama"
                    value={newOutfitGroom}
                    onChange={(e) => setNewOutfitGroom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Urgent Alert / Rule</label>
                <input
                  type="text"
                  placeholder="e.g. Groom takes 1-2 friends for photo at girl venue"
                  value={newUrgentRule}
                  onChange={(e) => setNewUrgentRule(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-sm transition-colors"
                >
                  Save Cue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Edit Schedule Cue</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-700 text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.item.time}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, time: e.target.value }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Side / Family</label>
                  <select
                    value={editingItem.item.side || 'Both'}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, side: e.target.value as EventSide }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Both">Joint / Both Sides</option>
                    <option value="Boy">Boy's Side</option>
                    <option value="Girl">Girl's Side</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editingItem.item.location}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, location: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editingItem.item.title}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, title: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gujarati Title</label>
                <input
                  type="text"
                  value={editingItem.item.gujaratiTitle || ''}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, gujaratiTitle: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Action Notes</label>
                <textarea
                  rows={2}
                  value={editingItem.item.actionNotes}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, actionNotes: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sound Rig Tag</label>
                  <input
                    type="text"
                    value={editingItem.item.soundRig || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, soundRig: e.target.value }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Groom Outfit Tag</label>
                  <input
                    type="text"
                    value={editingItem.item.outfitGroom || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, outfitGroom: e.target.value }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Urgent Rule / Alert</label>
                <input
                  type="text"
                  value={editingItem.item.urgentRule || ''}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, urgentRule: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingItem(null)} 
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-sm transition-colors"
                >
                  Update Cue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
