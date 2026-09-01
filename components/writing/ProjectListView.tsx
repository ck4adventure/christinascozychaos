'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ApiProject, ProjectType } from '@/lib/writing';
import { useWritingClient } from '@/components/writing/WritingClientContext';

const TYPE_LABELS: Record<ProjectType, string> = {
  NOVEL: 'Novel',
  SHORT_STORY_COLLECTION: 'Short Story Collection',
};

export default function ProjectListView() {
  const router = useRouter();
  const { client, basePath, demo } = useWritingClient();
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ProjectType>('NOVEL');
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setProjects(await client.listProjects());
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmitting(true);
    try {
      const project = await client.createProject(newTitle.trim(), newType);
      if (project) {
        setProjects((prev) => [project, ...prev]);
        setNewTitle('');
        setNewType('NOVEL');
        setCreating(false);
        router.push(`${basePath}/${project.id}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    await client.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  }

  async function handleLogout() {
    if (demo) {
      router.push('/login');
      return;
    }
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <div className="page">
      {/* Mobile-only nav — desktop gets Home/Sign out from the shared top bar */}
      <div className="writing-page-topnav mobile-nav-link">
        <Link href="/" className="btn btn--outline" style={{ textDecoration: 'none' }}>
          ← Home
        </Link>
        <button className="btn btn--outline" onClick={handleLogout}>
          {demo ? 'Exit demo' : 'Sign out'}
        </button>
      </div>

      <div className={`content ${mounted ? 'visible' : ''}`}>
        <div className="writing-title-block">
          <p className="eyebrow">{demo ? 'Demo —' : "Christina's"}</p>
          <h1 className="title" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            <em>Writing</em>
          </h1>
        </div>

        {demo && (
          <div className="chip" style={{ display: 'inline-flex', gap: '0.5rem', marginBottom: '1rem', cursor: 'default' }}>
            🔒 Stored only in this browser
          </div>
        )}

        <div className="divider" />

        {!loading && (
          <>
            {projects.length === 0 && !creating && (
              <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-inter)', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                No projects yet — start something new.
              </p>
            )}

            <div className="writing-project-list">
              {projects.map((project) => (
                <div key={project.id} className="writing-project-card">
                  <Link href={`${basePath}/${project.id}`} className="writing-project-card-link">
                    <span className="writing-project-type">{TYPE_LABELS[project.type]}</span>
                    <span className="card-title writing-project-title">{project.title}</span>
                    <span className="writing-project-meta">
                      {project.sectionCount ?? 0} {project.sectionCount === 1 ? 'section' : 'sections'}
                    </span>
                  </Link>
                  {deleteId === project.id ? (
                    <div className="writing-delete-confirm">
                      <span style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-inter)', fontSize: '0.75rem', letterSpacing: '0.02em' }}>Delete &quot;{project.title}&quot;?</span>
                      <button onClick={() => handleDelete(project.id)} className="btn btn--danger" style={{ fontSize: '0.6rem', padding: '0.25rem 0.6rem' }}>Yes, delete</button>
                      <button onClick={() => setDeleteId(null)} className="btn btn--text" style={{ fontSize: '0.6rem', padding: '0.25rem 0.6rem' }}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteId(project.id)} className="writing-card-delete" aria-label="Delete project">×</button>
                  )}
                </div>
              ))}
            </div>

            {creating ? (
              <form onSubmit={handleCreate} className="writing-new-form">
                <p className="eyebrow" style={{ marginBottom: '1rem' }}>New Project</p>
                <input
                  autoFocus
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Project title…"
                  className="input"
                  maxLength={120}
                />
                <div className="writing-type-picker">
                  {(['NOVEL', 'SHORT_STORY_COLLECTION'] as ProjectType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`writing-type-btn ${newType === t ? 'writing-type-btn--active' : ''}`}
                    >
                      {TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="submit" disabled={submitting || !newTitle.trim()} className="btn btn--primary">
                    {submitting ? 'Creating…' : 'Create'}
                  </button>
                  <button type="button" onClick={() => { setCreating(false); setNewTitle(''); }} className="btn btn--text">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button onClick={() => setCreating(true)} className="btn btn--outline">
                + New Project
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
