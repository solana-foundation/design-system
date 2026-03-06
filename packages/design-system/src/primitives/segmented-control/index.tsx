'use client';

import { ToggleGroup } from '@base-ui/react/toggle-group';
import { forwardRef, useCallback, useId, useMemo, useState } from 'react';
import { cn } from '../../utils';
import { SegmentedControlContext } from './context';
import { SegmentButton } from './segment-button';
import type { SegmentedControlProps } from './types';
export type { SegmentedControlItem, SegmentedControlProps } from './types';

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
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
    ({ items, value, defaultValue, onValueChange, disabled = false, className, 'aria-label': ariaLabel }, ref) => {
        // Generate unique layoutId for shared layout animation
        const uniqueId = useId();
        const layoutId = `segment-indicator-${uniqueId}`;

        // Determine if controlled or uncontrolled
        const isControlled = value !== undefined;

        // Internal state for uncontrolled mode
        const [internalValue, setInternalValue] = useState(defaultValue ?? items[0]?.value);

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
            [isControlled, onValueChange],
        );

        return (
            <SegmentedControlContext.Provider value={contextValue}>
                <ToggleGroup
                    aria-label={ariaLabel}
                    className={cn(
                        // Layout - Figma: pill shape, 2px padding, 4px gap
                        'inline-flex items-center gap-1 rounded-full p-0.5',
                        // Background - Figma: rgba(28,28,29,0.04)
                        'bg-black/[0.04] dark:bg-white/[0.08]',
                        // Disabled state
                        disabled && 'pointer-events-none opacity-40',
                        className,
                    )}
                    disabled={disabled}
                    onValueChange={handleValueChange}
                    ref={ref}
                    value={[currentValue ?? '']}
                >
                    {items.map(item => (
                        <SegmentButton isSelected={currentValue === item.value} item={item} key={item.value} />
                    ))}
                </ToggleGroup>
            </SegmentedControlContext.Provider>
        );
    },
);

SegmentedControl.displayName = 'SegmentedControl';
