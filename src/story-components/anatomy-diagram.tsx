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
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-1400 text-white text-xs font-semibold shrink-0">
        {number}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-body-sm text-text-extra-high font-medium">
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
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Component display area */}
      <div className="flex-1 rounded-lg bg-gray-100 p-8 flex items-center justify-center min-h-[120px]">
        {children}
      </div>
      {/* Parts legend */}
      <div className="flex flex-col gap-4 lg:w-80">
        {parts.map((part) => (
          <AnatomyPart
            key={part.number}
            number={part.number}
            name={part.name}
            description={part.description}
          />
        ))}
      </div>
    </div>
  );
}
