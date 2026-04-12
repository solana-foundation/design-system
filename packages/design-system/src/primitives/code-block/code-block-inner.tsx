'use client';

import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard';
import { cn } from '../../utils';
import { CodeAreaContent } from './components';
import { processHtml, useWordDecorations } from './helpers';
import type { CodeBlockInnerProps } from './public-types';
import { useShiki } from './use-shiki';

export function CodeBlockInner({
    code,
    language = 'text',
    showLineNumbers = false,
    hideCopyButton = false,
    highlightLines,
    addedLines,
    removedLines,
    maxHeight,
    onLineClick,
    lineAnchorPrefix,
    highlightWords,
    copyCode,
}: CodeBlockInnerProps) {
    const decorations = useWordDecorations(code, highlightWords);
    const { html, loading } = useShiki(code, language, decorations);
    const { copied, copy } = useCopyToClipboard(2000);

    const hasInteractiveLines = !!(onLineClick || lineAnchorPrefix);
    const hasDiff = (addedLines && addedLines.length > 0) || (removedLines && removedLines.length > 0);

    const processedHtml = html
        ? processHtml(html, {
              highlightLines,
              addedLines,
              removedLines,
              onLineClick: hasInteractiveLines,
              lineAnchorPrefix,
          })
        : null;

    return (
        <div
            className={cn(
                'relative',
                showLineNumbers && !hasInteractiveLines && 'code-block-line-numbers',
                hasInteractiveLines && 'code-block-interactive-lines',
                hasDiff && 'code-block-diff',
            )}
        >
            <CodeAreaContent
                code={code}
                copied={copied}
                hasInteractiveLines={hasInteractiveLines}
                hideCopyButton={hideCopyButton}
                loading={loading}
                maxHeight={maxHeight}
                onCopy={() => void copy(copyCode ?? code)}
                onLineClick={onLineClick}
                processedHtml={processedHtml}
            />
        </div>
    );
}

CodeBlockInner.displayName = 'CodeBlockInner';
