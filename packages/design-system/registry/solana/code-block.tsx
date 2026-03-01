import { CheckIcon, Square2StackIcon } from "@heroicons/react/24/outline";
import type { DecorationItem } from "@shikijs/core/types";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type CSSProperties,
  createContext,
  forwardRef,
  type ReactNode,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useShiki } from "@/hooks/use-shiki";
import { cn } from "@/lib/cn";

/** Mono font constant — maps to the design system's Berkeley Mono variable */
const FONT_MONO = "var(--font-berkeley-mono), ui-monospace, monospace";

/** Available code block theme variants */
export type CodeBlockTheme = "default" | "sand" | "calm" | "vivid";

export interface CodeBlockProps {
  /** The source code to display */
  code: string;
  /** Programming language for syntax highlighting */
  language?: string;
  /** Theme variant — overrides provider context */
  theme?: CodeBlockTheme;
  /** Monochrome mode — grayscale syntax with lightness contrast */
  mono?: boolean;
  /** Filename to display in the header bar */
  filename?: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Border radius in pixels (default: 8) */
  borderRadius?: number;
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Hide the copy button */
  hideCopyButton?: boolean;
  /** Line numbers to highlight (1-indexed) */
  highlightLines?: number[];
  /** Accessible label for the code block region */
  ariaLabel?: string;
  /** Lines added (1-indexed) — shown with green diff marker */
  addedLines?: number[];
  /** Lines removed (1-indexed) — shown with red diff marker */
  removedLines?: number[];
  /** Maximum visible lines before collapsing (shows expand toggle) */
  maxLines?: number;
  /** Label for the expand button (default: "Show more") */
  expandLabel?: string;
  /** Label for the collapse button (default: "Show less") */
  collapseLabel?: string;
  /** Maximum height in pixels for the scrollable code area */
  maxHeight?: number;
  /** Callback when a line number is clicked */
  onLineClick?: (line: number) => void;
  /** Prefix for line anchor IDs (e.g. "L" → id="L1", id="L2") */
  lineAnchorPrefix?: string;
  /** Words to highlight with a subtle background */
  highlightWords?: Array<{ text: string; className?: string }>;
}

// ---------- Context ----------

interface CodeBlockContextValue {
  theme?: CodeBlockTheme;
  mono?: boolean;
}

const CodeBlockContext = createContext<CodeBlockContextValue>({});

export function CodeBlockProvider({
  theme,
  mono,
  children,
}: {
  theme?: CodeBlockTheme;
  mono?: boolean;
  children: ReactNode;
}) {
  return (
    <CodeBlockContext.Provider value={{ theme, mono }}>
      {children}
    </CodeBlockContext.Provider>
  );
}

// ---------- Shared line-click handler ----------

function handleLineClick(
  e: React.MouseEvent | React.KeyboardEvent,
  onLineClick?: (line: number) => void
) {
  if ("key" in e && e.key !== "Enter" && e.key !== " ") return;
  const target = (e.target as HTMLElement).closest("[data-line-num]");
  if (target) {
    const lineNum = Number(target.getAttribute("data-line-num"));
    if (lineNum && onLineClick) onLineClick(lineNum);
  }
}

// ---------- CodeAreaContent (shared rendering) ----------

function CodeAreaContent({
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
    if (!scrollEl || !fadeEl) return;

    function update() {
      if (!scrollEl || !fadeEl) return;
      const hasOverflow = scrollEl.scrollWidth > scrollEl.clientWidth;
      const atEnd =
        scrollEl.scrollLeft + scrollEl.clientWidth >= scrollEl.scrollWidth - 1;
      fadeEl.style.opacity = hasOverflow && !atEnd ? "1" : "0";
    }

    update();
    scrollEl.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(scrollEl);

    return () => {
      scrollEl.removeEventListener("scroll", update);
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
          role: "grid",
          onClick: (e: React.MouseEvent) => handleLineClick(e, onLineClick),
          onKeyDown: (e: React.KeyboardEvent) =>
            handleLineClick(e, onLineClick),
        })}
        style={{
          tabSize: 2,
          scrollbarColor: "var(--code-block-scrollbar-thumb) transparent",
          ...(maxHeight
            ? { maxHeight, overflowY: "auto" as const }
            : undefined),
        }}
      >
        {loading || !processedHtml ? (
          <pre>
            <code style={{ color: "var(--shiki-foreground)" }}>{code}</code>
          </pre>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: processedHtml }}
            style={{ animation: "code-block-fade-in 150ms ease-out" }}
          />
        )}
      </div>
      <div ref={fadeRef} className="code-block-scroll-fade" />
    </>
  );
}

// ---------- CopyBtn (extracted to reduce complexity) ----------

function CopyBtn({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <button
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn(
        "code-block-copy-btn",
        "absolute top-3 right-3 z-10",
        "inline-flex items-center justify-center",
        "size-8 rounded-md",
        "cursor-pointer",
        "transition-colors duration-150 ease-out"
      )}
      data-copied={copied || undefined}
      onClick={onCopy}
      type="button"
    >
      <AnimatedIcon
        icon={
          copied ? (
            <CheckIcon className="size-4" />
          ) : (
            <Square2StackIcon className="size-4" />
          )
        }
        iconKey={copied ? "check" : "copy"}
        preset="micro"
      />
    </button>
  );
}

