import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ShieldAlert,
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
    <div className="space-y-4">
      {/* Ground Rules & Operational Constraints Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center">
          <ShieldAlert className="w-4 h-4 mr-1.5 text-indigo-600" />
          Critical Operational Rules & Constraints
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 leading-relaxed">
            <strong className="text-slate-900 block font-semibold mb-1">1. Surat Police 10 PM Limit:</strong>
            Turn off high DJ sound strictly at 10:00 PM at Silver Farm. Bride entry & couple raas must happen before 10 PM.
          </div>
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 leading-relaxed">
            <strong className="text-slate-900 block font-semibold mb-1">2. 05:00 AM Jaan Departure:</strong>
            Groom side departs at 5 AM sharp. ICER truck mounted with 4 Base 4 Top & flowers ready at 4:30 AM.
          </div>
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 leading-relaxed">
            <strong className="text-slate-900 block font-semibold mb-1">3. Bride Makeup Slot:</strong>
            Start 2–3 PM, finish by 5:00–5:30 PM strictly to allow sunset portraits before dinner & Garba.
          </div>
        </div>
      </div>

      {/* Questions Tracker List */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Family Decisions & Ritual Inquiries</h3>
            <div className="text-xs text-slate-500 mt-0.5">
              {pendingCount > 0 ? (
                <span className="text-amber-700 font-semibold">{pendingCount} pending decisions</span>
              ) : (
                <span className="text-emerald-700 font-semibold">✓ All questions resolved</span>
              )} • {decidedCount} decided
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Decision
          </button>
        </div>

        <div className="space-y-3">
          {decisions.map((dec) => (
            <div 
              key={dec.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all bg-white text-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Inline Editable Question */}
                <EditableText
                  value={dec.question}
                  onSave={(val) => onUpdateDecision(dec.id, { question: val })}
                  className="font-bold text-sm text-slate-900"
                />

                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                    dec.status === 'Decided' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/80' : 'bg-amber-100 text-amber-800 border border-amber-200/80'
                  }`}>
                    {dec.status === 'Decided' ? '✓ Decided' : 'Pending'}
                  </span>

                  <button
                    onClick={() => {
                      setEditingDecision(dec);
                      setEditOptionsStr(dec.options.join(', '));
                    }}
                    title="Edit question parameters"
                    className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteDecision(dec.id)}
                    title="Delete question"
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-1.5">
                {dec.options.map((opt, idx) => {
                  const isSelected = dec.decision?.toLowerCase().includes(opt.toLowerCase());
                  return (
                    <button
                      key={idx}
                      onClick={() => onUpdateDecision(dec.id, { decision: opt, status: 'Decided' })}
                      className={`px-3 py-1 rounded-lg text-[11px] border transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Selected Answer with Inline Editing */}
              <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center">
                  <span className="text-slate-500 mr-2 font-medium">Selected Answer: </span>
                  <EditableText
                    value={dec.decision || ''}
                    placeholder="Click to type decision..."
                    onSave={(val) => onUpdateDecision(dec.id, { decision: val, status: val.trim() ? 'Decided' : 'Pending' })}
                    className="font-bold text-slate-900"
                  />
                </div>

                <select
                  value={dec.status}
                  onChange={(e) => onUpdateDecision(dec.id, { status: e.target.value as any })}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Add Family Decision Point</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleCreateDecision} className="mt-4 space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question / Decision *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bus transport for Bhavnagar relatives"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Options (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. AC Bus, Mini Travelers, Private Cars"
                  value={newOptionsStr}
                  onChange={(e) => setNewOptionsStr(e.target.value)}
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingDecision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Edit Decision Parameters</h3>
              <button onClick={() => setEditingDecision(null)} className="text-slate-400 hover:text-slate-700 text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={editingDecision.question}
                  onChange={(e) => setEditingDecision({ ...editingDecision, question: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Options (Comma separated)</label>
                <input
                  type="text"
                  value={editOptionsStr}
                  onChange={(e) => setEditOptionsStr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chosen Resolution / Decision</label>
                <input
                  type="text"
                  value={editingDecision.decision || ''}
                  onChange={(e) => setEditingDecision({ ...editingDecision, decision: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editingDecision.status}
                  onChange={(e) => setEditingDecision({ ...editingDecision, status: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="Pending">Pending</option>
                  <option value="Decided">Decided</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingDecision(null)} 
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-sm transition-colors"
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
