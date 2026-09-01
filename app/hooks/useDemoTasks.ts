'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskLog, TaskWithStatus } from '@/types';
import { isToday, isOnDate, generateId } from '@/lib/storage';
import { DEMO_TASKS, getFlowerForCategory } from '@/lib/data';

const DEMO_TASKS_KEY = 'ccc_demo_tasks';
const DEMO_LOGS_KEY = 'ccc_demo_logs';

const demoStorage = {
  getTasks: (): Task[] => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(DEMO_TASKS_KEY) || '[]'); }
    catch { return []; }
  },
  saveTasks: (tasks: Task[]) => localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(tasks)),
  getLogs: (): TaskLog[] => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(DEMO_LOGS_KEY) || '[]'); }
    catch { return []; }
  },
  saveLogs: (logs: TaskLog[]) => localStorage.setItem(DEMO_LOGS_KEY, JSON.stringify(logs)),
};

function seedDemoTasks(): Task[] {
  const seeded: Task[] = DEMO_TASKS.map((t) => ({
    ...t,
    id: generateId(),
    createdAt: new Date().toISOString(),
    flower: getFlowerForCategory(t.category),
  }));
  demoStorage.saveTasks(seeded);
  return seeded;
}

/** Entirely browser-local counterpart to useTasks — never calls the server. Used by /blossom-demo. */
export function useDemoTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = demoStorage.getTasks();
    setTasks(existing.length > 0 ? existing : seedDemoTasks());
    setLogs(demoStorage.getLogs());
    setLoading(false);
  }, []);

  const tasksWithStatus: TaskWithStatus[] = tasks.map((task) => {
    const todayLog = logs.find((l) => l.taskId === task.id && isToday(l.completedAt));
    return { ...task, completedToday: !!todayLog, logId: todayLog?.id };
  });

  const addTask = useCallback(
    async (taskData: Omit<Task, 'id' | 'createdAt' | 'flower'>) => {
      const task: Task = {
        ...taskData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        flower: getFlowerForCategory(taskData.category),
      };
      setTasks((prev) => {
        const next = [...prev, task];
        demoStorage.saveTasks(next);
        return next;
      });
      return task;
    },
    []
  );

  const addOneOffTask = useCallback(
    async (taskData: Omit<Task, 'id' | 'createdAt' | 'flower' | 'frequency'>) => {
      const task: Task = {
        ...taskData,
        frequency: 'once',
        id: generateId(),
        createdAt: new Date().toISOString(),
        flower: getFlowerForCategory(taskData.category),
      };
      setTasks((prev) => {
        const next = [...prev, task];
        demoStorage.saveTasks(next);
        return next;
      });

      const log: TaskLog = { id: generateId(), taskId: task.id, completedAt: new Date().toISOString() };
      setLogs((prev) => {
        const next = [...prev, log];
        demoStorage.saveLogs(next);
        return next;
      });

      return task;
    },
    []
  );

  const toggleTask = useCallback(
    async (taskId: string) => {
      setLogs((prev) => {
        const existing = prev.find((l) => l.taskId === taskId && isToday(l.completedAt));
        const next = existing
          ? prev.filter((l) => l.id !== existing.id)
          : [...prev, { id: generateId(), taskId, completedAt: new Date().toISOString() }];
        demoStorage.saveLogs(next);
        return next;
      });
    },
    []
  );

  const toggleTaskForDate = useCallback(
    async (taskId: string, date: Date) => {
      const normalizedDate = new Date(date);
      normalizedDate.setHours(12, 0, 0, 0);

      setLogs((prev) => {
        const existing = prev.find((l) => l.taskId === taskId && isOnDate(l.completedAt, normalizedDate));
        const next = existing
          ? prev.filter((l) => l.id !== existing.id)
          : [...prev, { id: generateId(), taskId, completedAt: normalizedDate.toISOString() }];
        demoStorage.saveLogs(next);
        return next;
      });
    },
    []
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      setTasks((prev) => {
        const next = prev.filter((t) => t.id !== taskId);
        demoStorage.saveTasks(next);
        return next;
      });
      setLogs((prev) => {
        const next = prev.filter((l) => l.taskId !== taskId);
        demoStorage.saveLogs(next);
        return next;
      });
    },
    []
  );

  const editTask = useCallback(
    async (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'flower'>>) => {
      setTasks((prev) => {
        const next = prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
        demoStorage.saveTasks(next);
        return next;
      });
    },
    []
  );

  const resetDemo = useCallback(() => {
    const seeded = seedDemoTasks();
    setTasks(seeded);
    demoStorage.saveLogs([]);
    setLogs([]);
  }, []);

  return {
    tasks,
    logs,
    tasksWithStatus,
    loading,
    addTask,
    addOneOffTask,
    toggleTask,
    toggleTaskForDate,
    deleteTask,
    editTask,
    resetDemo,
  };
}
