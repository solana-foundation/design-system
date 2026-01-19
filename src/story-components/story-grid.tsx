import type { ReactNode } from "react";

export interface StoryGridProps {
  /** Grid content - typically variant examples */
  children: ReactNode;
  /** Number of columns (auto-adjusts on mobile) */
  columns?: 2 | 3 | 4 | 5;
  /** Additional CSS classes */
  className?: string;
}

const columnClasses = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-[100px_1fr_1fr_1fr_1fr]",
} as const;

/**
 * Responsive grid for displaying component variants.
 * Column 1 is typically labels (100px), remaining columns are examples.
 */
export function StoryGrid({
  children,
  columns = 5,
  className = "",
}: StoryGridProps) {
  return (
    <div
      className={`grid ${columnClasses[columns]} gap-x-8 gap-y-6 items-center ${className}`}
    >
      {children}
    </div>
  );
}

export interface GridLabelProps {
  /** Label text */
  children: ReactNode;
  /** Header style (for column headers) */
  header?: boolean;
}

/**
 * Label cell for StoryGrid rows or columns.
 */
export function GridLabel({ children, header = false }: GridLabelProps) {
  if (header) {
    return (
      <div className="text-xs font-medium text-text-low text-center uppercase tracking-wide">
        {children}
      </div>
    );
  }
  return (
    <div className="text-xs font-medium text-text-low">{children}</div>
  );
}

export interface GridCellProps {
  /** Cell content */
  children: ReactNode;
  /** Center content horizontally */
  center?: boolean;
}

/**
 * Content cell for StoryGrid.
 */
export function GridCell({ children, center = false }: GridCellProps) {
  return (
    <div className={center ? "flex justify-center" : ""}>{children}</div>
  );
}
