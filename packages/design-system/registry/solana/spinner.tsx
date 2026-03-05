import { forwardRef, type SVGProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Size variants for the Spinner component.
 * Maps to button icon sizes for consistent visual pairing.
 */
type SpinnerSize = "xl" | "lg" | "md" | "sm";

export interface SpinnerProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  /** Accessible label for screen readers */
  label?: string;
  /** Size of the spinner - matches button icon sizes */
  size?: SpinnerSize;
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
  ({ size = "md", className, label = "Loading", ...props }, ref) => {
    const dimension = sizeMap[size];

    return (
      <svg
        aria-label={label}
        className={cn(
          "animate-spinner",
          "motion-reduce:opacity-70 motion-reduce:[animation-play-state:paused]",
          className
        )}
        fill="none"
        height={dimension}
        ref={ref}
        role="status"
        viewBox="0 0 24 24"
        width={dimension}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {/* Track circle - subtle background */}
        <circle
          cx="12"
          cy="12"
          fill="none"
          r="10"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="3"
        />
        {/* Progress arc - grows and shrinks as it rotates */}
        <circle
          className="animate-spinner-dash"
          cx="12"
          cy="12"
          fill="none"
          r="10"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
    );
  }
);

Spinner.displayName = "Spinner";
