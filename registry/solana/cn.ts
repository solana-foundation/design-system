/**
 * Simple class name utility for conditionally joining class names.
 * Unlike clsx/tailwind-merge, this is a minimal implementation.
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}
