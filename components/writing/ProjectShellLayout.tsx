'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
import { ApiSection } from '@/lib/writing';
import { useProjectShell } from '@/components/writing/ProjectShellContext';
import { useWritingClient } from '@/components/writing/WritingClientContext';

interface SortableSectionRowProps {
  section: ApiSection;
  index: number;
  projectId: string;
  basePath: string;
  active: boolean;
  onDelete: (id: string) => void;
}

function SortableSectionRow({ section, index, projectId, basePath, active, onDelete }: SortableSectionRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`writing-sidebar-section ${active ? 'writing-sidebar-section--active' : ''}`}
    >
      <span className="writing-drag-handle" {...attributes} {...listeners} title="Drag to reorder">⠿</span>
      <Link href={`${basePath}/${projectId}/${section.id}`} className="writing-sidebar-section-link">
        <span className="writing-sidebar-section-num">{index + 1}</span>
        <span className="writing-sidebar-section-name">{section.title}</span>
      </Link>
      {confirmDelete ? (
        <div className="writing-delete-inline">
          <button onClick={() => onDelete(section.id)} className="btn btn--danger" style={{ fontSize: '0.55rem', padding: '0.2rem 0.5rem' }}>Delete</button>
          <button onClick={() => setConfirmDelete(false)} className="btn btn--text" style={{ fontSize: '0.55rem', padding: '0.2rem 0.5rem' }}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setConfirmDelete(true)} className="writing-card-delete" aria-label={`Delete ${section.title}`}>×</button>
      )}
    </div>
  );
}

export default function ProjectShellLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { basePath } = useWritingClient();
  const { projectId, project, sections, labels, addSection, deleteSection, reorderSections } = useProjectShell();
  const [mounted, setMounted] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => setMounted(true), []);

  const activeSectionId = pathname.split('/')[3]; // /writing/[projectId]/[sectionId]

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    await reorderSections(arrayMove(sections, oldIndex, newIndex).map((s) => s.id));
  }

  async function handleAddSection() {
    const section = await addSection();
    if (section) router.push(`${basePath}/${projectId}/${section.id}`);
  }

  return (
    <div className={`writing-editor-shell ${mounted ? 'mounted' : ''}`}>
      {/* ── Desktop sidebar ── */}
      <aside className="writing-sidebar">
        <div className="writing-sidebar-brand">
          <Link href={basePath} className="link-subtle">← Projects</Link>
          {project && (
            <Link href={`${basePath}/${projectId}`} className="writing-sidebar-project-title">
              {project.title}
            </Link>
          )}
        </div>
        <div className="writing-sidebar-sections">
          <p className="writing-sidebar-label">{labels.plural}</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {sections.map((s, i) => (
                <SortableSectionRow
                  key={s.id}
                  section={s}
                  index={i}
                  projectId={projectId}
                  basePath={basePath}
                  active={s.id === activeSectionId}
                  onDelete={deleteSection}
                />
              ))}
            </SortableContext>
          </DndContext>
          <button onClick={handleAddSection} className="link-subtle link-subtle--button link-subtle--bordered">
            {labels.newLabel}
          </button>
        </div>
      </aside>

      {children}
    </div>
  );
}
