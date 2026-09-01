'use client';

import { use } from 'react';
import { ProjectShellProvider } from '@/components/writing/ProjectShellContext';
import ProjectShellLayout from '@/components/writing/ProjectShellLayout';
import { WritingClientProvider } from '@/components/writing/WritingClientContext';
import { demoWritingClient } from '@/lib/writingDemoClient';

export default function ProjectDemoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);

  return (
    <WritingClientProvider client={demoWritingClient} basePath="/writing-demo" demo>
      <ProjectShellProvider projectId={projectId}>
        <ProjectShellLayout>{children}</ProjectShellLayout>
      </ProjectShellProvider>
    </WritingClientProvider>
  );
}
