import type { ReactNode } from 'react';

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
    'aria-label'?: string;
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
