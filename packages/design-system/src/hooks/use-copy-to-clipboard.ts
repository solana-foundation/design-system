import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_COPY_RESET_DELAY = 1600;

export interface CopyToClipboardResult {
  error?: Error;
  success: boolean;
}

const toError = (error: unknown) =>
  error instanceof Error ? error : new Error("Copy to clipboard failed");

const fallbackCopyToClipboard = (text: string): CopyToClipboardResult => {
  if (typeof document === "undefined") {
    return { success: false, error: new Error("Document is not available") };
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";

    document.body.append(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand("copy");
    textarea.remove();

    return success
      ? { success: true }
      : { success: false, error: new Error("Fallback clipboard copy failed") };
  } catch (error) {
    return { success: false, error: toError(error) };
  }
};

/**
 * Hook for copying text to clipboard with automatic reset.
 *
 * Returns a `copied` state that resets after the specified delay,
 * perfect for showing feedback (e.g., animating a check icon).
 *
 * The timeout is properly cleaned up if the component unmounts,
 * preventing memory leaks and state updates on unmounted components.
 *
 * @param resetDelay - Time in ms before `copied` resets to false (default: 1600)
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
export function useCopyToClipboard(resetDelay = DEFAULT_COPY_RESET_DELAY) {
  const [copied, setCopied] = useState(false);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearResetTimeout = useCallback(() => {
    if (!resetTimeoutRef.current) return;
    clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = null;
  }, []);

  const scheduleReset = useCallback(() => {
    clearResetTimeout();
    resetTimeoutRef.current = setTimeout(() => {
      setCopied(false);
      resetTimeoutRef.current = null;
    }, resetDelay);
  }, [clearResetTimeout, resetDelay]);

  // Clean up timeout on unmount.
  useEffect(() => {
    return clearResetTimeout;
  }, [clearResetTimeout]);

  const copy = useCallback(
    async (text: string): Promise<CopyToClipboardResult> => {
      if (
        typeof window !== "undefined" &&
        window.isSecureContext &&
        typeof navigator !== "undefined" &&
        navigator.clipboard?.writeText
      ) {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          scheduleReset();
          return { success: true };
        } catch {
          // Fall through to a compatibility fallback.
        }
      }

      const fallbackResult = fallbackCopyToClipboard(text);
      if (fallbackResult.success) {
        setCopied(true);
        scheduleReset();
      }
      return fallbackResult;
    },
    [scheduleReset]
  );

  return { copied, copy };
}
