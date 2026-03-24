'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskLog, TaskWithStatus } from '@/types';
import { isToday } from '@/lib/storage';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const get = (url: string) =>
      fetch(url).then((r) => {
        if (!r.ok) throw new Error(`${url} returned ${r.status}`);
        return r.json();
      });

    Promise.all([get('/api/tasks'), get('/api/logs')])
      .then(([{ tasks }, { logs }]) => {
        setTasks(tasks ?? []);
        setLogs(logs ?? []);
      })
      .catch((e) => console.error('Failed to load tasks/logs:', e))
      .finally(() => setLoading(false));
  }, []);

  const tasksWithStatus: TaskWithStatus[] = tasks.map((task) => {
    const todayLog = logs.find(
      (l) => l.taskId === task.id && isToday(l.completedAt)
    );
    return {
      ...task,
      completedToday: !!todayLog,
      logId: todayLog?.id,
    };
  });

  const addTask = useCallback(
    async (taskData: Omit<Task, 'id' | 'createdAt' | 'flower'>) => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) throw new Error(`POST /api/tasks returned ${res.status}`);
      const { task } = await res.json();
      setTasks((prev) => [...prev, task]);
      return task as Task;
    },
    []
  );

  const toggleTask = useCallback(
    async (taskId: string) => {
      const existingLog = logs.find(
        (l) => l.taskId === taskId && isToday(l.completedAt)
      );

      if (existingLog) {
        // Optimistic remove
        setLogs((prev) => prev.filter((l) => l.id !== existingLog.id));
        await fetch(`/api/logs/${existingLog.id}`, { method: 'DELETE' });
      } else {
        const res = await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId }),
        });
        const { log } = await res.json();
        setLogs((prev) => [...prev, log]);
      }
    },
    [logs]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      // Optimistic remove
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setLogs((prev) => prev.filter((l) => l.taskId !== taskId));
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    },
    []
  );

  const editTask = useCallback(
    async (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'flower'>>) => {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      );
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    },
    []
  );

  return {
    tasks,
    logs,
    tasksWithStatus,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
  };
}
