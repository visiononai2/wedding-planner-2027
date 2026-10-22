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
  ArrowRight
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
  // New Checklist Item Modal
  const [isAddChecklistOpen, setIsAddChecklistOpen] = useState(false);
  const [newChecklistStage, setNewChecklistStage] = useState('Scope & Destination');
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

  // Group checklist by stage
  const stages = ['Scope & Destination', 'Photography Crew', 'Travel & Lodging', 'Wardrobe & Styling', 'Shoot Execution', 'Post-Production'];

  return (
    <div className="space-y-5">
      {/* Top Banner Clarifying Distinction */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-indigo-200 border border-white/10 backdrop-blur-xs">
              <Camera className="w-3.5 h-3.5" />
              <span>Couple Photography Trip</span>
              <span>•</span>
              <span>Nov / Dec 2026</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Pre-Wedding Photography & Cinematography Planner
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              <strong>Notice:</strong> This couple photoshoot trip is an entirely separate multi-day travel project (2–3 days national or 1 week international), distinct from the Feb 18 home rituals (Randel, Lagan Lakhan, Haldi & Mehndi).
            </p>
          </div>

          {/* Quick Progress Dial */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shrink-0 text-center min-w-[150px]">
            <div className="text-2xl font-extrabold text-white">{completedChecklistCount} / {totalChecklistCount}</div>
            <div className="text-[11px] font-medium text-indigo-200 mt-0.5">Tasks Complete ({checklistPercent}%)</div>
            <div className="w-full bg-white/20 h-2 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full transition-all duration-300" style={{ width: `${checklistPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Preset Trip Scope Switcher */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Select Trip Scope & Preset:</span>
            </span>

            <div className="inline-flex flex-wrap items-center bg-black/40 p-1 rounded-xl border border-white/10 gap-1">
              <button
                onClick={() => onResetPlanToPreset('NATIONAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  plan.tripType === 'NATIONAL'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🇮🇳</span>
                <span>National Trip (2–3 Days)</span>
              </button>

              <button
                onClick={() => onResetPlanToPreset('INTERNATIONAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  plan.tripType === 'INTERNATIONAL'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>✈️</span>
                <span>International Trip (1 Week)</span>
              </button>

              <button
                onClick={() => onResetPlanToPreset('REGIONAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  plan.tripType === 'REGIONAL'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🏛️</span>
                <span>Gujarat Regional (1–2 Days)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Logistics Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Destination & Timing */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Destination & Timing</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-bold">
              {plan.durationLabel}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Target Destination:</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                <EditableText
                  value={plan.destination}
                  onSave={(val) => onUpdatePlan({ destination: val })}
                  className="font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Planned Dates:</div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                <EditableText
                  value={plan.targetDates}
                  onSave={(val) => onUpdatePlan({ targetDates: val })}
                />
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Duration:</div>
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
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Plane className="w-4 h-4 text-blue-600" />
            <span>Travel & Stay Logistics</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
              <span className="font-semibold text-slate-700">Flights / Train:</span>
              <button
                onClick={() => {
                  const next = plan.flightStatus === 'To Book' ? 'Booked' : plan.flightStatus === 'Booked' ? 'Not Needed' : 'To Book';
                  onUpdatePlan({ flightStatus: next });
                }}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                  plan.flightStatus === 'Booked'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/80'
                    : plan.flightStatus === 'To Book'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200/80'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {plan.flightStatus} (Click to toggle)
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
              <span className="font-semibold text-slate-700">Resort / Hotel Stay:</span>
              <button
                onClick={() => {
                  const next = plan.hotelStatus === 'To Book' ? 'Booked' : plan.hotelStatus === 'Booked' ? 'Not Needed' : 'To Book';
                  onUpdatePlan({ hotelStatus: next });
                }}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                  plan.hotelStatus === 'Booked'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/80'
                    : plan.hotelStatus === 'To Book'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200/80'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {plan.hotelStatus} (Click to toggle)
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
              <span className="font-semibold text-slate-700">Passport / Visa:</span>
              <button
                onClick={() => {
                  const states: Array<PreWeddingTripPlan['passportVisaStatus']> = ['Not Needed', 'Check Validity', 'Visa Applied', 'Visa Approved'];
                  const idx = states.indexOf(plan.passportVisaStatus);
                  const next = states[(idx + 1) % states.length];
                  onUpdatePlan({ passportVisaStatus: next });
                }}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                  plan.passportVisaStatus === 'Visa Approved' || plan.passportVisaStatus === 'Not Needed'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/80'
                    : 'bg-rose-100 text-rose-800 border border-rose-200/80'
                }`}
              >
                {plan.passportVisaStatus}
              </button>
            </div>
          </div>
        </div>

        {/* Financials & Budget */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <span>Trip Budget & Payments</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Estimated Total Cost:</span>
              <div className="font-bold text-slate-900">
                ₹
                <EditableText
                  value={String(plan.totalEstimatedCost || 0)}
                  onSave={(val) => onUpdatePlan({ totalEstimatedCost: Number(val) || 0 })}
                  className="font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Advance Paid:</span>
              <div className="font-semibold text-emerald-700">
                ₹
                <EditableText
                  value={String(plan.advancePaid || 0)}
                  onSave={(val) => onUpdatePlan({ advancePaid: Number(val) || 0 })}
                  className="font-semibold text-emerald-700"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Balance Remaining:</span>
              <span className={`font-mono text-sm ${remainingCost > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                ₹{remainingCost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Photography & Cinematography Crew Details */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Film className="w-4 h-4 text-indigo-600" />
              <span>Photography & Cinematography Crew Contract</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Agency coordination, deliverables, and turnaround deadlines
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Crew Size:</span>
              <span className="font-bold">
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
              <span className="font-bold text-slate-400 uppercase text-[10px]">Photo & Cinema Agency:</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                <EditableText
                  value={plan.photographerAgency}
                  onSave={(val) => onUpdatePlan({ photographerAgency: val })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px]">Lead Contact:</span>
                <div className="font-medium text-slate-800 mt-0.5">
                  <EditableText
                    value={plan.contactPerson || 'Enter contact name'}
                    onSave={(val) => onUpdatePlan({ contactPerson: val })}
                  />
                </div>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px]">Phone Number:</span>
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
          <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70">
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Guaranteed Package Deliverables:</span>
            </span>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              {plan.deliverables.map((d, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Themed Looks & Wardrobe Planner (4 Looks) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Shirt className="w-4 h-4 text-purple-600" />
              <span>Wardrobe & Themed Shoot Looks ({plan.looks.length} Looks)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Coordinate outfits and match backdrops for both Groom & Bride
            </p>
          </div>

          <button
            onClick={() => setIsAddLookOpen(true)}
            className="inline-flex items-center px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Shoot Look
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {plan.looks.map((look, index) => (
            <div
              key={look.id}
              className="bg-slate-50/80 hover:bg-white rounded-2xl p-4 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">
                    <EditableText
                      value={look.themeTitle}
                      onSave={(val) => handleUpdateLook(look.id, { themeTitle: val })}
                      className="font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const next = look.status === 'Planning' ? 'Outfits Ready' : look.status === 'Outfits Ready' ? 'Shot Done' : 'Planning';
                      handleUpdateLook(look.id, { status: next });
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                      look.status === 'Shot Done'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/80'
                        : look.status === 'Outfits Ready'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200/80'
                        : 'bg-amber-100 text-amber-800 border border-amber-200/80'
                    }`}
                  >
                    {look.status}
                  </button>

                  <button
                    onClick={() => handleDeleteLook(look.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete Look"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
                  <span className="font-bold text-blue-800 shrink-0 text-[11px]">👦 Groom:</span>
                  <div className="text-slate-700 text-[11px] flex-1">
                    <EditableText
                      value={look.groomOutfit}
                      onSave={(val) => handleUpdateLook(look.id, { groomOutfit: val })}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
                  <span className="font-bold text-rose-800 shrink-0 text-[11px]">👧 Bride:</span>
                  <div className="text-slate-700 text-[11px] flex-1">
                    <EditableText
                      value={look.brideOutfit}
                      onSave={(val) => handleUpdateLook(look.id, { brideOutfit: val })}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white/70 p-2 rounded-xl border border-slate-200/60 text-[11px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
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

      {/* Step-by-Step Interactive Checklist */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Step-by-Step Shoot Execution Checklist</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              From destination decision through final Garba LED wall video delivery
            </p>
          </div>

          <button
            onClick={() => setIsAddChecklistOpen(true)}
            className="inline-flex items-center px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Checklist Item
          </button>
        </div>

        {/* Grouped by Stages */}
        <div className="space-y-4">
          {stages.map((stage) => {
            const items = plan.checklist.filter(c => c.stage === stage);
            if (items.length === 0) return null;

            return (
              <div key={stage} className="space-y-2">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/80 inline-block">
                  {stage}
                </div>

                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-all ${
                        item.completed
                          ? 'bg-slate-50/60 border-slate-200/60 text-slate-400'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 flex-1">
                        <button
                          onClick={() => handleToggleChecklist(item.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                        >
                          {item.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>

                        <div className="space-y-0.5 flex-1">
                          <div className={`text-xs font-semibold ${item.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
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
                        className="text-slate-300 hover:text-rose-500 transition-colors p-1"
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

      {/* Wedding Day Connection Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3 shadow-sm">
        <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-900">
            Garba Night (Feb 20) LED Wall Playback Connection
          </div>
          <p className="text-amber-800 leading-relaxed">
            Ensure the photography team delivers the <strong>full horizontal 4K master cut</strong> by <strong>January 15, 2027</strong>. This video will be tested and handed over to Dhaval Jajenwala's LED wall operators at Silver Farm to be projected on the big screen during the Grand Couple Entry at the Feb 20 Raas-Garba!
          </p>
        </div>
      </div>

      {/* Modal: Add Look */}
      {isAddLookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Add New Themed Shoot Look</h3>
            <form onSubmit={handleAddLook} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Theme Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Heritage / Western Black Tie"
                  value={newLookTheme}
                  onChange={(e) => setNewLookTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Groom Outfit</label>
                <input
                  type="text"
                  placeholder="e.g. Navy Jodhpuri Bandhgala or Tuxedo"
                  value={newLookGroom}
                  onChange={(e) => setNewLookGroom(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bride Outfit</label>
                <input
                  type="text"
                  placeholder="e.g. Red Royal Lehenga or Satin Trail Gown"
                  value={newLookBride}
                  onChange={(e) => setNewLookBride(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location / Backdrop</label>
                <input
                  type="text"
                  placeholder="e.g. Palace arches, lakeside sunset, beach"
                  value={newLookBackdrop}
                  onChange={(e) => setNewLookBackdrop(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddLookOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Add Pre-Wedding Checklist Task</h3>
            <form onSubmit={handleAddChecklist} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Milestone Stage</label>
                <select
                  value={newChecklistStage}
                  onChange={(e) => setNewChecklistStage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-slate-900"
                >
                  {stages.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Book resort with courtyard photography rights"
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Operational Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Details, contacts, or requirements"
                  value={newChecklistNotes}
                  onChange={(e) => setNewChecklistNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddChecklistOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-colors"
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
