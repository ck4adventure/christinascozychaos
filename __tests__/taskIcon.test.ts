import { describe, it, expect } from 'vitest';
import { getTaskIcon, CATEGORY_CONFIG } from '@/lib/data';

describe('getTaskIcon', () => {
  it('returns the custom emoji when set', () => {
    expect(getTaskIcon({ emoji: '🫧', category: 'home' })).toBe('🫧');
  });

  it('falls back to the category icon when emoji is not set', () => {
    expect(getTaskIcon({ category: 'home' })).toBe(CATEGORY_CONFIG.home.icon);
    expect(getTaskIcon({ category: 'hygiene' })).toBe(CATEGORY_CONFIG.hygiene.icon);
    expect(getTaskIcon({ category: 'movement' })).toBe(CATEGORY_CONFIG.movement.icon);
    expect(getTaskIcon({ category: 'skills' })).toBe(CATEGORY_CONFIG.skills.icon);
  });

  it('falls back to category icon when emoji is an empty string', () => {
    expect(getTaskIcon({ emoji: '', category: 'home' })).toBe(CATEGORY_CONFIG.home.icon);
  });

  it('custom emoji takes priority over any category', () => {
    const emoji = '🎸';
    for (const category of Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>) {
      expect(getTaskIcon({ emoji, category })).toBe(emoji);
    }
  });
});
