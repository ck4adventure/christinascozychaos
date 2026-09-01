'use client';

import { use } from 'react';
import SectionEditorView from '@/components/writing/SectionEditorView';

export default function SectionEditorDemoPage({
  params,
}: {
  params: Promise<{ projectId: string; sectionId: string }>;
}) {
  const { projectId, sectionId } = use(params);
  return <SectionEditorView projectId={projectId} sectionId={sectionId} />;
}
