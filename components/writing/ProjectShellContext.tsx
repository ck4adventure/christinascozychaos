'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiProject, ApiSection } from '@/lib/writing';
import { sectionLabel } from '@/lib/sectionLabels';

const DEFAULT_LABELS = { singular: 'Section', plural: 'Sections', newLabel: '+ New Section' };

interface ProjectShellValue {
  projectId: string;
  project: ApiProject | null;
  sections: ApiSection[];
  loading: boolean;
  labels: typeof DEFAULT_LABELS;
  addSection: () => Promise<ApiSection | null>;
  deleteSection: (id: string) => Promise<void>;
  reorderSections: (orderedIds: string[]) => Promise<void>;
  renameSection: (id: string, title: string) => void;
  refetch: () => Promise<void>;
}

const ProjectShellContext = createContext<ProjectShellValue | null>(null);

export function useProjectShell(): ProjectShellValue {
  const ctx = useContext(ProjectShellContext);
  if (!ctx) throw new Error('useProjectShell must be used within a ProjectShellProvider');
  return ctx;
}

export function ProjectShellProvider({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [project, setProject] = useState<ApiProject | null>(null);
  const [sections, setSections] = useState<ApiSection[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
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
  }, [projectId, router]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [refetch]);

  const labels = project ? sectionLabel[project.type] : DEFAULT_LABELS;

  const addSection = useCallback(async (): Promise<ApiSection | null> => {
    const res = await fetch('/api/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, title: `Untitled ${labels.singular}` }),
    });
    if (!res.ok) return null;
    const section: ApiSection = await res.json();
    setSections((prev) => [...prev, section]);
    return section;
  }, [projectId, labels.singular]);

  const deleteSection = useCallback(async (id: string) => {
    await fetch(`/api/sections/${id}`, { method: 'DELETE' });
    setSections((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const reorderSections = useCallback(async (orderedIds: string[]) => {
    setSections((prev) => {
      const byId = new Map(prev.map((s) => [s.id, s]));
      return orderedIds.map((id) => byId.get(id)).filter((s): s is ApiSection => !!s);
    });
    await fetch('/api/sections/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, orderedIds }),
    });
  }, [projectId]);

  const renameSection = useCallback((id: string, title: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
  }, []);

  return (
    <ProjectShellContext.Provider
      value={{ projectId, project, sections, loading, labels, addSection, deleteSection, reorderSections, renameSection, refetch }}
    >
      {children}
    </ProjectShellContext.Provider>
  );
}
