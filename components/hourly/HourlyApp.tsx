'use client';

import { useMemo, useRef, useState } from 'react';
import { HourlyEntry, HourlyQuickAdd } from '@/types';
import { useHourly } from '@/app/hooks/useHourly';
import {
  computeDurations,
  formatDuration,
  getDayRange,
  getLogicalDay,
  shiftDay,
  totalLogged,
  totalsByTag,
} from '@/lib/hourly';
import EntryComposer from './EntryComposer';
import EntryRow from './EntryRow';
import EditSheet from './EditSheet';
import HistorySheet from './HistorySheet';

interface Toast {
  text: string;
  undoId?: string;
}

function formatDayLabel(day: string, today: string): string {
  if (day === today) return 'Today';
  if (day === shiftDay(today, -1)) return 'Yesterday';
  return getDayRange(day).start.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function HourlyApp() {
  const today = getLogicalDay(new Date());
  const [day, setDay] = useState(today);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [editing, setEditing] = useState<HourlyEntry | null>(null);
  const [historyFor, setHistoryFor] = useState<HourlyEntry | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (t: Toast) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(t);
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  };

  const {
    entries, quickAdds, allTags, loading,
    addEntry, editEntry, deleteEntry, addQuickAdd, removeQuickAdd,
  } = useHourly(day, (text) => showToast({ text }));

  // Durations use the whole day so a tag filter never changes the gaps.
  const withDurations = useMemo(() => computeDurations(entries), [entries]);
  const visible = useMemo(
    () =>
      withDurations
        .filter((i) => activeTags.length === 0 || i.entry.tags.some((t) => activeTags.includes(t)))
        .reverse(),
    [withDurations, activeTags]
  );
  const dayTags = useMemo(() => totalsByTag(withDurations), [withDurations]);
  const total = totalLogged(withDurations);
  const isToday = day === today;

  const toggleTag = (tag: string) =>
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const log = async (message: string, tags: string[], undoable = false) => {
    const id = await addEntry(message, tags);
    if (id && undoable) showToast({ text: `Logged “${message}”`, undoId: id });
  };

  const quickLog = (q: HourlyQuickAdd) => log(q.label, q.tags, true);

  const undo = () => {
    if (toast?.undoId) deleteEntry(toast.undoId);
    setToast(null);
  };

  const tagNames = allTags.map((t) => t.tag);

  return (
    <div className="hourly-page">
      <div className="hourly-inner">
        <header className="hourly-header">
          <p className="hourly-eyebrow">Hourly</p>
          <div className="hourly-daynav">
            <button type="button" className="btn-icon" aria-label="Previous day" onClick={() => setDay(shiftDay(day, -1))}>‹</button>
            <h1 className="hourly-daylabel">{formatDayLabel(day, today)}</h1>
            <button type="button" className="btn-icon" aria-label="Next day" disabled={isToday} onClick={() => setDay(shiftDay(day, 1))}>›</button>
          </div>
          {!isToday && (
            <button type="button" className="btn btn--link" onClick={() => setDay(today)}>Back to today</button>
          )}
        </header>

        {!loading && withDurations.length > 0 && (
          <section className="card hourly-summary" aria-label="Day summary">
            <div>
              <div className="hourly-summary-value">{formatDuration(total)}</div>
              <div className="hourly-summary-label">logged · {withDurations.length} {withDurations.length === 1 ? 'entry' : 'entries'}</div>
            </div>
            <div className="hourly-summary-tags">
              {dayTags.slice(0, 3).map(({ tag, ms }) => (
                <span key={tag} className="hourly-tag">#{tag} {formatDuration(ms)}</span>
              ))}
            </div>
          </section>
        )}

        {allTags.length > 0 && (
          <div className="hourly-filter" role="group" aria-label="Filter by tag">
            {allTags.map(({ tag }) => (
              <button
                key={tag}
                type="button"
                className={`chip hourly-filterchip${activeTags.includes(tag) ? ' chip--active' : ''}`}
                aria-pressed={activeTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </button>
            ))}
            {activeTags.length > 0 && (
              <button type="button" className="btn btn--link" onClick={() => setActiveTags([])}>Clear</button>
            )}
          </div>
        )}

        {loading ? (
          <div className="hourly-skeleton" aria-busy="true" aria-label="Loading entries">
            <div /><div /><div />
          </div>
        ) : visible.length === 0 ? (
          <p className="hourly-empty">
            {entries.length === 0
              ? isToday ? 'Nothing logged yet today. Log something you just finished.' : 'Nothing was logged this day.'
              : 'No entries match those tags.'}
          </p>
        ) : (
          <ul className="hourly-list">
            {visible.map(({ entry, durationMs }) => (
              <EntryRow key={entry.id} entry={entry} durationMs={durationMs} onOpen={setEditing} />
            ))}
          </ul>
        )}
      </div>

      {isToday && (
        <EntryComposer
          quickAdds={quickAdds}
          tagSuggestions={tagNames}
          onLog={(m, t) => log(m, t)}
          onQuickLog={quickLog}
          onSaveQuickAdd={(label, tags) => {
            addQuickAdd(label, tags);
            showToast({ text: `Saved “${label}” as a chip` });
          }}
          onRemoveQuickAdd={removeQuickAdd}
        />
      )}

      {toast && (
        <div className="hourly-toast" role="status">
          <span>{toast.text}</span>
          {toast.undoId && <button type="button" className="btn btn--link" onClick={undo}>Undo</button>}
        </div>
      )}

      {editing && (
        <EditSheet
          entry={editing}
          tagSuggestions={tagNames}
          onSave={editEntry}
          onDelete={deleteEntry}
          onShowHistory={(e) => setHistoryFor(e)}
          onClose={() => setEditing(null)}
        />
      )}
      {historyFor && (
        <HistorySheet
          entry={entries.find((e) => e.id === historyFor.id) ?? historyFor}
          onClose={() => setHistoryFor(null)}
        />
      )}
    </div>
  );
}
