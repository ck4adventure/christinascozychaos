'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiProject, ApiSection } from '@/lib/writing';
import { sectionLabel } from '@/lib/sectionLabels';
import { useWritingClient } from '@/components/writing/WritingClientContext';

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
  const { client, basePath } = useWritingClient();
  const [project, setProject] = useState<ApiProject | null>(null);
  const [sections, setSections] = useState<ApiSection[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const data = await client.getProject(projectId);
      if (!data) { router.push(basePath); return; }
      setProject(data);
      setSections(data.sections ?? []);
    } finally {
      setLoading(false);
    }
  }, [projectId, router, client, basePath]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [refetch]);

  const labels = project ? sectionLabel[project.type] : DEFAULT_LABELS;

  const addSection = useCallback(async (): Promise<ApiSection | null> => {
    const section = await client.createSection(projectId, `Untitled ${labels.singular}`);
    if (!section) return null;
    setSections((prev) => [...prev, section]);
    return section;
  }, [projectId, labels.singular, client]);

  const deleteSection = useCallback(async (id: string) => {
    await client.deleteSection(id);
    setSections((prev) => prev.filter((s) => s.id !== id));
  }, [client]);

  const reorderSections = useCallback(async (orderedIds: string[]) => {
    setSections((prev) => {
      const byId = new Map(prev.map((s) => [s.id, s]));
      return orderedIds.map((id) => byId.get(id)).filter((s): s is ApiSection => !!s);
    });
    await client.reorderSections(projectId, orderedIds);
  }, [projectId, client]);

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
