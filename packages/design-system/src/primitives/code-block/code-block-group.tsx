import { motion, useReducedMotion } from "motion/react";
import {
  type CSSProperties,
  forwardRef,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../../utils";
import { CodeBlockInner, type CodeBlockTheme } from "./index";

/** Mono font constant — maps to the design system's Berkeley Mono variable */
const FONT_MONO = "var(--font-berkeley-mono), ui-monospace, monospace";

export interface CodeBlockGroupItem {
  /** Tab label */
  label: string;
  /** Shiki language for syntax highlighting */
  language: string;
  /** Source code */
  code: string;
  /** Optional filename subtitle */
  filename?: string;
}

export interface CodeBlockGroupProps {
  /** Array of code items to display as tabs */
  items: CodeBlockGroupItem[];
  /** Default active tab (uncontrolled, matched by label) */
  defaultValue?: string;
  /** Active tab value (controlled) */
  value?: string;
  /** Callback when active tab changes */
  onValueChange?: (value: string) => void;
  /** Theme variant */
  theme?: CodeBlockTheme;
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
}

export const CodeBlockGroup = forwardRef<HTMLDivElement, CodeBlockGroupProps>(
  (
    {
      items,
      defaultValue,
      value: controlledValue,
      onValueChange,
      theme,
      showLineNumbers = false,
      borderRadius = 8,
      className,
      style,
      hideCopyButton = false,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      () => defaultValue ?? items[0]?.label ?? ""
    );

    const activeValue =
      controlledValue !== undefined ? controlledValue : internalValue;

    const handleTabChange = (val: string) => {
      if (controlledValue === undefined) {
        setInternalValue(val);
      }
      onValueChange?.(val);
    };

    const resolvedTheme = theme ?? "default";
    const activeItem = items.find((item) => item.label === activeValue);

    // --- Animation setup ---
    const uniqueId = useId();
    const layoutId = `code-group-tab-${uniqueId}`;
    const shouldReduceMotion = useReducedMotion();
    const [contentHeight, setContentHeight] = useState<number | "auto">("auto");
    const activePanelRef = useRef<HTMLDivElement | null>(null);
    const hasAnimated = useRef(false);

    // biome-ignore lint/correctness/useExhaustiveDependencies: activeValue triggers re-observe on the new active panel
    useLayoutEffect(() => {
      const el = activePanelRef.current;
      if (!el) return;

      const measure = () => setContentHeight(el.offsetHeight);
      measure();

      const observer = new ResizeObserver(() => measure());
      observer.observe(el);

      return () => {
        observer.disconnect();
        hasAnimated.current = true;
      };
    }, [activeValue]);

    return (
      <div
        className={cn("group relative", className)}
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
        {/* Tab header */}
        <div
          className="code-block-group-tablist"
          role="tablist"
          style={{
            borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
          }}
        >
          {items.map((item) => {
            const isSelected = item.label === activeValue;
            return (
              <button
                aria-selected={isSelected}
                data-selected={isSelected ? "" : undefined}
                key={item.label}
                onClick={() => handleTabChange(item.label)}
                role="tab"
                type="button"
              >
                {isSelected && (
                  <motion.span
                    className="absolute inset-x-0 bottom-0 h-[2px]"
                    layoutId={shouldReduceMotion ? undefined : layoutId}
                    style={{ background: "var(--shiki-foreground)" }}
                    transition={{ type: "spring", duration: 0.25, bounce: 0 }}
                  />
                )}
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Tab panels — all stay mounted for Shiki cache benefit */}
        <motion.div
          animate={{ height: contentHeight }}
          initial={false}
          style={{ position: "relative", overflow: "hidden" }}
          transition={
            !hasAnimated.current || shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", duration: 0.35, bounce: 0 }
          }
        >
          {items.map((item) => {
            const isActive = item.label === activeValue;
            return (
              <div
                aria-hidden={!isActive}
                key={item.label}
                ref={isActive ? activePanelRef : undefined}
                role="tabpanel"
                {...(!isActive && { inert: true })}
                style={{
                  position: "absolute" as const,
                  top: 0,
                  left: 0,
                  right: 0,
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 0.2s ease-out",
                  pointerEvents: isActive
                    ? ("auto" as const)
                    : ("none" as const),
                }}
              >
                <CodeBlockInner
                  code={item.code}
                  copyCode={activeItem?.code}
                  hideCopyButton={hideCopyButton}
                  language={item.language}
                  showLineNumbers={showLineNumbers}
                />
              </div>
            );
          })}
        </motion.div>
      </div>
    );
  }
);

CodeBlockGroup.displayName = "CodeBlockGroup";
