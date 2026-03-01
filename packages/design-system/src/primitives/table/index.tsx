import { Check, Copy } from "lucide-react";
import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../../utils";

/* =============================================================================
   Table
   Wrapper div (overflow + border-radius) around a native <table>.
   Supports scroll shadow indicators and keyboard-accessible scrolling.
   ============================================================================= */

export interface TableProps extends HTMLAttributes<HTMLDivElement> {}

export const Table = forwardRef<HTMLDivElement, TableProps>(
  ({ className, children, ...props }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollState, setScrollState] = useState({
      left: false,
      right: false,
    });

    const updateScrollState = useCallback((el: HTMLDivElement) => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setScrollState({
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth - 1,
      });
    }, []);

    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        updateScrollState(e.currentTarget);
      },
      [updateScrollState]
    );

    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      // Check initial scroll state (e.g. if table is wider than container on mount)
      updateScrollState(el);
    }, [updateScrollState]);

    return (
      <div
        className={cn(
          "table-scroll-container overflow-x-auto",
          "rounded-[var(--table-radius)] border border-[var(--table-border)]",
          "focus-visible:outline-2 focus-visible:outline-[var(--button-focus-ring)] focus-visible:outline-offset-2",
          className
        )}
        data-scroll-left={scrollState.left}
        data-scroll-right={scrollState.right}
        onScroll={handleScroll}
        ref={(node) => {
          // Merge refs: internal scrollRef + forwarded ref
          (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          // Check scroll state when ref attaches
          if (node) updateScrollState(node);
        }}
        role="region"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable regions need tabIndex for keyboard access
        tabIndex={0}
        {...props}
      >
        <table className="w-full caption-bottom border-separate border-spacing-0 text-body-md">
          {children}
        </table>
      </div>
    );
  }
);
Table.displayName = "Table";

/* =============================================================================
   TableHeader
   ============================================================================= */

export interface TableHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, ...props }, ref) => (
  <thead
    className={cn("bg-[var(--table-header-bg)]", className)}
    ref={ref}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

/* =============================================================================
   TableBody
   ============================================================================= */

export interface TableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      className={cn("[&_tr:last-child_td]:border-0", className)}
      ref={ref}
      {...props}
    />
  )
);
TableBody.displayName = "TableBody";

/* =============================================================================
   TableFooter
   ============================================================================= */

