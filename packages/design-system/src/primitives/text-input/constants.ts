import type { FieldSize } from '../_shared/field-size-config';
import type { CSSProperties } from 'react';

export const messageTransition = { duration: 0.15, ease: 'easeOut' as const };

export const INTERACTIVE_TARGET_SELECTOR = [
    'a[href]',
    'button',
    'input',
    'select',
    'textarea',
    "[role='button']",
    "[role='checkbox']",
    "[role='link']",
    "[role='menuitem']",
    "[role='option']",
    "[role='radio']",
    "[role='switch']",
    "[tabindex]:not([tabindex='-1'])",
    "[contenteditable='true']",
    "[contenteditable='plaintext-only']",
    "[data-input-addon-interactive='true']",
].join(', ');

export const addonSelectIconSizes: Record<FieldSize, CSSProperties> = {
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
