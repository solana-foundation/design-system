import { Children, cloneElement, forwardRef, type HTMLAttributes, isValidElement, type ReactNode } from 'react';
import { cn } from './cn';

export interface SlotProps extends HTMLAttributes<HTMLElement> {
    children?: ReactNode;
}

/**
 * Merges refs from multiple sources into a single callback ref.
 * Handles both callback refs and RefObjects.
 */
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
    return value => {
        for (const ref of refs) {
            if (typeof ref === 'function') {
                ref(value);
            } else if (ref != null) {
                (ref as React.MutableRefObject<T | null>).current = value;
            }
        }
    };
}

/**
 * Merges props from parent (Slot) and child, with special handling for:
 * - className: concatenated with cn()
 * - style: merged objects
 * - event handlers: chained to call both
 */
function mergeProps(
    parentProps: Record<string, unknown>,
    childProps: Record<string, unknown>,
): Record<string, unknown> {
    const merged: Record<string, unknown> = { ...parentProps };

    for (const key of Object.keys(childProps)) {
        const parentValue = parentProps[key];
        const childValue = childProps[key];

        // Merge classNames
        if (key === 'className') {
            merged[key] = cn(parentValue as string, childValue as string);
        }
        // Merge styles
        else if (key === 'style') {
            merged[key] = { ...(parentValue as object), ...(childValue as object) };
        }
        // Chain event handlers
        else if (key.startsWith('on') && typeof parentValue === 'function' && typeof childValue === 'function') {
            merged[key] = (...args: unknown[]) => {
                childValue(...args);
                parentValue(...args);
            };
        }
        // Child value takes precedence for other props
        else {
            merged[key] = childValue !== undefined ? childValue : parentValue;
        }
    }

    return merged;
}

/**
 * Slot component for the asChild pattern (similar to Radix UI Slot).
 *
 * When a component uses `asChild`, instead of rendering its default element,
 * it clones its single child and merges props, classNames, styles, and refs.
 *
 * @example
 * ```tsx
 * // Button with asChild renders as an anchor
 * <Button asChild>
 *   <a href="/dashboard">Go to Dashboard</a>
 * </Button>
 * ```
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(({ children, ...props }, forwardedRef) => {
    // Slot requires exactly one child element
    const child = Children.only(children);

    if (!isValidElement(child)) {
        console.warn('Slot requires a valid React element as its child');
        return null;
    }

    // Get child's existing props and ref
    const childProps = child.props as Record<string, unknown>;
    const childRef = (child as { ref?: React.Ref<HTMLElement> }).ref;

    // Merge props and refs, then clone the element
    return cloneElement(child, {
        ...mergeProps(props, childProps),
        ref: forwardedRef ? mergeRefs(forwardedRef, childRef) : childRef,
    } as Record<string, unknown>);
});

Slot.displayName = 'Slot';
