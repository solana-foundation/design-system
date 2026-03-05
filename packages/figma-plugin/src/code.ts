/// <reference types="@figma/plugin-typings" />

import type { PluginMessage, ResolvedToken, SelectionInfoMessage, ShellColors } from './shared/types';

// ---------------------------------------------------------------------------
// Font loading
// ---------------------------------------------------------------------------

interface FontPref {
    family: string;
    regular: string;
    italic: string | null;
}

const FONT_PREFERENCES: FontPref[] = [
    { family: 'Berkeley Mono', regular: 'Regular', italic: 'Italic' },
    { family: 'SF Mono', regular: 'Regular', italic: 'Regular Italic' },
    { family: 'JetBrains Mono', regular: 'Regular', italic: 'Italic' },
    { family: 'Fira Code', regular: 'Regular', italic: null },
    { family: 'Source Code Pro', regular: 'Regular', italic: 'Italic' },
    { family: 'Roboto Mono', regular: 'Regular', italic: 'Italic' },
    { family: 'Courier New', regular: 'Regular', italic: 'Italic' },
];

async function tryLoadFont(family: string, style: string): Promise<boolean> {
    try {
        await figma.loadFontAsync({ family, style });
        return true;
    } catch (_e) {
        return false;
    }
}

interface LoadedFonts {
    regular: FontName;
    italic: FontName | null;
}

async function loadFonts(): Promise<LoadedFonts> {
    for (const pref of FONT_PREFERENCES) {
        const regLoaded = await tryLoadFont(pref.family, pref.regular);
        if (!regLoaded) continue;

        let italicFont: FontName | null = null;
        if (pref.italic) {
            const italicLoaded = await tryLoadFont(pref.family, pref.italic);
            if (italicLoaded) {
                italicFont = { family: pref.family, style: pref.italic };
            }
        }

        return {
            regular: { family: pref.family, style: pref.regular },
            italic: italicFont,
        };
    }

    throw new Error('No monospace font available. Install JetBrains Mono or another monospace font.');
}

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): RGB {
    const h = hex.replace('#', '');
    return {
        r: parseInt(h.slice(0, 2), 16) / 255,
        g: parseInt(h.slice(2, 4), 16) / 255,
        b: parseInt(h.slice(4, 6), 16) / 255,
    };
}

function solidPaint(hex: string, opacity = 1): SolidPaint {
    return { type: 'SOLID', color: hexToRgb(hex), opacity };
}

// ---------------------------------------------------------------------------
// Code block creation
// ---------------------------------------------------------------------------

interface CreateConfig {
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
}

