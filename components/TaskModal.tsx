'use client';

import { useState, useEffect } from 'react';
import { Task, Category, Frequency } from '@/types';
import { CATEGORY_CONFIG, TASK_LIBRARY } from '@/lib/data';
import { ordinal } from '@/lib/taskFilter';

interface TaskModalProps {
  editingTask?: Task | null;
  existingTaskNames: string[];
  onSave: (data: Omit<Task, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const FREQUENCIES: Frequency[] = ['daily', 'weekly', 'monthly'];
const CATEGORIES = Object.keys(CATEGORY_CONFIG) as Category[];


export default function TaskModal({ editingTask, existingTaskNames, onSave, onClose }: TaskModalProps) {
  const [tab, setTab] = useState<'custom' | 'library'>('custom');
  const [name, setName] = useState(editingTask?.name || '');
  const [category, setCategory] = useState<Category>(editingTask?.category || 'home');
  const [frequency, setFrequency] = useState<Frequency>(editingTask?.frequency || 'daily');
  const [dayOfWeek, setDayOfWeek] = useState<number>(editingTask?.dayOfWeek ?? 0);
  const [dayOfMonth, setDayOfMonth] = useState<number>(editingTask?.dayOfMonth ?? 1);
  const [libraryFilter, setLibraryFilter] = useState<Category | 'all'>('all');

  useEffect(() => {
    if (editingTask) {
      setName(editingTask.name);
      setCategory(editingTask.category);
      setFrequency(editingTask.frequency);
      setDayOfWeek(editingTask.dayOfWeek ?? 0);
      setDayOfMonth(editingTask.dayOfMonth ?? 1);
      setTab('custom');
    }
  }, [editingTask]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      category,
      frequency,
      dayOfWeek: frequency === 'weekly' ? dayOfWeek : undefined,
      dayOfMonth: frequency === 'monthly' ? dayOfMonth : undefined,
    });
    onClose();
  };

  const handleLibraryAdd = (item: typeof TASK_LIBRARY[0]) => {
    onSave(item);
    onClose();
  };

  const filteredLibrary = TASK_LIBRARY.filter((t) => {
    const notOwned = !existingTaskNames.includes(t.name);
    const matchesFilter = libraryFilter === 'all' || t.category === libraryFilter;
    return notOwned && matchesFilter;
  });

  const inputStyle = {
    width: '100%',
    background: 'var(--color-bg-input)',
    border: '1px solid var(--color-border-input)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--color-text-body)',
    fontFamily: "var(--font-josefin), sans-serif",
    fontSize: '0.9rem',
    letterSpacing: '0.04em',
    outline: 'none',
  } as React.CSSProperties;

  const btnActive = {
    border: '1px solid var(--color-border-active)',
    background: 'var(--color-bg-chip)',
    color: 'var(--amber)',
  };

  const btnInactive = {
    border: '1px solid var(--color-border-default)',
    background: 'transparent',
    color: 'var(--color-text-faint)',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'var(--color-overlay)',
        backdropFilter: 'blur(6px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0 0 env(safe-area-inset-bottom)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-modal-sheet)',
          border: '1px solid var(--color-border-card)',
          borderRadius: '20px 20px 0 0',
          padding: '24px 20px 32px',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        {/* Handle */}
        <div style={{
          width: 36, height: 4,
          borderRadius: 2,
          background: 'var(--color-handle)',
          margin: '-10px auto 20px',
        }} />

        <h2 style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: '1.4rem',
          fontWeight: 400,
          color: 'var(--color-text-body)',
          marginBottom: '18px',
          fontStyle: 'italic',
        }}>
          {editingTask ? 'Edit Task' : 'Add a Task'}
        </h2>

        {/* Tabs — only show when adding, not editing */}
        {!editingTask && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {(['custom', 'library'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '10px',
                  ...(tab === t ? btnActive : btnInactive),
                  fontFamily: "var(--font-josefin), sans-serif",
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {t === 'custom' ? '✏️ Custom' : '📚 Library'}
              </button>
            ))}
          </div>
        )}

        {/* Custom form */}
        {(tab === 'custom' || editingTask) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontFamily: "var(--font-josefin), sans-serif", fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                Task Name
              </label>
              <input
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Make my bed"
                autoFocus
              />
            </div>

            <div>
              <label style={{ fontFamily: "var(--font-josefin), sans-serif", fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                Category
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '20px',
                      ...(category === c ? btnActive : btnInactive),
                      fontFamily: "var(--font-josefin), sans-serif",
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {CATEGORY_CONFIG[c].icon} {CATEGORY_CONFIG[c].label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontFamily: "var(--font-josefin), sans-serif", fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                Frequency
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {FREQUENCIES.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '10px',
                      ...(frequency === f ? btnActive : btnInactive),
                      fontFamily: "var(--font-josefin), sans-serif",
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Day of week picker — weekly only */}
            {frequency === 'weekly' && (
              <div>
                <label style={{ fontFamily: "var(--font-josefin), sans-serif", fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                  Day of Week
                </label>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setDayOfWeek(i)}
                      style={{
                        flex: 1,
                        padding: '7px 2px',
                        borderRadius: '10px',
                        ...(dayOfWeek === i ? btnActive : btnInactive),
                        fontFamily: "var(--font-josefin), sans-serif",
                        fontSize: '0.62rem',
                        letterSpacing: '0.03em',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Day of month picker — monthly only */}
            {frequency === 'monthly' && (
              <div>
                <label style={{ fontFamily: "var(--font-josefin), sans-serif", fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                  Day of Month
                </label>
                <select
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(Number(e.target.value))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>{ordinal(d)}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={!name.trim()}
              style={{
                marginTop: '6px',
                padding: '13px',
                borderRadius: '12px',
                border: 'none',
                background: name.trim()
                  ? 'linear-gradient(135deg, var(--amber-deep), var(--amber))'
                  : 'var(--color-btn-disabled-bg)',
                color: name.trim() ? 'var(--color-cta-text)' : 'var(--color-btn-disabled-text)',
                fontFamily: "var(--font-josefin), sans-serif",
                fontSize: '0.85rem',
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.25s',
              }}
            >
              {editingTask ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        )}

        {/* Library */}
        {tab === 'library' && !editingTask && (
          <div>
            {/* Category filter */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
              {(['all', ...CATEGORIES] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setLibraryFilter(c)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    ...(libraryFilter === c ? btnActive : btnInactive),
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

            {filteredLibrary.length === 0 ? (
              <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: 'italic', color: 'var(--color-text-muted)', textAlign: 'center', padding: '24px 0' }}>
                You&apos;ve added everything in this category! 🌸
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredLibrary.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleLibraryAdd(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border-default)',
                      background: 'var(--color-bg-library-item)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      width: '100%',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{CATEGORY_CONFIG[item.category].icon}</span>
                    <span style={{ flex: 1, fontFamily: "var(--font-josefin), sans-serif", fontSize: '0.88rem', color: 'var(--color-text-body)', letterSpacing: '0.03em' }}>
                      {item.name}
                    </span>
                    <span style={{ fontFamily: "var(--font-josefin), sans-serif", fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted-soft)' }}>
                      {item.frequency}
                    </span>
                    <span style={{ color: 'var(--amber)', fontSize: '1rem' }}>+</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
