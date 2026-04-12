import { Children, isValidElement, type CSSProperties, type ReactNode } from 'react';
import { getFieldSizeConfig, type FieldSize } from '../_shared/field-size-config';
import { selectIndicatorSizes, selectItemIconSizes, selectTriggerIconSizes } from './constants';
import type { ItemRegistryEntry } from './types';

interface SelectItemLikeProps {
    children?: ReactNode;
    icon?: ReactNode;
    value?: string;
}

export function collectItemRegistry(children: ReactNode, SelectItemComponent: unknown): Map<string, ItemRegistryEntry> {
    const registry = new Map<string, ItemRegistryEntry>();

    function visit(nodes: ReactNode) {
        for (const child of Children.toArray(nodes)) {
            if (!isValidElement(child)) continue;

            if (child.type === SelectItemComponent) {
                const itemProps = child.props as SelectItemLikeProps;
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
            if (nestedChildren) visit(nestedChildren);
        }
    }

    visit(children);
    return registry;
}

export function getSelectConfig(size: FieldSize) {
    const fc = getFieldSizeConfig(size);

    return {
        ...fc,
        wrapperStyle: {
            height: fc.height,
            paddingLeft: fc.contentPaddingX,
            paddingRight: fc.contentPaddingX,
            borderRadius: fc.radius,
            gap: fc.contentGap,
        } as CSSProperties,
        triggerIconStyle: {
            ...selectTriggerIconSizes[size],
        } as CSSProperties,
        itemIconStyle: {
            ...selectItemIconSizes[size],
        } as CSSProperties,
        indicatorSize: selectIndicatorSizes[size],
    };
}
