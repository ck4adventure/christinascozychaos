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
    <div style={{ padding: '0 0 100px' }}>
      <h1 style={{
        fontFamily: "var(--font-cormorant), serif",
        fontSize: '1.7rem',
        fontWeight: 400,
        fontStyle: 'italic',
        color: 'var(--color-text-body)',
        marginBottom: '18px',
        padding: '4px 0',
      }}>
        History
      </h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '22px', overflowX: 'auto', paddingBottom: '4px' }}>
        {(['all', ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilterCategory(c)}
            style={{
              padding: '5px 12px',
              borderRadius: '20px',
              border: filterCategory === c ? '1px solid var(--color-border-active)' : '1px solid var(--color-border-default)',
              background: filterCategory === c ? 'var(--color-bg-chip)' : 'transparent',
              color: filterCategory === c ? 'var(--amber)' : 'var(--color-text-faint)',
              fontFamily: "var(--font-josefin), sans-serif",
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            {c === 'all' ? '✨ All' : `${CATEGORY_CONFIG[c].icon} ${CATEGORY_CONFIG[c].label.split(' ')[0]}`}
          </button>
        ))}
      </div>

      {pastDays.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
            Nothing scheduled in the last 7 days. 🌸
          </p>
        </div>
      ) : (
        pastDays.map(({ date, label, entries }) => (
          <div key={label} style={{ marginBottom: '24px' }}>
            <p style={{
              fontFamily: "var(--font-josefin), sans-serif",
              fontSize: '0.68rem',
              fontWeight: 400,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '10px',
            }}>
              {label}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {entries.map(({ task, log }) => {
                const done = !!log;
                const time = log ? formatDateTime(log.completedAt).time : null;
                return (
                  <button
                    key={task.id}
                    onClick={() => onToggle(task.id, date)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'var(--color-bg-task-card)',
                      border: done
                        ? '1px solid rgba(232, 160, 32, 0.3)'
                        : '1px solid rgba(155, 96, 144, 0.3)',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      transition: 'opacity 0.15s',
                    }}
                  >
                    {/* Status indicator */}
                    <span style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: done ? 'none' : '1.5px dashed rgba(155, 96, 144, 0.5)',
                      background: done ? 'transparent' : 'transparent',
                      fontSize: '0.75rem',
                      color: 'var(--amber)',
                    }}>
                      {done ? '✓' : ''}
                    </span>

                    <span style={{ fontSize: '1rem' }}>{getTaskIcon(task)}</span>

                    <span style={{
                      flex: 1,
                      fontFamily: "var(--font-josefin), sans-serif",
                      fontSize: '0.88rem',
                      color: 'var(--color-text-body)',
                      letterSpacing: '0.03em',
                      opacity: done ? 1 : 0.55,
                    }}>
                      {task.name}
                    </span>

                    <span style={{
                      fontFamily: "var(--font-josefin), sans-serif",
                      fontSize: '0.65rem',
                      fontWeight: 200,
                      letterSpacing: '0.1em',
                      color: done ? 'var(--color-text-muted-soft)' : 'rgba(155, 96, 144, 0.6)',
                    }}>
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
