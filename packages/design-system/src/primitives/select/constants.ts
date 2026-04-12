import type { CSSProperties } from 'react';
import type { FieldSize } from '../_shared/field-size-config';

export const messageTransition = { duration: 0.15, ease: 'easeOut' as const };

export const selectTriggerIconSizes: Record<FieldSize, CSSProperties> = {
    xl: {
        width: 'var(--select-trigger-icon-xl)',
        height: 'var(--select-trigger-icon-xl)',
    },
    lg: {
        width: 'var(--select-trigger-icon-lg)',
        height: 'var(--select-trigger-icon-lg)',
    },
    md: {
        width: 'var(--select-trigger-icon-md)',
        height: 'var(--select-trigger-icon-md)',
    },
};

export const selectItemIconSizes: Record<FieldSize, CSSProperties> = {
    xl: {
        width: 'var(--select-item-icon-xl)',
        height: 'var(--select-item-icon-xl)',
    },
    lg: {
        width: 'var(--select-item-icon-lg)',
        height: 'var(--select-item-icon-lg)',
    },
    md: {
        width: 'var(--select-item-icon-md)',
        height: 'var(--select-item-icon-md)',
    },
};

export const selectIndicatorSizes: Record<FieldSize, string> = {
    xl: 'var(--select-indicator-size-xl)',
    lg: 'var(--select-indicator-size-lg)',
    md: 'var(--select-indicator-size-md)',
};