async function createCodeBlock(
    config: CreateConfig,
    colors: ShellColors,
    tokens: ResolvedToken[],
    targetFrame?: FrameNode | null,
): Promise<void> {
    const fonts = await loadFonts();
    const lines = config.code.split('\n');
    const lineCount = lines.length;

    const insertWidth = targetFrame ? Math.round(targetFrame.width) : config.width;

    // --- Outer frame ---
    const outer = figma.createFrame();
    outer.name = 'CodeBlock';
    outer.layoutMode = 'VERTICAL';
    outer.primaryAxisSizingMode = 'AUTO';
    outer.counterAxisSizingMode = 'FIXED';
    outer.resize(insertWidth, 100); // height auto
    outer.cornerRadius = config.borderRadius;
    outer.fills = [solidPaint(colors.bg)];
    outer.strokes = [solidPaint(colors.border, colors.borderOpacity)];
    outer.strokeWeight = 1;
    outer.strokeAlign = 'INSIDE';
    outer.clipsContent = true;

    // --- Header (optional) ---
    if (config.showHeader && config.filename) {
        const header = figma.createFrame();
        header.name = 'Header';
        header.layoutMode = 'HORIZONTAL';
        header.primaryAxisSizingMode = 'FIXED';
        header.counterAxisSizingMode = 'AUTO';
        header.layoutAlign = 'STRETCH';
        header.paddingTop = 10;
        header.paddingBottom = 10;
        header.paddingLeft = 16;
        header.paddingRight = 16;
        header.fills = [solidPaint(colors.headerBg, colors.headerBgOpacity)];

        // Header bottom border (inset box-shadow equivalent)
        header.strokes = [solidPaint(colors.border, colors.borderOpacity)];
        header.strokeWeight = 1;
        header.strokeAlign = 'INSIDE';
        header.strokeBottomWeight = 1;
        header.strokeTopWeight = 0;
        header.strokeLeftWeight = 0;
        header.strokeRightWeight = 0;

        const filenameText = figma.createText();
        filenameText.name = 'Filename';
        filenameText.fontName = fonts.regular;
        filenameText.fontSize = 13;
        filenameText.lineHeight = { value: 18, unit: 'PIXELS' };
        filenameText.characters = config.filename;
        filenameText.fills = [solidPaint(colors.headerText, colors.headerTextOpacity)];

        header.appendChild(filenameText);
        outer.appendChild(header);
    }

    // --- Code area frame ---
    const codeArea = figma.createFrame();
    codeArea.name = 'CodeArea';
    codeArea.layoutMode = 'HORIZONTAL';
    codeArea.primaryAxisSizingMode = 'FIXED';
    codeArea.counterAxisSizingMode = 'AUTO';
    codeArea.layoutAlign = 'STRETCH';
    codeArea.paddingTop = 16;
    codeArea.paddingBottom = 16;
    codeArea.paddingLeft = 16;
    codeArea.paddingRight = 16;
    codeArea.itemSpacing = 16;
    codeArea.fills = [];

    // --- Line numbers (optional) ---
    if (config.showLineNumbers) {
        const lineNums = figma.createText();
        lineNums.name = 'LineNumbers';
        lineNums.fontName = fonts.regular;
        lineNums.fontSize = config.fontSize;
        lineNums.lineHeight = { value: config.lineHeight, unit: 'PIXELS' };
        lineNums.textAlignHorizontal = 'RIGHT';

        const lineNumText = Array.from({ length: lineCount }, (_, i) => String(i + 1)).join('\n');
        lineNums.characters = lineNumText;
        lineNums.fills = [solidPaint(colors.lineNumber, colors.lineNumberOpacity)];

        codeArea.appendChild(lineNums);
        lineNums.layoutSizingHorizontal = 'HUG';
    }

    // --- Diff markers (optional) ---
    const hasAdded = config.addedLines.length > 0;
    const hasRemoved = config.removedLines.length > 0;
    const hasDiff = hasAdded || hasRemoved;

    if (hasDiff) {
        const addedSet = new Set(config.addedLines);
        const removedSet = new Set(config.removedLines);

        const diffMarkers = figma.createText();
        diffMarkers.name = 'DiffMarkers';
        diffMarkers.fontName = fonts.regular;
        diffMarkers.fontSize = config.fontSize;
        diffMarkers.lineHeight = { value: config.lineHeight, unit: 'PIXELS' };

        const markerText = lines
            .map((_, i) => {
                const lineNum = i + 1;
                if (addedSet.has(lineNum)) return '+';
                if (removedSet.has(lineNum)) return '-';
                return ' ';
            })
            .join('\n');

        diffMarkers.characters = markerText;

        // Color each marker
        let offset = 0;
        for (let i = 0; i < lineCount; i++) {
            const lineNum = i + 1;
            const char = markerText[offset];
            if (char === '+') {
                diffMarkers.setRangeFills(offset, offset + 1, [solidPaint(colors.diffAddedMarker)]);
            } else if (char === '-') {
                diffMarkers.setRangeFills(offset, offset + 1, [solidPaint(colors.diffRemovedMarker)]);
            } else {
                diffMarkers.setRangeFills(offset, offset + 1, [solidPaint(colors.foreground, 0)]);
            }
            offset += 2; // char + newline (or just char for last line)
            if (i < lineCount - 1) {
                // account for newline
            }
        }

        codeArea.appendChild(diffMarkers);
        diffMarkers.layoutSizingHorizontal = 'HUG';
    }

    // --- Code text ---
    const codeText = figma.createText();
    codeText.name = 'Code';
    codeText.fontName = fonts.regular;
    codeText.fontSize = config.fontSize;
    codeText.lineHeight = { value: config.lineHeight, unit: 'PIXELS' };
    codeText.characters = config.code;
    codeText.fills = [solidPaint(colors.foreground)];

    // Apply syntax coloring
    let applied = 0;
    let errors = 0;
    for (const token of tokens) {
        if (token.start >= token.end) continue;
        if (token.end > config.code.length) continue;

        try {
            codeText.setRangeFills(token.start, token.end, [solidPaint(token.color)]);
            if (token.italic && fonts.italic) {
                codeText.setRangeFontName(token.start, token.end, fonts.italic);
            }
            applied++;
        } catch (_e) {
            errors++;
        }
    }

    codeArea.appendChild(codeText);
    codeText.layoutSizingHorizontal = 'FILL';
    codeText.layoutSizingVertical = 'HUG';
    outer.appendChild(codeArea);

    // --- Insert into target or canvas ---
    if (targetFrame) {
        targetFrame.appendChild(outer);

        // If target is auto-layout, set CodeBlock to fill horizontally
        if (targetFrame.layoutMode !== 'NONE') {
            outer.layoutAlign = 'STRETCH';
            outer.layoutSizingHorizontal = 'FILL';
        }

        figma.notify(
            `CodeBlock → "${targetFrame.name}" | ${applied} tokens colored, ${errors} errors (${fonts.regular.family})`,
        );
    } else {
        const { x, y } = figma.viewport.center;
        outer.x = Math.round(x - insertWidth / 2);
        outer.y = Math.round(y);
        figma.currentPage.appendChild(outer);
        figma.notify(`CodeBlock | ${applied} tokens colored, ${errors} errors (${fonts.regular.family})`);
    }

    figma.currentPage.selection = [outer];
    figma.viewport.scrollAndZoomIntoView([outer]);
}

// ---------------------------------------------------------------------------
// Selection helpers
// ---------------------------------------------------------------------------

function getSelectedFrame(): FrameNode | null {
    const sel = figma.currentPage.selection;
    if (sel.length !== 1) return null;
    const node = sel[0];
    if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
        return node as FrameNode;
    }
    return null;
}

function sendSelectionInfo(): void {
    const frame = getSelectedFrame();
    const msg: SelectionInfoMessage = frame
        ? {
              type: 'selection-info',
              hasFrame: true,
              frameName: frame.name,
              frameWidth: Math.round(frame.width),
              frameHeight: Math.round(frame.height),
          }
        : {
              type: 'selection-info',
              hasFrame: false,
              frameName: '',
              frameWidth: 0,
              frameHeight: 0,
          };
    figma.ui.postMessage(msg);
}

// ---------------------------------------------------------------------------
// Plugin entry
// ---------------------------------------------------------------------------

figma.showUI(__html__, { width: 420, height: 640, themeColors: true });

// Send initial selection info + listen for changes
sendSelectionInfo();
figma.on('selectionchange', sendSelectionInfo);

figma.ui.onmessage = async (msg: PluginMessage) => {
    if (msg.type === 'insert-code-block') {
        try {
            const targetFrame = getSelectedFrame();
            await createCodeBlock(msg.config, msg.colors, msg.tokens, targetFrame);
        } catch (err) {
            figma.notify(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`, { error: true });
        }
    }

    if (msg.type === 'resize') {
        figma.ui.resize(msg.width, msg.height);
    }
};
