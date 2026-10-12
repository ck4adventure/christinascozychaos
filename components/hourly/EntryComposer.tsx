'use client';

import { useState } from 'react';
import { HourlyQuickAdd } from '@/types';
import TagPicker from './TagPicker';

interface EntryComposerProps {
  quickAdds: HourlyQuickAdd[];
  tagOptions: string[];
  onCreateTag: (tag: string) => void;
  onLog: (message: string, tags: string[]) => void;
  onQuickLog: (quickAdd: HourlyQuickAdd) => void;
  onSaveQuickAdd: (label: string, tags: string[]) => void;
  onRemoveQuickAdd: (id: string) => void;
}

export default function EntryComposer({
  quickAdds,
  tagOptions,
  onCreateTag,
  onLog,
  onQuickLog,
  onSaveQuickAdd,
  onRemoveQuickAdd,
}: EntryComposerProps) {
  const [message, setMessage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [editingChips, setEditingChips] = useState(false);

  const canLog = message.trim().length > 0;

  const submit = () => {
    if (!canLog) return;
    onLog(message.trim(), tags);
    setMessage('');
    setTags([]);
  };

  return (
    <div className="hourly-composer">
      <div className="hourly-quickrow" role="list">
        {quickAdds.map((q) => (
          <button
            key={q.id}
            role="listitem"
            type="button"
            className={`chip hourly-quickchip${editingChips ? ' hourly-quickchip--editing' : ''}`}
            onClick={() => (editingChips ? onRemoveQuickAdd(q.id) : onQuickLog(q))}
            aria-label={editingChips ? `Remove quick-add ${q.label}` : `Log ${q.label}`}
          >
            {editingChips ? `× ${q.label}` : q.label}
          </button>
        ))}
        <button type="button" className="chip hourly-quickchip hourly-quickchip--meta" onClick={() => setEditingChips((v) => !v)}>
          {editingChips ? 'Done' : 'Edit'}
        </button>
      </div>

      <form
        className="hourly-composer-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <input
          className="input hourly-message"
          value={message}
          maxLength={200}
          placeholder="What did you just finish?"
          enterKeyHint="send"
          onChange={(e) => setMessage(e.target.value)}
        />
        <TagPicker selected={tags} options={tagOptions} onChange={setTags} onCreateTag={onCreateTag} direction="up" />
        <div className="hourly-composer-actions">
          <button
            type="button"
            className="btn btn--text"
            disabled={!canLog}
            onClick={() => {
              onSaveQuickAdd(message.trim(), tags);
            }}
            title="Save this message as a quick-add chip"
          >
            + Save as chip
          </button>
          <button type="submit" className="btn btn--primary hourly-log-btn" disabled={!canLog}>
            Log it
          </button>
        </div>
      </form>
    </div>
  );
}
