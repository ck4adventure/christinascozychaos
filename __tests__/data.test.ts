import { describe, it, expect } from 'vitest';
import { FLOWER_TYPES, getRandomFlower, TASK_LIBRARY, CATEGORY_CONFIG } from '@/lib/data';

describe('getRandomFlower', () => {
  it('always returns a valid FlowerType', () => {
    for (let i = 0; i < 50; i++) {
      expect(FLOWER_TYPES).toContain(getRandomFlower());
    }
  });
});

describe('TASK_LIBRARY', () => {
  it('every entry has a valid category', () => {
    const validCategories = Object.keys(CATEGORY_CONFIG);
    for (const task of TASK_LIBRARY) {
      expect(validCategories).toContain(task.category);
    }
  });

  it('every entry has a valid frequency', () => {
    const validFrequencies = ['daily', 'weekly', 'monthly'];
    for (const task of TASK_LIBRARY) {
      expect(validFrequencies).toContain(task.frequency);
    }
  });

  it('every entry has a non-empty name', () => {
    for (const task of TASK_LIBRARY) {
      expect(task.name.trim().length).toBeGreaterThan(0);
    }
  });
});
