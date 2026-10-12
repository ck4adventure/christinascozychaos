'use client';

import { useState } from 'react';
import { MAX_TAG_LENGTH, normalizeTag } from '@/lib/hourly';

interface NewTagModalProps {
  existing: string[];
  onSubmit: (tag: string) => void;
  onClose: () => void;
}

export default function NewTagModal({ existing, onSubmit, onClose }: NewTagModalProps) {
  const [name, setName] = useState('');
  const tag = normalizeTag(name);
  const alreadyExists = tag !== '' && existing.includes(tag);

  return (
    <div
      className="hourly-modal-backdrop"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <form
        className="hourly-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hourly-newtag-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (tag) onSubmit(tag);
        }}
      >
        <h2 id="hourly-newtag-title" className="hourly-sheet-title">New tag</h2>
        <label className="hourly-field-label" htmlFor="hourly-newtag-input">Tag name</label>
        <input
          id="hourly-newtag-input"
          className="input hourly-newtag-input"
          value={name}
          maxLength={MAX_TAG_LENGTH + 10}
          autoFocus
          autoCapitalize="none"
          autoCorrect="off"
          enterKeyHint="done"
          placeholder="e.g. gardening"
          onChange={(e) => setName(e.target.value)}
        />
        <p className="hourly-muted hourly-newtag-hint" aria-live="polite">
          {tag === ''
            ? 'Letters, numbers, hyphens. Spaces become hyphens.'
            : alreadyExists
              ? `#${tag} already exists, so it will just be selected.`
              : `Will be saved as #${tag}`}
        </p>
        <div className="hourly-sheet-actions">
          <button type="button" className="btn btn--text" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--primary" disabled={tag === ''}>
            {alreadyExists ? 'Select tag' : 'Add tag'}
          </button>
        </div>
      </form>
    </div>
  );
}
