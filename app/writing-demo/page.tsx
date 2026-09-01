'use client';

import ProjectListView from '@/components/writing/ProjectListView';
import { WritingClientProvider } from '@/components/writing/WritingClientContext';
import { demoWritingClient } from '@/lib/writingDemoClient';

// Public demo of the writing tool — no login required, data lives only in this
// browser's localStorage, and it never calls the real /api/projects routes.
export default function WritingDemoPage() {
  return (
    <WritingClientProvider client={demoWritingClient} basePath="/writing-demo" demo>
      <ProjectListView />
    </WritingClientProvider>
  );
}