// ---------- Component ----------

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      code,
      language = "text",
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
    ref
  ) => {
    const ctx = useContext(CodeBlockContext);
    const resolvedTheme = theme ?? ctx.theme ?? "default";
    const resolvedMono = mono ?? ctx.mono ?? false;

    const decorations = useWordDecorations(code, highlightWords);
    const { html, loading } = useShiki(code, language, decorations);
    const { copied, copy } = useCopyToClipboard(2000);

    const hasHeader = !!filename;
    const hasInteractiveLines = !!(onLineClick || lineAnchorPrefix);
    const hasDiff =
      (addedLines && addedLines.length > 0) ||
      (removedLines && removedLines.length > 0);

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
        onCopy={() => copy(code)}
        onLineClick={onLineClick}
        processedHtml={processedHtml}
      />
    );

    return (
      <div
        className={cn(
          "group relative overflow-hidden",
          showLineNumbers && !hasInteractiveLines && "code-block-line-numbers",
          hasInteractiveLines && "code-block-interactive-lines",
          hasDiff && "code-block-diff",
          className
        )}
        data-code-mono={resolvedMono || undefined}
        data-code-theme={
          resolvedTheme === "default" ? undefined : resolvedTheme
        }
        ref={ref}
        role="region"
        {...(ariaLabel && { "aria-label": ariaLabel })}
        style={{
          borderRadius,
          border: "1px solid var(--code-block-border)",
          background: "var(--code-block-bg)",
          fontFamily: FONT_MONO,
          ...style,
        }}
      >
        {/* Header */}
        {hasHeader && (
          <div
            className="flex items-center justify-between px-4 py-2.5 text-[13px] leading-tight"
            style={{
              background: "var(--code-block-header-bg)",
              color: "var(--code-block-header-text)",
              boxShadow: "inset 0 -1px 0 var(--code-block-header-border)",
              borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
            }}
          >
            <span className="font-medium">{filename}</span>
          </div>
        )}

        {/* Code area */}
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
  }
);

CodeBlock.displayName = "CodeBlock";

// ---------- CodeBlockInner (for CodeBlockGroup) ----------

export interface CodeBlockInnerProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  hideCopyButton?: boolean;
  highlightLines?: number[];
  addedLines?: number[];
  removedLines?: number[];
  maxHeight?: number;
  onLineClick?: (line: number) => void;
  lineAnchorPrefix?: string;
  highlightWords?: Array<{ text: string; className?: string }>;
  /** Override the code used by the copy button (used by CodeBlockGroup) */
  copyCode?: string;
}

export function CodeBlockInner({
  code,
  language = "text",
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
  const hasDiff =
    (addedLines && addedLines.length > 0) ||
    (removedLines && removedLines.length > 0);

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
        "relative",
        showLineNumbers && !hasInteractiveLines && "code-block-line-numbers",
        hasInteractiveLines && "code-block-interactive-lines",
        hasDiff && "code-block-diff"
      )}
    >
      <CodeAreaContent
        code={code}
        copied={copied}
        hasInteractiveLines={hasInteractiveLines}
        hideCopyButton={hideCopyButton}
        loading={loading}
        maxHeight={maxHeight}
        onCopy={() => copy(copyCode ?? code)}
        onLineClick={onLineClick}
        processedHtml={processedHtml}
      />
    </div>
  );
}

// ---------- CollapsibleCodeArea ----------

function CollapsibleCodeArea({
  maxLines,
  expandLabel = "Show more",
  collapseLabel = "Show less",
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: html triggers re-measure after Shiki async load
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
          height: !expanded && needsCollapse ? collapsedHeight : "auto",
        }}
        className="code-block-collapsible overflow-hidden"
        initial={false}
        ref={contentRef}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", duration: 0.4, bounce: 0 }
        }
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
        <button
          className="code-block-expand-btn"
          onClick={() => setExpanded((v) => !v)}
          type="button"
        >
          {expanded ? collapseLabel : expandLabel}
        </button>
      )}
    </div>
  );
}

// ---------- Helpers ----------

/** Build Shiki decoration items from highlightWords */
function useWordDecorations(
  code: string,
  highlightWords?: Array<{ text: string; className?: string }>
): DecorationItem[] | undefined {
  return useMemo(() => {
    if (!highlightWords || highlightWords.length === 0) return undefined;

    const decorations: DecorationItem[] = [];
    const lines = code.split("\n");

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
            properties: { class: className ?? "highlighted-word" },
          });
          searchStart = charIdx + text.length;
        }
      }
    }

    return decorations.length > 0 ? decorations : undefined;
  }, [code, highlightWords]);
}

interface ProcessHtmlOptions {
  highlightLines?: number[];
  addedLines?: number[];
  removedLines?: number[];
  onLineClick?: boolean;
  lineAnchorPrefix?: string;
}

/**
 * Post-process Shiki HTML to add line highlights, diff markers,
 * and interactive line numbers.
 */
function processHtml(html: string, options: ProcessHtmlOptions): string {
  const {
    highlightLines,
    addedLines,
    removedLines,
    onLineClick,
    lineAnchorPrefix,
  } = options;

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
    let lineNumHtml = "";

    if (highlightSet?.has(lineIndex)) {
      attrs.push('data-highlight=""');
    }
    if (addedSet?.has(lineIndex)) {
      attrs.push('data-diff-added=""');
    }
    if (removedSet?.has(lineIndex)) {
      attrs.push('data-diff-removed=""');
    }
    if (hasInteractive) {
      const idAttr = lineAnchorPrefix
        ? ` id="${lineAnchorPrefix}${lineIndex}"`
        : "";
      lineNumHtml = `<span class="line-number" data-line-num="${lineIndex}"${idAttr}>${lineIndex}</span>`;
    }

    if (attrs.length === 0 && !lineNumHtml) return match;

    const attrStr = attrs.length > 0 ? ` ${attrs.join(" ")}` : "";
    return `<span class="line"${rest}${attrStr}>${lineNumHtml}`;
  });
}
