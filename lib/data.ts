import { Category, FlowerType, Task } from '@/types';

export const CATEGORY_CONFIG: Record<Category, { label: string; icon: string; color: string }> = {
  home:     { label: 'Home & Tidying',           icon: '🧺', color: '#7B3F6E' },
  hygiene:  { label: 'Hygiene & Body Care', icon: '🧼', color: '#9B6090' },
  movement: { label: 'Movement & Exercise',      icon: '🏃🏻‍♀️', color: '#C46A00' },
  skills:   { label: 'Skills Practice',          icon: '🎯', color: '#E8A020' },
};

export const FLOWER_TYPES: FlowerType[] = ['rose', 'daisy', 'tulip', 'sunflower', 'lotus', 'cherry'];

export const getRandomFlower = (): FlowerType =>
  FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)];

// Pre-loaded suggestion library — users can add any of these with one tap
export const TASK_LIBRARY: Omit<Task, 'id' | 'createdAt'>[] = [
  // Home
  { name: 'Wash dishes',       category: 'home',     frequency: 'daily'   },
  { name: 'Tidy bedroom',      category: 'home',     frequency: 'daily'   },
  { name: 'Wipe counters',     category: 'home',     frequency: 'daily'   },
  { name: 'Take out trash',    category: 'home',     frequency: 'weekly'  },
  { name: 'Do laundry',        category: 'home',     frequency: 'weekly'  },
  { name: 'Vacuum / sweep',    category: 'home',     frequency: 'weekly'  },
  { name: 'Clean bathroom',    category: 'home',     frequency: 'weekly'  },
  // Hygiene
  { name: 'Shower',            category: 'hygiene',  frequency: 'daily'   },
  { name: 'Wash hair',         category: 'hygiene',  frequency: 'weekly'  },
  { name: 'Skincare routine',  category: 'hygiene',  frequency: 'daily'   },
  { name: 'Brush & floss',     category: 'hygiene',  frequency: 'daily'   },
  { name: 'Take medications',  category: 'hygiene',  frequency: 'daily'   },
  { name: 'Drink enough water',category: 'hygiene',  frequency: 'daily'   },
  // Movement
  { name: 'Go for a walk',     category: 'movement', frequency: 'daily'   },
  { name: 'Stretch / yoga',    category: 'movement', frequency: 'daily'   },
  { name: 'Workout',           category: 'movement', frequency: 'weekly'  },
  { name: 'Dance',             category: 'movement', frequency: 'weekly'  },
  // Skills
  { name: 'Practice instrument', category: 'skills', frequency: 'daily'  },
  { name: 'Art / drawing',       category: 'skills', frequency: 'daily'  },
  { name: 'Read',                category: 'skills', frequency: 'daily'  },
  { name: 'Journaling',          category: 'skills', frequency: 'daily'  },
];
