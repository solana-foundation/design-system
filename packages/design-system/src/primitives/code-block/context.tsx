'use client';

import { createContext } from 'react';
import type { CodeBlockContextValue, CodeBlockProviderProps } from './types';

export const CodeBlockContext = createContext<CodeBlockContextValue>({});

export function CodeBlockProvider({ theme, mono, children }: CodeBlockProviderProps) {
    return <CodeBlockContext.Provider value={{ theme, mono }}>{children}</CodeBlockContext.Provider>;
}
