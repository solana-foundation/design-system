import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { Squircle as CornerSmoothing } from "corner-smoothing";
import { cn, Slot } from "../../utils";
import { Spinner } from "../spinner";
import { IOS_CORNER_SMOOTHING } from "../squircle";

/**
 * Base props for the button, excluding motion-conflicting event handlers.
 * We use HTMLMotionProps directly to avoid type conflicts between
 * React's onAnimationStart and Motion's onAnimationStart.
 */
type BaseButtonProps = Omit<
  HTMLMotionProps<"button">,
  | "children"
  | "disabled"
  | "ref"
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
 * Pill: Fully rounded (9999px).
 */
type ButtonRadius = "default" | "pill";

export interface ButtonProps extends BaseButtonProps {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset controlling height, padding, typography, and icon sizing */
  size?: ButtonSize;
  /** Disables the button */
  disabled?: boolean;
  /** Border radius style - default uses size-specific values, pill is fully rounded */
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
    squircleRadius: number; // Pixel value for corner-smoothing
    iconSize: string;
    gap: string;
    textClass: string;
  }
> = {
  xl: {
    height: "var(--button-height-xl)",
    paddingX: "var(--button-padding-x-xl)",
    radius: "var(--button-radius-xl)",
    squircleRadius: 12,
    iconSize: "var(--button-icon-xl)",
    gap: "var(--button-gap-xl)",
    textClass: "text-button-xl",
  },
  lg: {
    height: "var(--button-height-lg)",
    paddingX: "var(--button-padding-x-lg)",
    radius: "var(--button-radius-lg)",
    squircleRadius: 10,
    iconSize: "var(--button-icon-lg)",
    gap: "var(--button-gap-lg)",
    textClass: "text-button-lg",
  },
  md: {
    height: "var(--button-height-md)",
    paddingX: "var(--button-padding-x-md)",
    radius: "var(--button-radius-md)",
    squircleRadius: 8,
    iconSize: "var(--button-icon-md)",
    gap: "var(--button-gap-md)",
    textClass: "text-button-md",
  },
  sm: {
    height: "var(--button-height-sm)",
    paddingX: "var(--button-padding-x-sm)",
    radius: "var(--button-radius-sm)",
    squircleRadius: 6,
    iconSize: "var(--button-icon-sm)",
    gap: "var(--button-gap-sm)",
    textClass: "text-button-sm",
  },
};

/**
 * Motion spring configurations for button interactions.
 * Snappy spring for responsive feel without feeling sluggish.
 */
const spring = {
  snappy: { stiffness: 500, damping: 30 },
} as const;

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

    // Use squircle for default radius, CSS border-radius for pill
    const useSquircle = radius === "default";
    const borderRadius = radius === "pill" ? "9999px" : "0px"; // 0 when using squircle clip-path

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
    const variantClasses =
      variant === "primary"
        ? "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-bg-hover)] active:bg-[var(--button-primary-bg-active)]"
        : "bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-bg-hover)] active:bg-[var(--button-secondary-bg-active)]";

    // Base button classes
    const buttonClasses = cn(
      // Layout - relative for spinner overlay positioning
      "relative inline-flex items-center justify-center",
      // Typography - uses existing text-button-* classes
      sizeConfig.textClass,
      // Variant colors
      variantClasses,
      // Focus state - visible ring for accessibility
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--button-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--gray-50)]",
      // Dark mode focus offset
      "dark:focus-visible:ring-offset-[var(--gray-100)]",
      // Disabled state
      isDisabled && "opacity-40 pointer-events-none",
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
        className="inline-flex items-center justify-center shrink-0"
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
          className="inline-flex items-center justify-center"
          style={{ gap: "inherit" }}
          animate={{
            filter: loading ? "blur(4px)" : "blur(0px)",
            opacity: loading ? 0 : 1,
          }}
          transition={{ duration: 0.15 }}
        >
          {iconLeft && <IconWrapper>{iconLeft}</IconWrapper>}
          {!iconOnly && children && <span>{children}</span>}
          {iconRight && <IconWrapper>{iconRight}</IconWrapper>}
        </motion.span>
        {/* Spinner - fades in when loading, positioned absolutely to overlay */}
        {loading && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Spinner size={size} label="Loading" />
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
        whileTap, whileHover, whileFocus, whileDrag, whileInView,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        animate, initial, exit, variants, transition,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onAnimationStart, onAnimationComplete,
        ...htmlProps
      } = props;

      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          className={buttonClasses}
          style={buttonStyles as React.CSSProperties}
          {...(htmlProps as React.HTMLAttributes<HTMLElement>)}
        >
          {children}
        </Slot>
      );
    }

    // Motion variants for hover and press animations
    // Subtle hover scale (1.02) creates anticipation, press scale (0.97) provides tactile feedback
    // Per Emil Kowalski's animation principles
    const motionProps: HTMLMotionProps<"button"> = {
      whileHover: isDisabled ? undefined : { scale: 1.02 },
      whileTap: isDisabled ? undefined : { scale: 0.97 },
      transition: spring.snappy,
    };

    const buttonElement = (
      <motion.button
        ref={ref}
        className={buttonClasses}
        style={buttonStyles}
        disabled={isDisabled}
        aria-busy={loading}
        {...motionProps}
        {...props}
      >
        {content}
      </motion.button>
    );

    // Wrap in squircle for iOS-style corner smoothing (60%)
    if (useSquircle) {
      return (
        <CornerSmoothing
          cornerRadius={sizeConfig.squircleRadius}
          cornerSmoothing={IOS_CORNER_SMOOTHING}
          className="inline-flex"
        >
          {buttonElement}
        </CornerSmoothing>
      );
    }

    return buttonElement;
  }
);

Button.displayName = "Button";
