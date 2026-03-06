import { createContext, useContext } from 'react';
import type { TabsSize } from './constants';

export interface TabsContextValue {
    bordered: boolean;
    fullWidth: boolean;
    orientation: 'horizontal' | 'vertical';
    size: TabsSize;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext() {
    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error('Tab components must be used within <Tabs>');
    return ctx;
}
