import type { ReactNode } from "react";

export interface KeyboardKeyProps {
  /** Key label (e.g., "Enter", "Tab", "Space") */
  children: ReactNode;
}

/**
 * Keyboard key display for documenting shortcuts.
 * Renders as a styled key cap.
 */
export function KeyboardKey({ children }: KeyboardKeyProps) {
  return (
    <kbd className="inline-flex h-6 min-w-[24px] items-center justify-center rounded border border-gray-300 bg-gray-200 px-2 font-medium font-mono text-text-high text-xs shadow-[0_1px_0_1px_var(--gray-400)]">
      {children}
    </kbd>
  );
}

export interface KeyboardShortcutProps {
  /** Array of keys in the shortcut */
  keys: string[];
  /** Description of what the shortcut does */
  description: string;
}

/**
 * Keyboard shortcut with description.
 */
export function KeyboardShortcut({ keys, description }: KeyboardShortcutProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-1.5">
        {keys.map((key, index) => (
          <span className="flex items-center gap-1.5" key={index}>
            <KeyboardKey>{key}</KeyboardKey>
            {index < keys.length - 1 && (
              <span className="text-text-low text-xs">+</span>
            )}
          </span>
        ))}
      </div>
      <span className="text-body-sm text-text-medium">{description}</span>
    </div>
  );
}
