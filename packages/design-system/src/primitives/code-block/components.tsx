'use client';

import { CheckIcon, Square2StackIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../utils';
import { AnimatedIcon } from '../animated-icon';
import { handleLineClick } from './helpers';

function CopyBtn({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
    return (
        <button
            aria-label={copied ? 'Copied' : 'Copy code'}
            className={cn(
                'code-block-copy-btn',
                'absolute top-3 right-3 z-10',
                'inline-flex items-center justify-center',
                'size-8 rounded-md',
                'cursor-pointer',
                'transition-colors duration-150 ease-out',
            )}
            data-copied={copied || undefined}
            onClick={onCopy}
            type="button"
        >
            <AnimatedIcon
                icon={copied ? <CheckIcon className="size-4" /> : <Square2StackIcon className="size-4" />}
                iconKey={copied ? 'check' : 'copy'}
                preset="micro"
            />
        </button>
    );
}

export function CodeAreaContent({
    code,
    processedHtml,
    loading,
    hideCopyButton,
    copied,
    onCopy,
    hasInteractiveLines,
    onLineClick,
    maxHeight,
}: {
    code: string;
    processedHtml: string | null;
    loading: boolean;
    hideCopyButton: boolean;
    copied: boolean;
    onCopy: () => void;
    hasInteractiveLines: boolean;
    onLineClick?: (line: number) => void;
    maxHeight?: number;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const scrollEl = scrollRef.current;
        const fadeEl = fadeRef.current;
        if (!(scrollEl && fadeEl)) return;

        function update() {
            if (!(scrollEl && fadeEl)) return;
            const hasOverflow = scrollEl.scrollWidth > scrollEl.clientWidth;
            const atEnd = scrollEl.scrollLeft + scrollEl.clientWidth >= scrollEl.scrollWidth - 1;
            fadeEl.style.opacity = hasOverflow && !atEnd ? '1' : '0';
        }

        update();
        scrollEl.addEventListener('scroll', update, { passive: true });
        const ro = new ResizeObserver(update);
        ro.observe(scrollEl);

        return () => {
            scrollEl.removeEventListener('scroll', update);
            ro.disconnect();
        };
    }, [processedHtml]);

    return (
        <>
            {!hideCopyButton && <CopyBtn copied={copied} onCopy={onCopy} />}
            <div
                className="overflow-x-auto p-4 text-sm"
                ref={scrollRef}
                {...(hasInteractiveLines && {
                    role: 'grid',
                    onClick: (e: MouseEvent) => handleLineClick(e, onLineClick),
                    onKeyDown: (e: KeyboardEvent) => handleLineClick(e, onLineClick),
                })}
                style={{
                    tabSize: 2,
                    scrollbarColor: 'var(--code-block-scrollbar-thumb) transparent',
                    ...(maxHeight ? { maxHeight, overflowY: 'auto' as const } : undefined),
                }}
            >
                {loading || !processedHtml ? (
                    <pre>
                        <code style={{ color: 'var(--shiki-foreground)' }}>{code}</code>
                    </pre>
                ) : (
                    <div
                        dangerouslySetInnerHTML={{ __html: processedHtml }}
                        style={{ animation: 'code-block-fade-in 150ms ease-out' }}
                    />
                )}
            </div>
            <div className="code-block-scroll-fade" ref={fadeRef} />
        </>
    );
}

export function CollapsibleCodeArea({
    maxLines,
    expandLabel = 'Show more',
    collapseLabel = 'Show less',
    html,
    children,
}: {
    maxLines: number;
    expandLabel?: string;
    collapseLabel?: string;
    html: string | null;
    children: ReactNode;
}) {
    const LINE_HEIGHT = 21; // text-sm leading-relaxed ≈ 21px
    const collapsedHeight = maxLines * LINE_HEIGHT + 32; // +32 for p-4 padding
    const contentRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState(false);
    const [naturalHeight, setNaturalHeight] = useState(0);
    const reduceMotion = useReducedMotion();

    useLayoutEffect(() => {
        if (contentRef.current) {
            setNaturalHeight(contentRef.current.scrollHeight);
        }
    }, [html]);

    const needsCollapse = naturalHeight > collapsedHeight;

    return (
        <div className="relative">
            <motion.div
                animate={{
                    height: !expanded && needsCollapse ? collapsedHeight : 'auto',
                }}
                className="code-block-collapsible overflow-hidden"
                initial={false}
                ref={contentRef}
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0 }}
            >
                {children}
            </motion.div>
            <AnimatePresence>
                {needsCollapse && !expanded && (
                    <motion.div
                        animate={{ opacity: 1 }}
                        className="code-block-fade-overlay"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
                    />
                )}
            </AnimatePresence>
            {needsCollapse && (
                <button className="code-block-expand-btn" onClick={() => setExpanded(v => !v)} type="button">
                    {expanded ? collapseLabel : expandLabel}
                </button>
            )}
        </div>
    );
}
