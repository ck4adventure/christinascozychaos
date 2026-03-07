import { describe, it, expect } from 'vitest';
import { ordinal, isTaskForDay } from '@/lib/taskFilter';

describe('ordinal', () => {
  it('handles 1st, 2nd, 3rd', () => {
    expect(ordinal(1)).toBe('1st');
    expect(ordinal(2)).toBe('2nd');
    expect(ordinal(3)).toBe('3rd');
  });

  it('handles 4th–20th as "th"', () => {
    expect(ordinal(4)).toBe('4th');
    expect(ordinal(11)).toBe('11th');
    expect(ordinal(12)).toBe('12th');
    expect(ordinal(13)).toBe('13th');
    expect(ordinal(20)).toBe('20th');
  });

  it('handles 21st, 22nd, 23rd', () => {
    expect(ordinal(21)).toBe('21st');
    expect(ordinal(22)).toBe('22nd');
    expect(ordinal(23)).toBe('23rd');
  });

  it('handles 31st', () => {
    expect(ordinal(31)).toBe('31st');
  });
});

describe('isTaskForDay', () => {
  const DOW = 3; // Wednesday
  const DOM = 15;

  it('daily tasks always appear', () => {
    expect(isTaskForDay({ frequency: 'daily' }, DOW, DOM)).toBe(true);
    expect(isTaskForDay({ frequency: 'daily' }, 0, 1)).toBe(true);
  });

  it('weekly tasks appear only on their assigned day', () => {
    expect(isTaskForDay({ frequency: 'weekly', dayOfWeek: 3 }, DOW, DOM)).toBe(true);
    expect(isTaskForDay({ frequency: 'weekly', dayOfWeek: 1 }, DOW, DOM)).toBe(false);
  });

  it('weekly tasks default to Sunday (0) when dayOfWeek is undefined', () => {
    expect(isTaskForDay({ frequency: 'weekly' }, 0, DOM)).toBe(true);
    expect(isTaskForDay({ frequency: 'weekly' }, 1, DOM)).toBe(false);
  });

  it('monthly tasks appear only on their assigned date', () => {
    expect(isTaskForDay({ frequency: 'monthly', dayOfMonth: 15 }, DOW, DOM)).toBe(true);
    expect(isTaskForDay({ frequency: 'monthly', dayOfMonth: 1 }, DOW, DOM)).toBe(false);
  });

  it('monthly tasks default to the 1st when dayOfMonth is undefined', () => {
    expect(isTaskForDay({ frequency: 'monthly' }, DOW, 1)).toBe(true);
    expect(isTaskForDay({ frequency: 'monthly' }, DOW, 15)).toBe(false);
  });
});
