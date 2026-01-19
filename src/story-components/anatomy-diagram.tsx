import type { ReactNode } from "react";

export interface AnatomyPartProps {
  /** Part number for reference */
  number: number;
  /** Part name */
  name: string;
  /** Part description */
  description: string;
}

/**
 * Single part in an anatomy legend.
 */
export function AnatomyPart({ number, name, description }: AnatomyPartProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-1400 font-semibold text-white text-xs">
        {number}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-body-sm text-text-extra-high">
          {name}
        </span>
        <span className="text-body-sm text-text-medium">{description}</span>
      </div>
    </div>
  );
}

export interface AnatomyDiagramProps {
  /** The component being annotated */
  children: ReactNode;
  /** List of labeled parts */
  parts: Array<{
    number: number;
    name: string;
    description: string;
  }>;
}

/**
 * Anatomy diagram showing labeled component parts.
 * Displays the component alongside a legend of its parts.
 */
export function AnatomyDiagram({ children, parts }: AnatomyDiagramProps) {
  return (
    <div className="flex flex-col items-start gap-8 lg:flex-row">
      {/* Component display area */}
      <div className="flex min-h-[120px] flex-1 items-center justify-center rounded-lg bg-gray-100 p-8">
        {children}
      </div>
      {/* Parts legend */}
      <div className="flex flex-col gap-4 lg:w-80">
        {parts.map((part) => (
          <AnatomyPart
            description={part.description}
            key={part.number}
            name={part.name}
            number={part.number}
          />
        ))}
      </div>
    </div>
  );
}
