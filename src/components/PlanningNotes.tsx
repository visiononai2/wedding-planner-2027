import React, { useState } from 'react';
import { 
  FileText, 
  Pin, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  Download, 
  Tag, 
  Clock,
  Sparkles,
  Share2
} from 'lucide-react';
import { PlanningNote, NoteCategory } from '../types/wedding';
import { EditableText } from './EditableText';

interface PlanningNotesProps {
  notes: PlanningNote[];
  onAddNote: (note: Omit<PlanningNote, 'id' | 'updatedAt'>) => void;
  onUpdateNote: (id: string, updates: Partial<PlanningNote>) => void;
  onDeleteNote: (id: string) => void;
}

const CATEGORIES: NoteCategory[] = [
  'General',
  'Rituals & Traditions',
  'Sound & Technical',
  'Venue & Food',
  'Outfits & Styling',
  'Family & Fiance'
];

export const PlanningNotes: React.FC<PlanningNotesProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add Note Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<NoteCategory>('General');
  const [newContent, setNewContent] = useState('');
  const [newTagsStr, setNewTagsStr] = useState('');
  const [newPinned, setNewPinned] = useState(false);

  // Edit Note Modal
  const [editingNote, setEditingNote] = useState<PlanningNote | null>(null);
  const [editTagsStr, setEditTagsStr] = useState('');

  // Keyboard Escape listener for modals
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAddModalOpen) setIsAddModalOpen(false);
        if (editingNote) setEditingNote(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen, editingNote]);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tags = newTagsStr
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onAddNote({
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      pinned: newPinned,
      tags: tags.length > 0 ? tags : undefined
    });

    setNewTitle('');
    setNewCategory('General');
    setNewContent('');
    setNewTagsStr('');
    setNewPinned(false);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote || !editingNote.title.trim()) return;

    const tags = editTagsStr
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onUpdateNote(editingNote.id, {
      title: editingNote.title.trim(),
      category: editingNote.category,
      content: editingNote.content.trim(),
      pinned: editingNote.pinned,
      tags: tags.length > 0 ? tags : undefined,
      updatedAt: '2026-10-22'
    });

    setEditingNote(null);
  };

  const handleCopyNote = (note: PlanningNote) => {
    const text = `📌 ${note.title} (${note.category})\n\n${note.content}\n\nTags: ${note.tags?.join(', ') || 'None'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAll = () => {
    let output = `# Wedding Overall Planning Notes\nAggregated on 2026-10-22 | Wedding: Feb 21, 2027\n\n`;
    notes.forEach((note, index) => {
      output += `## ${index + 1}. ${note.title} [${note.category}]\n`;
      if (note.pinned) output += `> Status: Pinned / High Priority\n`;
      if (note.tags && note.tags.length > 0) output += `> Tags: ${note.tags.join(', ')}\n`;
      output += `\n${note.content}\n\n---\n\n`;
    });

    const blob = new Blob([output], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-overall-notes-2026-10-22.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered notes
  const filteredNotes = notes.filter(n => {
    if (selectedCategory !== 'ALL' && n.category !== selectedCategory) return false;
    if (showPinnedOnly && !n.pinned) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags?.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Sort pinned first, then by title or updated
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const pinnedCount = notes.filter(n => n.pinned).length;

  return (
    <div className="space-y-4">
      {/* Overview & Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Notes</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{notes.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Aggregated overall notes</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Pinned / Critical</div>
          <div className="text-xl font-bold text-amber-700 mt-1">{pinnedCount}</div>
          <div className="text-[11px] text-amber-600 mt-0.5">Quick access rules & specs</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Active Topics</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{CATEGORIES.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Rituals, DJ, Food, Outfits</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Actions</div>
            <button
              onClick={handleExportAll}
              className="mt-1.5 inline-flex items-center text-xs font-semibold text-slate-700 hover:text-indigo-600 underline underline-offset-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Export Notes (.md)
            </button>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search in notes, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 w-44 sm:w-60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Categories ({notes.length})</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat} ({notes.filter(n => n.category === cat).length})
              </option>
            ))}
          </select>

          {/* Pinned filter toggle */}
          <button
            onClick={() => setShowPinnedOnly(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center ${
              showPinnedOnly
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Pin className="w-3 h-3 mr-1" />
            Pinned Only ({pinnedCount})
          </button>

          <span className="text-slate-400 font-medium ml-1 hidden sm:inline">
            Showing <strong className="text-slate-700">{sortedNotes.length}</strong> notes
          </span>
        </div>

        <button
          onClick={() => {
            setNewCategory(selectedCategory !== 'ALL' ? selectedCategory : 'General');
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Planning Note
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {sortedNotes.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200 text-xs text-slate-400">
            No planning notes match the current filter. Click "+ Add Planning Note" to aggregate new notes.
          </div>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-sm space-y-3 flex flex-col justify-between ${
                note.pinned 
                  ? 'border-amber-300 ring-2 ring-amber-200/50 bg-gradient-to-b from-amber-50/20 to-white' 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Note Header: Category, Pin Toggle & Actions */}
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
                      {note.category}
                    </span>

                    {note.pinned && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200/80 flex items-center">
                        <Pin className="w-2.5 h-2.5 mr-1 fill-amber-700" />
                        Pinned
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400 font-medium">
                      Updated {note.updatedAt}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {/* Pin/Unpin Button */}
                    <button
                      onClick={() => onUpdateNote(note.id, { pinned: !note.pinned })}
                      title={note.pinned ? "Unpin note" : "Pin note to top"}
                      className={`p-1.5 rounded-lg transition-colors ${
                        note.pinned 
                          ? 'text-amber-600 hover:bg-amber-50' 
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-amber-600' : ''}`} />
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyNote(note)}
                      title="Copy note text"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      {copiedId === note.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Edit Modal Button */}
                    <button
                      onClick={() => {
                        setEditingNote(note);
                        setEditTagsStr(note.tags?.join(', ') || '');
                      }}
                      title="Full edit modal"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete note "${note.title}"?`)) {
                          onDeleteNote(note.id);
                        }
                      }}
                      title="Delete note"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Inline Editable Title */}
                <div className="mt-2.5">
                  <EditableText
                    value={note.title}
                    onSave={(val) => onUpdateNote(note.id, { title: val, updatedAt: '2026-10-22' })}
                    className="font-bold text-sm sm:text-base text-slate-900 block"
                  />
                </div>

                {/* Inline Editable Content with Preserved Line Breaks */}
                <div className="mt-2 text-xs text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 whitespace-pre-line leading-relaxed">
                  <EditableText
                    value={note.content}
                    multiline
                    onSave={(val) => onUpdateNote(note.id, { content: val, updatedAt: '2026-10-22' })}
                    className="text-slate-800 block text-xs"
                  />
                </div>
              </div>

              {/* Tags Row */}
              {note.tags && note.tags.length > 0 && (
                <div className="pt-2.5 flex flex-wrap items-center gap-1.5 border-t border-slate-100">
                  <Tag className="w-3 h-3 text-slate-400 mr-0.5" />
                  {note.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Note Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Add New Planning Note</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleCreateNote} className="mt-4 space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Note Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandvo Dome Tent Specifications"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as NoteCategory)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Mandvo, Dome, Farm"
                    value={newTagsStr}
                    onChange={(e) => setNewTagsStr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Note Content & Details *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Aggregate thoughts, bullet points, vendor numbers, or checklists here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pinNote"
                  checked={newPinned}
                  onChange={(e) => setNewPinned(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="pinNote" className="text-slate-700 font-medium cursor-pointer">
                  Pin to top of Planning Notes (Highlight as critical)
                </label>
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
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Edit Planning Note</h3>
              <button onClick={() => setEditingNote(null)} className="text-slate-400 hover:text-slate-700 text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Note Title *</label>
                <input
                  type="text"
                  required
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingNote.category}
                    onChange={(e) => setEditingNote({ ...editingNote, category: e.target.value as NoteCategory })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={editTagsStr}
                    onChange={(e) => setEditTagsStr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Note Content & Details *</label>
                <textarea
                  rows={6}
                  required
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="editPinNote"
                  checked={editingNote.pinned}
                  onChange={(e) => setEditingNote({ ...editingNote, pinned: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="editPinNote" className="text-slate-700 font-medium cursor-pointer">
                  Pin to top of Planning Notes (Highlight as critical)
                </label>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingNote(null)} 
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-sm transition-colors"
                >
                  Update Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
