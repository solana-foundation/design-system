import type { ReactNode } from 'react';

export interface StorySectionProps {
    /** Section content */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Optional description text below the title */
    description?: string;
    /** Section title displayed as a heading */
    title?: string;
}

/**
 * Section container for organizing story content.
 * Provides consistent spacing and typography for story documentation.
 */
export function StorySection({ title, description, children, className = '' }: StorySectionProps) {
    return (
        <section className={`flex flex-col gap-6 ${className}`}>
            {(title || description) && (
                <div className="flex flex-col gap-1">
                    {title && <h3 className="text-headline-lg text-text-extra-high">{title}</h3>}
                    {description && <p className="max-w-xl text-body-md text-text-medium">{description}</p>}
                </div>
            )}
            {children}
        </section>
    );
}
