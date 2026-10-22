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
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center">
          <ShieldAlert className="w-4 h-4 mr-1 text-gray-700" />
          Critical Operational Rules & Constraints
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <strong className="text-gray-900 block font-semibold mb-0.5">1. Surat Police 10 PM Limit:</strong>
            Turn off high DJ sound strictly at 10:00 PM at Silver Farm. Bride entry & couple raas must happen before 10 PM.
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <strong className="text-gray-900 block font-semibold mb-0.5">2. 05:00 AM Jaan Departure:</strong>
            Groom side departs at 5 AM sharp. ICER truck mounted with 4 Base 4 Top & flowers ready at 4:30 AM.
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <strong className="text-gray-900 block font-semibold mb-0.5">3. Bride Makeup Slot:</strong>
            Start 2–3 PM, finish by 5:00–5:30 PM strictly to allow sunset portraits before dinner & Garba.
          </div>
        </div>
      </div>

      {/* Questions Tracker List */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-100">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">Family Decisions & Ritual Inquiries</h3>
            <div className="text-xs text-gray-500 mt-0.5">
              {pendingCount > 0 ? (
                <span className="text-amber-700 font-semibold">{pendingCount} pending decisions</span>
              ) : (
                <span className="text-emerald-700 font-semibold">✓ All questions resolved</span>
              )} • {decidedCount} decided
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Decision
          </button>
        </div>

        <div className="space-y-2.5">
          {decisions.map((dec) => (
            <div 
              key={dec.id}
              className="p-3.5 rounded-lg border border-gray-200 hover:border-gray-300 transition bg-white text-xs space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Inline Editable Question */}
                <EditableText
                  value={dec.question}
                  onSave={(val) => onUpdateDecision(dec.id, { question: val })}
                  className="font-bold text-sm text-gray-900"
                />

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                    dec.status === 'Decided' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {dec.status === 'Decided' ? '✓ Decided' : 'Pending'}
                  </span>

                  <button
                    onClick={() => {
                      setEditingDecision(dec);
                      setEditOptionsStr(dec.options.join(', '));
                    }}
                    title="Edit question parameters"
                    className="p-1 text-gray-400 hover:text-gray-900 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteDecision(dec.id)}
                    title="Delete question"
                    className="p-1 text-gray-400 hover:text-rose-600 transition"
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
                      className={`px-2.5 py-1 rounded text-[11px] border transition ${
                        isSelected
                          ? 'bg-gray-900 text-white border-gray-900 font-semibold shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Selected Answer with Inline Editing */}
              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-1.5 font-medium">Selected Answer: </span>
                  <EditableText
                    value={dec.decision || ''}
                    placeholder="Click to type decision..."
                    onSave={(val) => onUpdateDecision(dec.id, { decision: val, status: val.trim() ? 'Decided' : 'Pending' })}
                    className="font-semibold text-gray-900"
                  />
                </div>

                <select
                  value={dec.status}
                  onChange={(e) => onUpdateDecision(dec.id, { status: e.target.value as any })}
                  className="bg-gray-50 border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-gray-200 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-sm">Add Family Decision Point</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-lg">&times;</button>
            </div>

            <form onSubmit={handleCreateDecision} className="mt-3 space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Question / Decision *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bus transport for Bhavnagar relatives"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Options (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. AC Bus, Mini Travelers, Private Cars"
                  value={newOptionsStr}
                  onChange={(e) => setNewOptionsStr(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-gray-200">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-gray-900 text-white rounded font-semibold hover:bg-black">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingDecision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-gray-200 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-sm">Edit Decision Parameters</h3>
              <button onClick={() => setEditingDecision(null)} className="text-gray-400 hover:text-gray-700 text-lg">&times;</button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-3 space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={editingDecision.question}
                  onChange={(e) => setEditingDecision({ ...editingDecision, question: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Options (Comma separated)</label>
                <input
                  type="text"
                  value={editOptionsStr}
                  onChange={(e) => setEditOptionsStr(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Chosen Resolution / Decision</label>
                <input
                  type="text"
                  value={editingDecision.decision || ''}
                  onChange={(e) => setEditingDecision({ ...editingDecision, decision: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={editingDecision.status}
                  onChange={(e) => setEditingDecision({ ...editingDecision, status: e.target.value as any })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                >
                  <option value="Pending">Pending</option>
                  <option value="Decided">Decided</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-gray-200">
                <button type="button" onClick={() => setEditingDecision(null)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-gray-900 text-white rounded font-semibold hover:bg-black">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
