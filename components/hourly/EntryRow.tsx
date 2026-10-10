'use client';

import { HourlyEntry } from '@/types';
import { formatDuration } from '@/lib/hourly';

interface EntryRowProps {
  entry: HourlyEntry;
  durationMs: number | null;
  onOpen: (entry: HourlyEntry) => void;
}

export default function EntryRow({ entry, durationMs, onOpen }: EntryRowProps) {
  const time = new Date(entry.loggedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return (
    <li>
      <button type="button" className="hourly-row" onClick={() => onOpen(entry)}>
        <span className="hourly-row-time">{time}</span>
        <span className="hourly-row-body">
          <span className="hourly-row-message">{entry.message}</span>
          {entry.tags.length > 0 && (
            <span className="hourly-row-tags">
              {entry.tags.map((t) => (
                <span key={t} className="hourly-tag">#{t}</span>
              ))}
            </span>
          )}
        </span>
        <span className="hourly-row-duration" aria-label={durationMs === null ? 'No duration' : `Took ${formatDuration(durationMs)}`}>
          {durationMs === null ? '—' : `+${formatDuration(durationMs)}`}
        </span>
        {!!entry.editCount && <span className="hourly-row-edited">edited</span>}
      </button>
    </li>
  );
}
