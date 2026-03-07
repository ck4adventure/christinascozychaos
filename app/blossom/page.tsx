'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Task, TaskWithStatus, Frequency } from '@/types';
import { useTasks } from '@/app/hooks/useTasks';
import { CATEGORY_CONFIG } from '@/lib/data';
import { ordinal, isTaskForDay } from '@/lib/taskFilter';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import HistoryView from '@/components/HistoryView';
import NavBar from '@/components/NavBar';

type Tab = 'today' | 'schedule' | 'history' | 'add';

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TrackerPage() {
  const { tasks, logs, tasksWithStatus, mounted, addTask, toggleTask, deleteTask, editTask } = useTasks();
  const [tab, setTab] = useState<Tab>('today');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleTabChange = (t: Tab) => {
    if (t === 'add') {
      setEditingTask(null);
      setModalOpen(true);
    } else {
      setTab(t);
    }
  };

  const handleEdit = (task: TaskWithStatus) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      editTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setEditingTask(null);
  };

  const todayDow = new Date().getDay();
  const todayDom = new Date().getDate();

  const todaysTasks = tasksWithStatus.filter((t) => isTaskForDay(t, todayDow, todayDom));

  const completedCount = todaysTasks.filter((t) => t.completedToday).length;
  const totalCount = todaysTasks.length;

  if (!mounted) return null;

  return (
    <div style={{
        minHeight: '100dvh',
        background: 'linear-gradient(160deg, #2A0E30 0%, #1A0820 60%, #2A1400 100%)',
        color: '#E8D5C4',
        position: 'relative',
      }}>
        {/* Ambient background glow */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 60% 40% at 80% 90%, rgba(196,106,0,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 20% 20%, rgba(123,63,110,0.2) 0%, transparent 65%)',
        }} />

        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: '480px',
          margin: '0 auto',
          padding: '52px 18px 0',
          minHeight: '100dvh',
        }}>

          <Link href="/" className="bowl-back">← Home</Link>

          {/* TODAY VIEW */}
          {tab === 'today' && (
            <div>
              {/* Header */}
              <div style={{ marginBottom: '24px' }}>
                <p style={{
                  fontFamily: "var(--font-josefin), sans-serif",
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(155,96,144,0.8)',
                  marginBottom: '4px',
                }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <h1 style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: '2rem',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: '#E8D5C4',
                  lineHeight: 1.1,
                }}>
                  Today&apos;s Tasks
                </h1>

                {/* Progress */}
                {totalCount > 0 && (
                  <div style={{ marginTop: '14px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                    }}>
                      <span style={{ fontWeight: "bolder", fontFamily: "var(--font-josefin), sans-serif", fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(155,96,144,0.8)' }}>
                        {completedCount} of {totalCount} done
                      </span>
                      {completedCount === totalCount && totalCount > 0 && (
                        <span style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: 'italic', fontSize: '0.85rem', color: '#E8A020' }}>
                          All done! 🌸
                        </span>
                      )}
                    </div>
                    <div style={{
                      height: '3px',
                      borderRadius: '99px',
                      background: 'rgba(123,63,110,0.3)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                        background: 'linear-gradient(90deg, #C46A00, #E8A020)',
                        borderRadius: '99px',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Task list */}
              {todaysTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: 'italic', fontSize: '1.15rem', fontWeight: 600, color: 'rgba(155,96,144,0.7)', lineHeight: 1.6 }}>
                    Nothing scheduled for today.<br /><span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Enjoy the quiet. 🌙</span>
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '100px' }}>
                  {todaysTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HISTORY VIEW */}
          {tab === 'history' && (
            <HistoryView logs={logs} tasks={tasks} />
          )}

          {/* SCHEDULE VIEW */}
          {tab === 'schedule' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <p style={{
                  fontFamily: "var(--font-josefin), sans-serif",
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(155,96,144,0.8)',
                  marginBottom: '4px',
                }}>
                  All Tasks
                </p>
                <h1 style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: '2rem',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: '#E8D5C4',
                  lineHeight: 1.1,
                }}>
                  Your Schedule
                </h1>
                <p style={{
                  fontFamily: "var(--font-josefin), sans-serif",
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  color: 'rgba(155,96,144,0.65)',
                  marginTop: '8px',
                }}>
                  Change a task&apos;s frequency to shift it between groups
                </p>
              </div>

              {tasksWithStatus.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: 'italic', fontSize: '1.15rem', color: 'rgba(155,96,144,0.7)', lineHeight: 1.6 }}>
                    No tasks yet.<br />Tap <span style={{ color: '#E8A020' }}>＋ Add</span> to get started.
                  </p>
                </div>
              ) : (
                <div style={{ paddingBottom: '100px' }}>
                  {(['daily', 'weekly', 'monthly'] as Frequency[]).map((freq) => {
                    const group = tasksWithStatus.filter((t) => t.frequency === freq);
                    if (!group.length) return null;
                    return (
                      <div key={freq} style={{ marginBottom: '28px' }}>
                        {/* Group header */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '10px',
                          marginBottom: '10px',
                          paddingBottom: '8px',
                          borderBottom: '1px solid rgba(123,63,110,0.25)',
                        }}>
                          <h2 style={{
                            fontFamily: "var(--font-cormorant), serif",
                            fontSize: '1.25rem',
                            fontWeight: 300,
                            fontStyle: 'italic',
                            color: '#E8D5C4',
                          }}>
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </h2>
                          <span style={{
                            fontFamily: "var(--font-josefin), sans-serif",
                            fontSize: '0.6rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: '#E8A020',
                            opacity: 0.65,
                          }}>
                            {group.length} task{group.length !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Task rows */}
                        {group.map((task) => (
                          <div key={task.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'linear-gradient(135deg, rgba(123,63,110,0.18), rgba(42,14,48,0.45))',
                            border: '1px solid rgba(123,63,110,0.3)',
                            borderRadius: '12px',
                            padding: '11px 14px',
                            marginBottom: '8px',
                          }}>
                            <span style={{ fontSize: '1rem', flexShrink: 0, lineHeight: 1 }}>
                              {CATEGORY_CONFIG[task.category].icon}
                            </span>
                            <span style={{
                              flex: 1,
                              fontFamily: "var(--font-josefin), sans-serif",
                              fontSize: '0.9rem',
                              fontWeight: 300,
                              letterSpacing: '0.04em',
                              color: '#E8D5C4',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {task.name}
                            </span>
                            {task.frequency === 'weekly' && (
                              <span style={{
                                fontFamily: "var(--font-josefin), sans-serif",
                                fontSize: '0.62rem',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: '#E8A020',
                                opacity: 0.7,
                                flexShrink: 0,
                              }}>
                                {DAY_SHORT[task.dayOfWeek ?? 0]}
                              </span>
                            )}
                            {task.frequency === 'monthly' && (
                              <span style={{
                                fontFamily: "var(--font-josefin), sans-serif",
                                fontSize: '0.62rem',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: '#E8A020',
                                opacity: 0.7,
                                flexShrink: 0,
                              }}>
                                {ordinal(task.dayOfMonth ?? 1)}
                              </span>
                            )}
                            <button
                              onClick={() => handleEdit(task)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(155,96,144,0.7)',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                padding: '4px 6px',
                                flexShrink: 0,
                                lineHeight: 1,
                              }}
                              aria-label={`Edit ${task.name}`}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(232,112,112,0.5)',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                padding: '4px 6px',
                                flexShrink: 0,
                                lineHeight: 1,
                              }}
                              aria-label={`Delete ${task.name}`}
                            >
                              🗑
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <NavBar active={tab} onChange={handleTabChange} />

        {/* Modal */}
        {modalOpen && (
          <TaskModal
            editingTask={editingTask}
            existingTaskNames={tasks.map((t) => t.name)}
            onSave={handleSave}
            onClose={() => { setModalOpen(false); setEditingTask(null); }}
          />
        )}
      </div>
  );
}
