import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

const transition = { type: "spring" as const, duration: 0.3, bounce: 0 };

interface AnimatedIconProps {
  /** The icon element to display */
  icon: ReactNode;
  /** Unique key to identify the current icon state (triggers animation on change) */
  iconKey: string;
}

/**
 * Animates icon transitions with blur + scale effect.
 *
 * @example
 * <AnimatedIcon
 *   icon={playing ? <Pause /> : <Play />}
 *   iconKey={playing ? "pause" : "play"}
 * />
 */
export const AnimatedIcon = ({ icon, iconKey }: AnimatedIconProps) => {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        className="flex items-center justify-center"
        exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
        initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
        key={iconKey}
        transition={transition}
      >
        {icon}
      </motion.span>
    </AnimatePresence>
  );
};

export type { AnimatedIconProps };
