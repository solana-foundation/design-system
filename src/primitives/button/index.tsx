import { type HTMLMotionProps, motion } from "motion/react";
import { forwardRef, type ReactNode } from "react";
import { cn, Slot } from "../../utils";
import { Spinner } from "../spinner";

/**
 * Base props for the button, excluding motion-conflicting event handlers.
 * We use HTMLMotionProps directly to avoid type conflicts between
 * React's onAnimationStart and Motion's onAnimationStart.
 */
type BaseButtonProps = Omit<
  HTMLMotionProps<"button">,
  "children" | "disabled" | "ref"
>;

/**
 * Button size variants.
 * Each size maps to height, padding, radius, icon size, and gap tokens.
 */
type ButtonSize = "xl" | "lg" | "md" | "sm";

/**
 * Button visual variants.
 * Primary: High contrast, solid background.
 * Secondary: Subtle, transparent background.
 */
type ButtonVariant = "primary" | "secondary";

/**
 * Button border radius variants.
 * Default: Size-specific radius (12/10/8/6px).
 * Round: Fully rounded (9999px).
 */
type ButtonRadius = "default" | "round";

export interface ButtonProps extends BaseButtonProps {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset controlling height, padding, typography, and icon sizing */
  size?: ButtonSize;
  /** Disables the button */
  disabled?: boolean;
  /** Border radius style - default uses size-specific values, round is fully rounded */
  radius?: ButtonRadius;
  /** Icon element to display before the button text */
  iconLeft?: ReactNode;
  /** Icon element to display after the button text */
  iconRight?: ReactNode;
  /** When true, renders as a square icon-only button with no text */
  iconOnly?: boolean;
  /** Shows a loading spinner and disables the button */
  loading?: boolean;
  /** Button content - text label or custom elements */
  children?: ReactNode;
  /** Renders the button's styles on the child element instead of a button element */
  asChild?: boolean;
}

/**
 * CSS variable names for size tokens.
 * Used to apply consistent sizing from the design system.
 */
const sizeStyles: Record<
  ButtonSize,
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
    height: "var(--button-height-xl)",
    paddingX: "var(--button-padding-x-xl)",
    radius: "var(--button-radius-xl)",
    iconSize: "var(--button-icon-xl)",
    gap: "var(--button-gap-xl)",
    textClass: "text-button-xl",
  },
  lg: {
    height: "var(--button-height-lg)",
    paddingX: "var(--button-padding-x-lg)",
    radius: "var(--button-radius-lg)",
    iconSize: "var(--button-icon-lg)",
    gap: "var(--button-gap-lg)",
    textClass: "text-button-lg",
  },
  md: {
    height: "var(--button-height-md)",
    paddingX: "var(--button-padding-x-md)",
    radius: "var(--button-radius-md)",
    iconSize: "var(--button-icon-md)",
    gap: "var(--button-gap-md)",
    textClass: "text-button-md",
  },
  sm: {
    height: "var(--button-height-sm)",
    paddingX: "var(--button-padding-x-sm)",
    radius: "var(--button-radius-sm)",
    iconSize: "var(--button-icon-sm)",
    gap: "var(--button-gap-sm)",
    textClass: "text-button-sm",
  },
};

