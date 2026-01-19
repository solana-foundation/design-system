import { useCallback, useEffect, useState } from "react";

/**
 * Hook for copying text to clipboard with automatic reset.
 *
 * Returns a `copied` state that resets after the specified delay,
 * perfect for showing feedback (e.g., animating a check icon).
 *
 * The timeout is properly cleaned up if the component unmounts,
 * preventing memory leaks and state updates on unmounted components.
 *
 * @param resetDelay - Time in ms before `copied` resets to false (default: 2000)
 *
 * @example
 * ```tsx
 * function CopyButton({ text }: { text: string }) {
 *   const { copied, copy } = useCopyToClipboard();
 *
 *   return (
 *     <Button onClick={() => copy(text)}>
 *       <AnimatedIcon
 *         iconKey={copied ? "check" : "copy"}
 *         icon={copied ? <Check /> : <Copy />}
 *       />
 *     </Button>
 *   );
 * }
 * ```
 */
export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);

  // Clean up timeout when copied changes or component unmounts
  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), resetDelay);
    return () => clearTimeout(timeout);
  }, [copied, resetDelay]);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  }, []);

  return { copied, copy };
}
