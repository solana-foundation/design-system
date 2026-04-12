import type { CSSProperties, ForwardedRef } from 'react';
import type { FieldSize } from '../_shared/field-size-config';
import { getFieldSizeConfig } from '../_shared/field-size-config';
import { addonSelectIconSizes } from './constants';

export function setForwardedRef<T>(ref: ForwardedRef<T>, value: T | null) {
    if (typeof ref === 'function') {
        ref(value);
        return;
    }
    if (ref) ref.current = value;
}

export function getInputConfig(size: FieldSize) {
    const fc = getFieldSizeConfig(size);
    return {
        ...fc,
        wrapperStyle: {
            height: fc.height,
            borderRadius: fc.radius,
        } as CSSProperties,
        iconStyle: {
            width: fc.iconSize,
            height: fc.iconSize,
        } as CSSProperties,
        addonSelectIconStyle: {
            ...addonSelectIconSizes[size],
        } as CSSProperties,
    };
}
