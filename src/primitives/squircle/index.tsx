import { Squircle as CornerSmoothing } from "corner-smoothing";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../../utils";

/**
 * Squircle radius tokens (in px).
 * These map to the design system's radius scale.
 */
export const SQUIRCLE_RADIUS = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
} as const;

/**
 * iOS corner smoothing preset (60%).
 * This matches the Figma corner smoothing at 60%.
 */
export const IOS_CORNER_SMOOTHING = 0.6;

type SquircleRadius = keyof typeof SQUIRCLE_RADIUS | number;

export interface SquircleProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /**
   * Corner radius - either a preset token or a number in pixels.
   * @default "xl" (12px)
   */
  cornerRadius?: SquircleRadius;
  /**
   * Corner smoothing amount (0-1).
   * 0 = no smoothing (standard border-radius)
   * 0.6 = iOS preset (60% smoothing)
   * 1 = maximum smoothing
   * @default 0.6 (iOS preset)
   */
  cornerSmoothing?: number;
  /**
   * Border width in pixels. When set, creates a squircle border.
   * Note: Border color is set via background-color on the element,
   * and actual background via ::before pseudo-element.
   */
  borderWidth?: number;
  /** Content to render inside the squircle */
  children: ReactNode;
}

/**
 * Squircle component with iOS-style corner smoothing.
 *
 * Uses Figma's exact algorithm for corner smoothing via clip-path.
 * The 60% smoothing preset matches iOS's corner treatment.
 *
 * **Note on shadows:** Because this uses clip-path, box-shadow won't work.
 * Use the squircle shadow utility classes on a parent wrapper instead:
 * - `squircle-shadow-sm`
 * - `squircle-shadow`
 * - `squircle-shadow-md`
 * - `squircle-shadow-lg`
 *
 * @example
 * ```tsx
 * // Basic usage with token
 * <Squircle cornerRadius="xl" className="bg-gray-100 p-4">
 *   Content
 * </Squircle>
 *
 * // Custom radius in pixels
 * <Squircle cornerRadius={20} className="bg-primary p-6">
 *   Large card
 * </Squircle>
 *
 * // With border
 * <Squircle
 *   cornerRadius="lg"
 *   borderWidth={1}
 *   className="bg-border-medium"
 * >
 *   <div className="bg-white">Bordered content</div>
 * </Squircle>
 *
 * // With shadow (on parent)
 * <div className="squircle-shadow-md">
 *   <Squircle cornerRadius="xl" className="bg-white p-4">
 *     Elevated card
 *   </Squircle>
 * </div>
 * ```
 */
export const Squircle = forwardRef<HTMLDivElement, SquircleProps>(
  (
    {
      cornerRadius = "xl",
      cornerSmoothing = IOS_CORNER_SMOOTHING,
      borderWidth,
      children,
      className,
      ...props
    },
    ref
  ) => {
    // Resolve radius token to pixel value
    const resolvedRadius =
      typeof cornerRadius === "number"
        ? cornerRadius
        : SQUIRCLE_RADIUS[cornerRadius];

    return (
      <CornerSmoothing
        ref={ref}
        cornerRadius={resolvedRadius}
        cornerSmoothing={cornerSmoothing}
        borderWidth={borderWidth}
        className={cn(className)}
        {...props}
      >
        {children}
      </CornerSmoothing>
    );
  }
);

Squircle.displayName = "Squircle";
