import type { ReactNode } from 'react';

export type CodeBlockTheme = 'default' | 'sand' | 'calm' | 'vivid';

export interface HighlightWord {
    text: string;
    className?: string;
}

export interface CodeBlockContextValue {
    mono?: boolean;
    theme?: CodeBlockTheme;
}

export interface ProcessHtmlOptions {
    addedLines?: number[];
    highlightLines?: number[];
    lineAnchorPrefix?: string;
    onLineClick?: boolean;
    removedLines?: number[];
}

export interface CodeBlockProviderProps {
    children: ReactNode;
    mono?: boolean;
    theme?: CodeBlockTheme;
}
