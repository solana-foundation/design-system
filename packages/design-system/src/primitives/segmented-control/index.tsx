import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { motion, useReducedMotion } from "motion/react";
import {
  createContext,
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";
import { cn } from "../../utils";

/**
 * Individual segment item configuration.
 */
export interface SegmentedControlItem {
  /** Disable this segment */
  disabled?: boolean;
  /** Optional icon to display before the label */
  icon?: ReactNode;
  /** Display label */
  label: string;
  /** Unique value for this segment */
  value: string;
}

export interface SegmentedControlProps {
  /** Accessible label for the segment group */
  "aria-label"?: string;
  /** Additional className for the root container */
  className?: string;
  /** Default selected value (uncontrolled) */
  defaultValue?: string;
  /** Whether the entire control is disabled */
  disabled?: boolean;
  /** Array of segment items */
  items: SegmentedControlItem[];
  /** Callback when selection changes */
  onValueChange?: (value: string) => void;
  /** Currently selected value (controlled) */
  value?: string;
}

/**
 * Context to share layoutId across segments for shared layout animation.
 */
const SegmentedControlContext = createContext<{ layoutId: string } | null>(
  null
);

/**
 * Spring animation configuration for the sliding indicator.
 * Uses Apple's duration+bounce pattern for clarity.
 * Zero bounce = precise, snappy feel for a control indicator.
 */
const indicatorSpring = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0,
};

/**
 * Individual segment button component.
 */
const SegmentButton = forwardRef<
  HTMLButtonElement,
  {
    item: SegmentedControlItem;
    isSelected: boolean;
  }
>(({ item, isSelected }, ref) => {
  const context = useContext(SegmentedControlContext);
  if (!context) {
    throw new Error("SegmentButton must be used within SegmentedControl");
  }

  const { layoutId } = context;
  const shouldReduceMotion = useReducedMotion();

  return (
    <Toggle
      className={cn(
        // Layout
        "relative inline-flex shrink-0 items-center justify-center gap-[5px] rounded-full px-3 py-2",
        // Typography - Figma: 13px semibold
        "text-button-sm",
        // Colors - text changes based on selection (Figma: #1c1c1d selected, 56% idle)
        isSelected ? "text-text-extra-high" : "text-text-low",
        // Hover state (when not selected)
        !isSelected && "hover:text-text-medium",
        // Transitions - color changes use ease (not ease-out)
        "ease transition-colors duration-150",
        // Disabled state
        item.disabled && "pointer-events-none opacity-40",
        // Focus ring
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--button-focus-ring)] focus-visible:ring-offset-1",
        // Cursor
        !item.disabled && "cursor-pointer",
        // Reduced motion
        "motion-reduce:transition-none"
      )}
      disabled={item.disabled}
      ref={ref}
      value={item.value}
    >
      {/* Sliding indicator - layoutId drives the shared layout animation */}
      {isSelected && (
        <motion.span
          className="absolute inset-0 rounded-full bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.07)] will-change-transform dark:bg-gray-100"
          layoutId={shouldReduceMotion ? undefined : layoutId}
          transition={indicatorSpring}
        />
      )}

      {/* Content - positioned above indicator */}
      <span className="relative z-10 inline-flex items-center justify-center gap-[inherit]">
        {item.icon && (
          <span className="inline-flex size-4 shrink-0 items-center justify-center">
            {item.icon}
          </span>
        )}
        <span>{item.label}</span>
      </span>
    </Toggle>
  );
});

SegmentButton.displayName = "SegmentButton";

/**
 * SegmentedControl component with smooth sliding indicator animation.
 *
 * Uses Motion's layoutId for shared layout animations, creating a fluid
 * sliding pill effect when switching between segments.
 *
 * Built on Base UI's ToggleGroup for accessibility:
 * - Keyboard navigation (arrow keys)
 * - Focus management
 * - ARIA attributes
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   items={[
 *     { value: "all", label: "All" },
 *     { value: "active", label: "Active" },
 *     { value: "completed", label: "Completed" },
 *   ]}
 *   defaultValue="all"
 * />
 * ```
 */
export const SegmentedControl = forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>(
  (
    {
      items,
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      className,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    // Generate unique layoutId for shared layout animation
    const uniqueId = useId();
    const layoutId = `segment-indicator-${uniqueId}`;

    // Determine if controlled or uncontrolled
    const isControlled = value !== undefined;

    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = useState(
      defaultValue ?? items[0]?.value
    );

    // Current value depends on mode
    const currentValue = isControlled ? value : internalValue;

    // Stable context value - layoutId never changes after mount
    const contextValue = useMemo(() => ({ layoutId }), [layoutId]);

    // Handle value change - ToggleGroup passes array, we use single selection
    const handleValueChange = useCallback(
      (newValue: string[]) => {
        // Prevent deselection - always keep one item selected
        if (newValue.length === 0) return;

        const selectedValue = newValue[0];

        // Update internal state for uncontrolled mode
        if (!isControlled) {
          setInternalValue(selectedValue);
        }

        // Always call the callback if provided
        onValueChange?.(selectedValue);
      },
      [isControlled, onValueChange]
    );

    return (
      <SegmentedControlContext.Provider value={contextValue}>
        <ToggleGroup
          aria-label={ariaLabel}
          className={cn(
            // Layout - Figma: pill shape, 2px padding, 4px gap
            "inline-flex items-center gap-1 rounded-full p-0.5",
            // Background - Figma: rgba(28,28,29,0.04)
            "bg-black/[0.04] dark:bg-white/[0.08]",
            // Disabled state
            disabled && "pointer-events-none opacity-40",
            className
          )}
          disabled={disabled}
          onValueChange={handleValueChange}
          ref={ref}
          value={[currentValue ?? ""]}
        >
          {items.map((item) => (
            <SegmentButton
              isSelected={currentValue === item.value}
              item={item}
              key={item.value}
            />
          ))}
        </ToggleGroup>
      </SegmentedControlContext.Provider>
    );
  }
);

SegmentedControl.displayName = "SegmentedControl";
