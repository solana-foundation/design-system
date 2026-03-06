'use client';

import { useCallback, useState, type UIEvent } from 'react';

interface ScrollShadowsState {
    left: boolean;
    right: boolean;
}

export function useScrollShadows<T extends HTMLElement>() {
    const [scrollState, setScrollState] = useState<ScrollShadowsState>({
        left: false,
        right: false,
    });

    const updateScrollState = useCallback((el: T) => {
        const { scrollLeft, scrollWidth, clientWidth } = el;
        const left = scrollLeft > 0;
        const right = scrollLeft < scrollWidth - clientWidth - 1;

        setScrollState(prev => {
            if (prev.left === left && prev.right === right) return prev;
            return { left, right };
        });
    }, []);

    const handleScroll = useCallback(
        (event: UIEvent<T>) => {
            updateScrollState(event.currentTarget);
        },
        [updateScrollState],
    );

    return { scrollState, updateScrollState, handleScroll };
}
