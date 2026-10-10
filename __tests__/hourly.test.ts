import { describe, it, expect } from 'vitest';
import {
  getLogicalDay,
  getDayRange,
  shiftDay,
  computeDurations,
  groupByDay,
  totalsByTag,
  normalizeTags,
  formatDuration,
  diffWords,
} from '@/lib/hourly';
import { HourlyEntry } from '@/types';

// Local-time constructors keep these tests timezone-independent.
const at = (day: number, h: number, m = 0) => new Date(2026, 9, day, h, m);

function entry(id: string, when: Date, tags: string[] = []): HourlyEntry {
  return { id, message: id, tags, loggedAt: when.toISOString(), createdAt: when.toISOString() };
}

describe('getLogicalDay', () => {
  it('counts times before 4am toward the previous day', () => {
    expect(getLogicalDay(at(6, 3, 59))).toBe('2026-10-05');
    expect(getLogicalDay(at(6, 4, 0))).toBe('2026-10-06');
    expect(getLogicalDay(at(6, 23, 30))).toBe('2026-10-06');
  });
});

describe('getDayRange / shiftDay', () => {
  it('spans 4am to 4am', () => {
    const { start, end } = getDayRange('2026-10-06');
    expect(start).toEqual(at(6, 4));
    expect(end).toEqual(at(7, 4));
  });
  it('shifts across month boundaries', () => {
    expect(shiftDay('2026-10-31', 1)).toBe('2026-11-01');
    expect(shiftDay('2026-10-01', -1)).toBe('2026-09-30');
  });
});

describe('computeDurations', () => {
  it('gives the first entry of the day no duration and the rest their gap', () => {
    const result = computeDurations([
      entry('c', at(6, 9, 45)),
      entry('a', at(6, 9, 0)),
      entry('b', at(6, 9, 20)),
    ]);
    expect(result.map((r) => r.entry.id)).toEqual(['a', 'b', 'c']);
    expect(result.map((r) => r.durationMs)).toEqual([null, 20 * 60000, 25 * 60000]);
  });

  it('does not span the 4am day boundary', () => {
    const result = computeDurations([entry('late', at(6, 23, 0)), entry('morning', at(7, 8, 0))]);
    expect(result[1].durationMs).toBeNull();
  });

  it('keeps entries after midnight but before 4am in the same day', () => {
    const result = computeDurations([entry('a', at(6, 23, 0)), entry('b', at(7, 1, 0))]);
    expect(result[1].durationMs).toBe(2 * 60 * 60000);
  });

  it('handles an empty list', () => {
    expect(computeDurations([])).toEqual([]);
  });
});

describe('groupByDay', () => {
  it('groups by logical day, newest day first', () => {
    const items = computeDurations([
      entry('a', at(5, 10)),
      entry('b', at(6, 2)),
      entry('c', at(6, 10)),
    ]);
    const groups = groupByDay(items);
    expect(groups.map((g) => g.day)).toEqual(['2026-10-06', '2026-10-05']);
    expect(groups[1].items.map((i) => i.entry.id)).toEqual(['a', 'b']);
  });
});

describe('totalsByTag', () => {
  it('sums durations per tag and sorts descending', () => {
    const items = computeDurations([
      entry('a', at(6, 9, 0), ['home']),
      entry('b', at(6, 9, 10), ['home', 'cleaning']),
      entry('c', at(6, 9, 15), ['food']),
    ]);
    expect(totalsByTag(items)).toEqual([
      { tag: 'home', ms: 10 * 60000 },
      { tag: 'cleaning', ms: 10 * 60000 },
      { tag: 'food', ms: 5 * 60000 },
    ]);
  });
});

describe('normalizeTags', () => {
  it('trims, lowercases, strips # and de-duplicates', () => {
    expect(normalizeTags(['  Home ', '#home', 'KITCHEN', ''])).toEqual(['home', 'kitchen']);
  });
  it('splits a string on commas and whitespace', () => {
    expect(normalizeTags('home, #Kitchen  food')).toEqual(['home', 'kitchen', 'food']);
  });
});

describe('formatDuration', () => {
  it('formats minutes and hours', () => {
    expect(formatDuration(12 * 60000)).toBe('12m');
    expect(formatDuration(65 * 60000)).toBe('1h 05m');
    expect(formatDuration(10_000)).toBe('<1m');
  });
});

describe('diffWords', () => {
  it('marks added and removed words', () => {
    expect(diffWords('did the dishes', 'did all the dishes')).toEqual([
      { text: 'did', type: 'same' },
      { text: 'all', type: 'added' },
      { text: 'the', type: 'same' },
      { text: 'dishes', type: 'same' },
    ]);
    const swap = diffWords('made lunch', 'made dinner');
    expect(swap.filter((p) => p.type !== 'same')).toEqual([
      { text: 'lunch', type: 'removed' },
      { text: 'dinner', type: 'added' },
    ]);
  });
  it('returns all same for identical text', () => {
    expect(diffWords('a b', 'a b').every((p) => p.type === 'same')).toBe(true);
  });
});
