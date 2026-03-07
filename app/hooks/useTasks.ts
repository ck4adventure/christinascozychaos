'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskLog, TaskWithStatus } from '@/types';
import { storage, isToday, generateId } from '@/lib/storage';
import { getRandomFlower } from '@/lib/data';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [flowers, setFlowers] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTasks(storage.getTasks());
    setLogs(storage.getLogs());
    setFlowers(storage.getFlowers());
    setMounted(true);
  }, []);

  // Tasks enriched with today's completion status + assigned flower
  const tasksWithStatus: TaskWithStatus[] = tasks.map((task) => {
    const todayLog = logs.find(
      (l) => l.taskId === task.id && isToday(l.completedAt)
    );
    return {
      ...task,
      completedToday: !!todayLog,
      logId: todayLog?.id,
      flower: (flowers[task.id] as TaskWithStatus['flower']) || 'daisy',
    };
  });

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    // Assign a random flower to this task — sticks forever
    const newFlowers = { ...flowers, [newTask.id]: getRandomFlower() };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    setFlowers(newFlowers);
    storage.saveTasks(newTasks);
    storage.saveFlowers(newFlowers);
    return newTask;
  }, [tasks, flowers]);

  const toggleTask = useCallback((taskId: string) => {
    const existingLog = logs.find(
      (l) => l.taskId === taskId && isToday(l.completedAt)
    );
    let newLogs: TaskLog[];
    if (existingLog) {
      // Un-complete: remove the log entry
      newLogs = logs.filter((l) => l.id !== existingLog.id);
    } else {
      // Complete: add a new log entry
      const newLog: TaskLog = {
        id: generateId(),
        taskId,
        completedAt: new Date().toISOString(),
      };
      newLogs = [...logs, newLog];
    }
    setLogs(newLogs);
    storage.saveLogs(newLogs);
  }, [logs]);

  const deleteTask = useCallback((taskId: string) => {
    const newTasks = tasks.filter((t) => t.id !== taskId);
    const newLogs = logs.filter((l) => l.taskId !== taskId);
    setTasks(newTasks);
    setLogs(newLogs);
    storage.saveTasks(newTasks);
    storage.saveLogs(newLogs);
  }, [tasks, logs]);

  const editTask = useCallback((taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    const newTasks = tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t);
    setTasks(newTasks);
    storage.saveTasks(newTasks);
  }, [tasks]);

  return {
    tasks,
    logs,
    tasksWithStatus,
    mounted,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
  };
}
