'use client';

import { forwardRef, useContext, type CSSProperties } from 'react';
import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard';
import { cn } from '../../utils';
import { FONT_MONO } from './constants';
import { CodeBlockContext } from './context';
import { CodeAreaContent, CollapsibleCodeArea } from './components';
import { processHtml, useWordDecorations } from './helpers';
import type { CodeBlockProps } from './public-types';
import { useShiki } from './use-shiki';

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
    (
        {
            code,
            language = 'text',
            theme,
            mono,
            filename,
            showLineNumbers = false,
            borderRadius = 8,
            className,
            style,
            hideCopyButton = false,
            highlightLines,
            ariaLabel,
            addedLines,
            removedLines,
            maxLines,
            expandLabel,
            collapseLabel,
            maxHeight,
            onLineClick,
            lineAnchorPrefix,
            highlightWords,
        },
        ref,
    ) => {
        const ctx = useContext(CodeBlockContext);
        const resolvedTheme = theme ?? ctx.theme ?? 'default';
        const resolvedMono = mono ?? ctx.mono ?? false;

        const decorations = useWordDecorations(code, highlightWords);
        const { html, loading } = useShiki(code, language, decorations);
        const { copied, copy } = useCopyToClipboard(2000);

        const hasHeader = !!filename;
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

        const codeAreaContent = (
            <CodeAreaContent
                code={code}
                copied={copied}
                hasInteractiveLines={hasInteractiveLines}
                hideCopyButton={hideCopyButton}
                loading={loading}
                maxHeight={maxHeight}
                onCopy={() => void copy(code)}
                onLineClick={onLineClick}
                processedHtml={processedHtml}
            />
        );

        return (
            <div
                className={cn(
                    'group relative overflow-hidden',
                    showLineNumbers && !hasInteractiveLines && 'code-block-line-numbers',
                    hasInteractiveLines && 'code-block-interactive-lines',
                    hasDiff && 'code-block-diff',
                    className,
                )}
                data-code-mono={resolvedMono || undefined}
                data-code-theme={resolvedTheme === 'default' ? undefined : resolvedTheme}
                ref={ref}
                role="region"
                {...(ariaLabel && { 'aria-label': ariaLabel })}
                style={{
                    borderRadius,
                    border: '1px solid var(--code-block-border)',
                    background: 'var(--code-block-bg)',
                    fontFamily: FONT_MONO,
                    ...(style as CSSProperties | undefined),
                }}
            >
                {hasHeader && (
                    <div
                        className="flex items-center justify-between px-4 py-2.5 text-[13px] leading-tight"
                        style={{
                            background: 'var(--code-block-header-bg)',
                            color: 'var(--code-block-header-text)',
                            boxShadow: 'inset 0 -1px 0 var(--code-block-header-border)',
                            borderRadius: `${borderRadius - 1}px ${borderRadius - 1}px 0 0`,
                        }}
                    >
                        <span className="font-medium">{filename}</span>
                    </div>
                )}

                {maxLines ? (
                    <CollapsibleCodeArea
                        collapseLabel={collapseLabel}
                        expandLabel={expandLabel}
                        html={processedHtml}
                        maxLines={maxLines}
                    >
                        {codeAreaContent}
                    </CollapsibleCodeArea>
                ) : (
                    <div className="relative">{codeAreaContent}</div>
                )}
            </div>
        );
    },
);

CodeBlock.displayName = 'CodeBlock';
