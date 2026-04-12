'use client';

import { CheckIcon, Square2StackIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useState } from 'react';
import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard';
import { cn } from '../../utils';
import { AnimatedIcon } from '../animated-icon';

type CopyButtonSize = 'xl' | 'lg' | 'md';
type CopyButtonVariant = 'icon' | 'inline' | 'addon';
type CopyButtonState = 'idle' | 'copied' | 'failed';

const iconSizes: Record<CopyButtonSize, number> = {
    xl: 20,
    lg: 16,
    md: 16,
};

const inlineTextClassBySize: Record<CopyButtonSize, string> = {
    xl: 'text-button-xl',
    lg: 'text-button-lg',
    md: 'text-button-md',
};

const inlineSpacingClassBySize: Record<CopyButtonSize, string> = {
    xl: 'gap-[var(--button-gap-xl)] px-[var(--button-padding-x-xl)]',
    lg: 'gap-[var(--button-gap-lg)] px-[var(--button-padding-x-lg)]',
    md: 'gap-[var(--button-gap-md)] px-[var(--button-padding-x-md)]',
};

const addonSpacingClassBySize: Record<CopyButtonSize, string> = {
    xl: 'gap-2', // 8px — balanced for 20px icon (40% of icon size)
    lg: 'gap-1.5', // 6px — balanced for 16px icon (38% of icon size)
    md: 'gap-1.5', // 6px — balanced for 16px icon (38% of icon size)
};

const COPY_FAILURE_RESET_DELAY = 1200;

const getCopyButtonState = ({ copied, failed }: { copied: boolean; failed: boolean }): CopyButtonState => {
    if (failed) return 'failed';
    if (copied) return 'copied';
    return 'idle';
};

const getCopyButtonVariantClasses = ({ variant, size }: { variant: CopyButtonVariant; size: CopyButtonSize }) => {
    if (variant === 'inline')
        return [
            'h-full min-h-full whitespace-nowrap',
            inlineSpacingClassBySize[size],
            'font-sans tracking-[var(--tracking-normal)] text-text-high hover:text-text-extra-high',
            inlineTextClassBySize[size],
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--input-focus-ring)] focus-visible:ring-inset',
        ].join(' ');
    if (variant === 'addon')
        return [
            'h-full min-h-full whitespace-nowrap px-0',
            addonSpacingClassBySize[size],
            'font-sans tracking-[var(--tracking-normal)] text-text-high hover:text-text-extra-high',
            inlineTextClassBySize[size],
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--input-focus-ring)] focus-visible:ring-inset',
        ].join(' ');
    return [
        'text-text-medium hover:text-text-high',
        'focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2',
    ].join(' ');
};

const getIconAriaLabel = ({ state, failedLabel }: { state: CopyButtonState; failedLabel: string }) => {
    if (state === 'copied') return 'Copied';
    if (state === 'failed') return failedLabel;
    return 'Copy to clipboard';
};

export interface CopyButtonProps {
    /** Additional class names */
    className?: string;
    /** Success label */
    copiedLabel?: string;
    /** Failure label */
    failedLabel?: string;
    /** Idle label (inline mode) */
    label?: string;
    /** Size variant — should match the parent Input size */
    size?: CopyButtonSize;
    /** The text to copy to the clipboard */
    value: string;
    /** Visual mode: compact icon button or inline text+icon action */
    variant?: CopyButtonVariant;
}

export const CopyButton = ({
    value,
    size = 'md',
    variant = 'icon',
    label = 'Copy',
    copiedLabel = 'Copied',
    failedLabel = 'Copy failed',
    className,
}: CopyButtonProps) => {
    const { copied, copy } = useCopyToClipboard();
    const [failed, setFailed] = useState(false);
    const iconSize = iconSizes[size];
    const targetSize = Math.max(iconSize + 8, 24);
    const hasLabel = variant === 'inline' || variant === 'addon';

    useEffect(() => {
        if (!failed) return;
        const timeout = setTimeout(() => setFailed(false), COPY_FAILURE_RESET_DELAY);
        return () => clearTimeout(timeout);
    }, [failed]);

    const handleClick = useCallback(async () => {
        const result = await copy(value);
        setFailed(!result.success);
    }, [copy, value]);

    const state = getCopyButtonState({ copied, failed });
    const statusLabel = state === 'copied' ? copiedLabel : state === 'failed' ? failedLabel : label;
    const ariaLabel = hasLabel ? statusLabel : getIconAriaLabel({ failedLabel, state });

    const handlePointerDown = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
        if (event.pointerType === 'mouse' || event.pointerType === 'pen' || event.pointerType === 'touch') {
            event.preventDefault();
        }
    }, []);

    return (
        <button
            aria-label={ariaLabel}
            className={cn(
                'inline-flex cursor-pointer items-center justify-center rounded-sm',
                'transition-colors duration-150 ease-out motion-reduce:transition-none',
                getCopyButtonVariantClasses({ variant, size }),
                className,
            )}
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            style={hasLabel ? { height: '100%', minHeight: '100%' } : { width: targetSize, height: targetSize }}
            type="button"
        >
            <span
                className="inline-flex shrink-0 items-center justify-center"
                style={{ width: iconSize, height: iconSize }}
            >
                <AnimatedIcon
                    icon={
                        state === 'copied' ? (
                            <CheckIcon height={iconSize} width={iconSize} />
                        ) : state === 'failed' ? (
                            <XMarkIcon height={iconSize} width={iconSize} />
                        ) : (
                            <Square2StackIcon height={iconSize} width={iconSize} />
                        )
                    }
                    iconKey={state}
                    preset="micro"
                />
            </span>
            {variant === 'addon' && <span aria-hidden>{statusLabel}</span>}
            {variant === 'inline' && (
                <span
                    aria-hidden
                    className="grid text-left [&>span]:col-start-1 [&>span]:row-start-1 [&>span]:transition-opacity [&>span]:duration-150 [&>span]:ease-out motion-reduce:[&>span]:transition-none"
                >
                    <span className={state !== 'idle' ? 'opacity-0' : undefined}>{label}</span>
                    <span className={state !== 'copied' ? 'opacity-0' : undefined}>{copiedLabel}</span>
                    <span className={state !== 'failed' ? 'opacity-0' : undefined}>{failedLabel}</span>
                </span>
            )}
            <span className="sr-only" role="status">
                {state === 'copied' ? 'Copied to clipboard' : state === 'failed' ? failedLabel : ''}
            </span>
        </button>
    );
};
