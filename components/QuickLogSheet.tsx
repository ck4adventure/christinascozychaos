'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Task, TaskWithStatus, Category, Frequency } from '@/types';
import { CATEGORY_CONFIG } from '@/lib/data';
import { ordinal } from '@/lib/taskFilter';

const EmojiPicker = dynamic(() => import('@emoji-mart/react'), { ssr: false });

interface QuickLogSheetProps {
  tasksWithStatus: TaskWithStatus[];
  todayDow: number;
  todayDom: number;
  isTaskForDay: (task: Pick<Task, 'frequency' | 'dayOfWeek' | 'dayOfMonth'>, dow: number, dom: number) => boolean;
  onAddOneOff: (data: Omit<Task, 'id' | 'createdAt' | 'flower' | 'frequency'>) => Promise<Task>;
  onAddScheduled: (data: Omit<Task, 'id' | 'createdAt' | 'flower'>) => Promise<Task>;
  onToggle: (id: string) => void;
  onClose: () => void;
}

const CATEGORIES = Object.keys(CATEGORY_CONFIG) as Category[];
const FREQUENCIES: Frequency[] = ['daily', 'weekly', 'monthly'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function QuickLogSheet({
  tasksWithStatus,
  todayDow,
  todayDom,
  isTaskForDay,
  onAddOneOff,
  onAddScheduled,
  onToggle,
  onClose,
}: QuickLogSheetProps) {
  const [tab, setTab] = useState<'new' | 'existing'>('new');

  // New activity form
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [category, setCategory] = useState<Category>('home');
  const [saveToSchedule, setSaveToSchedule] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [dayOfWeek, setDayOfWeek] = useState<number>(todayDow);
  const [dayOfMonth, setDayOfMonth] = useState<number>(todayDom);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showEmojiPicker) return;
    const handler = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showEmojiPicker]);

  // Tasks not scheduled for today and not already logged today
  const offScheduleTasks = tasksWithStatus.filter(
    (t) => !isTaskForDay(t, todayDow, todayDom) && !t.completedToday && t.frequency !== 'once'
  );

  const handleAddLog = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      if (saveToSchedule) {
        const task = await onAddScheduled({
          name: name.trim(),
          emoji: emoji.trim() || undefined,
          category,
          frequency,
          dayOfWeek: frequency === 'weekly' ? dayOfWeek : undefined,
          dayOfMonth: frequency === 'monthly' ? dayOfMonth : undefined,
        });
        onToggle(task.id);
      } else {
        await onAddOneOff({
          name: name.trim(),
          emoji: emoji.trim() || undefined,
          category,
        });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleExistingToggle = (taskId: string) => {
    onToggle(taskId);
    onClose();
  };

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

  const labelStyle = {
    fontFamily: "var(--font-josefin), sans-serif",
    fontSize: '0.7rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-text-muted)',
    display: 'block',
    marginBottom: '6px',
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
          Log Something
        </h2>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {([['new', '✦ New Activity'], ['existing', '📋 From Schedule']] as const).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '10px',
                ...(tab === t ? btnActive : btnInactive),
                fontFamily: "var(--font-josefin), sans-serif",
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* New Activity form */}
        {tab === 'new' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Name + emoji */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Activity Name</label>
                <input
                  style={inputStyle}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Baked bread"
                  autoFocus
                />
              </div>
              <div style={{ position: 'relative' }} ref={emojiPickerRef}>
                <label style={labelStyle}>Icon</label>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker((v) => !v)}
                  style={{ ...inputStyle, width: '56px', textAlign: 'center', fontSize: '1.3rem', padding: '8px', cursor: 'pointer' }}
                >
                  {emoji || '✨'}
                </button>
                {showEmojiPicker && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, zIndex: 200, marginTop: '4px' }}>
                    <EmojiPicker
                      onEmojiSelect={(e: { native: string }) => {
                        setEmoji(e.native);
                        setShowEmojiPicker(false);
                      }}
                      theme="auto"
                      previewPosition="none"
                      skinTonePosition="none"
                      dynamicWidth={false}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>Category</label>
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

            {/* Save to schedule checkbox */}
            <div
              onClick={() => setSaveToSchedule((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '12px',
                border: saveToSchedule ? '1px solid var(--color-border-active)' : '1px solid var(--color-border-default)',
                background: saveToSchedule ? 'var(--color-bg-chip)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                userSelect: 'none',
              }}
            >
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '5px',
                border: saveToSchedule ? '2px solid var(--amber)' : '2px solid var(--color-text-muted)',
                background: saveToSchedule ? 'rgba(232,160,32,0.2)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}>
                {saveToSchedule && (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1.5 5.5L4 8L9.5 2.5" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div>
                <div style={{
                  fontFamily: "var(--font-josefin), sans-serif",
                  fontSize: '0.82rem',
                  letterSpacing: '0.05em',
                  color: saveToSchedule ? 'var(--amber)' : 'var(--color-text-body)',
                  transition: 'color 0.2s',
                }}>
                  Save to my schedule
                </div>
                <div style={{
                  fontFamily: "var(--font-josefin), sans-serif",
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  color: 'var(--color-text-muted)',
                  marginTop: '2px',
                }}>
                  {saveToSchedule ? 'Pick a frequency below' : 'Just log it for today'}
                </div>
              </div>
            </div>

            {/* Frequency pickers — shown when save to schedule is checked */}
            {saveToSchedule && (
              <>
                <div>
                  <label style={labelStyle}>Frequency</label>
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

                {frequency === 'weekly' && (
                  <div>
                    <label style={labelStyle}>Day of Week</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {DAY_SHORT.map((d, i) => (
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

                {frequency === 'monthly' && (
                  <div>
                    <label style={labelStyle}>Day of Month</label>
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
              </>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '13px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border-default)',
                  background: 'transparent',
                  color: 'var(--color-text-faint)',
                  fontFamily: "var(--font-josefin), sans-serif",
                  fontSize: '0.85rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddLog}
                disabled={!name.trim() || saving}
                style={{
                  flex: 2,
                  padding: '13px',
                  borderRadius: '12px',
                  border: 'none',
                  background: name.trim() && !saving
                    ? 'linear-gradient(135deg, var(--amber-deep), var(--amber))'
                    : 'var(--color-btn-disabled-bg)',
                  color: name.trim() && !saving ? 'var(--color-cta-text)' : 'var(--color-btn-disabled-text)',
                  fontFamily: "var(--font-josefin), sans-serif",
                  fontSize: '0.85rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: name.trim() && !saving ? 'pointer' : 'not-allowed',
                  transition: 'all 0.25s',
                }}
              >
                Add &amp; Log
              </button>
            </div>
          </div>
        )}

        {/* From Schedule tab */}
        {tab === 'existing' && (
          <div>
            {offScheduleTasks.length === 0 ? (
              <p style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: 'italic',
                color: 'var(--color-text-muted)',
                textAlign: 'center',
                padding: '24px 0',
                lineHeight: 1.6,
              }}>
                All your scheduled tasks are already in today&apos;s view 🌸
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{
                  fontFamily: "var(--font-josefin), sans-serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  marginBottom: '4px',
                }}>
                  Tap to log for today
                </p>
                {offScheduleTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleExistingToggle(task.id)}
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
                    <span style={{ fontSize: '1.1rem' }}>
                      {task.emoji || CATEGORY_CONFIG[task.category].icon}
                    </span>
                    <span style={{
                      flex: 1,
                      fontFamily: "var(--font-josefin), sans-serif",
                      fontSize: '0.88rem',
                      color: 'var(--color-text-body)',
                      letterSpacing: '0.03em',
                    }}>
                      {task.name}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-josefin), sans-serif",
                      fontSize: '0.65rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-muted-soft)',
                    }}>
                      {task.frequency}
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
