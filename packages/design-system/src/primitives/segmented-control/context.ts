'use client';

import { createContext, useContext } from 'react';

export interface SegmentedControlContextValue {
    layoutId: string;
}

export const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null);

export function useSegmentedControlContext() {
    const context = useContext(SegmentedControlContext);
    if (!context) throw new Error('SegmentButton must be used within SegmentedControl');
    return context;
}