export interface TableFooterProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(({ className, ...props }, ref) => (
  <tfoot
    className={cn(
      "bg-[var(--table-header-bg)] font-[var(--font-weight-medium)]",
      className
    )}
    ref={ref}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

/* =============================================================================
   TableRow
   ============================================================================= */

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      className={cn(
        "group/row",
        "transition-colors duration-150 ease-out",
        "hover:bg-[var(--table-row-bg-hover)]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

/* =============================================================================
   TableHead
   ============================================================================= */

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Column alignment */
  align?: "left" | "center" | "right";
  /** Pin column to left or right edge during horizontal scroll */
  pinned?: "left" | "right";
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, align = "left", pinned, ...props }, ref) => (
    <th
      className={cn(
        "text-[var(--table-header-text)]",
        "font-[var(--font-weight-medium)]",
        "whitespace-nowrap align-middle",
        "border-[var(--table-border)] border-b",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        pinned && "sticky z-20 bg-[var(--table-header-bg-solid)]",
        pinned === "left" &&
          "left-0 shadow-[inset_-1px_0_0_0_var(--table-border)]",
        pinned === "right" &&
          "right-0 shadow-[inset_1px_0_0_0_var(--table-border)]",
        className
      )}
      ref={ref}
      style={{
        height: "var(--table-header-height)",
        paddingInline: "var(--table-cell-padding-x)",
        paddingBlock: "var(--table-header-padding-y)",
      }}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

/* =============================================================================
   TableCell
   ============================================================================= */

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Column alignment */
  align?: "left" | "center" | "right";
  /** Render text in monospace (Berkeley Mono) */
  mono?: boolean;
  /** Apply tabular-nums for aligned numbers */
  numeric?: boolean;
  /** Pin column to left or right edge during horizontal scroll */
  pinned?: "left" | "right";
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  (
    {
      className,
      align = "left",
      mono = false,
      numeric = false,
      pinned,
      ...props
    },
    ref
  ) => (
    <td
      className={cn(
        "whitespace-nowrap align-middle text-text-high",
        "border-[var(--table-border)] border-b",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        mono && "font-berkeley-mono",
        numeric && "tabular-nums",
        pinned && "sticky z-10 bg-[var(--table-bg)]",
        pinned && "group-hover/row:bg-[var(--table-row-bg-hover-solid)]",
        pinned && "transition-colors duration-150 ease-out",
        pinned === "left" &&
          "left-0 shadow-[inset_-1px_0_0_0_var(--table-border)]",
        pinned === "right" &&
          "right-0 shadow-[inset_1px_0_0_0_var(--table-border)]",
        className
      )}
      ref={ref}
      style={{
        height: "var(--table-row-height)",
        paddingInline: "var(--table-cell-padding-x)",
        paddingBlock: "var(--table-cell-padding-y)",
      }}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

/* =============================================================================
   TableCellCopyable
   Cell with a copy-to-clipboard button that appears on hover.
   Useful for wallet addresses, API keys, transaction signatures.
   ============================================================================= */

export interface TableCellCopyableProps
  extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Column alignment */
  align?: "left" | "center" | "right";
  /** Render text in monospace (Berkeley Mono) */
  mono?: boolean;
  /** The value to copy (defaults to children text content) */
  value?: string;
  /** Max width before truncating with ellipsis (number for px, string for any CSS unit) */
  truncate?: number | string;
  /** Pin column to left or right edge during horizontal scroll */
  pinned?: "left" | "right";
}

export const TableCellCopyable = forwardRef<
  HTMLTableCellElement,
  TableCellCopyableProps
>(
  (
    {
      className,
      align = "left",
      mono = false,
      value,
      truncate,
      pinned,
      children,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      const text =
        value ?? (typeof children === "string" ? children : String(children));
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };

    const truncateStyle = truncate
      ? {
          maxWidth: typeof truncate === "number" ? `${truncate}px` : truncate,
          overflow: "hidden" as const,
          textOverflow: "ellipsis" as const,
          whiteSpace: "nowrap" as const,
        }
      : {};

    return (
      <td
        className={cn(
          "group/copy whitespace-nowrap align-middle text-text-high",
          "border-[var(--table-border)] border-b",
          align === "left" && "text-left",
          align === "center" && "text-center",
          align === "right" && "text-right",
          mono && "font-berkeley-mono",
          pinned && "sticky z-10 bg-[var(--table-bg)]",
          pinned && "group-hover/row:bg-[var(--table-row-bg-hover-solid)]",
          pinned && "transition-colors duration-150 ease-out",
          pinned === "left" &&
            "left-0 shadow-[inset_-1px_0_0_0_var(--table-border)]",
          pinned === "right" &&
            "right-0 shadow-[inset_1px_0_0_0_var(--table-border)]",
          className
        )}
        ref={ref}
        style={{
          height: "var(--table-row-height)",
          paddingInline: "var(--table-cell-padding-x)",
          paddingBlock: "var(--table-cell-padding-y)",
        }}
        {...props}
      >
        <span className="inline-flex items-center gap-1.5">
          <span style={truncateStyle}>{children}</span>
          <button
            aria-label="Copy to clipboard"
            className="shrink-0 cursor-pointer text-text-low opacity-0 transition-opacity duration-150 hover:text-text-high group-hover/copy:opacity-100"
            onClick={handleCopy}
            type="button"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </span>
      </td>
    );
  }
);
TableCellCopyable.displayName = "TableCellCopyable";

/* =============================================================================
   TableCaption
   ============================================================================= */

export interface TableCaptionProps
  extends HTMLAttributes<HTMLTableCaptionElement> {}

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => (
  <caption
    className={cn(
      "py-3 text-[var(--table-caption-text)] text-body-sm",
      className
    )}
    ref={ref}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";
