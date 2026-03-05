/** Message types shared between code.ts (main thread) and UI iframe */

export type CodeBlockTheme = 'default' | 'sand' | 'calm' | 'vivid';
export type CodeBlockMode = 'light' | 'dark';

export interface ResolvedToken {
    start: number;
    end: number;
    color: string; // hex
    italic: boolean;
}

export interface ShellColors {
    bg: string; // hex
    border: string; // hex
    borderOpacity: number;
    headerBg: string; // hex
    headerBgOpacity: number;
    headerText: string; // hex
    headerTextOpacity: number;
    lineNumber: string; // hex
    lineNumberOpacity: number;
    foreground: string; // hex
    diffAddedMarker: string; // hex
    diffRemovedMarker: string; // hex
}

export interface InsertCodeBlockMessage {
    type: 'insert-code-block';
    config: {
        code: string;
        width: number;
        borderRadius: number;
        fontSize: number;
        lineHeight: number;
        showHeader: boolean;
        filename: string;
        showLineNumbers: boolean;
        addedLines: number[];
        removedLines: number[];
    };
    colors: ShellColors;
    tokens: ResolvedToken[];
}

export interface ResizeMessage {
    type: 'resize';
    width: number;
    height: number;
}

/** Main thread → UI: info about the currently selected frame */
export interface SelectionInfoMessage {
    type: 'selection-info';
    hasFrame: boolean;
    frameName: string;
    frameWidth: number;
    frameHeight: number;
}

export type PluginMessage = InsertCodeBlockMessage | ResizeMessage;
export type MainToUiMessage = SelectionInfoMessage;

export const SUPPORTED_LANGUAGES = [
    'typescript',
    'javascript',
    'tsx',
    'jsx',
    'rust',
    'python',
    'bash',
    'json',
    'html',
    'css',
    'yaml',
    'toml',
    'sql',
    'go',
    'c',
    'cpp',
    'java',
    'swift',
    'kotlin',
    'solidity',
    'markdown',
    'graphql',
    'diff',
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
