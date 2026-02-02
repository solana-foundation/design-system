import { Field } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import { motion, useReducedMotion } from "motion/react";
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { cn } from "../../utils";

/**
 * Input size variants.
 * Each size maps to height, padding, radius, icon size, and typography tokens.
 */
type InputSize = "xl" | "lg" | "md";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Size preset controlling height, padding, typography, and icon sizing */
  size?: InputSize;
  /** Label text displayed above the input */
  label?: string;
  /** Helper text displayed below the input */
  description?: string;
  /** Error message - renders error styling and message below input */
  error?: string;
  /** Icon element to display at the start of the input */
  iconLeft?: ReactNode;
  /** Icon element to display at the end of the input */
  iconRight?: ReactNode;
}

/** Static style objects hoisted to module scope to avoid per-render allocations. */
const iconWrapperStyle: React.CSSProperties = {
  width: "var(--icon-size)",
  height: "var(--icon-size)",
};

const focusRingStyle: React.CSSProperties = {
  inset: "calc(var(--input-border-width) * -1)",
  borderRadius: "inherit",
  boxShadow: "0 0 0 3px var(--input-focus-ring)",
};

const TRANSITION_INSTANT = { duration: 0 } as const;
const TRANSITION_EXIT = { duration: 0.12, ease: "easeIn" } as const;

/**
 * Icon wrapper for consistent sizing.
 * Uses inherited --icon-size CSS variable set by parent input container.
 */
const IconWrapper = ({ children }: { children: ReactNode }) => (
  <span
    className="inline-flex shrink-0 items-center justify-center text-text-low transition-colors duration-200 ease-out motion-reduce:transition-none"
    style={iconWrapperStyle}
  >
    {children}
  </span>
);

const sizeStyles: Record<
  InputSize,
  {
    height: string;
    paddingX: string;
    radius: string;
    iconSize: string;
    gap: string;
    textClass: string;
  }
> = {
  xl: {
    height: "var(--input-height-xl)",
    paddingX: "var(--input-padding-x-xl)",
    radius: "var(--input-radius-xl)",
    iconSize: "var(--input-icon-xl)",
    gap: "var(--input-gap-xl)",
    textClass: "text-body-lg",
  },
  lg: {
    height: "var(--input-height-lg)",
    paddingX: "var(--input-padding-x-lg)",
    radius: "var(--input-radius-lg)",
    iconSize: "var(--input-icon-lg)",
    gap: "var(--input-gap-lg)",
    textClass: "text-body-md",
  },
  md: {
    height: "var(--input-height-md)",
    paddingX: "var(--input-padding-x-md)",
    radius: "var(--input-radius-md)",
    iconSize: "var(--input-icon-md)",
    gap: "var(--input-gap-md)",
    textClass: "text-body-sm",
  },
};

/**
 * Input component with Base UI accessible foundation.
 *
 * Renders a styled text input with optional label, description, error message,
 * and icon slots. Uses Base UI's Field and Input components for accessibility
 * (label association, error announcement, ARIA attributes).
 *
 * When no label, description, or error is provided, renders a minimal
 * styled input without the Field wrapper.
 *
 * @example
 * ```tsx
 * // Basic input
 * <Input placeholder="you@email.com" />
 *
 * // With label
 * <Input label="Email" placeholder="you@email.com" size="xl" />
 *
 * // With icons
 * <Input iconLeft={<SearchIcon />} placeholder="Search..." size="lg" />
 *
 * // With error
 * <Input label="Email" error="This field is required" required />
 *
 * // With description
 * <Input label="Username" description="Must be unique" />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "xl",
      label,
      description,
      error,
      iconLeft,
      iconRight,
      disabled = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const sizeConfig = sizeStyles[size];
    const [isFocused, setIsFocused] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsFocused(false);
      }
    }, []);

    const containerStyles = useMemo(
      () =>
        ({
          height: sizeConfig.height,
          padding: `0 ${sizeConfig.paddingX}`,
          borderRadius: sizeConfig.radius,
          gap: sizeConfig.gap,
          "--icon-size": sizeConfig.iconSize,
          ...style,
        }) as React.CSSProperties,
      [sizeConfig, style]
    );

    const hasField = !!(label || description || error);

    const containerClasses = cn(
      // Layout — relative for focus ring overlay positioning
      "group relative flex w-full items-center",
      // Border - 1.5px with semantic tokens (color: hint needed for CSS vars)
      "border-[color:var(--input-border-idle)] border-[length:var(--input-border-width)] border-solid",
      // Hover state — only when not focused (focus state should be visually locked)
      "[&:not(:focus-within)]:hover:border-[color:var(--input-border-hover)] [&:not(:focus-within)]:hover:bg-[var(--input-bg-hover)]",
      // Focus state - border and background
      "focus-within:border-[color:var(--input-border-focus)] focus-within:bg-[var(--input-bg-hover)]",
      // Border & background transitions (focus ring handled by motion.span overlay)
      "transition-colors duration-200 ease-out motion-reduce:transition-none",
      // Disabled
      disabled && "pointer-events-none opacity-50",
      // Error state
      error &&
        "border-red-500 focus-within:border-red-500 hover:border-red-500",
      className
    );

    const inputClasses = cn(
      // Reset & layout
      "autofill-transparent min-w-0 flex-1 bg-transparent outline-none",
      // Typography - inherits from size config
      sizeConfig.textClass,
      // Colors
      "text-text-extra-high",
      "placeholder:text-text-low",
      // Placeholder transition for smooth hover color shift
      "placeholder:transition-colors placeholder:duration-200 placeholder:ease-out",
      // Hover: placeholder becomes more visible (via group-hover)
      "group-hover:placeholder:text-text-medium"
    );

    const inputElement = (
      // biome-ignore lint/a11y/noNoninteractiveElementInteractions: focus/blur track focus-within state for the child input's ring overlay
      // biome-ignore lint/a11y/noStaticElementInteractions: see above
      <div
        className={containerClasses}
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={containerStyles}
      >
        {/* Focus ring overlay — GPU-accelerated opacity + scale animation */}
        <motion.span
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: shouldReduceMotion ? 1 : isFocused ? 1 : 0.97,
          }}
          aria-hidden="true"
          className="pointer-events-none absolute"
          initial={false}
          style={focusRingStyle}
          transition={
            shouldReduceMotion || isFocused
              ? TRANSITION_INSTANT
              : TRANSITION_EXIT
          }
        />
        {iconLeft && <IconWrapper>{iconLeft}</IconWrapper>}
        <BaseInput
          className={inputClasses}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        {iconRight && <IconWrapper>{iconRight}</IconWrapper>}
      </div>
    );

    // Without field metadata, render minimal input
    if (!hasField) {
      return inputElement;
    }

    // With field metadata, wrap with Base UI Field for accessibility
    return (
      <Field.Root
        className="flex w-full flex-col gap-2"
        disabled={disabled}
        invalid={!!error}
      >
        {label && (
          <Field.Label className="text-body-md text-text-medium">
            {label}
          </Field.Label>
        )}
        {inputElement}
        {description && !error && (
          <Field.Description className="text-body-sm text-text-low">
            {description}
          </Field.Description>
        )}
        {error && (
          <Field.Error className="text-body-sm text-red-500" match>
            {error}
          </Field.Error>
        )}
      </Field.Root>
    );
  }
);

Input.displayName = "Input";
