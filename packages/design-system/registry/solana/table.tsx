import { Check, Copy } from "lucide-react";
import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";

/* =============================================================================
   Table
   Wrapper div (overflow + border-radius) around a native <table>.
   ============================================================================= */

export interface TableProps extends HTMLAttributes<HTMLDivElement> {}

export const Table = forwardRef<HTMLDivElement, TableProps>(
  ({ className, children, ...props }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const shadowStartRef = useRef<HTMLDivElement>(null);
    const shadowEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const scrollEl = scrollRef.current;
      const startEl = shadowStartRef.current;
      const endEl = shadowEndRef.current;
      if (!(scrollEl && startEl && endEl)) return;

      function update() {
        if (!(scrollEl && startEl && endEl)) return;
        const hasOverflow = scrollEl.scrollWidth > scrollEl.clientWidth;
        const atStart = scrollEl.scrollLeft <= 0;
        const atEnd =
          scrollEl.scrollLeft + scrollEl.clientWidth >=
          scrollEl.scrollWidth - 1;
        startEl.style.opacity = hasOverflow && !atStart ? "1" : "0";
        endEl.style.opacity = hasOverflow && !atEnd ? "1" : "0";
      }

      update();
      scrollEl.addEventListener("scroll", update, { passive: true });
      const ro = new ResizeObserver(update);
      ro.observe(scrollEl);
      return () => {
        scrollEl.removeEventListener("scroll", update);
        ro.disconnect();
      };
    }, []);

    return (
      <div className={cn("relative", className)} ref={ref} {...props}>
        <div
          className={cn(
            "table-scroll-container overflow-x-auto",
            "rounded-[var(--table-radius)] border border-[var(--table-border)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] focus-visible:ring-inset"
          )}
          ref={scrollRef}
          role="region"
          tabIndex={0}
        >
          <table className="w-full caption-bottom border-collapse text-body-md">
            {children}
          </table>
        </div>
        <div className="table-scroll-shadow-start" ref={shadowStartRef} />
        <div className="table-scroll-shadow-end" ref={shadowEndRef} />
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
      className={cn("[&_tr:last-child]:border-0", className)}
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
        "border-[var(--table-border)] border-b",
        "transition-colors duration-150 ease-out",
        "hover:bg-[var(--table-row-bg-hover)]",
        "data-[state=selected]:bg-[var(--table-row-bg-selected)]",
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
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, align = "left", ...props }, ref) => (
    <th
      className={cn(
        "text-[var(--table-header-text)]",
        "font-[var(--font-weight-medium)]",
        "whitespace-nowrap align-middle",
        "ps-[var(--table-cell-padding-x)] pe-[var(--table-cell-padding-x)]",
        "first:ps-[var(--table-cell-padding-x-edge)] last:pe-[var(--table-cell-padding-x-edge)]",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className
      )}
      ref={ref}
      style={{
        height: "var(--table-header-height)",
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
  /** Apply lining + tabular figures for aligned numbers */
  numeric?: boolean;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  (
    { className, align = "left", mono = false, numeric = false, ...props },
    ref
  ) => (
    <td
      className={cn(
        "whitespace-nowrap align-middle text-text-high",
        "ps-[var(--table-cell-padding-x)] pe-[var(--table-cell-padding-x)]",
        "first:ps-[var(--table-cell-padding-x-edge)] last:pe-[var(--table-cell-padding-x-edge)]",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        mono && "font-berkeley-mono",
        numeric && "lining-nums tabular-nums",
        className
      )}
      ref={ref}
      style={{
        height: "var(--table-row-height)",
        paddingBlock: "var(--table-cell-padding-y)",
        ...(mono ? { fontSize: "var(--text-body-sm-size)" } : {}),
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
          "ps-[var(--table-cell-padding-x)] pe-[var(--table-cell-padding-x)]",
          "first:ps-[var(--table-cell-padding-x-edge)] last:pe-[var(--table-cell-padding-x-edge)]",
          align === "left" && "text-left",
          align === "center" && "text-center",
          align === "right" && "text-right",
          mono && "font-berkeley-mono",
          className
        )}
        ref={ref}
        style={{
          height: "var(--table-row-height)",
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