/**
 * Button component with motion-enhanced interactions.
 *
 * Features:
 * - Two variants: primary (solid) and secondary (subtle)
 * - Four sizes: xl, lg, md, sm
 * - Icon support: left, right, or icon-only
 * - Loading state with centered spinner
 * - asChild pattern for custom element rendering
 * - Respects prefers-reduced-motion
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button variant="primary" size="md">Click me</Button>
 *
 * // With icons
 * <Button iconLeft={<PlusIcon />}>Add Item</Button>
 *
 * // Icon only
 * <Button iconOnly iconLeft={<SearchIcon />} aria-label="Search" />
 *
 * // Loading state
 * <Button loading>Saving...</Button>
 *
 * // As a link
 * <Button asChild>
 *   <a href="/dashboard">Dashboard</a>
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      radius = "default",
      iconLeft,
      iconRight,
      iconOnly = false,
      loading = false,
      disabled = false,
      children,
      asChild = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const sizeConfig = sizeStyles[size];
    const isDisabled = disabled || loading;

    // Border radius: use size-specific for default, fully rounded for round
    const borderRadius = radius === "round" ? "9999px" : sizeConfig.radius;

    // For icon-only buttons, use height for both dimensions
    const buttonWidth = iconOnly ? sizeConfig.height : "auto";
    const buttonPadding = iconOnly ? "0" : `0 ${sizeConfig.paddingX}`;

    // Combined styles for the button
    const buttonStyles = {
      height: sizeConfig.height,
      width: buttonWidth,
      padding: buttonPadding,
      borderRadius,
      gap: sizeConfig.gap,
      // CSS variables for dynamic icon sizing
      "--icon-size": sizeConfig.iconSize,
      ...style,
    } as React.CSSProperties;

    // Variant-specific classes using CSS variable references
    // Note: No active: color change - scale animation provides sufficient press feedback
    const variantClasses =
      variant === "primary"
        ? "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-bg-hover)]"
        : "bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-bg-hover)]";

    // Base button classes
    const buttonClasses = cn(
      // Layout - relative for spinner overlay positioning
      "relative inline-flex items-center justify-center",
      // GPU optimization - prevents first-frame animation stutter (Jakub.kr)
      "will-change-transform",
      // Typography - uses existing text-button-* classes
      sizeConfig.textClass,
      // Variant colors
      variantClasses,
      // Focus state - visible ring for accessibility
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--button-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--gray-50)]",
      // Dark mode focus offset
      "dark:focus-visible:ring-offset-[var(--gray-100)]",
      // Disabled state
      isDisabled && "pointer-events-none opacity-40",
      // Cursor
      !isDisabled && "cursor-pointer",
      // Transition for color changes with ease-out (motion handles scale)
      // Per Emil Kowalski's Tip #4: Use ease-out for entrances/interactions
      "transition-colors duration-150 ease-out",
      // Reduced motion: instant transitions
      "motion-reduce:transition-none",
      className
    );

    // Icon wrapper component for consistent sizing
    const IconWrapper = ({ children: icon }: { children: ReactNode }) => (
      <span
        className="inline-flex shrink-0 items-center justify-center"
        style={{
          width: "var(--icon-size)",
          height: "var(--icon-size)",
        }}
      >
        {icon}
      </span>
    );

    // Button content with loading blur transition
    // Per Emil Kowalski's Tip #7: Use blur for smooth content crossfades
    const content = (
      <>
        {/* Content wrapper - blurs and fades when loading */}
        <motion.span
          animate={{
            filter: loading ? "blur(4px)" : "blur(0px)",
            opacity: loading ? 0 : 1,
          }}
          className="inline-flex items-center justify-center"
          style={{ gap: "inherit" }}
          transition={{ duration: 0.15 }}
        >
          {iconLeft && <IconWrapper>{iconLeft}</IconWrapper>}
          {!iconOnly && children && <span>{children}</span>}
          {iconRight && <IconWrapper>{iconRight}</IconWrapper>}
        </motion.span>
        {/* Spinner - fades in when loading, positioned absolutely to overlay */}
        {loading && (
          <motion.span
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Spinner label="Loading" size={size} />
          </motion.span>
        )}
      </>
    );

    // If asChild, render using Slot to merge props with child element
    // Note: asChild does not support motion props - use for static link buttons
    if (asChild) {
      // Extract only standard HTML attributes for the Slot
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        whileTap,
        whileHover,
        whileFocus,
        whileDrag,
        whileInView,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        animate,
        initial,
        exit,
        variants,
        transition,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onAnimationStart,
        onAnimationComplete,
        ...htmlProps
      } = props;

      return (
        <Slot
          className={buttonClasses}
          ref={ref as React.Ref<HTMLElement>}
          style={buttonStyles as React.CSSProperties}
          {...(htmlProps as React.HTMLAttributes<HTMLElement>)}
        >
          {children}
        </Slot>
      );
    }

    // Press animation only - no hover scale
    // Per Emil Kowalski: scale 0.97 on press with ~150ms transition
    // https://emilkowal.ski/ui/7-practical-animation-tips
    const scaleMotionProps = {
      whileTap: isDisabled ? undefined : { scale: 0.97 },
      transition: { type: "spring" as const, duration: 0.15, bounce: 0 },
    };

    return (
      <motion.button
        aria-busy={loading}
        className={buttonClasses}
        disabled={isDisabled}
        ref={ref}
        style={buttonStyles}
        {...scaleMotionProps}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
