import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2,
  Edit3
} from 'lucide-react';
import { DecisionPoint } from '../types/wedding';
import { EditableText } from './EditableText';

interface DecisionsTrackerProps {
  decisions: DecisionPoint[];
  onUpdateDecision: (id: string, updates: Partial<DecisionPoint>) => void;
  onAddDecision: (decision: Omit<DecisionPoint, 'id'>) => void;
  onDeleteDecision: (id: string) => void;
}

export const DecisionsTracker: React.FC<DecisionsTrackerProps> = ({
  decisions,
  onUpdateDecision,
  onAddDecision,
  onDeleteDecision
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptionsStr, setNewOptionsStr] = useState('');

  // Edit Modal State
  const [editingDecision, setEditingDecision] = useState<DecisionPoint | null>(null);
  const [editOptionsStr, setEditOptionsStr] = useState('');

  // Keyboard Escape listener for modals
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAddModalOpen) setIsAddModalOpen(false);
        if (editingDecision) setEditingDecision(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen, editingDecision]);

  const handleCreateDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    onAddDecision({
      question: newQuestion.trim(),
      options: newOptionsStr.split(',').map(s => s.trim()).filter(Boolean),
      status: 'Pending',
      decision: ''
    });

    setNewQuestion('');
    setNewOptionsStr('');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDecision || !editingDecision.question.trim()) return;

    const options = editOptionsStr.split(',').map(s => s.trim()).filter(Boolean);

    onUpdateDecision(editingDecision.id, {
      question: editingDecision.question.trim(),
      options: options.length > 0 ? options : editingDecision.options,
      status: editingDecision.status,
      decision: editingDecision.decision?.trim() || ''
    });

    setEditingDecision(null);
  };

  const pendingCount = decisions.filter(d => d.status === 'Pending').length;
  const decidedCount = decisions.filter(d => d.status === 'Decided').length;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Unified Master Decisions & Operational Protocols Hub */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
        {/* Header: Title & Stats & Add Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-serif text-base sm:text-lg font-medium text-slate-900">Family Decisions & Ritual Inquiries</h3>
            <div className="text-xs text-slate-500 font-sans mt-0.5">
              {pendingCount > 0 ? (
                <span className="text-amber-800 font-semibold">{pendingCount} pending decisions</span>
              ) : (
                <span className="text-emerald-700 font-semibold">✓ All questions resolved</span>
              )} • {decidedCount} decided
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 stroke-[1.5]" />
            Add Decision
          </button>
        </div>

        {/* Decision Cards List */}
        <div className="space-y-3.5">
          {decisions.map((dec) => (
            <div 
              key={dec.id}
              className="p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all bg-white text-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Inline Editable Question */}
                <EditableText
                  value={dec.question}
                  onSave={(val) => onUpdateDecision(dec.id, { question: val })}
                  className="font-medium text-sm text-slate-900 font-serif"
                />

                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-full font-sans font-medium text-[11px] border ${
                    dec.status === 'Decided' ? 'bg-emerald-50 text-emerald-800 border-emerald-200/70' : 'bg-amber-50 text-amber-800 border-amber-200/70'
                  }`}>
                    {dec.status === 'Decided' ? '✓ Decided' : 'Pending'}
                  </span>

                  <button
                    onClick={() => {
                      setEditingDecision(dec);
                      setEditOptionsStr(dec.options.join(', '));
                    }}
                    title="Edit question parameters"
                    className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>

                  <button
                    onClick={() => onDeleteDecision(dec.id)}
                    title="Delete question"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-2">
                {dec.options.map((opt, idx) => {
                  const isSelected = dec.decision?.toLowerCase().includes(opt.toLowerCase());
                  return (
                    <button
                      key={idx}
                      onClick={() => onUpdateDecision(dec.id, { decision: opt, status: 'Decided' })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-sans border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Selected Answer with Inline Editing */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center">
                  <span className="text-slate-400 mr-2 font-sans font-normal">Selected Answer: </span>
                  <EditableText
                    value={dec.decision || ''}
                    placeholder="Click to type decision..."
                    onSave={(val) => onUpdateDecision(dec.id, { decision: val, status: val.trim() ? 'Decided' : 'Pending' })}
                    className="font-medium text-slate-900 font-serif"
                  />
                </div>

                <select
                  value={dec.status}
                  onChange={(e) => onUpdateDecision(dec.id, { status: e.target.value as any })}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1 text-xs text-slate-800 font-sans font-medium focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Decided">Decided</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-[0_24px_70px_rgba(15,23,42,0.18)] border border-slate-200/90 text-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="font-serif font-medium text-slate-900 text-base">Add Family Decision Point</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-full transition-colors cursor-pointer text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleCreateDecision} className="mt-5 space-y-4 font-sans">
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Question / Decision *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bus transport for outstation guests"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Options (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. AC Bus, Mini Travelers, Private Cars"
                  value={newOptionsStr}
                  onChange={(e) => setNewOptionsStr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-2.5 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-medium rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-xs shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingDecision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-[0_24px_70px_rgba(15,23,42,0.18)] border border-slate-200/90 text-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="font-serif font-medium text-slate-900 text-base">Edit Decision Parameters</h3>
              <button onClick={() => setEditingDecision(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-full transition-colors cursor-pointer text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4 font-sans">
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Question *</label>
                <input
                  type="text"
                  required
                  value={editingDecision.question}
                  onChange={(e) => setEditingDecision({ ...editingDecision, question: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Options (Comma separated)</label>
                <input
                  type="text"
                  value={editOptionsStr}
                  onChange={(e) => setEditOptionsStr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Chosen Resolution / Decision</label>
                <input
                  type="text"
                  value={editingDecision.decision || ''}
                  onChange={(e) => setEditingDecision({ ...editingDecision, decision: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Status</label>
                <select
                  value={editingDecision.status}
                  onChange={(e) => setEditingDecision({ ...editingDecision, status: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all font-medium cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Decided">Decided</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-2.5 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingDecision(null)} 
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-medium rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-xs shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};