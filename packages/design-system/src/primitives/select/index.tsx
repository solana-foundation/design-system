'use client';

import { Field } from '@base-ui/react/field';
import { Select as BaseSelect } from '@base-ui/react/select';
import { CheckIcon } from '@heroicons/react/20/solid';
import { ChevronDownIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'motion/react';
import {
    Children,
    createContext,
    isValidElement,
    type ReactNode,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from 'react';
import { cn } from '../../utils';
import { type FieldSize, getFieldSizeConfig } from '../_shared/field-size-config';
import { Tooltip } from '../tooltip';

// =============================================================================
// Types
// =============================================================================

type SelectSize = FieldSize;

interface ItemRegistryEntry {
    icon?: ReactNode;
    label?: string;
    value: string;
}

interface SelectContextValue {
    multiple: boolean;
    size: SelectSize;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
    const ctx = useContext(SelectContext);
    if (!ctx) throw new Error('Select compound components must be used within <Select>');
    return ctx;
}

function collectItemRegistry(children: ReactNode): Map<string, ItemRegistryEntry> {
    const registry = new Map<string, ItemRegistryEntry>();

    const visit = (nodes: ReactNode) => {
        for (const child of Children.toArray(nodes)) {
            if (!isValidElement(child)) continue;

            if (child.type === SelectItem) {
                const itemProps = child.props as Partial<SelectItemProps>;
                if (typeof itemProps.value === 'string') {
                    const label = typeof itemProps.children === 'string' ? itemProps.children : undefined;
                    registry.set(itemProps.value, {
                        value: itemProps.value,
                        icon: itemProps.icon,
                        label,
                    });
                }
            }

            const nestedChildren = (child.props as { children?: ReactNode }).children;
            if (nestedChildren) {
                visit(nestedChildren);
            }
        }
    };

    visit(children);
    return registry;
}

const messageTransition = { duration: 0.15, ease: 'easeOut' as const };

// =============================================================================
// Size config (mirrors TextInput)
// =============================================================================

const selectTriggerIconSizes: Record<FieldSize, React.CSSProperties> = {
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

const selectItemIconSizes: Record<FieldSize, React.CSSProperties> = {
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

const selectIndicatorSizes: Record<FieldSize, string> = {
    xl: 'var(--select-indicator-size-xl)',
    lg: 'var(--select-indicator-size-lg)',
    md: 'var(--select-indicator-size-md)',
};

function getSelectConfig(size: FieldSize) {
    const fc = getFieldSizeConfig(size);
    return {
        ...fc,
        wrapperStyle: {
            height: fc.height,
            paddingLeft: fc.contentPaddingX,
            paddingRight: fc.contentPaddingX,
            borderRadius: fc.radius,
            gap: fc.contentGap,
        } as React.CSSProperties,
        triggerIconStyle: {
            ...selectTriggerIconSizes[size],
        } as React.CSSProperties,
        itemIconStyle: {
            ...selectItemIconSizes[size],
        } as React.CSSProperties,
        indicatorSize: selectIndicatorSizes[size],
    };
}

// =============================================================================
// Trigger icon wrapper (mirrors TextInput's IconWrapper, uses select group)
// =============================================================================

function TriggerIconWrapper({ children, style }: { children: ReactNode; style: React.CSSProperties }) {
    return (
        <span
            className={cn(
                'pointer-events-none inline-flex shrink-0 items-center justify-center text-text-extra-high [&_svg]:size-full',
                'opacity-44 transition-opacity duration-150 ease-out',
                'motion-reduce:transition-none',
                'group-[:not([data-popup-open])]/select:group-hover/select:opacity-56',
                'group-[[data-popup-open]]/select:opacity-72',
            )}
            style={style}
        >
            {children}
        </span>
    );
}

// =============================================================================
// Select (root)
// =============================================================================

// Single-select props
interface SelectSingleProps {
    defaultValue?: string | null;
    multiple?: false;
    onValueChange?: (value: string | null) => void;
    value?: string | null;
}

// Multi-select props
interface SelectMultipleProps {
    defaultValue?: string[];
    multiple: true;
    onValueChange?: (value: string[]) => void;
    value?: string[];
}

interface SelectBaseProps {
    children: ReactNode;
    className?: string;
    defaultOpen?: boolean;
    description?: string;
    disabled?: boolean;
    error?: string;
    /** Tooltip hint shown via info icon next to the label */
    hint?: string;
    label?: string;
    name?: string;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
    placeholder?: string;
    required?: boolean;
    size?: SelectSize;
}

export type SelectProps = SelectBaseProps & (SelectSingleProps | SelectMultipleProps);

export function Select({
    size = 'md',
    label,
    description,
    error,
    hint,
    placeholder,
    disabled,
    required,
    name,
    open,
    defaultOpen,
    onOpenChange,
    multiple = false,
    value,
    defaultValue,
    onValueChange,
    children,
    className,
}: SelectProps) {
    const config = getSelectConfig(size);
    const hasField = label || description || error;
    const selectActionsRef = useRef<{ unmount: () => void } | null>(null);

    // Track selected value internally for icon sync
    const [internalValue, setInternalValue] = useState<string | string[] | null>(value ?? defaultValue ?? null);

    // Sync controlled value
    const currentValue = value !== undefined ? value : internalValue;
    const itemRegistry = useMemo(() => collectItemRegistry(children), [children]);
    const ctxValue = useMemo(() => ({ size, multiple }), [size, multiple]);

    // Get icon for selected value (single-select only)
    const selectedIcon = !multiple && typeof currentValue === 'string' ? itemRegistry.get(currentValue)?.icon : null;

    // Wrap onValueChange to track internal state
    const handleSingleChange = useCallback(
        (val: string | null) => {
            setInternalValue(val);
            if (!multiple && onValueChange) {
                (onValueChange as (v: string | null) => void)(val);
            }
        },
        [multiple, onValueChange],
    );

    const handleMultipleChange = useCallback(
        (val: string[]) => {
            setInternalValue(val);
            if (multiple && onValueChange) {
                (onValueChange as (v: string[]) => void)(val);
            }
        },
        [multiple, onValueChange],
    );

    // Build the trigger
    const trigger = (
        <BaseSelect.Trigger
            className={cn(
                'group/select relative flex cursor-pointer items-center',
                disabled && 'pointer-events-none opacity-40',
                className,
            )}
            disabled={disabled}
            style={config.wrapperStyle}
        >
            {/* Border layer */}
            <span
                className={cn(
                    'pointer-events-none absolute inset-0 rounded-[inherit]',
                    'border-[length:var(--input-border-width)]',
                    'border-[var(--input-border-idle)]',
                    'bg-[var(--input-bg-idle)]',
                    'transition-[border-color,background-color] duration-150 ease-out',
                    'motion-reduce:transition-none',
                    'group-[:not([data-popup-open])]/select:group-hover/select:border-[var(--input-border-hover)]',
                    'group-[:not([data-popup-open])]/select:group-hover/select:bg-[var(--input-bg-hover)]',
                    'group-[[data-popup-open]]/select:border-[var(--input-border-focus)]',
                    error && 'border-[var(--input-border-error)]',
                )}
            />

            {/* Focus ring */}
            <span
                className={cn(
                    'pointer-events-none absolute inset-0 rounded-[inherit]',
                    'shadow-[0_0_0_2px_var(--input-focus-ring)]',
                    'opacity-0 transition-opacity duration-150 ease-out',
                    'group-[[data-popup-open]]/select:opacity-100 group-[[data-popup-open]]/select:duration-0',
                    'group-focus-visible/select:opacity-100 group-focus-visible/select:duration-0',
                    'motion-reduce:transition-none',
                )}
            />

            {/* Icon synced from selected item (single-select only) */}
            {selectedIcon && <TriggerIconWrapper style={config.triggerIconStyle}>{selectedIcon}</TriggerIconWrapper>}

            {/* Value text */}
            <BaseSelect.Value
                className={cn(
                    'min-w-0 flex-1 truncate text-left leading-[var(--input-text-line-height)]',
                    'text-text-extra-high',
                    config.textClass,
                )}
                placeholder={<span className="text-[var(--input-placeholder-color)]">{placeholder}</span>}
            />

            {/* Chevron */}
            <BaseSelect.Icon
                className={cn(
                    'inline-flex shrink-0 items-center justify-center text-text-medium',
                    'transition-transform duration-150 ease-out',
                    'motion-reduce:transition-none',
                    'group-[[data-popup-open]]/select:rotate-180',
                )}
            >
                <ChevronDownIcon style={config.triggerIconStyle} />
            </BaseSelect.Icon>
        </BaseSelect.Trigger>
    );

    // Shared root props
    const sharedRootProps = {
        actionsRef: selectActionsRef,
        defaultOpen,
        disabled,
        modal: false as const,
        name,
        onOpenChange,
        open,
        required,
    };

    const rootChildren = (
        <>
            {trigger}
            <BaseSelect.Portal>
                <BaseSelect.Positioner
                    alignItemWithTrigger={false}
                    className="z-50"
                    disableAnchorTracking
                    side="bottom"
                    sideOffset={4}
                >
                    <BaseSelect.Popup
                        className={cn(
                            'origin-[var(--transform-origin)]',
                            'rounded-[var(--select-popup-radius)]',
                            'bg-[var(--select-popup-bg)]',
                            'border border-[var(--select-popup-border)]',
                            'shadow-[var(--select-popup-shadow)]',
                            'p-[var(--select-popup-padding)]',
                            'min-w-[var(--anchor-width)]',
                            'max-h-[var(--available-height)]',
                            'overflow-y-auto',
                            'outline-none',
                            // CSS transition animation
                            'transform-gpu will-change-[transform,opacity]',
                            'transition-[transform,opacity] duration-[140ms] ease-[cubic-bezier(0.23,1,0.32,1)]',
                            'data-[starting-style]:scale-[0.985] data-[starting-style]:opacity-0',
                            'data-[ending-style]:scale-[0.985] data-[ending-style]:opacity-0',
                            'motion-reduce:transition-none',
                        )}
                    >
                        <BaseSelect.ScrollUpArrow
                            className={cn(
                                'sticky top-0 z-10 flex h-6 items-center justify-center',
                                'bg-gradient-to-b from-[var(--select-popup-bg)] to-transparent',
                            )}
                        >
                            <ChevronDownIcon className="size-3.5 rotate-180 text-text-medium" />
                        </BaseSelect.ScrollUpArrow>

                        <BaseSelect.List>{children}</BaseSelect.List>

                        <BaseSelect.ScrollDownArrow
                            className={cn(
                                'sticky bottom-0 z-10 flex h-6 items-center justify-center',
                                'bg-gradient-to-t from-[var(--select-popup-bg)] to-transparent',
                            )}
                        >
                            <ChevronDownIcon className="size-3.5 text-text-medium" />
                        </BaseSelect.ScrollDownArrow>
                    </BaseSelect.Popup>
                </BaseSelect.Positioner>
            </BaseSelect.Portal>
        </>
    );

    const selectContent = (
        <SelectContext.Provider value={ctxValue}>
            {multiple ? (
                <BaseSelect.Root
                    defaultValue={defaultValue as string[] | undefined}
                    multiple
                    onValueChange={handleMultipleChange}
                    value={value as string[] | undefined}
                    {...sharedRootProps}
                >
                    {rootChildren}
                </BaseSelect.Root>
            ) : (
                <BaseSelect.Root
                    defaultValue={defaultValue as string | null | undefined}
                    onValueChange={handleSingleChange}
                    value={value as string | null | undefined}
                    {...sharedRootProps}
                >
                    {rootChildren}
                </BaseSelect.Root>
            )}
        </SelectContext.Provider>
    );

    if (!hasField) return selectContent;

    return (
        <Field.Root className="flex flex-col gap-1.5" disabled={disabled} invalid={!!error}>
            {label && (
                <div className="flex items-center gap-1">
                    <Field.Label className={cn('font-medium text-text-high', config.labelClass)}>{label}</Field.Label>
                    {hint && (
                        <Tooltip content={hint}>
                            <button
                                aria-label="More information"
                                className="inline-flex items-center justify-center rounded-sm text-text-low transition-colors hover:text-text-medium motion-reduce:transition-none"
                                style={{
                                    padding: `calc((1.5rem - ${config.hintIconSize}) / 2)`,
                                    margin: `calc(-1 * (1.5rem - ${config.hintIconSize}) / 2)`,
                                }}
                                type="button"
                            >
                                <QuestionMarkCircleIcon
                                    style={{
                                        width: config.hintIconSize,
                                        height: config.hintIconSize,
                                    }}
                                />
                            </button>
                        </Tooltip>
                    )}
                </div>
            )}
            {selectContent}
            <AnimatePresence initial={false} mode="wait">
                {error ? (
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        initial={{ opacity: 0, y: -4 }}
                        key="error"
                        transition={messageTransition}
                    >
                        <Field.Error className={cn('text-[var(--input-error-text)]', config.descriptionClass)} match>
                            {error}
                        </Field.Error>
                    </motion.div>
                ) : description ? (
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        initial={{ opacity: 0, y: -4 }}
                        key="description"
                        transition={messageTransition}
                    >
                        <Field.Description className={cn('text-text-low', config.descriptionClass)}>
                            {description}
                        </Field.Description>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </Field.Root>
    );
}

Select.displayName = 'Select';

// =============================================================================
// SelectItem
// =============================================================================

export interface SelectItemProps {
    children: ReactNode;
    className?: string;
    description?: string;
    disabled?: boolean;
    icon?: ReactNode;
    value: string;
}

export function SelectItem({
    value,
    icon,
    description: itemDescription,
    disabled,
    children,
    className,
}: SelectItemProps) {
    const { size } = useSelectContext();
    const config = getSelectConfig(size);

    return (
        <BaseSelect.Item
            className={cn(
                'relative flex cursor-pointer select-none items-center gap-2 outline-none',
                'rounded-[var(--select-item-radius)]',
                'px-2 py-1.5',
                'data-[highlighted]:bg-[var(--select-item-highlight-bg)]',
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
                config.textClass,
                className,
            )}
            disabled={disabled}
            value={value}
        >
            {/* Check indicator */}
            <BaseSelect.ItemIndicator
                className="inline-flex shrink-0 items-center justify-center"
                style={{
                    width: config.indicatorSize,
                    height: config.indicatorSize,
                }}
            >
                <CheckIcon
                    className="text-text-extra-high"
                    style={{
                        width: config.indicatorSize,
                        height: config.indicatorSize,
                    }}
                />
            </BaseSelect.ItemIndicator>

            {/* Optional leading icon */}
            {icon && (
                <span
                    className="inline-flex shrink-0 items-center justify-center text-text-medium [&_svg]:size-full"
                    style={config.itemIconStyle}
                >
                    {icon}
                </span>
            )}

            {/* Text column */}
            <div className="flex min-w-0 flex-1 flex-col">
                <BaseSelect.ItemText className="truncate text-text-extra-high">{children}</BaseSelect.ItemText>
                {itemDescription && <span className="truncate text-[12px] text-text-low">{itemDescription}</span>}
            </div>
        </BaseSelect.Item>
    );
}

SelectItem.displayName = 'SelectItem';

// =============================================================================
// SelectGroup
// =============================================================================

export interface SelectGroupProps {
    children: ReactNode;
    className?: string;
}

export function SelectGroup({ children, className }: SelectGroupProps) {
    return <BaseSelect.Group className={className}>{children}</BaseSelect.Group>;
}

SelectGroup.displayName = 'SelectGroup';

// =============================================================================
// SelectGroupLabel
// =============================================================================

export interface SelectGroupLabelProps {
    children: ReactNode;
    className?: string;
}

export function SelectGroupLabel({ children, className }: SelectGroupLabelProps) {
    return (
        <BaseSelect.GroupLabel className={cn('px-2 py-1.5 font-medium text-[12px] text-text-low', className)}>
            {children}
        </BaseSelect.GroupLabel>
    );
}

SelectGroupLabel.displayName = 'SelectGroupLabel';

// =============================================================================
// SelectSeparator
// =============================================================================

export interface SelectSeparatorProps {
    className?: string;
}

export function SelectSeparator({ className }: SelectSeparatorProps) {
    return <BaseSelect.Separator className={cn('my-1 h-px bg-border-light', className)} />;
}

SelectSeparator.displayName = 'SelectSeparator';
