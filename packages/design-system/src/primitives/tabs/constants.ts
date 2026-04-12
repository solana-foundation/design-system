export type TabsSize = 'sm' | 'md';

export const tabsSizeConfig = {
    sm: {
        textSize: 'var(--text-button-sm)',
        paddingX: 'var(--tab-padding-x-sm)',
        paddingY: 'var(--tab-padding-y-sm)',
        gap: 'var(--tab-gap-sm)',
        iconSize: 'var(--tab-icon-sm)',
    },
    md: {
        textSize: 'var(--text-button-md)',
        paddingX: 'var(--tab-padding-x-md)',
        paddingY: 'var(--tab-padding-y-md)',
        gap: 'var(--tab-gap-md)',
        iconSize: 'var(--tab-icon-md)',
    },
} as const;
