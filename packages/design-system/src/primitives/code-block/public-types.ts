import type { CSSProperties } from 'react';
import type { CodeBlockTheme, HighlightWord } from './types';

export interface CodeBlockProps {
    /** Lines added (1-indexed) — shown with green diff marker */
    addedLines?: number[];
    /** Accessible label for the code block region */
    ariaLabel?: string;
    /** Border radius in pixels (default: 8) */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
    /** The source code to display */
    code: string;
    /** Label for the collapse button (default: "Show less") */
    collapseLabel?: string;
    /** Label for the expand button (default: "Show more") */
    expandLabel?: string;
    /** Filename to display in the header bar */
    filename?: string;
    /** Hide the copy button */
    hideCopyButton?: boolean;
    /** Line numbers to highlight (1-indexed) */
    highlightLines?: number[];
    /** Words to highlight with a subtle background */
    highlightWords?: HighlightWord[];
    /** Programming language for syntax highlighting */
    language?: string;
    /** Prefix for line anchor IDs (e.g. "L" → id="L1", id="L2") */
    lineAnchorPrefix?: string;
    /** Maximum height in pixels for the scrollable code area */
    maxHeight?: number;
    /** Maximum visible lines before collapsing (shows expand toggle) */
    maxLines?: number;
    /** Monochrome mode — grayscale syntax with lightness contrast */
    mono?: boolean;
    /** Callback when a line number is clicked */
    onLineClick?: (line: number) => void;
    /** Lines removed (1-indexed) — shown with red diff marker */
    removedLines?: number[];
    /** Show line numbers */
    showLineNumbers?: boolean;
    /** Inline styles */
    style?: CSSProperties;
    /** Theme variant — overrides provider context */
    theme?: CodeBlockTheme;
}

export interface CodeBlockInnerProps {
    addedLines?: number[];
    code: string;
    /** Override the code used by the copy button (used by CodeBlockGroup) */
    copyCode?: string;
    hideCopyButton?: boolean;
    highlightLines?: number[];
    highlightWords?: HighlightWord[];
    language?: string;
    lineAnchorPrefix?: string;
    maxHeight?: number;
    onLineClick?: (line: number) => void;
    removedLines?: number[];
    showLineNumbers?: boolean;
}
