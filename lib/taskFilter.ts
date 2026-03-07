import { Task } from '@/types';

/** Returns "1st", "2nd", "3rd", "4th", … for a given positive integer. */
export const ordinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/**
 * Returns true if the task should appear on a given day.
 * @param task   - Task (or any object with frequency / dayOfWeek / dayOfMonth)
 * @param dow    - Day of week for "today" (0 = Sun … 6 = Sat)
 * @param dom    - Day of month for "today" (1 – 31)
 */
export const isTaskForDay = (
  task: Pick<Task, 'frequency' | 'dayOfWeek' | 'dayOfMonth'>,
  dow: number,
  dom: number,
): boolean => {
  if (task.frequency === 'daily') return true;
  if (task.frequency === 'weekly') return (task.dayOfWeek ?? 0) === dow;
  if (task.frequency === 'monthly') return (task.dayOfMonth ?? 1) === dom;
  return false;
};
