'use client';

import { useEffect, useState } from 'react';
import { HourlyEdit, HourlyEntry } from '@/types';
import { diffWords } from '@/lib/hourly';

interface HistorySheetProps {
  entry: HourlyEntry;
  onClose: () => void;
}

interface Version {
  message: string;
  tags: string[];
  loggedAt: string;
  at: string | null; // when this version was replaced; null = current
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export default function HistorySheet({ entry, onClose }: HistorySheetProps) {
  const [edits, setEdits] = useState<HourlyEdit[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`/api/hourly/entries/${entry.id}/edits`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then(({ edits }) => setEdits(edits))
      .catch(() => setFailed(true));
  }, [entry.id]);

  // Edit i stores the state BEFORE edit i, so versions = [prev of each edit..., current].
  const versions: Version[] = edits
    ? [
        ...edits.map((e) => ({ message: e.prevMessage, tags: e.prevTags, loggedAt: e.prevLoggedAt, at: e.editedAt })),
        { message: entry.message, tags: entry.tags, loggedAt: entry.loggedAt, at: null },
      ]
    : [];

  return (
    <div className="hourly-sheet-backdrop" onClick={onClose}>
      <div className="hourly-sheet" role="dialog" aria-label="Edit history" onClick={(e) => e.stopPropagation()}>
        <div className="hourly-sheet-header">
          <h2 className="hourly-sheet-title">Edit history</h2>
          <button type="button" className="btn btn--text" onClick={onClose}>Close</button>
        </div>
        {failed && <p className="hourly-muted">Could not load history.</p>}
        {!edits && !failed && <p className="hourly-muted">Loading…</p>}
        {edits && edits.length === 0 && <p className="hourly-muted">No edits yet.</p>}
        <ol className="hourly-history">
          {versions.map((v, i) => {
            const prev = versions[i - 1];
            const parts = prev ? diffWords(prev.message, v.message) : null;
            const tagsChanged = prev && prev.tags.join(',') !== v.tags.join(',');
            const timeChanged = prev && prev.loggedAt !== v.loggedAt;
            return (
              <li key={i} className="hourly-history-item">
                <div className="hourly-history-label">
                  {i === 0 ? 'Original' : `Edit ${i}`}
                  {v.at === null ? ' · current' : ''}
                  {i > 0 && edits && <span> · {fmt(edits[i - 1].editedAt)}</span>}
                </div>
                <p className="hourly-history-message">
                  {parts
                    ? parts.map((p, k) => (
                        <span key={k} className={`hourly-diff hourly-diff--${p.type}`}>
                          {p.text}{' '}
                        </span>
                      ))
                    : v.message}
                </p>
                {tagsChanged && <p className="hourly-history-meta">Tags: {v.tags.map((t) => `#${t}`).join(' ') || 'none'}</p>}
                {timeChanged && <p className="hourly-history-meta">Time: {fmt(v.loggedAt)}</p>}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
