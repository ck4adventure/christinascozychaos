'use client';

import BlossomDemoTracker from '@/components/BlossomDemoTracker';

// Public demo of the Blossom chore tracker — no login required, data lives only
// in this browser's localStorage, and it never calls the real /api/tasks routes.
export default function BlossomDemoPage() {
  return <BlossomDemoTracker />;
}
