'use client';

import { useState } from 'react';
import { normalizeTags } from '@/lib/hourly';

interface TagInputProps {
  tags: string[];
  suggestions: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, suggestions, onChange }: TagInputProps) {
  const [draft, setDraft] = useState('');

  const commit = (raw: string) => {
    const next = normalizeTags([...tags, ...normalizeTags(raw)]);
    onChange(next);
    setDraft('');
  };

  const matches = draft.trim()
    ? suggestions.filter((s) => s.startsWith(draft.trim().toLowerCase().replace(/^#+/, '')) && !tags.includes(s)).slice(0, 5)
    : [];

  return (
    <div className="hourly-taginput">
      <div className="hourly-taginput-row">
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            className="hourly-tag hourly-tag--removable"
            onClick={() => onChange(tags.filter((x) => x !== t))}
            aria-label={`Remove tag ${t}`}
          >
            #{t} ×
          </button>
        ))}
        <input
          className="hourly-taginput-field"
          value={draft}
          placeholder={tags.length ? 'add tag' : 'tags (optional)'}
          autoCapitalize="none"
          autoCorrect="off"
          enterKeyHint="done"
          onChange={(e) => {
            const v = e.target.value;
            if (/[,\s]$/.test(v) && v.trim()) commit(v);
            else setDraft(v);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && draft.trim()) {
              e.preventDefault();
              commit(draft);
            } else if (e.key === 'Backspace' && !draft && tags.length) {
              onChange(tags.slice(0, -1));
            }
          }}
          onBlur={() => draft.trim() && commit(draft)}
        />
      </div>
      {matches.length > 0 && (
        <div className="hourly-suggestions">
          {matches.map((m) => (
            <button key={m} type="button" className="hourly-tag" onMouseDown={(e) => e.preventDefault()} onClick={() => commit(m)}>
              #{m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
