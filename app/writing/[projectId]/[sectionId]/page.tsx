'use client';

import { useEffect, useState, useRef, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ApiSection, ApiNote } from '@/lib/writing';
import { useProjectShell } from '@/components/writing/ProjectShellContext';

const AUTOSAVE_DELAY = 1500;
const LS_KEY = (id: string) => `writing_section_${id}`;

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type MobileTab = 'write' | 'sections' | 'notes';

export default function SectionEditorPage({
  params,
}: {
  params: Promise<{ projectId: string; sectionId: string }>;
}) {
  const { projectId, sectionId } = use(params);
  const router = useRouter();
  const { project, sections, labels, addSection, renameSection } = useProjectShell();

  const [section, setSection] = useState<ApiSection | null>(null);
  const [notes, setNotes] = useState<ApiNote[]>([]);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [noteInput, setNoteInput] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [notesOpen, setNotesOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('write');

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestContent = useRef<unknown>(null);

  const saveContent = useCallback(
    async (content: unknown) => {
      setSaveState('saving');
      try {
        const res = await fetch(`/api/sections/${sectionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
        if (res.ok) {
          localStorage.setItem(LS_KEY(sectionId), JSON.stringify(content));
          setSaveState('saved');
          setTimeout(() => setSaveState('idle'), 2000);
        } else {
          setSaveState('error');
        }
      } catch {
        setSaveState('error');
      }
    },
    [sectionId]
  );

  const flushSave = useCallback(() => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
      if (latestContent.current) saveContent(latestContent.current);
    }
  }, [saveContent]);

  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: { class: 'writing-editor-body' },
    },
    onUpdate({ editor }) {
      const content = editor.getJSON();
      latestContent.current = content;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveContent(content), AUTOSAVE_DELAY);
    },
    onBlur: () => flushSave(),
  });

  useEffect(() => {
    fetchSection();
    return () => flushSave();
  }, [sectionId]);

  // Tab close / reload: localStorage write is synchronous, the fetch uses
  // keepalive so it has a chance to finish after the page starts unloading.
  useEffect(() => {
    function handleBeforeUnload() {
      if (saveTimer.current && latestContent.current) {
        clearTimeout(saveTimer.current);
        localStorage.setItem(LS_KEY(sectionId), JSON.stringify(latestContent.current));
        fetch(`/api/sections/${sectionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: latestContent.current }),
          keepalive: true,
        });
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sectionId]);

  async function fetchSection() {
    const res = await fetch(`/api/sections/${sectionId}`);

    if (res.status === 404) { router.push(`/writing/${projectId}`); return; }

    if (res.ok) {
      const data: ApiSection & { notes: ApiNote[] } = await res.json();
      setSection(data);
      setTitleValue(data.title);
      setNotes(data.notes ?? []);

      let content = data.content;
      const lsContent = localStorage.getItem(LS_KEY(sectionId));
      if ((!content || (typeof content === 'object' && Object.keys(content as object).length === 0)) && lsContent) {
        try { content = JSON.parse(lsContent); } catch { /* keep db content */ }
      }
      if (editor && content && typeof content === 'object' && Object.keys(content as object).length > 0) {
        editor.commands.setContent(content);
      }
    }
  }

  useEffect(() => {
    if (editor && section?.content && typeof section.content === 'object' && Object.keys(section.content as object).length > 0) {
      editor.commands.setContent(section.content);
    }
  }, [editor]);

  async function handleTitleSave() {
    if (!titleValue.trim() || titleValue === section?.title) {
      setEditingTitle(false);
      setTitleValue(section?.title ?? '');
      return;
    }
    await fetch(`/api/sections/${sectionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titleValue.trim() }),
    });
    setSection((prev) => prev ? { ...prev, title: titleValue.trim() } : prev);
    renameSection(sectionId, titleValue.trim());
    setEditingTitle(false);
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteInput.trim()) return;
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectionId, body: noteInput.trim() }),
    });
    if (res.ok) {
      const note: ApiNote = await res.json();
      setNotes((prev) => [...prev, note]);
      setNoteInput('');
      setAddingNote(false);
    }
  }

  async function handleDeleteNote(id: string) {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function handleManualSave() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (editor) saveContent(editor.getJSON());
  }

  async function handleAddSection() {
    const newSection = await addSection();
    if (newSection) {
      router.push(`/writing/${projectId}/${newSection.id}`);
      setMobileTab('write');
    }
  }

  const currentIndex = sections.findIndex((s) => s.id === sectionId);
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  // Shared notes panel content used by both desktop aside and mobile tab
  const notesPanelContent = (
    <>
      <div className="writing-notes-list">
        {notes.length === 0 && <p className="writing-notes-empty">No notes yet.</p>}
        {notes.map((note) => (
          <div key={note.id} className="writing-note">
            <p className="writing-note-body">{note.body}</p>
            <button onClick={() => handleDeleteNote(note.id)} className="writing-note-delete">×</button>
          </div>
        ))}
      </div>
      {addingNote ? (
        <form onSubmit={handleAddNote} className="writing-note-form">
          <textarea
            autoFocus
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Add a note…"
            className="input input--textarea"
            rows={3}
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="submit" disabled={!noteInput.trim()} className="btn btn--primary" style={{ fontSize: '0.65rem', padding: '0.35rem 0.75rem' }}>Add</button>
            <button type="button" onClick={() => { setAddingNote(false); setNoteInput(''); }} className="btn btn--text" style={{ fontSize: '0.65rem', padding: '0.35rem 0.75rem' }}>Cancel</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setAddingNote(true)} className="btn btn--outline" style={{ margin: '0.75rem', fontSize: '0.65rem', padding: '0.4rem 0.9rem' }}>
          + Add Note
        </button>
      )}
    </>
  );

  return (
    <>
      {/* ── Main area ── */}
      <main className="writing-editor-main">

        {/* Top bar — shared desktop/mobile */}
        <div className="writing-editor-topbar">
          {/* Mobile: back link + project name */}
          <div className="writing-topbar-mobile-brand">
            <Link href={`/writing/${projectId}`} className="writing-sidebar-back">← {project?.title ?? 'Back'}</Link>
          </div>

          <div className="writing-editor-title-area">
            {editingTitle ? (
              <input
                autoFocus
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSave();
                  if (e.key === 'Escape') { setEditingTitle(false); setTitleValue(section?.title ?? ''); }
                }}
                className="input input--lg"
              />
            ) : (
              <h2
                className="writing-editor-section-title"
                onClick={() => setEditingTitle(true)}
                title="Click to rename"
              >
                {section?.title ?? '…'}
              </h2>
            )}
          </div>

          <div className="writing-editor-topbar-right">
            {/* Desktop-only notes toggle */}
            <button
              onClick={() => setNotesOpen((o) => !o)}
              className={`writing-notes-toggle writing-desktop-only ${notesOpen ? 'writing-notes-toggle--open' : ''}`}
              title="Toggle notes"
            >
              Notes {notes.length > 0 && <span className="writing-notes-count">{notes.length}</span>}
            </button>
          </div>
        </div>

        {/* Mobile: sections tab panel */}
        {mobileTab === 'sections' && (
          <div className="writing-mobile-panel writing-mobile-only">
            <div className="writing-mobile-panel-header">
              <span className="writing-sidebar-label">{labels.plural}</span>
              <button onClick={handleAddSection} className="writing-sidebar-new" style={{ margin: 0 }}>
                {labels.newLabel}
              </button>
            </div>
            <div className="writing-mobile-section-list">
              {sections.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => { router.push(`/writing/${projectId}/${s.id}`); setMobileTab('write'); }}
                  className={`writing-mobile-section-item ${s.id === sectionId ? 'writing-mobile-section-item--active' : ''}`}
                >
                  <span className="writing-sidebar-section-num">{i + 1}</span>
                  <span className="writing-sidebar-section-name">{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile: notes tab panel */}
        {mobileTab === 'notes' && (
          <div className="writing-mobile-panel writing-mobile-only">
            <div className="writing-mobile-panel-header">
              <span className="writing-sidebar-label">Notes</span>
            </div>
            {notesPanelContent}
          </div>
        )}

        {/* Editor — hidden on mobile when not on write tab */}
        <div className={`writing-editor-content ${mobileTab !== 'write' ? 'writing-mobile-hidden' : ''}`}>
          <EditorContent editor={editor} />
        </div>

        {/* Prev/next nav — only on write tab */}
        {mobileTab === 'write' && (prevSection || nextSection) && (
          <div className="writing-editor-nav">
            {prevSection ? (
              <Link href={`/writing/${projectId}/${prevSection.id}`} className="writing-prev-next">
                ← {prevSection.title}
              </Link>
            ) : <span />}
            {nextSection && (
              <Link href={`/writing/${projectId}/${nextSection.id}`} className="writing-prev-next">
                {nextSection.title} →
              </Link>
            )}
          </div>
        )}

        {/* Save bar — fixed at the bottom of the writing area, centered */}
        {mobileTab === 'write' && (
          <div className="writing-save-bar">
            <button
              onClick={handleManualSave}
              disabled={saveState === 'saving'}
              className="btn btn--outline"
              style={{ fontSize: '0.65rem', padding: '0.4rem 0.9rem' }}
            >
              Save
            </button>
            <span className={`writing-save-indicator writing-save-indicator--${saveState}`}>
              {saveState === 'saving' && 'Saving…'}
              {saveState === 'saved' && 'Saved'}
              {saveState === 'error' && 'Save failed'}
            </span>
          </div>
        )}
      </main>

      {/* ── Desktop notes panel ── */}
      {notesOpen && (
        <aside className="writing-notes-panel writing-desktop-only">
          <div className="writing-notes-header">
            <span className="writing-sidebar-label">Notes</span>
            <button onClick={() => setNotesOpen(false)} className="writing-notes-close">×</button>
          </div>
          {notesPanelContent}
        </aside>
      )}

      {/* ── Mobile bottom tab bar ── */}
      <nav className="nav-tabs writing-mobile-only" style={{ height: '56px' }}>
        {([
          { id: 'write', label: 'Write', icon: '✏️' },
          { id: 'sections', label: labels.plural, icon: '☰' },
          { id: 'notes', label: `Notes${notes.length > 0 ? ` (${notes.length})` : ''}`, icon: '📝' },
        ] as { id: MobileTab; label: string; icon: string }[]).map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setMobileTab(id)}
            className={`nav-tab ${mobileTab === id ? 'nav-tab--active' : ''}`}
          >
            <span className="nav-tab-icon">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
