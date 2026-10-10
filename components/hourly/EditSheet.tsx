'use client';

import { useState } from 'react';
import { HourlyEntry } from '@/types';
import { normalizeTags } from '@/lib/hourly';
import TagInput from './TagInput';

interface EditSheetProps {
  entry: HourlyEntry;
  tagSuggestions: string[];
  onSave: (id: string, changes: { message?: string; tags?: string[]; loggedAt?: string }) => Promise<boolean>;
  onDelete: (id: string) => void;
  onShowHistory: (entry: HourlyEntry) => void;
  onClose: () => void;
}

/** ISO string -> value for <input type="datetime-local"> in local time. */
function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditSheet({ entry, tagSuggestions, onSave, onDelete, onShowHistory, onClose }: EditSheetProps) {
  const [message, setMessage] = useState(entry.message);
  const [tags, setTags] = useState(entry.tags);
  const [when, setWhen] = useState(toLocalInput(entry.loggedAt));
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = async () => {
    if (!message.trim() || saving) return;
    const changes: { message?: string; tags?: string[]; loggedAt?: string } = {};
    if (message.trim() !== entry.message) changes.message = message.trim();
    if (normalizeTags(tags).join(',') !== entry.tags.join(',')) changes.tags = tags;
    if (when && when !== toLocalInput(entry.loggedAt)) changes.loggedAt = new Date(when).toISOString();
    if (Object.keys(changes).length === 0) return onClose();
    setSaving(true);
    const ok = await onSave(entry.id, changes);
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <div className="hourly-sheet-backdrop" onClick={onClose}>
      <div className="hourly-sheet" role="dialog" aria-label="Edit entry" onClick={(e) => e.stopPropagation()}>
        <div className="hourly-sheet-header">
          <h2 className="hourly-sheet-title">Edit entry</h2>
          <button type="button" className="btn btn--text" onClick={onClose}>Cancel</button>
        </div>

        <label className="hourly-field-label" htmlFor="hourly-edit-message">Message</label>
        <input id="hourly-edit-message" className="input" value={message} maxLength={200} onChange={(e) => setMessage(e.target.value)} />

        <label className="hourly-field-label">Tags</label>
        <TagInput tags={tags} suggestions={tagSuggestions} onChange={setTags} />

        <label className="hourly-field-label" htmlFor="hourly-edit-time">Finished at</label>
        <input id="hourly-edit-time" className="input" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />

        {!!entry.editCount && (
          <button type="button" className="btn btn--link hourly-history-link" onClick={() => onShowHistory(entry)}>
            Edited {entry.editCount} {entry.editCount === 1 ? 'time' : 'times'} · view history
          </button>
        )}

        <div className="hourly-sheet-actions">
          {confirmDelete ? (
            <>
              <button type="button" className="btn btn--danger" onClick={() => { onDelete(entry.id); onClose(); }}>
                Delete for good
              </button>
              <button type="button" className="btn btn--text" onClick={() => setConfirmDelete(false)}>Keep</button>
            </>
          ) : (
            <button type="button" className="btn btn--text" onClick={() => setConfirmDelete(true)}>Delete</button>
          )}
          <button type="button" className="btn btn--primary" disabled={saving || !message.trim()} onClick={save}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
