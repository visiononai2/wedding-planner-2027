import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Shirt, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Calendar,
  Users,
  Sparkles
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
  resetEventSignal?: number;
}

function parseDayDetails(d: EventDaySchedule, index: number) {
  const parts = d.dayName.split('/');
  const weekday = parts[0]?.trim() || '';
  const dateStr = parts[1]?.trim() || '';
  const dateParts = dateStr.split(' ');
  const dayNum = dateParts[0] || `${15 + index}`;
  const month = dateParts[1] || 'Feb';

  const boyCount = d.items.filter(i => i.side === 'Boy').length;
  const girlCount = d.items.filter(i => i.side === 'Girl').length;
  const jointCount = d.items.filter(i => i.side === 'Both' || !i.side).length;

  return {
    dayNumber: index + 1,
    weekday,
    shortWeekday: weekday.slice(0, 3).toUpperCase(),
    dayNum,
    month,
    boyCount,
    girlCount,
    jointCount,
    totalCues: d.items.length
  };
}

export const EventItinerary: React.FC<EventItineraryProps> = ({
  days,
  activeSide,
  onAddScheduleItem,
  onEditScheduleItem,
  onDeleteScheduleItem,
  onReorderScheduleItems,
  resetEventSignal
}) => {
  // Always default to the first event/day in the itinerary
  const [selectedDayId, setSelectedDayId] = useState<string>(() => days[0]?.id || 'feb-15');

  // When event schedule tab is selected, show the first event
  useEffect(() => {
    if (resetEventSignal !== undefined && resetEventSignal > 0) {
      if (days.length > 0) {
        setSelectedDayId(days[0].id);
      }
    }
  }, [resetEventSignal, days]);

  // Ensure selectedDayId always points to a valid day
  useEffect(() => {
    if (days.length > 0 && !days.some(d => d.id === selectedDayId)) {
      setSelectedDayId(days[0].id);
    }
  }, [days, selectedDayId]);

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
  const [newOutfitBride, setNewOutfitBride] = useState('');
  const [newUrgentRule, setNewUrgentRule] = useState('');

  // Edit Item Modal
  const [editingItem, setEditingItem] = useState<{ dayId: string; item: ScheduleEvent } | null>(null);

  // Keyboard Escape and Arrow Navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputActive = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable;

      if (e.key === 'Escape') {
        if (isAddModalOpen) setIsAddModalOpen(false);
        if (editingItem) setEditingItem(null);
        return;
      }

      if (isInputActive || isAddModalOpen || editingItem !== null) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        const activeIdx = days.findIndex(d => d.id === selectedDayId);
        if (activeIdx > 0) {
          setSelectedDayId(days[activeIdx - 1].id);
        }
      } else if (e.key === 'ArrowRight') {
        const activeIdx = days.findIndex(d => d.id === selectedDayId);
        if (activeIdx < days.length - 1) {
          setSelectedDayId(days[activeIdx + 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [days, selectedDayId, isAddModalOpen, editingItem]);

  const activeDay = days.find(d => d.id === selectedDayId) || days[0];

  const totalWeekCues = useMemo(() => {
    return days.reduce((sum, d) => sum + d.items.length, 0);
  }, [days]);

  // Filter items by side if selected — keep original indices for reorder
  const displayedItems = useMemo(() => {
    return activeDay.items
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ item }) => {
        if (activeSide === 'BOY') {
          return item.side === 'Boy' || item.side === 'Both' || !item.side;
        }
        if (activeSide === 'GIRL') {
          return item.side === 'Girl' || item.side === 'Both' || !item.side;
        }
        if (activeSide === 'FAMILY') {
          return item.side === 'Both' || !item.side;
        }
        return true;
      });
  }, [activeDay.items, activeSide]);

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
      outfitBride: newOutfitBride.trim() || undefined,
      urgentRule: newUrgentRule.trim() || undefined
    });

    setNewTime('');
    setNewTitle('');
    setNewGujTitle('');
    setNewActionNotes('');
    setNewSide('Both');
    setNewSoundRig('');
    setNewOutfitGroom('');
    setNewOutfitBride('');
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
      outfitBride: editingItem.item.outfitBride?.trim() || undefined,
      urgentRule: editingItem.item.urgentRule?.trim() || undefined
    });

    setEditingItem(null);
  };

  const renderSideBadge = (side?: EventSide) => {
    if (side === 'Boy') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
          <span>👦</span>
          <span>Boy's Side</span>
        </span>
      );
    }
    if (side === 'Girl') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
          <span>👧</span>
          <span>Girl's Side</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
        <span>🤝</span>
        <span>Joint / Both Sides</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Unified Event Schedule Master Hub (7-Day Journey Ribbon + Cues Table) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Navigation strip header & 7-Day Ribbon */}
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-4 bg-slate-50/30">
          {/* Navigation strip header */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B89230] animate-pulse" />
              <span className="text-xs sm:text-sm font-serif font-bold tracking-wider uppercase text-slate-900">
                Vivah Saptah • 7-Day Wedding Journey
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                (Feb 15 – Feb 21, 2027)
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 font-semibold">
                {totalWeekCues} Total Cues
              </span>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-xl text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Event Cue
              </button>
            </div>
          </div>

          {/* 7-Day Grid Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {days.map((d, index) => {
              const isSelected = selectedDayId === d.id;
              const details = parseDayDetails(d, index);

              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDayId(d.id)}
                  className={`group relative text-left p-3.5 rounded-xl transition-all duration-200 border flex flex-col justify-between cursor-pointer ${
                    index === 6 ? 'col-span-2 sm:col-span-1' : ''
                  } ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10 -translate-y-0.5'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70 hover:-translate-y-0.5 shadow-2xs'
                  }`}
                >
                  {/* Active indicator top bar */}
                  {isSelected && (
                    <div className="absolute -top-px left-3 right-3 h-[3px] bg-gradient-to-r from-[#B89230] via-[#D4AF37] to-[#B89230] rounded-full shadow-xs" />
                  )}

                  {/* Day Badge & Date */}
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200/70'
                      }`}>
                        Day 0{details.dayNumber}
                      </span>

                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isSelected ? 'text-[#D4AF37]' : 'text-slate-400'
                      }`}>
                        {details.shortWeekday}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className={`text-base sm:text-lg font-bold font-serif leading-none ${
                        isSelected ? 'text-white' : 'text-slate-800'
                      }`}>
                        {details.dayNum}
                      </span>
                      <span className={`text-[10px] font-mono uppercase ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {details.month}
                      </span>
                    </div>

                    {/* Ceremony Title (Readable Title-Case Serif) */}
                    <div className="mt-2 min-h-[42px] flex items-start">
                      <h4 className={`text-xs font-serif leading-snug line-clamp-2 transition-colors ${
                        isSelected ? 'text-white font-bold' : 'text-slate-700 font-semibold group-hover:text-slate-900'
                      }`}>
                        {d.title}
                      </h4>
                    </div>
                  </div>

                  {/* Footer: Cues Count + Side Dots */}
                  <div className={`flex items-center justify-between pt-2 border-t mt-2 ${
                    isSelected ? 'border-white/20' : 'border-slate-100'
                  }`}>
                    <span className={`text-[10px] font-mono font-semibold ${
                      isSelected ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-600'
                    }`}>
                      {d.items.length} {d.items.length === 1 ? 'cue' : 'cues'}
                    </span>

                    <div className="flex items-center gap-1">
                      {details.boyCount > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title={`${details.boyCount} Groom cues`} />
                      )}
                      {details.girlCount > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title={`${details.girlCount} Bride cues`} />
                      )}
                      {details.jointCount > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title={`${details.jointCount} Joint cues`} />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Operational Special Protocol Reminders (Feb 20 Raas Garba sound regulation) */}
        {selectedDayId === 'feb-20' && (
          <div className="flex items-start sm:items-center gap-2.5 p-3.5 mx-4 sm:mx-5 my-3 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <span className="leading-relaxed">
              <strong>Raas Garba Sound Regulation:</strong> DJ sound volume strictly monitored by city guidelines. If local police officers visit at 10:00 PM, respectfully reduce volume or conclude DJ sound per regulations; otherwise continue till 12:00 AM.
            </span>
          </div>
        )}

        {/* Perspective filter indicator if activeSide filters out items */}
        {activeSide !== 'ALL' && displayedItems.length !== activeDay.items.length && (
          <div className="flex items-center justify-between text-xs px-4 py-2 mx-4 sm:mx-5 my-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
            <span>
              Showing {displayedItems.length} of {activeDay.items.length} cues for{' '}
              <strong>{activeSide === 'BOY' ? "Boy's Side" : activeSide === 'GIRL' ? "Girl's Side" : activeSide === 'FAMILY' ? "Family's Side" : "Both Sides"}</strong>.
            </span>
            <span className="text-slate-400 font-medium">Switch to "Both Sides" above to view all cues.</span>
          </div>
        )}

        {/* Mobile View: Stacked Responsive Cue Cards (sm:hidden) */}
        <div className="sm:hidden divide-y divide-slate-100 border-t border-slate-100">
          {displayedItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 p-4">
              <Users className="w-7 h-7 mx-auto mb-2 text-slate-300" />
              <div className="text-xs font-semibold text-slate-600">No event cues match the current filter</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Switch perspective above or add a new cue for this day.</div>
            </div>
          ) : (
            displayedItems.map(({ item, originalIndex }, index) => (
              <div key={item.id} className="p-4 space-y-3 bg-white hover:bg-slate-50/50 transition-colors">
                {/* Header: #, Time & Side badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-mono text-[11px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold tracking-tight shadow-2xs">
                      {item.time}
                    </span>
                  </div>
                  {renderSideBadge(item.side)}
                </div>

                {/* Ritual / Event Title */}
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-base leading-snug">
                    <EditableText
                      value={item.title}
                      onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { title: val })}
                    />
                  </h3>
                  {item.gujaratiTitle && (
                    <div className="text-xs text-slate-500 mt-0.5 font-sans">
                      <EditableText
                        value={item.gujaratiTitle}
                        onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { gujaratiTitle: val })}
                      />
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/60">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium">
                    <EditableText
                      value={item.location}
                      onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { location: val })}
                    />
                  </span>
                </div>

                {/* Key Ceremonial Instruction */}
                <div className="bg-amber-50/40 p-3 rounded-xl border border-amber-200/60 text-slate-900 shadow-2xs">
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider font-bold text-[#8B6E1F] mb-1">
                    <Sparkles className="w-3 h-3 text-[#B89230]" />
                    <span>Ceremonial Instruction</span>
                  </div>
                  <EditableText
                    value={item.actionNotes}
                    multiline
                    onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { actionNotes: val })}
                    className="text-slate-900 font-medium text-xs leading-relaxed block"
                  />
                </div>

                {/* Outfits & Sound Rigs */}
                {(item.outfitGroom || item.outfitBride || item.soundRig) && (
                  <div className="grid grid-cols-1 gap-1.5 text-xs pt-1">
                    {item.outfitGroom && (
                      <div className="text-[11px] text-blue-900 bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-100 flex items-center gap-1.5">
                        <span>🤵</span>
                        <span className="font-bold">Groom:</span>
                        <span>{item.outfitGroom}</span>
                      </div>
                    )}
                    {item.outfitBride && (
                      <div className="text-[11px] text-rose-900 bg-rose-50/80 px-2.5 py-1 rounded-md border border-rose-100 flex items-center gap-1.5">
                        <span>👰</span>
                        <span className="font-bold">Bride:</span>
                        <span>{item.outfitBride}</span>
                      </div>
                    )}
                    {item.soundRig && (
                      <div className="text-[11px] text-purple-900 bg-purple-50/80 px-2.5 py-1 rounded-md border border-purple-100 flex items-center gap-1.5">
                        <span>🎵</span>
                        <span className="font-bold">Sound:</span>
                        <span>{item.soundRig}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions (Reorder, Edit, Delete) */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveUp(originalIndex)}
                      disabled={originalIndex === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="Move cue up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(originalIndex)}
                      disabled={originalIndex === activeDay.items.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="Move cue down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingItem({ dayId: selectedDayId, item })}
                      className="px-3 py-1.5 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-lg hover:bg-slate-100 border border-slate-200 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteScheduleItem(selectedDayId, item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Delete cue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Full Table (hidden sm:block) */}
        <div className="hidden sm:block overflow-x-auto border-t border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-2 w-10 text-center">#</th>
                <th className="py-3 px-3 w-28">Time</th>
                <th className="py-3 px-3 w-48">Ritual / Event</th>
                <th className="py-3 px-3 w-28">Side</th>
                <th className="py-3 px-3 w-36">Location</th>
                <th className="py-3 px-3 min-w-[280px]">Key Instruction</th>
                <th className="py-3 px-3 w-48">Outfits / Sound</th>
                <th className="py-3 px-3 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-7 h-7 mx-auto mb-2 text-slate-300" />
                    <div className="text-xs font-semibold text-slate-600">No event cues match the current filter</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Switch perspective above or add a new cue for this day.</div>
                  </td>
                </tr>
              ) : (
                displayedItems.map(({ item, originalIndex }, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-2 text-center font-mono text-slate-400 font-bold align-top pt-5">{index + 1}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap align-top pt-5">
                      <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-900 font-mono text-[11px] font-semibold border border-slate-200/80 inline-block">
                        <EditableText
                          value={item.time}
                          onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { time: val })}
                        />
                      </span>
                    </td>
                    <td className="py-3.5 px-3 align-top pt-4">
                      <div className="font-serif font-bold text-slate-900 text-sm">
                        <EditableText
                          value={item.title}
                          onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { title: val })}
                        />
                      </div>
                      {item.gujaratiTitle && (
                        <div className="text-[11px] text-slate-500 mt-1 font-sans">
                          <EditableText
                            value={item.gujaratiTitle}
                            onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { gujaratiTitle: val })}
                          />
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap align-top pt-4">{renderSideBadge(item.side)}</td>
                    <td className="py-3.5 px-3 text-slate-600 align-top pt-4">
                      <div className="flex items-center gap-1 font-medium text-xs text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <EditableText
                          value={item.location}
                          onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { location: val })}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-3 min-w-[280px] align-top">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-slate-900 shadow-2xs hover:border-[#D4AF37]/70 transition-all">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-bold text-[#8B6E1F] mb-1">
                          <Sparkles className="w-3 h-3 text-[#B89230]" />
                          <span>Ceremonial Instruction</span>
                        </div>
                        <EditableText
                          value={item.actionNotes}
                          multiline
                          onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { actionNotes: val })}
                          className="text-slate-900 font-medium text-xs sm:text-[13px] leading-relaxed block"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-3 space-y-1.5 align-top pt-4 w-48">
                      {item.outfitGroom && (
                        <div className="text-[11px] text-blue-800 font-medium flex items-center gap-1">
                          <span>🤵</span>
                          <span className="font-semibold text-blue-900">Groom:</span>
                          <EditableText
                            value={item.outfitGroom}
                            onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { outfitGroom: val })}
                          />
                        </div>
                      )}
                      {item.outfitBride && (
                        <div className="text-[11px] text-rose-800 font-medium flex items-center gap-1">
                          <span>👰</span>
                          <span className="font-semibold text-rose-900">Bride:</span>
                          <EditableText
                            value={item.outfitBride}
                            onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { outfitBride: val })}
                          />
                        </div>
                      )}
                      {item.soundRig && (
                        <div className="text-[11px] text-purple-800 font-medium flex items-center gap-1">
                          <span>🔊</span>
                          <EditableText
                            value={item.soundRig}
                            onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { soundRig: val })}
                          />
                        </div>
                      )}
                      {item.urgentRule && (
                        <div className="text-[11px] text-amber-800 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0 text-amber-600" />
                          <EditableText
                            value={item.urgentRule}
                            onSave={(val) => onEditScheduleItem(selectedDayId, item.id, { urgentRule: val })}
                          />
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap align-top pt-4 w-24">
                      <div className="flex items-center justify-end space-x-1">
                        <div className="flex border border-slate-200 rounded-lg overflow-hidden shrink-0 bg-slate-50 mr-1">
                          <button
                            onClick={() => handleMoveUp(originalIndex)}
                            disabled={originalIndex === 0}
                            title="Move earlier"
                            className="px-1.5 py-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(originalIndex)}
                            disabled={originalIndex === activeDay.items.length - 1}
                            title="Move later"
                            className="px-1.5 py-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-25 disabled:cursor-not-allowed transition-colors border-l border-slate-200 cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => setEditingItem({ dayId: selectedDayId, item })}
                          title="Edit"
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteScheduleItem(selectedDayId, item.id)}
                          title="Delete"
                          className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Add Cue to {activeDay.title}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
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

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bride Outfit Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Yellow Silk Saree / Lehenga"
                    value={newOutfitBride}
                    onChange={(e) => setNewOutfitBride(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block font-semibold text-slate-700 mb-1">Urgent Alert / Rule</label>
                  <input
                    type="text"
                    placeholder="e.g. Keep low volume / strictly 10 PM"
                    value={newUrgentRule}
                    onChange={(e) => setNewUrgentRule(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Schedule Cue
              </h3>
              <button 
                onClick={() => setEditingItem(null)} 
                className="text-slate-400 hover:text-slate-700 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
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

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bride Outfit Tag</label>
                  <input
                    type="text"
                    value={editingItem.item.outfitBride || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, outfitBride: e.target.value }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
