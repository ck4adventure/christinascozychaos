export type Category = 'home' | 'hygiene' | 'movement' | 'skills' | 'seeking';

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'once';

export interface Task {
  id: string;
  name: string;
  category: Category;
  frequency: Frequency;
  dayOfWeek?: number;   // 0=Sun … 6=Sat, used when frequency === 'weekly'
  dayOfMonth?: number;  // 1–31, used when frequency === 'monthly'
  emoji?: string;       // custom icon, falls back to category icon
  flower: FlowerType;   // assigned at creation, never changes
  createdAt: string; // ISO string
}

export interface TaskLog {
  id: string;
  taskId: string;
  completedAt: string; // ISO string
}

export type FlowerType = 'rose' | 'daisy' | 'tulip' | 'sunflower' | 'lotus' | 'cherry' | 'white_lotus' | 'passionflower';

export interface TaskWithStatus extends Task {
  completedToday: boolean;
  logId?: string;
}

export interface HourlyEntry {
  id: string;
  message: string;
  tags: string[];
  loggedAt: string; // ISO string, the finish time
  createdAt: string; // ISO string
  editCount?: number;
}

export interface HourlyEdit {
  id: string;
  entryId: string;
  prevMessage: string;
  prevTags: string[];
  prevLoggedAt: string; // ISO string
  editedAt: string; // ISO string
}

export interface HourlyQuickAdd {
  id: string;
  label: string;
  tags: string[];
  sortOrder: number;
}
