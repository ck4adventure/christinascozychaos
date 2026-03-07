'use client';

import { useState } from 'react';
import { Task, TaskWithStatus } from '@/types';
import { useTasks } from '@/app/hooks/useTasks';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import HistoryView from '@/components/HistoryView';
import NavBar from '@/components/NavBar';

type Tab = 'today' | 'history' | 'add';

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

  const completedCount = tasksWithStatus.filter((t) => t.completedToday).length;
  const totalCount = tasksWithStatus.length;

  if (!mounted) return null;

  return (
    <>
      <style>{`
* { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #1A0820; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

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

          {/* TODAY VIEW */}
          {tab === 'today' && (
            <div>
              {/* Header */}
              <div style={{ marginBottom: '24px' }}>
                <p style={{
                  fontFamily: "var(--font-josefin), sans-serif",
                  fontSize: '0.68rem',
                  fontWeight: 200,
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
                      <span style={{ fontFamily: "var(--font-josefin), sans-serif", fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(155,96,144,0.8)' }}>
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
              {tasksWithStatus.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: 'italic', fontSize: '1.15rem', color: 'rgba(155,96,144,0.7)', lineHeight: 1.6 }}>
                    No tasks yet.<br />Tap <span style={{ color: '#E8A020' }}>＋ Add</span> below to get started.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '100px' }}>
                  {tasksWithStatus.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onEdit={handleEdit}
                      onDelete={deleteTask}
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
    </>
  );
}
