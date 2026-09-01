'use client';

import dynamic from 'next/dynamic';

const ChordMachine = dynamic(() => import('./ChordMachine'), { ssr: false });

export default function ChordMachineClient() {
  return <ChordMachine />;
}
