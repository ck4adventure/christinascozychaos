'use client';

import { useTasks } from '@/app/hooks/useTasks';
import BlossomTrackerView from '@/components/BlossomTrackerView';

export default function BlossomTracker() {
  const data = useTasks();
  if (data.loading) return null;
  return <BlossomTrackerView {...data} />;
}
