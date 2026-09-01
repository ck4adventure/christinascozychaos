'use client';

import { use } from 'react';
import { ProjectShellProvider } from '@/components/writing/ProjectShellContext';
import ProjectShellLayout from '@/components/writing/ProjectShellLayout';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);

  return (
    <ProjectShellProvider projectId={projectId}>
      <ProjectShellLayout>{children}</ProjectShellLayout>
    </ProjectShellProvider>
  );
}
