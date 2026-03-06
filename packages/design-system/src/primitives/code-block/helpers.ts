import type { DecorationItem } from '@shikijs/core/types';
import { useMemo, type KeyboardEvent, type MouseEvent } from 'react';
import type { HighlightWord, ProcessHtmlOptions } from './types';

export function handleLineClick(e: MouseEvent | KeyboardEvent, onLineClick?: (line: number) => void) {
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
    const target = (e.target as HTMLElement).closest('[data-line-num]');
    if (!target) return;

    const lineNum = Number(target.getAttribute('data-line-num'));
    if (lineNum && onLineClick) onLineClick(lineNum);
}

/** Build Shiki decoration items from highlightWords */
export function useWordDecorations(code: string, highlightWords?: HighlightWord[]): DecorationItem[] | undefined {
    return useMemo(() => {
        if (!highlightWords || highlightWords.length === 0) return undefined;

        const decorations: DecorationItem[] = [];
        const lines = code.split('\n');

        for (const { text, className } of highlightWords) {
            for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
                const line = lines[lineIdx];
                let searchStart = 0;
                while (true) {
                    const charIdx = line.indexOf(text, searchStart);
                    if (charIdx === -1) break;
                    decorations.push({
                        start: { line: lineIdx, character: charIdx },
                        end: { line: lineIdx, character: charIdx + text.length },
                        properties: { class: className ?? 'highlighted-word' },
                    });
                    searchStart = charIdx + text.length;
                }
            }
        }

        return decorations.length > 0 ? decorations : undefined;
    }, [code, highlightWords]);
}

/**
 * Post-process Shiki HTML to add line highlights, diff markers,
 * and interactive line numbers.
 */
export function processHtml(html: string, options: ProcessHtmlOptions): string {
    const { highlightLines, addedLines, removedLines, onLineClick, lineAnchorPrefix } = options;

    const hasHighlight = highlightLines && highlightLines.length > 0;
    const hasAdded = addedLines && addedLines.length > 0;
    const hasRemoved = removedLines && removedLines.length > 0;
    const hasInteractive = onLineClick || lineAnchorPrefix;

    if (!(hasHighlight || hasAdded || hasRemoved || hasInteractive)) return html;

    const highlightSet = hasHighlight ? new Set(highlightLines) : null;
    const addedSet = hasAdded ? new Set(addedLines) : null;
    const removedSet = hasRemoved ? new Set(removedLines) : null;

    let lineIndex = 0;

    return html.replace(/<span class="line"(.*?)>/g, (match, rest) => {
        lineIndex++;

        const attrs: string[] = [];
        let lineNumHtml = '';

        if (highlightSet?.has(lineIndex)) attrs.push('data-highlight=""');
        if (addedSet?.has(lineIndex)) attrs.push('data-diff-added=""');
        if (removedSet?.has(lineIndex)) attrs.push('data-diff-removed=""');

        if (hasInteractive) {
            const idAttr = lineAnchorPrefix ? ` id="${lineAnchorPrefix}${lineIndex}"` : '';
            lineNumHtml = `<span class="line-number" data-line-num="${lineIndex}"${idAttr}>${lineIndex}</span>`;
        }

        if (attrs.length === 0 && !lineNumHtml) return match;

        const attrStr = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
        return `<span class="line"${rest}${attrStr}>${lineNumHtml}`;
    });
}
