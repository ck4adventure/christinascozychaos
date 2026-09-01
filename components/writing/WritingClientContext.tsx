'use client';

import { createContext, useContext } from 'react';
import { WritingClient, realWritingClient } from '@/lib/writingClient';

interface WritingCtxValue {
  client: WritingClient;
  basePath: string;
  demo: boolean;
}

const DEFAULT_CTX: WritingCtxValue = { client: realWritingClient, basePath: '/writing', demo: false };

const WritingClientContext = createContext<WritingCtxValue>(DEFAULT_CTX);

export function useWritingClient(): WritingCtxValue {
  return useContext(WritingClientContext);
}

export function WritingClientProvider({
  client,
  basePath,
  demo = false,
  children,
}: {
  client: WritingClient;
  basePath: string;
  demo?: boolean;
  children: React.ReactNode;
}) {
  return (
    <WritingClientContext.Provider value={{ client, basePath, demo }}>
      {children}
    </WritingClientContext.Provider>
  );
}
