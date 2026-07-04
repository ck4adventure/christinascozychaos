// /writing/[projectId] — lightweight project overview shown in the sidebar shell when no section is open
'use client';

import Link from 'next/link';
import { ProjectType } from '@/lib/writing';
import { useProjectShell } from '@/components/writing/ProjectShellContext';

const TYPE_LABELS: Record<ProjectType, string> = {
  NOVEL: 'Novel',
  SHORT_STORY_COLLECTION: 'Short Story Collection',
};

export default function ProjectDashboardPage() {
  const { projectId, project, sections, loading, labels } = useProjectShell();

  const mostRecent = sections.length
    ? [...sections].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
    : null;

  return (
    <main className="writing-editor-main">
      <div className="writing-editor-content" style={{ maxWidth: '560px' }}>
        <Link href="/writing" className="writing-sidebar-back mobile-nav-link" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
          ← Projects
        </Link>

        {!loading && project && (
          <>
            <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>{TYPE_LABELS[project.type]}</p>
            <h1 className="title" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', marginBottom: '1.5rem' }}>
              <em>{project.title}</em>
            </h1>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.6rem', color: 'var(--amber)' }}>
                {sections.length}
              </div>
              <div style={{ fontFamily: 'var(--font-josefin), sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                {sections.length === 1 ? labels.singular : labels.plural}
              </div>
            </div>

            {mostRecent ? (
              <Link href={`/writing/${projectId}/${mostRecent.id}`} className="writing-sidebar-back" style={{ display: 'inline-block' }}>
                Continue with &quot;{mostRecent.title}&quot; →
              </Link>
            ) : (
              <p style={{ color: 'var(--plum-light)', fontFamily: 'var(--font-josefin)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                No {labels.plural.toLowerCase()} yet — use &quot;{labels.newLabel}&quot; to add one.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
