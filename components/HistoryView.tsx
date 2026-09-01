'use client';

import { useState } from 'react';
import { Task, TaskLog, Category } from '@/types';
import { CATEGORY_CONFIG, getTaskIcon } from '@/lib/data';
import { formatDateTime, isOnDate } from '@/lib/storage';
import { isTaskForDay } from '@/lib/taskFilter';

interface HistoryViewProps {
  logs: TaskLog[];
  tasks: Task[];
  onToggle: (taskId: string, date: Date) => void;
}

export default function HistoryView({ logs, tasks, onToggle }: HistoryViewProps) {
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');

  const CATEGORIES = Object.keys(CATEGORY_CONFIG) as Category[];

  // Build last 7 days (yesterday → 7 days ago), excluding today
  const pastDays: Array<{
    date: Date;
    label: string;
    entries: Array<{ task: Task; log: TaskLog | undefined }>;
  }> = [];

  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const endOfDay = new Date(d);
    endOfDay.setHours(23, 59, 59, 999);

    const dueTasks = tasks
      .filter((t) => new Date(t.createdAt) <= endOfDay)
      .filter((t) => isTaskForDay(t, d.getDay(), d.getDate()))
      .filter((t) => filterCategory === 'all' || t.category === filterCategory);

    if (dueTasks.length === 0) continue;

    pastDays.push({
      date: d,
      label: d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
      entries: dueTasks.map((task) => ({
        task,
        log: logs.find((l) => l.taskId === task.id && isOnDate(l.completedAt, d)),
      })),
    });
  }

  return (
    <div className="history-root">
      <h1 className="title" style={{ fontSize: '1.7rem', fontStyle: 'italic', marginBottom: '18px' }}>History</h1>

      <div className="history-filters">
        {(['all', ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilterCategory(c)}
            className={`chip${filterCategory === c ? ' chip--active' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            {c === 'all' ? '✨ All' : `${CATEGORY_CONFIG[c].icon} ${CATEGORY_CONFIG[c].label.split(' ')[0]}`}
          </button>
        ))}
      </div>

      {pastDays.length === 0 ? (
        <div className="history-empty">
          <p className="history-empty-text">Nothing scheduled in the last 7 days. 🌸</p>
        </div>
      ) : (
        pastDays.map(({ date, label, entries }) => (
          <div key={label} className="history-day">
            <p className="history-day-label">{label}</p>
            <div className="history-task-list">
              {entries.map(({ task, log }) => {
                const done = !!log;
                const time = log ? formatDateTime(log.completedAt).time : null;
                return (
                  <button
                    key={task.id}
                    onClick={() => onToggle(task.id, date)}
                    className={`history-task-row ${done ? 'history-task-row--done' : 'history-task-row--pending'}`}
                  >
                    <span className={`history-task-status${done ? '' : ' history-task-status--pending'}`}>
                      {done ? '✓' : ''}
                    </span>
                    <span className="history-task-icon">{getTaskIcon(task)}</span>
                    <span className={`history-task-name${done ? '' : ' history-task-name--pending'}`}>
                      {task.name}
                    </span>
                    <span className={`history-task-time ${done ? 'history-task-time--done' : 'history-task-time--pending'}`}>
                      {done ? time : 'tap to log'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
