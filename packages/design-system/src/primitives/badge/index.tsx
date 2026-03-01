import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color variant */
  variant?: BadgeVariant;
  /** Show a colored dot indicator before the label */
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[var(--badge-default-bg)] text-[var(--badge-default-text)]",
  success: "bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]",
  warning: "bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)]",
  danger: "bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)]",
  info: "bg-[var(--badge-info-bg)] text-[var(--badge-info-text)]",
};

const dotColorVar: Record<BadgeVariant, string> = {
  default: "var(--badge-default-dot)",
  success: "var(--badge-success-dot)",
  warning: "var(--badge-warning-dot)",
  danger: "var(--badge-danger-dot)",
  info: "var(--badge-info-dot)",
};

/**
 * Badge component for status indicators and labels.
 *
 * @example
 * ```tsx
 * <Badge variant="success" dot>Active</Badge>
 * <Badge variant="danger">Expired</Badge>
 * <Badge>Default</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant = "default", dot = false, className, children, style, ...props },
    ref
  ) => {
    return (
      <span
        className={cn(
          "inline-flex items-center whitespace-nowrap",
          variantClasses[variant],
          className
        )}
        ref={ref}
        style={{
          height: "var(--badge-height)",
          paddingInline: "var(--badge-padding-x)",
          borderRadius: "var(--badge-radius)",
          gap: "var(--badge-gap)",
          fontSize: "var(--badge-font-size)",
          fontWeight: "var(--badge-font-weight)",
          lineHeight: 1,
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "color-mix(in srgb, currentColor 6%, transparent)",
          ...style,
        }}
        {...props}
      >
        {dot && (
          <span
            aria-hidden
            className="shrink-0 rounded-full"
            style={{
              width: "var(--badge-dot-size)",
              height: "var(--badge-dot-size)",
              backgroundColor: dotColorVar[variant],
            }}
          />
        )}
        <span style={{ transform: "translateY(0.5px)" }}>{children}</span>
      </span>
    );
  }
);

Badge.displayName = "Badge";
