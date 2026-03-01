import { CheckIcon, Square2StackIcon } from "@heroicons/react/24/outline";
import {
  type CSSProperties,
  createContext,
  forwardRef,
  type ReactNode,
  useContext,
} from "react";
import { useCopyToClipboard } from "../../hooks/use-copy-to-clipboard";
import { cn } from "../../utils";
import { AnimatedIcon } from "../animated-icon";
import { useShiki } from "./use-shiki";

/** Mono font constant — maps to the design system's Berkeley Mono variable */
const FONT_MONO = "var(--font-berkeley-mono), ui-monospace, monospace";

/** Available code block theme variants */
export type CodeBlockTheme = "default" | "sand";

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
}

// ---------- Context ----------

const CodeBlockContext = createContext<CodeBlockTheme | undefined>(undefined);

export function CodeBlockProvider({
  theme,
  children,
}: {
  theme: CodeBlockTheme;
  children: ReactNode;
}) {
  return (
    <CodeBlockContext.Provider value={theme}>
      {children}
    </CodeBlockContext.Provider>
  );
}

// ---------- Component ----------

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      code,
      language = "text",
      theme,
      filename,
      showLineNumbers = false,
      borderRadius = 8,
      className,
      style,
      hideCopyButton = false,
      highlightLines,
    },
    ref
  ) => {
    const contextTheme = useContext(CodeBlockContext);
    const resolvedTheme = theme ?? contextTheme ?? "default";

    const { html, loading } = useShiki(code, language);
    const { copied, copy } = useCopyToClipboard(2000);

    const hasHeader = !!filename;

    return (
      <div
        className={cn(
          "group relative",
          showLineNumbers && "code-block-line-numbers",
          className
        )}
        data-code-theme={
          resolvedTheme === "default" ? undefined : resolvedTheme
        }
        ref={ref}
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
            className="flex items-center justify-between px-4 py-2 text-xs"
            style={{
              background: "var(--code-block-header-bg)",
              color: "var(--code-block-header-text)",
              borderBottom: "1px solid var(--code-block-header-border)",
              borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
            }}
          >
            <span className="font-medium">{filename}</span>
            <span className="uppercase tracking-wider opacity-60">
              {language}
            </span>
          </div>
        )}

        {/* Code area */}
        <div className="relative">
          {/* Copy button */}
          {!hideCopyButton && (
            <button
              aria-label={copied ? "Copied" : "Copy code"}
              className={cn(
                "code-block-copy-btn",
                "absolute top-3 right-3 z-10",
                "inline-flex items-center justify-center",
                "size-8 rounded-md",
                "cursor-pointer",
                "transition-all duration-150 ease-out"
              )}
              data-copied={copied || undefined}
              onClick={() => copy(code)}
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
          )}

          {/* Highlighted code */}
          <div
            className="overflow-x-auto p-4 text-sm"
            style={{
              fontFamily: FONT_MONO,
              lineHeight: 1.5,
              scrollbarColor: "var(--code-block-scrollbar-thumb) transparent",
            }}
          >
            {loading || !html ? (
              <pre>
                <code style={{ color: "var(--shiki-foreground)" }}>{code}</code>
              </pre>
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: processHtml(html, highlightLines),
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

CodeBlock.displayName = "CodeBlock";

// ---------- Helpers ----------

/**
 * Post-process Shiki HTML to add line highlights.
 * Shiki wraps each line in a `<span class="line">` element.
 */
function processHtml(html: string, highlightLines?: number[]): string {
  if (!highlightLines || highlightLines.length === 0) return html;

  const highlightSet = new Set(highlightLines);
  let lineIndex = 0;

  return html.replace(/<span class="line"/g, () => {
    lineIndex++;
    if (highlightSet.has(lineIndex)) {
      return '<span class="line" style="background:var(--code-block-line-highlight);display:inline-block;width:100%;margin:0 -1rem;padding:0 1rem"';
    }
    return '<span class="line"';
  });
}
