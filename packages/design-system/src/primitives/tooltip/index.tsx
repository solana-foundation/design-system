import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import {
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
} from "react";
import { cn } from "../../utils";

// Context to detect if a TooltipProvider ancestor exists
const TooltipProviderContext = createContext(false);

export interface TooltipProviderProps {
  children: ReactNode;
  /** Delay in ms before showing a tooltip (default 0) */
  delay?: number;
  /** Delay in ms before hiding a tooltip (default 150) */
  closeDelay?: number;
  /** If another tooltip opens within this time (ms) after one closes, it opens instantly (default 300) */
  timeout?: number;
}

export function TooltipProvider({
  children,
  delay = 0,
  closeDelay = 150,
  timeout = 300,
}: TooltipProviderProps) {
  return (
    <TooltipProviderContext value={true}>
      <BaseTooltip.Provider
        closeDelay={closeDelay}
        delay={delay}
        timeout={timeout}
      >
        {children}
      </BaseTooltip.Provider>
    </TooltipProviderContext>
  );
}

export interface TooltipProps {
  /** Content displayed inside the tooltip popup */
  content: ReactNode;
  /** Trigger element — must accept a ref */
  children: ReactElement;
  /** Which side of the trigger to position the tooltip */
  side?: "top" | "bottom" | "left" | "right";
  /** Alignment along the side axis */
  align?: "start" | "center" | "end";
  /** Offset from the trigger in pixels */
  sideOffset?: number;
  /** Show an arrow pointing at the trigger */
  arrow?: boolean;
  /** Delay in ms before showing (default 0). Ignored when inside a TooltipProvider. */
  delay?: number;
  /** Delay in ms before hiding (default 150). Ignored when inside a TooltipProvider. */
  closeDelay?: number;
}

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 8,
  arrow = true,
  delay = 0,
  closeDelay = 150,
}: TooltipProps) {
  const hasProvider = useContext(TooltipProviderContext);

  const tooltip = (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          align={align}
          className="z-50"
          side={side}
          sideOffset={sideOffset}
        >
          <BaseTooltip.Popup
            className={cn(
              "origin-[var(--transform-origin)]",
              "rounded-[var(--tooltip-radius)]",
              "bg-[var(--tooltip-bg)]",
              "shadow-[var(--tooltip-shadow)]",
              "max-w-[320px]",
              "px-2.5 py-1.5",
              "text-pretty text-[12px] text-[var(--tooltip-text)] leading-snug",
              "overflow-visible outline-none",
              // Animation: 125ms ease-out-quint with visible scale pop
              "transform-gpu will-change-[transform,opacity]",
              "transition-[transform,opacity] duration-[125ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
              "data-[starting-style]:scale-[0.96] data-[starting-style]:opacity-0",
              "data-[ending-style]:scale-[0.96] data-[ending-style]:opacity-0",
              "data-[instant]:transition-none",
              "motion-reduce:transition-none"
            )}
          >
            {arrow && (
              <BaseTooltip.Arrow
                className={cn(
                  "size-2 rotate-45 bg-[var(--tooltip-bg)]",
                  "data-[side=bottom]:-top-1",
                  "data-[side=top]:-bottom-1",
                  "data-[side=left]:-right-1",
                  "data-[side=right]:-left-1",
                )}
              />
            )}
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );

  // If inside a TooltipProvider, skip creating a nested Provider
  if (hasProvider) return tooltip;

  // Standalone fallback: wrap in its own Provider
  return (
    <BaseTooltip.Provider closeDelay={closeDelay} delay={delay}>
      {tooltip}
    </BaseTooltip.Provider>
  );
}
