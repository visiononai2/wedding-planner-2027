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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-gray-400">Total Notes</div>
          <div className="text-lg font-bold text-gray-900 mt-0.5">{notes.length}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Aggregated overall notes</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-gray-400">Pinned / Critical</div>
          <div className="text-lg font-bold text-amber-700 mt-0.5">{pinnedCount}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">Quick access rules & specs</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-gray-400">Active Topics</div>
          <div className="text-lg font-bold text-gray-900 mt-0.5">{CATEGORIES.length}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Rituals, DJ, Food, Outfits</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-400">Actions</div>
            <button
              onClick={handleExportAll}
              className="mt-1 inline-flex items-center text-xs font-semibold text-gray-700 hover:text-gray-900 underline underline-offset-2"
            >
              <Download className="w-3.5 h-3.5 mr-1 text-gray-500" />
              Export All Notes (.md)
            </button>
          </div>
          <FileText className="w-5 h-5 text-gray-400 shrink-0" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search in notes, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1 bg-gray-50 border border-gray-300 rounded text-xs text-gray-900 w-44 sm:w-56 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-gray-50 border border-gray-300 text-gray-800 rounded px-2.5 py-1"
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
            className={`px-2.5 py-1 rounded border text-xs font-medium transition flex items-center ${
              showPinnedOnly
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <Pin className="w-3 h-3 mr-1" />
            Pinned Only ({pinnedCount})
          </button>

          <span className="text-gray-500 font-medium ml-1 hidden sm:inline">
            Showing <strong>{sortedNotes.length}</strong> notes
          </span>
        </div>

        <button
          onClick={() => {
            setNewCategory(selectedCategory !== 'ALL' ? selectedCategory : 'General');
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-black text-white font-semibold text-xs transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Planning Note
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sortedNotes.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-8 text-center border border-gray-200 text-xs text-gray-500">
            No planning notes match the current filter. Click "+ Add Planning Note" to aggregate new notes.
          </div>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`bg-white rounded-xl p-4 border transition shadow-sm space-y-3 flex flex-col justify-between ${
                note.pinned 
                  ? 'border-amber-300 ring-1 ring-amber-200/60' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div>
                {/* Note Header: Category, Pin Toggle & Actions */}
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-gray-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                      {note.category}
                    </span>

                    {note.pinned && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center">
                        <Pin className="w-2.5 h-2.5 mr-1 fill-amber-700" />
                        Pinned
                      </span>
                    )}

                    <span className="text-[10px] text-gray-400">
                      Updated {note.updatedAt}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {/* Pin/Unpin Button */}
                    <button
                      onClick={() => onUpdateNote(note.id, { pinned: !note.pinned })}
                      title={note.pinned ? "Unpin note" : "Pin note to top"}
                      className={`p-1 rounded transition ${
                        note.pinned 
                          ? 'text-amber-600 hover:bg-amber-50' 
                          : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-amber-600' : ''}`} />
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyNote(note)}
                      title="Copy note text"
                      className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
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
                      className="p-1 rounded text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition"
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
                      className="p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
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
                    className="font-bold text-sm text-gray-900 block"
                  />
                </div>

                {/* Inline Editable Content with Preserved Line Breaks */}
                <div className="mt-2 text-xs text-gray-700 bg-gray-50/80 p-2.5 rounded-lg border border-gray-150 whitespace-pre-line leading-relaxed">
                  <EditableText
                    value={note.content}
                    multiline
                    onSave={(val) => onUpdateNote(note.id, { content: val, updatedAt: '2026-10-22' })}
                    className="text-gray-800 block text-xs"
                  />
                </div>
              </div>

              {/* Tags Row */}
              {note.tags && note.tags.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-gray-100">
                  <Tag className="w-3 h-3 text-gray-400 mr-0.5" />
                  {note.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-gray-200 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-sm">Add New Planning Note</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-lg">&times;</button>
            </div>

            <form onSubmit={handleCreateNote} className="mt-3 space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Note Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandvo Dome Tent Specifications"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as NoteCategory)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Mandvo, Dome, Farm"
                    value={newTagsStr}
                    onChange={(e) => setNewTagsStr(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Note Content & Details *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Aggregate thoughts, bullet points, vendor numbers, or checklists here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 font-mono text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pinNote"
                  checked={newPinned}
                  onChange={(e) => setNewPinned(e.target.checked)}
                  className="rounded text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="pinNote" className="text-gray-700 font-medium cursor-pointer">
                  Pin to top of Planning Notes (Highlight as critical)
                </label>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-gray-900 text-white rounded font-semibold hover:bg-black"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-gray-200 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-sm">Edit Planning Note</h3>
              <button onClick={() => setEditingNote(null)} className="text-gray-400 hover:text-gray-700 text-lg">&times;</button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-3 space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Note Title *</label>
                <input
                  type="text"
                  required
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={editingNote.category}
                    onChange={(e) => setEditingNote({ ...editingNote, category: e.target.value as NoteCategory })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={editTagsStr}
                    onChange={(e) => setEditTagsStr(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Note Content & Details *</label>
                <textarea
                  rows={6}
                  required
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 font-mono text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="editPinNote"
                  checked={editingNote.pinned}
                  onChange={(e) => setEditingNote({ ...editingNote, pinned: e.target.checked })}
                  className="rounded text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="editPinNote" className="text-gray-700 font-medium cursor-pointer">
                  Pin to top of Planning Notes (Highlight as critical)
                </label>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => setEditingNote(null)} 
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-gray-900 text-white rounded font-semibold hover:bg-black"
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
