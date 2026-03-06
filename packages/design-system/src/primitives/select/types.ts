import type { ReactNode } from 'react';
import type { FieldSize } from '../_shared/field-size-config';

export type SelectSize = FieldSize;

export interface ItemRegistryEntry {
    icon?: ReactNode;
    label?: string;
    value: string;
}

export interface SelectContextValue {
    multiple: boolean;
    size: SelectSize;
}
