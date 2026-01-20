import { Check, X } from "lucide-react";
import type { ReactNode } from "react";

export interface DoExampleProps {
  /** Description of the correct usage */
  description: string;
  /** Example content demonstrating correct usage */
  children: ReactNode;
}

/**
 * Usage guideline showing correct/recommended patterns.
 * Green indicator with checkmark.
 */
export function DoExample({ description, children }: DoExampleProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/15">
          <Check className="h-3 w-3 text-green-600" strokeWidth={3} />
        </div>
        <span className="font-semibold text-green-700 text-xs uppercase tracking-wide">
          Do
        </span>
      </div>
      <div className="flex min-h-[80px] items-center justify-center rounded-lg border border-border-medium p-6">
        {children}
      </div>
      <p className="text-body-sm text-text-medium">{description}</p>
    </div>
  );
}

export interface DontExampleProps {
  /** Description of the incorrect usage */
  description: string;
  /** Example content demonstrating incorrect usage */
  children: ReactNode;
}

/**
 * Usage guideline showing incorrect/discouraged patterns.
 * Red indicator with X mark.
 */
export function DontExample({ description, children }: DontExampleProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/15">
          <X className="h-3 w-3 text-red-600" strokeWidth={3} />
        </div>
        <span className="font-semibold text-red-700 text-xs uppercase tracking-wide">
          Don't
        </span>
      </div>
      <div className="flex min-h-[80px] items-center justify-center rounded-lg border border-border-medium p-6">
        {children}
      </div>
      <p className="text-body-sm text-text-medium">{description}</p>
    </div>
  );
}

export interface GuidelinesGridProps {
  /** Do/Don't example pairs */
  children: ReactNode;
}

/**
 * Two-column grid for Do/Don't example pairs.
 */
export function GuidelinesGrid({ children }: GuidelinesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">{children}</div>
  );
}
