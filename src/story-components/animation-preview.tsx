import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/primitives/button";

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
        className="flex items-center justify-center rounded-lg bg-gray-100 p-8"
        data-animation-playing={isPlaying}
      >
        {children}
      </div>
      <div className="flex items-center justify-between">
        {label ? (
          <span className="text-body-sm text-text-medium">{label}</span>
        ) : (
          <span />
        )}
        <Button
          iconLeft={isPlaying ? <Pause /> : <Play />}
          onClick={() => setIsPlaying(!isPlaying)}
          size="sm"
          variant="secondary"
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </div>
    </div>
  );
}
