import React, { useState } from 'react';
import { 
  Camera, 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  Video, 
  Image as ImageIcon, 
  Shirt, 
  IndianRupee,
  Film,
  Compass,
  ArrowRight,
  Search,
  Kanban,
  LayoutList,
  SlidersHorizontal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  PreWeddingTripPlan, 
  PreWeddingTripType, 
  PreWeddingLook, 
  PreWeddingChecklistItem, 
  WeddingSide 
} from '../types/wedding';
import { EditableText } from './EditableText';
import { PreWeddingKanbanBoard, PreWeddingGroupBy, STAGES_LIST } from './clickup/PreWeddingKanbanBoard';

interface PreWeddingPlannerProps {
  plan: PreWeddingTripPlan;
  activeSide: WeddingSide;
  onUpdatePlan: (updates: Partial<PreWeddingTripPlan>) => void;
  onResetPlanToPreset: (presetType: PreWeddingTripType) => void;
}

export const PreWeddingPlanner: React.FC<PreWeddingPlannerProps> = ({
  plan,
  activeSide,
  onUpdatePlan,
  onResetPlanToPreset
}) => {
  // Sub-module view switcher: Default to Shoot Tasks Kanban Board
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'looks' | 'logistics' | 'crew' | 'all'>('tasks');

  // Shoot Tasks Kanban View states
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [groupBy, setGroupBy] = useState<PreWeddingGroupBy>('status');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');

  // New Checklist Item Modal
  const [isAddChecklistOpen, setIsAddChecklistOpen] = useState(false);
  const [newChecklistStage, setNewChecklistStage] = useState('Location & Scope Decision');
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newChecklistNotes, setNewChecklistNotes] = useState('');

  // New Look Modal
  const [isAddLookOpen, setIsAddLookOpen] = useState(false);
  const [newLookTheme, setNewLookTheme] = useState('');
  const [newLookGroom, setNewLookGroom] = useState('');
  const [newLookBride, setNewLookBride] = useState('');
  const [newLookBackdrop, setNewLookBackdrop] = useState('');

  // Keyboard Escape listener for modals
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAddChecklistOpen) setIsAddChecklistOpen(false);
        if (isAddLookOpen) setIsAddLookOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddChecklistOpen, isAddLookOpen]);

  // Checklist Handlers
  const handleToggleChecklist = (id: string) => {
    const updated = plan.checklist.map(item => {
      if (item.id === id) {
        const nextState = !item.completed;
        if (nextState) {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
        }
        return { ...item, completed: nextState };
      }
      return item;
    });
    onUpdatePlan({ checklist: updated });
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistTitle.trim()) return;

    const newItem: PreWeddingChecklistItem = {
      id: `pw-chk-${Date.now()}`,
      stage: newChecklistStage,
      title: newChecklistTitle.trim(),
      completed: false,
      notes: newChecklistNotes.trim() || undefined
    };

    onUpdatePlan({ checklist: [...plan.checklist, newItem] });
    setNewChecklistTitle('');
    setNewChecklistNotes('');
    setIsAddChecklistOpen(false);
  };

  const handleDeleteChecklist = (id: string) => {
    onUpdatePlan({ checklist: plan.checklist.filter(c => c.id !== id) });
  };

  const handleAddChecklistDirect = (item: Omit<PreWeddingChecklistItem, 'id'>) => {
    const newItem: PreWeddingChecklistItem = {
      ...item,
      id: `pw-chk-${Date.now()}`
    };
    onUpdatePlan({ checklist: [...plan.checklist, newItem] });
  };

  const handleEditChecklist = (id: string, updates: Partial<PreWeddingChecklistItem>) => {
    onUpdatePlan({
      checklist: plan.checklist.map(c => c.id === id ? { ...c, ...updates } : c)
    });
  };

  // Looks Handlers
  const handleAddLook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLookTheme.trim()) return;

    const newLook: PreWeddingLook = {
      id: `pw-look-${Date.now()}`,
      themeTitle: newLookTheme.trim(),
      groomOutfit: newLookGroom.trim() || 'Coordinated styling',
      brideOutfit: newLookBride.trim() || 'Coordinated styling',
      locationBackdrop: newLookBackdrop.trim() || 'Scenic location',
      status: 'Planning'
    };

    onUpdatePlan({ looks: [...plan.looks, newLook] });
    setNewLookTheme('');
    setNewLookGroom('');
    setNewLookBride('');
    setNewLookBackdrop('');
    setIsAddLookOpen(false);
  };

  const handleUpdateLook = (id: string, updates: Partial<PreWeddingLook>) => {
    onUpdatePlan({
      looks: plan.looks.map(l => l.id === id ? { ...l, ...updates } : l)
    });
  };

  const handleDeleteLook = (id: string) => {
    onUpdatePlan({ looks: plan.looks.filter(l => l.id !== id) });
  };

  // Calculations
  const completedChecklistCount = plan.checklist.filter(c => c.completed).length;
  const totalChecklistCount = plan.checklist.length;
  const checklistPercent = totalChecklistCount > 0 ? Math.round((completedChecklistCount / totalChecklistCount) * 100) : 0;
  const remainingCost = (plan.totalEstimatedCost || 0) - (plan.advancePaid || 0);

  // Stages for checklist
  const stages = STAGES_LIST;

  const filteredChecklist = plan.checklist.filter(item => {
    if (taskSearchQuery.trim()) {
      const q = taskSearchQuery.toLowerCase();
      const match = item.title.toLowerCase().includes(q) || 
                    item.stage.toLowerCase().includes(q) || 
                    (item.notes && item.notes.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const renderShootTasksSection = () => (
    <div className="space-y-4">
      {/* ClickUp Toolbar & View Controls */}
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
                <span>List View</span>
              </button>
            </div>

            {/* Group By selector (in Board mode) */}
            {viewMode === 'board' && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">Group:</span>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as PreWeddingGroupBy)}
                  className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer"
                >
                  <option value="status">By Status (To Do / Completed)</option>
                  <option value="stage">By Shoot Stages</option>
                </select>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsAddChecklistOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all duration-200 hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Shoot Task
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search shoot tasks & stages..."
                value={taskSearchQuery}
                onChange={(e) => setTaskSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 w-44 sm:w-64 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          <div className="text-slate-500 font-medium text-xs flex items-center gap-1.5 font-mono">
            <span>Showing</span>
            <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] border border-slate-200/60">
              {filteredChecklist.length}
            </span>
            <span className="font-sans">shoot tasks</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-medium">{completedChecklistCount} completed</span>
          </div>
        </div>
      </div>

      {/* Main Content: Kanban Board OR List View */}
      {viewMode === 'board' ? (
        <PreWeddingKanbanBoard
          checklist={filteredChecklist}
          activeSide={activeSide}
          groupBy={groupBy}
          onToggleChecklist={handleToggleChecklist}
          onUpdateChecklist={handleEditChecklist}
          onAddChecklist={handleAddChecklistDirect}
          onDeleteChecklist={handleDeleteChecklist}
        />
      ) : (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="space-y-4">
            {stages.map((stage) => {
              const items = filteredChecklist.filter(c => c.stage === stage);
              if (items.length === 0) return null;

              return (
                <div key={stage} className="space-y-2">
                  <div className="text-[10px] font-semibold text-slate-700 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200/80 inline-block font-mono">
                    {stage}
                  </div>

                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                          item.completed
                            ? 'bg-slate-50/60 border-slate-200/60 text-slate-400'
                            : 'bg-white border-slate-200/70 hover:border-[#D4AF37]/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 flex-1">
                          <button
                            onClick={() => handleToggleChecklist(item.id)}
                            className="mt-0.5 text-slate-400 hover:text-emerald-700 transition-colors shrink-0 cursor-pointer"
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                            )}
                          </button>

                          <div className="space-y-0.5 flex-1">
                            <div className={`text-xs font-medium ${item.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              <EditableText
                                value={item.title}
                                onSave={(val) => handleEditChecklist(item.id, { title: val })}
                              />
                            </div>

                            {item.notes && (
                              <div className="text-[11px] text-slate-500">
                                <EditableText
                                  value={item.notes}
                                  onSave={(val) => handleEditChecklist(item.id, { notes: val })}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteChecklist(item.id)}
                          className="text-slate-300 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Clarifying Distinction */}
      <div className="bg-[#1C1917] text-slate-100 rounded-3xl p-6 sm:p-8 shadow-[0_16px_50px_rgba(28,25,23,0.18)] border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-medium bg-white/10 text-[#D4AF37] border border-[#D4AF37]/30 backdrop-blur-xs font-mono tracking-wider">
              <Camera className="w-3.5 h-3.5" />
              <span>Couple Photography Trip</span>
              <span>•</span>
              <span>Nov / Dec 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal font-cormorant tracking-wide text-slate-50">
              Pre-Wedding Photography & Cinematography Planner
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              <strong className="text-slate-200">Notice:</strong> This couple photoshoot trip is an entirely separate multi-day travel project (2–3 days national or 1 week international), distinct from the Feb 15 home rituals (Randel, Lagan Lakhan, Haldi & Mehndi).
            </p>
          </div>

          {/* Quick Progress Dial */}
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-800 shrink-0 text-center min-w-[160px]">
            <div className="text-2xl sm:text-3xl font-light font-cormorant text-slate-50">{completedChecklistCount} / {totalChecklistCount}</div>
            <div className="text-[10px] font-medium text-[#D4AF37] font-mono tracking-wider mt-1 uppercase">Tasks Complete ({checklistPercent}%)</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#D4AF37] h-full rounded-full transition-all duration-300" style={{ width: `${checklistPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Preset Trip Scope Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Select Trip Scope & Preset:</span>
            </span>

            <div className="inline-flex flex-wrap items-center bg-black/40 p-1 rounded-xl border border-slate-800 gap-1">
              <button
                onClick={() => onResetPlanToPreset('NATIONAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  plan.tripType === 'NATIONAL'
                    ? 'bg-slate-50 text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🇮🇳</span>
                <span>National Trip (2–3 Days)</span>
              </button>

              <button
                onClick={() => onResetPlanToPreset('INTERNATIONAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  plan.tripType === 'INTERNATIONAL'
                    ? 'bg-slate-50 text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>✈️</span>
                <span>International Trip (1 Week)</span>
              </button>

              <button
                onClick={() => onResetPlanToPreset('REGIONAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  plan.tripType === 'REGIONAL'
                    ? 'bg-slate-50 text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🏛️</span>
                <span>Gujarat Regional (1–2 Days)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Wedding Module Sub-Navigation Tabs */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border border-slate-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('tasks')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'tasks'
                ? 'bg-slate-900 text-slate-50 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>📋 Shoot Execution Tasks</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              activeSubTab === 'tasks' ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-700'
            }`}>
              {plan.checklist.filter(c => !c.completed).length} pending
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('looks')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'looks'
                ? 'bg-slate-900 text-slate-50 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>🎬 Wardrobe & Looks</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              activeSubTab === 'looks' ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-700'
            }`}>
              {plan.looks.length} looks
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('logistics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'logistics'
                ? 'bg-slate-900 text-slate-50 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>📍 Destination & Stay Logistics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('crew')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'crew'
                ? 'bg-slate-900 text-slate-50 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>📷 Crew Contract</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'all'
                ? 'bg-slate-900 text-slate-50 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Full Plan Overview</span>
          </button>
        </div>
      </div>

      {/* Trip Logistics Overview Card */}
      {(activeSubTab === 'tasks' || activeSubTab === 'logistics' || activeSubTab === 'all') && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Destination & Timing */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-[#D4AF37]/50 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all space-y-3.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            <span className="flex items-center gap-1.5 text-slate-700">
              <MapPin className="w-4 h-4 text-[#B89230]" />
              <span>Destination & Timing</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-200/80 font-medium">
              {plan.durationLabel}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase font-mono tracking-wider">Target Destination:</div>
              <div className="text-base font-cormorant font-medium text-slate-900 mt-0.5">
                <EditableText
                  value={plan.destination}
                  onSave={(val) => onUpdatePlan({ destination: val })}
                  className="font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase font-mono tracking-wider">Planned Dates:</div>
              <div className="text-xs font-mono text-slate-700 mt-0.5">
                <EditableText
                  value={plan.targetDates}
                  onSave={(val) => onUpdatePlan({ targetDates: val })}
                />
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase font-mono tracking-wider">Duration:</div>
              <div className="text-xs text-slate-600 mt-0.5">
                <EditableText
                  value={plan.durationLabel}
                  onSave={(val) => onUpdatePlan({ durationLabel: val })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Travel & Bookings Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-[#D4AF37]/50 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all space-y-3.5">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Plane className="w-4 h-4 text-[#B89230]" />
            <span>Travel & Stay Logistics</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
              <span className="font-medium text-slate-700">Flights / Train:</span>
              <button
                onClick={() => {
                  const next = plan.flightStatus === 'To Book' ? 'Booked' : plan.flightStatus === 'Booked' ? 'Not Needed' : 'To Book';
                  onUpdatePlan({ flightStatus: next });
                }}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
                  plan.flightStatus === 'Booked'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                    : plan.flightStatus === 'To Book'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {plan.flightStatus} (Toggle)
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
              <span className="font-medium text-slate-700">Resort / Hotel Stay:</span>
              <button
                onClick={() => {
                  const next = plan.hotelStatus === 'To Book' ? 'Booked' : plan.hotelStatus === 'Booked' ? 'Not Needed' : 'To Book';
                  onUpdatePlan({ hotelStatus: next });
                }}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
                  plan.hotelStatus === 'Booked'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                    : plan.hotelStatus === 'To Book'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {plan.hotelStatus} (Toggle)
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
              <span className="font-medium text-slate-700">Passport / Visa:</span>
              <button
                onClick={() => {
                  const states: Array<PreWeddingTripPlan['passportVisaStatus']> = ['Not Needed', 'Check Validity', 'Visa Applied', 'Visa Approved'];
                  const idx = states.indexOf(plan.passportVisaStatus);
                  const next = states[(idx + 1) % states.length];
                  onUpdatePlan({ passportVisaStatus: next });
                }}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
                  plan.passportVisaStatus === 'Visa Approved' || plan.passportVisaStatus === 'Not Needed'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                    : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                }`}
              >
                {plan.passportVisaStatus}
              </button>
            </div>
          </div>
        </div>

        {/* Financials & Budget */}
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-slate-200/70 hover:border-[#D4AF37]/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all space-y-3.5">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <IndianRupee className="w-4 h-4 text-[#B89230]" />
            <span>Trip Budget & Payments</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Estimated Total Cost:</span>
              <div className="font-medium text-slate-900 font-mono">
                ₹
                <EditableText
                  value={String(plan.totalEstimatedCost || 0)}
                  onSave={(val) => onUpdatePlan({ totalEstimatedCost: Number(val) || 0 })}
                  className="font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Advance Paid:</span>
              <div className="font-medium text-emerald-700 font-mono">
                ₹
                <EditableText
                  value={String(plan.advancePaid || 0)}
                  onSave={(val) => onUpdatePlan({ advancePaid: Number(val) || 0 })}
                  className="font-medium text-emerald-700"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-medium">
              <span className="text-slate-700">Balance Remaining:</span>
              <span className={`font-mono text-sm ${remainingCost > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                ₹{remainingCost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Photography & Cinematography Crew Details */}
      {(activeSubTab === 'crew' || activeSubTab === 'all') && (
      <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-slate-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60">
          <div>
            <h2 className="text-sm sm:text-base font-normal font-cormorant text-slate-900 flex items-center gap-2 text-lg">
              <Film className="w-4 h-4 text-[#B89230]" />
              <span>Photography & Cinematography Crew Contract</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Agency coordination, deliverables, and turnaround deadlines
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 font-mono text-[11px]">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Crew Size:</span>
              <span className="font-semibold text-slate-900">
                <EditableText
                  value={String(plan.crewCount || 3)}
                  onSave={(val) => onUpdatePlan({ crewCount: Number(val) || 3 })}
                /> members
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2.5">
            <div>
              <span className="font-semibold text-slate-400 uppercase text-[10px] font-mono tracking-wider">Photo & Cinema Agency:</span>
              <div className="text-sm font-medium text-slate-900 mt-0.5">
                <EditableText
                  value={plan.photographerAgency}
                  onSave={(val) => onUpdatePlan({ photographerAgency: val })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="font-semibold text-slate-400 uppercase text-[10px] font-mono tracking-wider">Lead Contact:</span>
                <div className="font-medium text-slate-800 mt-0.5">
                  <EditableText
                    value={plan.contactPerson || 'Enter contact name'}
                    onSave={(val) => onUpdatePlan({ contactPerson: val })}
                  />
                </div>
              </div>
              <div>
                <span className="font-semibold text-slate-400 uppercase text-[10px] font-mono tracking-wider">Phone Number:</span>
                <div className="font-mono text-slate-800 mt-0.5">
                  <EditableText
                    value={plan.phone || 'Enter phone number'}
                    onSave={(val) => onUpdatePlan({ phone: val })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Deliverables List */}
          <div className="space-y-2 bg-slate-50/80 p-4 rounded-xl border border-slate-200/70">
            <span className="font-semibold text-slate-800 text-xs flex items-center gap-1.5 font-mono tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#B89230]" />
              <span>Guaranteed Package Deliverables:</span>
            </span>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              {plan.deliverables.map((d, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B89230] mt-0.5 shrink-0" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      )}

      {/* Themed Looks & Wardrobe Planner (4 Looks) */}
      {(activeSubTab === 'looks' || activeSubTab === 'all') && (
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-cormorant font-normal text-slate-900 flex items-center gap-2">
              <Shirt className="w-4 h-4 text-[#B89230]" />
              <span>Wardrobe & Themed Shoot Looks ({plan.looks.length} Looks)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Coordinate outfits and match backdrops for both Groom & Bride
            </p>
          </div>

          <button
            onClick={() => setIsAddLookOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Shoot Look
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.looks.map((look, index) => (
            <div
              key={look.id}
              className="bg-white hover:bg-slate-50/50 rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 transition-all duration-300 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200/80 text-slate-800 font-mono text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="font-cormorant text-base sm:text-lg font-medium text-slate-900">
                    <EditableText
                      value={look.themeTitle}
                      onSave={(val) => handleUpdateLook(look.id, { themeTitle: val })}
                      className="font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const next = look.status === 'Planning' ? 'Outfits Ready' : look.status === 'Outfits Ready' ? 'Shot Done' : 'Planning';
                      handleUpdateLook(look.id, { status: next });
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
                      look.status === 'Shot Done'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                        : look.status === 'Outfits Ready'
                        ? 'bg-[#3B6281]/10 text-[#3B6281] border border-[#3B6281]/20'
                        : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                    }`}
                  >
                    {look.status}
                  </button>

                  <button
                    onClick={() => handleDeleteLook(look.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="Delete Look"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 bg-white/90 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="font-medium text-[#3B6281] shrink-0 text-[11px]">👦 Groom:</span>
                  <div className="text-slate-700 text-[11px] flex-1">
                    <EditableText
                      value={look.groomOutfit}
                      onSave={(val) => handleUpdateLook(look.id, { groomOutfit: val })}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white/90 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="font-medium text-[#A84A5B] shrink-0 text-[11px]">👧 Bride:</span>
                  <div className="text-slate-700 text-[11px] flex-1">
                    <EditableText
                      value={look.brideOutfit}
                      onSave={(val) => handleUpdateLook(look.id, { brideOutfit: val })}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white/70 p-2 rounded-xl border border-slate-200/60 text-[11px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-[#B89230] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <EditableText
                      value={look.locationBackdrop}
                      onSave={(val) => handleUpdateLook(look.id, { locationBackdrop: val })}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Step-by-Step Shoot Execution Tasks (Kanban Board) */}
      {(activeSubTab === 'tasks' || activeSubTab === 'all') && renderShootTasksSection()}

      {/* Wedding Day Connection Callout */}
      {(activeSubTab === 'tasks' || activeSubTab === 'all') && (
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D4AF37]/50 text-xs text-slate-800 flex items-start gap-3.5 shadow-[0_2px_12px_rgba(212,175,55,0.08)]">
        <Sparkles className="w-5 h-5 text-[#B89230] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-medium text-slate-900 font-cormorant text-base">
            Garba Night (Feb 20) LED Wall Playback Connection
          </div>
          <p className="text-slate-600 leading-relaxed">
            Ensure the photography team delivers the <strong className="text-slate-900">full horizontal 4K master cut</strong> by <strong className="text-slate-900">January 15, 2027</strong>. This video will be tested and handed over to Dhaval Jajenwala's LED wall operators at Silver Farm to be projected on the big screen during the Grand Couple Entry at the Feb 20 Raas-Garba!
          </p>
        </div>
      </div>
      )}

      {/* Modal: Add Look */}
      {isAddLookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] max-w-md w-full p-6 sm:p-7 space-y-4 border border-slate-200/90">
            <h3 className="font-cormorant text-xl font-normal text-slate-900">Add New Themed Shoot Look</h3>
            <form onSubmit={handleAddLook} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1 text-[11px]">Theme Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Heritage / Western Black Tie"
                  value={newLookTheme}
                  onChange={(e) => setNewLookTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200/80 rounded-xl focus:ring-1 focus:ring-[#D4AF37] bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 text-[11px]">Groom Outfit</label>
                <input
                  type="text"
                  placeholder="e.g. Navy Jodhpuri Bandhgala or Tuxedo"
                  value={newLookGroom}
                  onChange={(e) => setNewLookGroom(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200/80 rounded-xl bg-slate-50 focus:ring-1 focus:ring-[#D4AF37] text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 text-[11px]">Bride Outfit</label>
                <input
                  type="text"
                  placeholder="e.g. Red Royal Lehenga or Satin Trail Gown"
                  value={newLookBride}
                  onChange={(e) => setNewLookBride(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200/80 rounded-xl bg-slate-50 focus:ring-1 focus:ring-[#D4AF37] text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 text-[11px]">Location / Backdrop</label>
                <input
                  type="text"
                  placeholder="e.g. Palace arches, lakeside sunset, beach"
                  value={newLookBackdrop}
                  onChange={(e) => setNewLookBackdrop(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200/80 rounded-xl bg-slate-50 focus:ring-1 focus:ring-[#D4AF37] text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddLookOpen(false)}
                  className="px-4 py-2 border border-slate-200/80 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Save Look
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Checklist Item */}
      {isAddChecklistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] max-w-md w-full p-6 sm:p-7 space-y-4 border border-slate-200/90">
            <h3 className="font-cormorant text-xl font-normal text-slate-900">Add Pre-Wedding Checklist Task</h3>
            <form onSubmit={handleAddChecklist} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1 text-[11px]">Milestone Stage</label>
                <select
                  value={newChecklistStage}
                  onChange={(e) => setNewChecklistStage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200/80 rounded-xl focus:ring-1 focus:ring-[#D4AF37] bg-white text-slate-900 font-medium"
                >
                  {stages.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 text-[11px]">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Book resort with courtyard photography rights"
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200/80 rounded-xl focus:ring-1 focus:ring-[#D4AF37] bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 text-[11px]">Operational Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Details, contacts, or requirements"
                  value={newChecklistNotes}
                  onChange={(e) => setNewChecklistNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200/80 rounded-xl bg-white focus:ring-1 focus:ring-[#D4AF37] text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200/70">
                <button
                  type="button"
                  onClick={() => setIsAddChecklistOpen(false)}
                  className="px-4 py-2 border border-slate-200/80 rounded-xl text-slate-600 hover:bg-slate-200/60 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-50 font-medium rounded-xl shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
