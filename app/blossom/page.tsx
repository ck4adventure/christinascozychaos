'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Task, TaskWithStatus, Frequency } from '@/types';
import { useTasks } from '@/app/hooks/useTasks';
import { CATEGORY_CONFIG, getTaskIcon } from '@/lib/data';
import { ordinal, isTaskForDay } from '@/lib/taskFilter';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import QuickLogSheet from '@/components/QuickLogSheet';
import HistoryView from '@/components/HistoryView';
import NavBar from '@/components/NavBar';

type Tab = 'today' | 'schedule' | 'history' | 'add';

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TrackerPage() {
  const { tasks, logs, tasksWithStatus, loading, addTask, addOneOffTask, toggleTask, toggleTaskForDate, deleteTask, editTask } = useTasks();
  const [tab, setTab] = useState<Tab>('today');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [quickLogOpen, setQuickLogOpen] = useState(false);

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

  const handleSave = (data: Omit<Task, 'id' | 'createdAt' | 'flower'>) => {
    if (editingTask) {
      editTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setEditingTask(null);
  };

  const todayDow = new Date().getDay();
  const todayDom = new Date().getDate();

  const todaysTasks = tasksWithStatus.filter((t) => isTaskForDay(t, todayDow, todayDom) || t.completedToday);
  const completedCount = todaysTasks.filter((t) => t.completedToday).length;
  const totalCount = todaysTasks.length;

  if (loading) return null;

  return (
    <div className="blossom-page">
      <div className="blossom-ambient" />

      <div className="blossom-inner">
        <Link href="/" className="btn btn--link mobile-nav-link" style={{ marginBottom: "2.5rem" }}>← Home</Link>

        {/* TODAY VIEW */}
        {tab === 'today' && (
          <div>
            <div className="blossom-header">
              <p className="eyebrow" style={{ marginBottom: '4px' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="title" style={{ fontSize: '2rem', fontStyle: 'italic' }}>Today&apos;s Tasks</h1>

              {totalCount > 0 && (
                <div className="blossom-progress">
                  <div className="blossom-progress-row">
                    <span className="blossom-progress-count">
                      {completedCount} of {totalCount} done
                    </span>
                    {completedCount === totalCount && (
                      <span className="blossom-progress-done">All done! 🌸</span>
                    )}
                  </div>
                  <div className="blossom-progress-track">
                    <div
                      className="blossom-progress-fill"
                      style={{ width: `${(completedCount / totalCount) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {todaysTasks.length === 0 ? (
              <div className="blossom-empty">
                <p className="blossom-empty-text">
                  Nothing scheduled for today.<br />
                  <span>Enjoy the quiet. 🌙</span>
                </p>
                <button
                  className="btn btn--outline"
                  onClick={() => setQuickLogOpen(true)}
                  style={{ marginTop: '16px' }}
                >
                  ✦ Log something
                </button>
              </div>
            ) : (
              <div className="blossom-task-list">
                {todaysTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onToggle={toggleTask} />
                ))}
                <button
                  className="btn btn--outline"
                  onClick={() => setQuickLogOpen(true)}
                  style={{ width: '100%', marginTop: '4px' }}
                >
                  ✦ Log something extra
                </button>
              </div>
            )}
          </div>
        )}

        {/* HISTORY VIEW */}
        {tab === 'history' && <HistoryView logs={logs} tasks={tasks} onToggle={toggleTaskForDate} />}

        {/* SCHEDULE VIEW */}
        {tab === 'schedule' && (
          <div>
            <div className="blossom-header">
              <p className="eyebrow" style={{ marginBottom: '4px' }}>All Tasks</p>
              <h1 className="title" style={{ fontSize: '2rem', fontStyle: 'italic' }}>Your Schedule</h1>
              <p className="blossom-subtext">
                Change a task&apos;s frequency to shift it between groups
              </p>
            </div>

            {tasksWithStatus.length === 0 ? (
              <div className="blossom-schedule-empty">
                <p className="blossom-schedule-empty-text">
                  No tasks yet.<br />
                  Tap <span>＋ Add</span> to get started.
                </p>
              </div>
            ) : (
              <div className="blossom-schedule-list">
                {(['daily', 'weekly', 'monthly'] as Frequency[]).map((freq) => {
                  const group = tasksWithStatus.filter((t) => t.frequency === freq);
                  if (!group.length) return null;
                  return (
                    <div key={freq} className="blossom-group">
                      <div className="blossom-group-header">
                        <h2 className="blossom-group-title">
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </h2>
                        <span className="blossom-group-count">
                          {group.length} task{group.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {group.map((task) => (
                        <div key={task.id} className="blossom-task-row">
                          <span className="blossom-icon">
                            {getTaskIcon(task)}
                          </span>
                          <span className="blossom-task-name">{task.name}</span>
                          {task.frequency === 'weekly' && (
                            <span className="blossom-task-meta">
                              {DAY_SHORT[task.dayOfWeek ?? 0]}
                            </span>
                          )}
                          {task.frequency === 'monthly' && (
                            <span className="blossom-task-meta">
                              {ordinal(task.dayOfMonth ?? 1)}
                            </span>
                          )}
                          <button
                            className="blossom-edit-btn"
                            onClick={() => handleEdit(task)}
                            aria-label={`Edit ${task.name}`}
                          >
                            ✏️
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

      <NavBar active={tab} onChange={handleTabChange} />

      {modalOpen && (
        <TaskModal
          editingTask={editingTask}
          existingTaskNames={tasks.map((t) => t.name)}
          onSave={handleSave}
          onDelete={editingTask ? () => { deleteTask(editingTask.id); setModalOpen(false); setEditingTask(null); } : undefined}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
        />
      )}

      {quickLogOpen && (
        <QuickLogSheet
          tasksWithStatus={tasksWithStatus}
          todayDow={todayDow}
          todayDom={todayDom}
          isTaskForDay={isTaskForDay}
          onAddOneOff={addOneOffTask}
          onAddScheduled={addTask}
          onToggle={toggleTask}
          onClose={() => setQuickLogOpen(false)}
        />
      )}
    </div>
  );
}
