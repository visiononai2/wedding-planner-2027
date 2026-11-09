import React, { useState } from 'react';
import { 
  Pin, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
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
    <div className="space-y-6 sm:space-y-7">
      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400 stroke-[1.5]" />
            <input
              type="text"
              placeholder="Search in notes, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 w-44 sm:w-64 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-slate-50 border border-slate-200/80 text-slate-700 rounded-xl px-3.5 py-2 text-xs hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all cursor-pointer font-sans"
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
            className={`px-3.5 py-2 rounded-xl border text-xs font-sans font-medium transition-all flex items-center cursor-pointer ${
              showPinnedOnly
                ? 'bg-amber-50 text-amber-800 border-amber-200/70 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
            }`}
          >
            <Pin className="w-3 h-3 mr-1.5 text-[#B89230] stroke-[1.5]" />
            Pinned Only ({pinnedCount})
          </button>
        </div>

        <button
          onClick={() => {
            setNewCategory(selectedCategory !== 'ALL' ? selectedCategory : 'General');
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-sans font-semibold text-xs transition-all shadow-xs hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5 stroke-[1.5]" />
          Add Planning Note
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sortedNotes.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200 text-xs text-slate-400 font-serif italic">
            No planning notes match the current filter. Click "+ Add Planning Note" to aggregate new notes.
          </div>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md space-y-4 flex flex-col justify-between ${
                note.pinned 
                  ? 'border-amber-300/80 ring-2 ring-amber-400/20 bg-amber-50/10' 
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Note Header: Category, Pin Toggle & Actions */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/70">
                      {note.category}
                    </span>

                    {note.pinned && (
                      <span className="text-[10px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 flex items-center">
                        <Pin className="w-2.5 h-2.5 mr-1 fill-[#B89230] text-[#B89230]" />
                        Pinned
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400 font-sans">
                      Updated {note.updatedAt}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {/* Pin/Unpin Button */}
                    <button
                      onClick={() => onUpdateNote(note.id, { pinned: !note.pinned })}
                      title={note.pinned ? "Unpin note" : "Pin note to top"}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        note.pinned 
                          ? 'text-[#B89230] bg-amber-50/60' 
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Pin className={`w-3.5 h-3.5 stroke-[1.5] ${note.pinned ? 'fill-[#B89230]' : ''}`} />
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyNote(note)}
                      title="Copy note text"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {copiedId === note.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[1.5]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 stroke-[1.5]" />
                      )}
                    </button>

                    {/* Edit Modal Button */}
                    <button
                      onClick={() => {
                        setEditingNote(note);
                        setEditTagsStr(note.tags?.join(', ') || '');
                      }}
                      title="Full edit modal"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete note "${note.title}"?`)) {
                          onDeleteNote(note.id);
                        }
                      }}
                      title="Delete note"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>
                  </div>
                </div>

                {/* Inline Editable Title */}
                <div className="mt-3.5">
                  <EditableText
                    value={note.title}
                    onSave={(val) => onUpdateNote(note.id, { title: val, updatedAt: '2026-10-22' })}
                    className="font-serif font-medium text-base text-slate-900 block tracking-wide"
                  />
                </div>

                {/* Inline Editable Content with Preserved Line Breaks */}
                <div className="mt-3 text-xs text-slate-700 bg-slate-50/80 p-4 rounded-xl border border-slate-200/70 whitespace-pre-line leading-relaxed font-sans">
                  <EditableText
                    value={note.content}
                    multiline
                    onSave={(val) => onUpdateNote(note.id, { content: val, updatedAt: '2026-10-22' })}
                    className="text-slate-700 block text-xs"
                  />
                </div>
              </div>

              {/* Tags Row */}
              {note.tags && note.tags.length > 0 && (
                <div className="pt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100">
                  <Tag className="w-3 h-3 text-slate-400 mr-1 stroke-[1.5]" />
                  {note.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-[0_24px_70px_rgba(15,23,42,0.18)] border border-slate-200/90 text-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="font-serif font-medium text-slate-900 text-base">Add New Planning Note</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-full transition-colors cursor-pointer text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleCreateNote} className="mt-5 space-y-4 font-sans">
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Note Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandvo Dome Tent Specifications"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1.5">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as NoteCategory)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all cursor-pointer font-medium"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1.5">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Mandvo, Dome, Farm"
                    value={newTagsStr}
                    onChange={(e) => setNewTagsStr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Note Content & Details *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Aggregate thoughts, bullet points, vendor numbers, or checklists here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all font-sans text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pinNote"
                  checked={newPinned}
                  onChange={(e) => setNewPinned(e.target.checked)}
                  className="rounded text-[#B89230] focus:ring-[#D4AF37] cursor-pointer"
                />
                <label htmlFor="pinNote" className="text-slate-700 font-medium cursor-pointer">
                  Pin to top of Planning Notes (Highlight as critical)
                </label>
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
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-[0_24px_70px_rgba(15,23,42,0.18)] border border-slate-200/90 text-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="font-serif font-medium text-slate-900 text-base">Edit Planning Note</h3>
              <button onClick={() => setEditingNote(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-full transition-colors cursor-pointer text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4 font-sans">
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Note Title *</label>
                <input
                  type="text"
                  required
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1.5">Category</label>
                  <select
                    value={editingNote.category}
                    onChange={(e) => setEditingNote({ ...editingNote, category: e.target.value as NoteCategory })}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all cursor-pointer font-medium"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1.5">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={editTagsStr}
                    onChange={(e) => setEditTagsStr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Note Content & Details *</label>
                <textarea
                  rows={6}
                  required
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white focus:border-[#D4AF37] transition-all font-sans text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="editPinNote"
                  checked={editingNote.pinned}
                  onChange={(e) => setEditingNote({ ...editingNote, pinned: e.target.checked })}
                  className="rounded text-[#B89230] focus:ring-[#D4AF37] cursor-pointer"
                />
                <label htmlFor="editPinNote" className="text-slate-700 font-medium cursor-pointer">
                  Pin to top of Planning Notes (Highlight as critical)
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-2.5 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingNote(null)} 
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-medium rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-xs shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
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