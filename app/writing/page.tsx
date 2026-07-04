// /writing top level page should be a list of current projects and the ability to add new ones
// no delete needed on the card, delete will be hidden within project settings

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateSparks, Spark } from '@/app/utils/sparks';
import { ApiProject, ProjectType } from '@/lib/writing';

const floatingOrbs = [
  { size: 300, x: 8, y: 12, delay: 0, duration: 20 },
  { size: 180, x: 75, y: 55, delay: 3, duration: 24 },
  { size: 130, x: 45, y: 78, delay: 6, duration: 17 },
  { size: 240, x: 88, y: 8, delay: 1.5, duration: 22 },
];

const TYPE_LABELS: Record<ProjectType, string> = {
  NOVEL: 'Novel',
  SHORT_STORY_COLLECTION: 'Short Story Collection',
};

export default function WritingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ProjectType>('NOVEL');
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setSparks(generateSparks(20));
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) setProjects(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim(), type: newType }),
      });
      if (res.ok) {
        const project: ApiProject = await res.json();
        setProjects((prev) => [project, ...prev]);
        setNewTitle('');
        setNewType('NOVEL');
        setCreating(false);
        router.push(`/writing/${project.id}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

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

      {/* Mobile-only nav — desktop gets Home/Sign out from the shared top bar */}
      <div className="writing-page-topnav mobile-nav-link">
        <Link href="/" className="chip" style={{ textDecoration: 'none' }}>
          ← Home
        </Link>
        <button className="chip" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          Sign out
        </button>
      </div>

      <div className={`content ${mounted ? 'visible' : ''}`}>
        <div className="writing-title-block">
          <p className="eyebrow">Christina&apos;s</p>
          <h1 className="title" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            <em>Writing</em>
          </h1>
        </div>

        <div className="divider" />

        {!loading && (
          <>
            {projects.length === 0 && !creating && (
              <p style={{ color: 'var(--plum-light)', fontFamily: 'var(--font-josefin)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                No projects yet — start something new.
              </p>
            )}

            <div className="writing-project-list">
              {projects.map((project) => (
                <div key={project.id} className="writing-project-card">
                  <Link href={`/writing/${project.id}`} className="writing-project-card-link">
                    <span className="writing-project-type">{TYPE_LABELS[project.type]}</span>
                    <span className="writing-project-title">{project.title}</span>
                    <span className="writing-project-meta">
                      {project.sectionCount ?? 0} {project.sectionCount === 1 ? 'section' : 'sections'}
                    </span>
                  </Link>
                  {deleteId === project.id ? (
                    <div className="writing-delete-confirm">
                      <span style={{ color: 'var(--cream)', fontFamily: 'var(--font-josefin)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>Delete &quot;{project.title}&quot;?</span>
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

      <div className="bottom-rule" />
    </div>
  );
}
