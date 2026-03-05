import { type ComponentPropsWithRef, forwardRef } from 'react';
import { cn } from '@/lib/cn';

export interface InlineCodeProps extends ComponentPropsWithRef<'code'> {}

export const InlineCode = forwardRef<HTMLElement, InlineCodeProps>(({ className, ...props }, ref) => {
    return <code className={cn('inline-code', className)} ref={ref} {...props} />;
});

InlineCode.displayName = 'InlineCode';
