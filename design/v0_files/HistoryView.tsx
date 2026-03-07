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
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1.7rem',
        fontWeight: 400,
        fontStyle: 'italic',
        color: '#E8D5C4',
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
              border: filterCategory === c ? '1px solid rgba(232,160,32,0.55)' : '1px solid rgba(123,63,110,0.3)',
              background: filterCategory === c ? 'rgba(232,160,32,0.1)' : 'transparent',
              color: filterCategory === c ? '#E8A020' : 'rgba(232,213,196,0.5)',
              fontFamily: "'Josefin Sans', sans-serif",
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
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.1rem', color: 'rgba(155,96,144,0.7)' }}>
            Nothing logged yet. Go complete something! 🌸
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([dateLabel, entries]) => (
          <div key={dateLabel} style={{ marginBottom: '24px' }}>
            <p style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: '0.68rem',
              fontWeight: 300,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(155,96,144,0.8)',
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
                      background: 'rgba(123,63,110,0.12)',
                      border: '1px solid rgba(123,63,110,0.22)',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{cat.icon}</span>
                    <span style={{
                      flex: 1,
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontSize: '0.88rem',
                      color: '#E8D5C4',
                      letterSpacing: '0.03em',
                    }}>
                      {log.task.name}
                    </span>
                    <span style={{
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontSize: '0.68rem',
                      fontWeight: 200,
                      letterSpacing: '0.1em',
                      color: 'rgba(155,96,144,0.7)',
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
