import * as React from "react";
import { cn } from "../../utils";

export interface SolanaLogoProps extends React.SVGAttributes<SVGSVGElement> {}

/**
 * Solana logo SVG component
 */
const SolanaLogo = React.forwardRef<SVGSVGElement, SolanaLogoProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        className={cn("", className)}
        fill="none"
        ref={ref}
        viewBox="0 0 397 311"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
          fill="currentColor"
        />
        <path
          d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
          fill="currentColor"
        />
        <path
          d="M332.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H5.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
          fill="currentColor"
        />
      </svg>
    );
  }
);
SolanaLogo.displayName = "SolanaLogo";

export interface SolanaIconProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Solana gradient icon component
 */
const SolanaIcon = React.forwardRef<HTMLSpanElement, SolanaIconProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        className={cn(
          "inline-block rounded-sm bg-gradient-to-br from-[#9945FF] to-[#14F195]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
SolanaIcon.displayName = "SolanaIcon";

export { SolanaLogo, SolanaIcon };
