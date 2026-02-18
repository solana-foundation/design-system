import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

type AnimatedIconPreset = "default" | "micro";
type MotionState = Exclude<
  ComponentProps<typeof motion.span>["exit"],
  undefined
>;

const transitions: Record<
  AnimatedIconPreset,
  ComponentProps<typeof motion.span>["transition"]
> = {
  default: { type: "spring" as const, duration: 0.3, bounce: 0 },
  micro: {
    duration: 0.18,
    ease: [0.23, 1, 0.32, 1],
  },
};

const variantByPreset: Record<
  AnimatedIconPreset,
  {
    animate: MotionState;
    enterExit: MotionState;
  }
> = {
  default: {
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    enterExit: { opacity: 0, scale: 0.25, filter: "blur(4px)" },
  },
  micro: {
    animate: { opacity: 1, scale: 1 },
    enterExit: { opacity: 0, scale: 0.88 },
  },
};

interface AnimatedIconProps {
  /** The icon element to display */
  icon: ReactNode;
  /** Unique key to identify the current icon state (triggers animation on change) */
  iconKey: string;
  /** Motion preset. Use `micro` for high-frequency UI feedback (e.g., copy actions). */
  preset?: AnimatedIconPreset;
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
export const AnimatedIcon = ({
  icon,
  iconKey,
  preset = "default",
}: AnimatedIconProps) => {
  const reduceMotion = useReducedMotion();
  const presetVariant = variantByPreset[preset];
  const staticVariant: MotionState =
    preset === "default"
      ? { opacity: 1, scale: 1, filter: "blur(0px)" }
      : { opacity: 1, scale: 1 };
  const transition = reduceMotion ? { duration: 0 } : transitions[preset];
  const presenceMode = "popLayout";

  return (
    <AnimatePresence initial={false} mode={presenceMode}>
      <motion.span
        animate={reduceMotion ? staticVariant : presetVariant.animate}
        className="flex items-center justify-center"
        exit={reduceMotion ? staticVariant : presetVariant.enterExit}
        initial={reduceMotion ? staticVariant : presetVariant.enterExit}
        key={iconKey}
        transition={transition}
      >
        {icon}
      </motion.span>
    </AnimatePresence>
  );
};

export type { AnimatedIconProps };
