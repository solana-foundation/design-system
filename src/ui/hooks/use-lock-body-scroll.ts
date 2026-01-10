import { useEffect, useLayoutEffect, useState } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Hook to lock/unlock body scroll (useful for modals)
 * Prevents layout shift by accounting for scrollbar width
 * @param initialLocked - Whether to lock scroll initially
 * @returns Tuple of [locked, setLocked] state
 */
export function useLockBodyScroll(
  initialLocked = false
): [boolean, (locked: boolean) => void] {
  const [locked, setLocked] = useState(initialLocked);

  useIsomorphicLayoutEffect(() => {
    if (!locked) return;

    // Calculate scrollbar width to prevent layout shift
    const scrollBarWidth = window.innerWidth - document.body.offsetWidth;
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      `${scrollBarWidth}px`
    );

    // Store original overflow value
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      // Restore original overflow
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.removeProperty("--scrollbar-width");
    };
  }, [locked]);

  // Sync with prop changes
  useEffect(() => {
    if (locked !== initialLocked) {
      setLocked(initialLocked);
    }
  }, [initialLocked, locked]);

  return [locked, setLocked];
}
