'use client';

import { useState } from 'react';
import { Task, TaskLog, Category } from '@/types';
import { CATEGORY_CONFIG } from '@/lib/data';
import { formatDateTime, isToday } from '@/lib/storage';

interface HistoryViewProps {
  logs: TaskLog[];
  tasks: Task[];
}

export default function HistoryView({ logs, tasks }: HistoryViewProps) {
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');

  const taskMap = Object.fromEntries(tasks.map((t) => [t.id, t]));

  const enrichedLogs = logs
    .map((log) => ({ ...log, task: taskMap[log.taskId] }))
    .filter((log) => log.task)
    .filter((log) => filterCategory === 'all' || log.task.category === filterCategory)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  // Group by date label
  const grouped: Record<string, typeof enrichedLogs> = {};
  enrichedLogs.forEach((log) => {
    const label = isToday(log.completedAt)
      ? 'Today'
      : new Date(log.completedAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(log);
  });

  const CATEGORIES = Object.keys(CATEGORY_CONFIG) as Category[];

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

      {Object.keys(grouped).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
            Nothing logged yet. Go complete something! 🌸
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([dateLabel, entries]) => (
          <div key={dateLabel} style={{ marginBottom: '24px' }}>
            <p style={{
              fontFamily: "var(--font-josefin), sans-serif",
              fontSize: '0.68rem',
              fontWeight: 300,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '10px',
            }}>
              {dateLabel}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {entries.map((log) => {
                const { time } = formatDateTime(log.completedAt);
                const cat = CATEGORY_CONFIG[log.task.category];
                return (
                  <div
                    key={log.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: 'var(--color-bg-task-card)',
                      border: '1px solid var(--color-border-soft)',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{cat.icon}</span>
                    <span style={{
                      flex: 1,
                      fontFamily: "var(--font-josefin), sans-serif",
                      fontSize: '0.88rem',
                      color: 'var(--color-text-body)',
                      letterSpacing: '0.03em',
                    }}>
                      {log.task.name}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-josefin), sans-serif",
                      fontSize: '0.68rem',
                      fontWeight: 200,
                      letterSpacing: '0.1em',
                      color: 'var(--color-text-muted-soft)',
                    }}>
                      {time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
