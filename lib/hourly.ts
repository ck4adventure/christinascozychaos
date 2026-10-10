import { HourlyEntry } from '@/types';

/** Local hour at which a new "day" starts; earlier times count toward the previous day. */
export const DAY_START_HOUR = 4;

export const DEFAULT_QUICK_ADDS: { label: string; tags: string[] }[] = [
  { label: 'did the dishes', tags: ['home', 'kitchen'] },
  { label: 'vacuumed', tags: ['home', 'cleaning'] },
  { label: 'made dinner', tags: ['kitchen', 'food'] },
  { label: 'brushed teeth', tags: ['hygiene'] },
  { label: 'took a shower', tags: ['hygiene'] },
  { label: 'did laundry', tags: ['home', 'cleaning'] },
  { label: 'tidied up', tags: ['home', 'cleaning'] },
  { label: 'took out the trash', tags: ['home'] },
  { label: 'went for a walk', tags: ['movement'] },
  { label: 'grocery shopping', tags: ['errands', 'food'] },
  { label: 'answered emails', tags: ['work'] },
  { label: 'ate lunch', tags: ['food'] },
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** Local YYYY-MM-DD of the logical day a timestamp belongs to. */
export function getLogicalDay(date: Date): string {
  const d = new Date(date.getTime() - DAY_START_HOUR * 60 * 60 * 1000);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Local [start, end) boundaries of a logical day, as Dates. */
export function getDayRange(day: string): { start: Date; end: Date } {
  const [y, m, d] = day.split('-').map(Number);
  return {
    start: new Date(y, m - 1, d, DAY_START_HOUR),
    end: new Date(y, m - 1, d + 1, DAY_START_HOUR),
  };
}

export function shiftDay(day: string, delta: number): string {
  const [y, m, d] = day.split('-').map(Number);
  const shifted = new Date(y, m - 1, d + delta);
  return `${shifted.getFullYear()}-${pad(shifted.getMonth() + 1)}-${pad(shifted.getDate())}`;
}

export interface EntryWithDuration {
  entry: HourlyEntry;
  durationMs: number | null;
}

/**
 * Duration = gap since the previous entry. The first entry of each logical day
 * has no duration, so a gap never spans the day boundary.
 */
export function computeDurations(entries: HourlyEntry[]): EntryWithDuration[] {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime()
  );
  return sorted.map((entry, i) => {
    const prev = sorted[i - 1];
    if (!prev) return { entry, durationMs: null };
    const at = new Date(entry.loggedAt);
    if (getLogicalDay(new Date(prev.loggedAt)) !== getLogicalDay(at)) {
      return { entry, durationMs: null };
    }
    return { entry, durationMs: at.getTime() - new Date(prev.loggedAt).getTime() };
  });
}

export function groupByDay<T extends { entry: HourlyEntry }>(items: T[]): { day: string; items: T[] }[] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const day = getLogicalDay(new Date(item.entry.loggedAt));
    map.set(day, [...(map.get(day) ?? []), item]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([day, items]) => ({ day, items }));
}

/** Total time per tag. An entry with several tags counts toward each. */
export function totalsByTag(items: EntryWithDuration[]): { tag: string; ms: number }[] {
  const totals = new Map<string, number>();
  for (const { entry, durationMs } of items) {
    if (!durationMs) continue;
    for (const tag of entry.tags) totals.set(tag, (totals.get(tag) ?? 0) + durationMs);
  }
  return [...totals.entries()].map(([tag, ms]) => ({ tag, ms })).sort((a, b) => b.ms - a.ms);
}

export function totalLogged(items: EntryWithDuration[]): number {
  return items.reduce((sum, { durationMs }) => sum + (durationMs ?? 0), 0);
}

export function normalizeTags(raw: string[] | string): string[] {
  const parts = Array.isArray(raw) ? raw : raw.split(/[\s,]+/);
  const seen = new Set<string>();
  for (const p of parts) {
    const tag = p.trim().replace(/^#+/, '').toLowerCase();
    if (tag) seen.add(tag);
  }
  return [...seen];
}

export function formatDuration(ms: number): string {
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 1) return '<1m';
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${pad(m)}m`;
}

export interface DiffPart {
  text: string;
  type: 'same' | 'added' | 'removed';
}

/** Word-level diff via longest common subsequence. */
export function diffWords(prev: string, next: string): DiffPart[] {
  const a = prev.split(/\s+/).filter(Boolean);
  const b = next.split(/\s+/).filter(Boolean);
  const lcs: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const parts: DiffPart[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      parts.push({ text: a[i], type: 'same' });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      parts.push({ text: a[i++], type: 'removed' });
    } else {
      parts.push({ text: b[j++], type: 'added' });
    }
  }
  while (i < a.length) parts.push({ text: a[i++], type: 'removed' });
  while (j < b.length) parts.push({ text: b[j++], type: 'added' });
  return parts;
}
