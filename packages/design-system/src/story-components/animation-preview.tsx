import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Button } from '@/primitives/button';

export interface AnimationPreviewProps {
    /** Content containing animated elements (e.g., Spinner, Button with loading) */
    children: React.ReactNode;
    /** Description of the animation being previewed */
    label?: string;
}

/**
 * Wrapper for previewing animations in Storybook documentation.
 *
 * Respects `prefers-reduced-motion` by default, pausing animations.
 * Provides a Play/Pause button for opt-in viewing.
 *
 * @example
 * ```tsx
 * <AnimationPreview label="Loading spinner - 1s linear rotation">
 *   <Button loading>Saving...</Button>
 * </AnimationPreview>
 * ```
 */
export function AnimationPreview({ children, label }: AnimationPreviewProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            <div
                className="flex items-center justify-center rounded-lg border border-border-medium p-8"
                data-animation-playing={isPlaying}
            >
                {children}
            </div>
            <div className="flex items-center justify-between">
                {label ? <span className="text-body-sm text-text-medium">{label}</span> : <span />}
                <Button
                    iconLeft={
                        <AnimatePresence initial={false} mode="popLayout">
                            <motion.div
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 0.5, filter: 'blur(4px)' }}
                                initial={{ opacity: 0, scale: 0.5, filter: 'blur(4px)' }}
                                key={isPlaying ? 'pause' : 'play'}
                                transition={{ type: 'spring', duration: 0.2, bounce: 0 }}
                            >
                                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </motion.div>
                        </AnimatePresence>
                    }
                    onClick={() => setIsPlaying(!isPlaying)}
                    size="sm"
                    variant="secondary"
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </Button>
            </div>
        </div>
    );
}
