import { forwardRef } from "react";
import { cn } from "../../utils";

/**
 * Size variants for the Spinner component.
 * Maps to button icon sizes for consistent visual pairing.
 */
type SpinnerSize = "xl" | "lg" | "md" | "sm";

export interface SpinnerProps {
  /** Size of the spinner - matches button icon sizes */
  size?: SpinnerSize;
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for screen readers */
  label?: string;
}

/**
 * Spinner maps sizes to pixel dimensions matching button icon tokens.
 * XL=20px, Lg=18px, Md=16px, Sm=14px
 */
const sizeMap: Record<SpinnerSize, number> = {
  xl: 20,
  lg: 18,
  md: 16,
  sm: 14,
};

/**
 * A loading spinner with smooth rotation animation.
 * Respects prefers-reduced-motion by pausing animation.
 *
 * @example
 * ```tsx
 * <Spinner size="md" label="Loading content" />
 * ```
 */
export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size = "md", className, label = "Loading" }, ref) => {
    const dimension = sizeMap[size];

    return (
      <svg
        ref={ref}
        width={dimension}
        height={dimension}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          // Smooth rotation animation
          "animate-spin",
          // Pause animation when reduced motion is preferred
          "motion-reduce:animate-none motion-reduce:opacity-70",
          className
        )}
        role="status"
        aria-label={label}
      >
        {/* Track circle - subtle background */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeOpacity="0.2"
          fill="none"
        />
        {/* Progress arc - visible spinner portion */}
        <path
          d="M12 2C6.48 2 2 6.48 2 12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }
);

Spinner.displayName = "Spinner";
