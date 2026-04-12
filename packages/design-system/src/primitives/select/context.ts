import { createContext, useContext } from 'react';
import type { SelectContextValue } from './types';

export const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelectContext() {
    const ctx = useContext(SelectContext);
    if (!ctx) throw new Error('Select compound components must be used within <Select>');
    return ctx;
}
