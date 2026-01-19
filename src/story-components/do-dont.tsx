import type { ReactNode } from "react";
import { Check, X } from "lucide-react";

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
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/15">
          <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
        </div>
        <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
          Do
        </span>
      </div>
      <div className="rounded-lg bg-gray-100 p-6 flex items-center justify-center min-h-[80px]">
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
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/15">
          <X className="w-3 h-3 text-red-600" strokeWidth={3} />
        </div>
        <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">
          Don't
        </span>
      </div>
      <div className="rounded-lg bg-gray-100 p-6 flex items-center justify-center min-h-[80px]">
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{children}</div>
  );
}
