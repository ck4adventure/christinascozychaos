export type Category = 'home' | 'hygiene' | 'movement' | 'skills' | 'seeking';

export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  name: string;
  category: Category;
  frequency: Frequency;
  dayOfWeek?: number;   // 0=Sun … 6=Sat, used when frequency === 'weekly'
  dayOfMonth?: number;  // 1–31, used when frequency === 'monthly'
  emoji?: string;       // custom icon, falls back to category icon
  createdAt: string; // ISO string
}

export interface TaskLog {
  id: string;
  taskId: string;
  completedAt: string; // ISO string
}

export type FlowerType = 'rose' | 'daisy' | 'tulip' | 'sunflower' | 'lotus' | 'cherry' | 'white_lotus';

export interface TaskWithStatus extends Task {
  completedToday: boolean;
  logId?: string;
  flower: FlowerType;
}
