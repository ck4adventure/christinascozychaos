import { Category, FlowerType, Task } from '@/types';

export const CATEGORY_CONFIG: Record<Category, { label: string; icon: string; color: string }> = {
  home:     { label: 'Home & Tidying',      icon: '🧺', color: '#7B3F6E' },
  hygiene:  { label: 'Hygiene & Body Care', icon: '🧼', color: '#9B6090' },
  movement: { label: 'Movement & Exercise', icon: '🏃🏻‍♀️', color: '#C46A00' },
  skills:   { label: 'Skills Practice',     icon: '🎯', color: '#E8A020' },
  seeking:  { label: 'Seeking',             icon: '🔥', color: '#7B7BAA' },
};

export const getTaskIcon = (task: { emoji?: string; category: Category }): string =>
  task.emoji || CATEGORY_CONFIG[task.category].icon;

// Flowers available to standard categories
export const FLOWER_TYPES: FlowerType[] = ['rose', 'daisy', 'tulip', 'sunflower', 'lotus', 'cherry'];

// Flowers reserved for the Seeking category
const SEEKING_FLOWER_TYPES: FlowerType[] = ['white_lotus', 'passionflower'];

export const getRandomFlower = (): FlowerType =>
  FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)];

export const getFlowerForCategory = (category: Category): FlowerType => {
  if (category === 'seeking') {
    return SEEKING_FLOWER_TYPES[Math.floor(Math.random() * SEEKING_FLOWER_TYPES.length)];
  }
  return FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)];
};

// Pre-loaded suggestion library — users can add any of these with one tap
export const TASK_LIBRARY: Omit<Task, 'id' | 'createdAt' | 'flower'>[] = [
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
  { name: 'Practice instrument', category: 'skills',   frequency: 'daily'   },
  { name: 'Art / drawing',       category: 'skills',   frequency: 'daily'   },
  { name: 'Read',                category: 'skills',   frequency: 'daily'   },
  { name: 'Journaling',          category: 'skills',   frequency: 'daily'   },
  // Seeking
  { name: 'Meditate',            category: 'seeking',  frequency: 'daily'   },
  { name: 'Morning pages',       category: 'seeking',  frequency: 'daily'   },
  { name: 'Gratitude practice',  category: 'seeking',  frequency: 'daily'   },
  { name: 'Breathwork',          category: 'seeking',  frequency: 'daily'   },
  { name: 'Tarot / oracle pull', category: 'seeking',  frequency: 'daily'   },
  { name: 'Shadow work',         category: 'seeking',  frequency: 'weekly'  },
  { name: 'Nature sit',          category: 'seeking',  frequency: 'weekly'  },
];
