'use client';

import dynamic from 'next/dynamic';

const CascadesGame = dynamic(() => import('./CascadesGame'), { ssr: false });

export default function CascadesGameClient() {
  return <CascadesGame />;
}
