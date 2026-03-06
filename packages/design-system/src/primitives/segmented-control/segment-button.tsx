'use client';

import { Toggle } from '@base-ui/react/toggle';
import { motion, useReducedMotion } from 'motion/react';
import { forwardRef } from 'react';
import { cn } from '../../utils';
import { indicatorSpring } from './constants';
import { useSegmentedControlContext } from './context';
import type { SegmentedControlItem } from './types';

export const SegmentButton = forwardRef<
    HTMLButtonElement,
    {
        item: SegmentedControlItem;
        isSelected: boolean;
    }
>(({ item, isSelected }, ref) => {
    const { layoutId } = useSegmentedControlContext();
    const shouldReduceMotion = useReducedMotion();

    return (
        <Toggle
            className={cn(
                // Layout
                'relative inline-flex shrink-0 items-center justify-center gap-[5px] rounded-full px-3 py-2',
                // Typography - Figma: 13px semibold
                'text-button-sm',
                // Colors - text changes based on selection (Figma: #1c1c1d selected, 56% idle)
                isSelected ? 'text-text-extra-high' : 'text-text-low',
                // Hover state (when not selected)
                !isSelected && 'hover:text-text-medium',
                // Transitions - color changes use ease (not ease-out)
                'ease transition-colors duration-150',
                // Disabled state
                item.disabled && 'pointer-events-none opacity-40',
                // Focus ring
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--button-focus-ring)] focus-visible:ring-offset-1',
                // Cursor
                !item.disabled && 'cursor-pointer',
                // Reduced motion
                'motion-reduce:transition-none',
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
                    <span className="inline-flex size-4 shrink-0 items-center justify-center">{item.icon}</span>
                )}
                <span>{item.label}</span>
            </span>
        </Toggle>
    );
});

SegmentButton.displayName = 'SegmentButton';
