'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { generateSparks, Spark } from '@/app/utils/sparks';
import { ApiProject, ApiSection } from '@/lib/writing';
import { sectionLabel } from '@/lib/sectionLabels';

const floatingOrbs = [
  { size: 260, x: 5, y: 20, delay: 0, duration: 20 },
  { size: 160, x: 80, y: 60, delay: 4, duration: 24 },
  { size: 200, x: 50, y: 85, delay: 7, duration: 18 },
];

interface SortableRowProps {
  section: ApiSection;
  label: string;
  projectId: string;
  onDelete: (id: string) => void;
}

function SortableRow({ section, label, projectId, onDelete }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="writing-section-row">
      <span className="writing-drag-handle" {...attributes} {...listeners} title="Drag to reorder">⠿</span>
      <Link href={`/writing/${projectId}/${section.id}`} className="writing-section-link">
        <span className="writing-section-label">{label}</span>
        <span className="writing-section-title">{section.title}</span>
      </Link>
      {confirmDelete ? (
        <div className="writing-delete-inline">
          <button onClick={() => onDelete(section.id)} className="writing-delete-btn writing-delete-btn--confirm">Delete</button>
          <button onClick={() => setConfirmDelete(false)} className="writing-delete-btn">Cancel</button>
        </div>
      ) : (
        <button onClick={() => setConfirmDelete(true)} className="writing-card-delete" aria-label={`Delete ${label}`}>×</button>
      )}
    </div>
  );
}

export default function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [project, setProject] = useState<(ApiProject & { sections: ApiSection[] }) | null>(null);
  const [sections, setSections] = useState<ApiSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    setMounted(true);
    setSparks(generateSparks(20));
    fetchProject();
  }, [projectId]);

  async function fetchProject() {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.status === 404) { router.push('/writing'); return; }
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        setSections(data.sections ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, title: newTitle.trim() }),
      });
      if (res.ok) {
        const section: ApiSection = await res.json();
        setSections((prev) => [...prev, section]);
        setNewTitle('');
        setAdding(false);
        router.push(`/writing/${projectId}/${section.id}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/sections/${id}`, { method: 'DELETE' });
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sections, oldIndex, newIndex);
    setSections(reordered);
    await fetch('/api/sections/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, orderedIds: reordered.map((s) => s.id) }),
    });
  }

  const labels = project ? sectionLabel[project.type] : { singular: 'Section', plural: 'Sections', newLabel: '+ New Section' };

  return (
    <div className="page">
      <div className="mesh" />

      {floatingOrbs.map((orb, i) => (
        <div
          key={i}
          className="orb"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: i % 2 === 0 ? '#7B3F6E' : '#C46A00',
            animationDelay: `${orb.delay}s`,
            animationDuration: `${orb.duration}s`,
          }}
        />
      ))}

      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="spark"
          style={{
            width: spark.size,
            height: spark.size,
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            animationDelay: `${spark.delay}s`,
            animationDuration: `${spark.duration}s`,
          }}
        />
      ))}

      <div className={`content ${mounted ? 'visible' : ''}`}>
        <div className="writing-header">
          <div>
            <p className="eyebrow">{project ? labels.plural : 'Writing'}</p>
            <h1 className="title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
              {project ? <em>{project.title}</em> : <em>Loading…</em>}
            </h1>
          </div>
          <Link href="/writing" className="chip" style={{ textDecoration: 'none', alignSelf: 'flex-start', marginTop: '0.5rem' }}>
            ← Projects
          </Link>
        </div>

        <div className="divider" />

        {!loading && (
          <>
            {sections.length === 0 && !adding && (
              <p style={{ color: 'var(--plum-light)', fontFamily: 'var(--font-josefin)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                No {labels.plural.toLowerCase()} yet.
              </p>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                <div className="writing-section-list">
                  {sections.map((section, i) => (
                    <SortableRow
                      key={section.id}
                      section={section}
                      label={`${labels.singular} ${i + 1}`}
                      projectId={projectId}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {adding ? (
              <form onSubmit={handleAddSection} className="writing-new-form" style={{ marginTop: '1rem' }}>
                <input
                  autoFocus
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={`${labels.singular} title…`}
                  className="writing-input"
                  maxLength={120}
                />
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <button type="submit" disabled={submitting || !newTitle.trim()} className="writing-submit-btn">
                    {submitting ? 'Creating…' : 'Create'}
                  </button>
                  <button type="button" onClick={() => { setAdding(false); setNewTitle(''); }} className="writing-cancel-btn">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button onClick={() => setAdding(true)} className="writing-new-btn" style={{ marginTop: sections.length > 0 ? '1.25rem' : '0' }}>
                {labels.newLabel}
              </button>
            )}
          </>
        )}
      </div>

      <div className="bottom-rule" />
    </div>
  );
}
