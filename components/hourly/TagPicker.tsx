'use client';

import { useEffect, useId, useRef, useState } from 'react';
import NewTagModal from './NewTagModal';

interface TagPickerProps {
  selected: string[];
  options: string[];
  onChange: (tags: string[]) => void;
  /** Called when a brand-new tag is created so the parent can keep offering it. */
  onCreateTag: (tag: string) => void;
  /** Which way the menu opens; use "up" for controls pinned to the bottom of the screen. */
  direction?: 'up' | 'down';
}

export default function TagPicker({ selected, options, onChange, onCreateTag, direction = 'up' }: TagPickerProps) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const toggle = (tag: string) =>
    onChange(selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag]);

  const handleCreate = (tag: string) => {
    onCreateTag(tag);
    if (!selected.includes(tag)) onChange([...selected, tag]);
    setCreating(false);
  };

  return (
    <div className="hourly-tagpicker" ref={rootRef}>
      <div className="hourly-tagpicker-row">
        <button
          type="button"
          className="btn btn--outline hourly-tagpicker-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          {selected.length > 0 ? `Tags (${selected.length})` : 'Add tags'} <span aria-hidden="true">{open ? '▴' : '▾'}</span>
        </button>
        {selected.map((t) => (
          <button
            key={t}
            type="button"
            className="hourly-tag hourly-tag--removable"
            onClick={() => toggle(t)}
            aria-label={`Remove tag ${t}`}
          >
            #{t} ×
          </button>
        ))}
      </div>

      {open && (
        <div className={`hourly-tagmenu hourly-tagmenu--${direction}`} id={menuId}>
          <button
            type="button"
            className="hourly-tagmenu-create"
            onClick={() => {
              setOpen(false);
              setCreating(true);
            }}
          >
            <span aria-hidden="true">＋</span> Create new tag
          </button>
          <div className="hourly-tagmenu-list" role="listbox" aria-multiselectable="true" aria-label="Tags">
            {options.map((tag) => {
              const isSelected = selected.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`hourly-tagmenu-option${isSelected ? ' hourly-tagmenu-option--selected' : ''}`}
                  onClick={() => toggle(tag)}
                >
                  <span className="hourly-tagmenu-check" aria-hidden="true">{isSelected ? '✓' : ''}</span>
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {creating && (
        <NewTagModal existing={options} onSubmit={handleCreate} onClose={() => setCreating(false)} />
      )}
    </div>
  );
}
