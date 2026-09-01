'use client';

import { useDemoTasks } from '@/app/hooks/useDemoTasks';
import BlossomTrackerView from '@/components/BlossomTrackerView';

export default function BlossomDemoTracker() {
  const data = useDemoTasks();
  if (data.loading) return null;
  return <BlossomTrackerView {...data} demo resetDemo={data.resetDemo} />;
}
