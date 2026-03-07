'use client';

import { useState, useRef, useEffect } from 'react';
import { TaskWithStatus } from '@/types';
import { CATEGORY_CONFIG } from '@/lib/data';
import Flower from './Flower';

interface TaskCardProps {
  task: TaskWithStatus;
  onToggle: (id: string) => void;
  onEdit: (task: TaskWithStatus) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cat = CATEGORY_CONFIG[task.category];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = () => {
    if (!task.completedToday) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 700);
    }
    onToggle(task.id);
  };

  return (
    <div
      onClick={handleToggle}
      style={{
        background: task.completedToday
          ? 'linear-gradient(135deg, rgba(123,63,110,0.35), rgba(42,14,48,0.6))'
          : 'linear-gradient(135deg, rgba(123,63,110,0.18), rgba(42,14,48,0.45))',
        border: task.completedToday
          ? '1px solid rgba(232,160,32,0.45)'
          : '1px solid rgba(123,63,110,0.35)',
        borderRadius: '16px',
        padding: '14px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        position: 'relative',
        transition: 'all 0.35s ease',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Checkbox */}
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: '7px',
          border: task.completedToday
            ? '2.5px solid #E8A020'
            : '2.5px solid rgba(155,96,144,0.7)',
          background: task.completedToday ? 'rgba(232,160,32,0.15)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.3s ease',
        }}
      >
        {task.completedToday && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7L5.5 10.5L12 3.5"
              stroke="#E8A020"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 20,
                strokeDashoffset: justCompleted ? 20 : 0,
                transition: 'stroke-dashoffset 0.35s ease',
              }}
            />
          </svg>
        )}
      </div>

      {/* Task info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '3px',
        }}>
          <span style={{ fontSize: '0.78rem' }}>{cat.icon}</span>
          <span style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: '0.95rem',
            fontWeight: 400,
            color: task.completedToday ? 'rgba(232,213,196,0.65)' : '#E8D5C4',
            textDecoration: task.completedToday ? 'line-through' : 'none',
            textDecorationColor: 'rgba(232,160,32,0.5)',
            transition: 'all 0.3s ease',
            letterSpacing: '0.03em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {task.name}
          </span>
        </div>
        <span style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontSize: '0.68rem',
          fontWeight: 200,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(155,96,144,0.8)',
        }}>
          {task.frequency}
        </span>
      </div>

      {/* Flower */}
      <div style={{
        flexShrink: 0,
        transform: justCompleted ? 'scale(1.3)' : 'scale(1)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <Flower type={task.flower} bloomed={task.completedToday} size={34} />
      </div>

      {/* ••• menu */}
      <div
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
        style={{ flexShrink: 0, position: 'relative' }}
      >
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(155,96,144,0.7)',
            fontSize: '1.1rem',
            cursor: 'pointer',
            padding: '2px 4px',
            lineHeight: 1,
            borderRadius: '6px',
          }}
          aria-label="Task options"
        >
          ···
        </button>
        {menuOpen && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: '110%',
            background: '#3D1A54',
            border: '1px solid rgba(232,160,32,0.25)',
            borderRadius: '10px',
            overflow: 'hidden',
            zIndex: 50,
            minWidth: '110px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            {[
              { label: '✏️ Edit', action: () => { onEdit(task); setMenuOpen(false); } },
              { label: '🗑 Delete', action: () => { onDelete(task.id); setMenuOpen(false); }, danger: true },
            ].map(({ label, action, danger }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 14px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: '0.8rem',
                  letterSpacing: '0.05em',
                  color: danger ? '#e87070' : '#E8D5C4',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
