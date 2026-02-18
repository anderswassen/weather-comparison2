'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useUXAgent, UseUXAgentResult } from '@/hooks/useUXAgent';

const UXAgentContext = createContext<UseUXAgentResult | undefined>(undefined);

export function UXAgentProvider({ children }: { children: ReactNode }) {
  const agent = useUXAgent();

  return (
    <UXAgentContext.Provider value={agent}>{children}</UXAgentContext.Provider>
  );
}

export function useUXAgentContext(): UseUXAgentResult {
  const context = useContext(UXAgentContext);
  if (context === undefined) {
    throw new Error('useUXAgentContext must be used within a UXAgentProvider');
  }
  return context;
}
