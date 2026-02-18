import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "../../hooks/use-copy-to-clipboard";
import { cn } from "../../utils";
import { AnimatedIcon } from "../animated-icon";

type CopyButtonSize = "xl" | "lg" | "md";

const iconSizes: Record<CopyButtonSize, number> = {
  xl: 18,
  lg: 16,
  md: 14,
};

export interface CopyButtonProps {
  /** The text to copy to the clipboard */
  value: string;
  /** Size variant — should match the parent Input size */
  size?: CopyButtonSize;
  /** Additional class names */
  className?: string;
}

export const CopyButton = ({
  value,
  size = "md",
  className,
}: CopyButtonProps) => {
  const { copied, copy } = useCopyToClipboard();
  const iconSize = iconSizes[size];

  return (
    <button
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-sm text-text-medium",
        "transition-colors duration-150 hover:text-text-high",
        "focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2",
        className
      )}
      onClick={() => copy(value)}
      style={{ width: iconSize + 8, height: iconSize + 8 }}
      type="button"
    >
      <AnimatedIcon
        icon={
          copied ? (
            <Check size={iconSize} strokeWidth={2} />
          ) : (
            <Copy size={iconSize} strokeWidth={2} />
          )
        }
        iconKey={copied ? "check" : "copy"}
      />
      <span className="sr-only" role="status">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
};
