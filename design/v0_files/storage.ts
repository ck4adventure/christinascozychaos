import { Task, TaskLog } from '@/types';

const TASKS_KEY = 'ccc_tasks';
const LOGS_KEY = 'ccc_logs';
const FLOWERS_KEY = 'ccc_flowers'; // taskId -> FlowerType, persists across sessions

export const storage = {
  getTasks: (): Task[] => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]'); }
    catch { return []; }
  },
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  getLogs: (): TaskLog[] => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]'); }
    catch { return []; }
  },
  saveLogs: (logs: TaskLog[]) => {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },

  getFlowers: (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem(FLOWERS_KEY) || '{}'); }
    catch { return {}; }
  },
  saveFlowers: (flowers: Record<string, string>) => {
    localStorage.setItem(FLOWERS_KEY, JSON.stringify(flowers));
  },
};

export const isToday = (isoString: string): boolean => {
  const d = new Date(isoString);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
};

export const formatDateTime = (isoString: string): { date: string; time: string } => {
  const d = new Date(isoString);
  return {
    date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  };
};

export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
