"use client";

import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "../../utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The size of the spinner */
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", ...props }, ref) => {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        ref={ref}
        {...props}
      >
        <Loader2
          className={cn(
            "animate-spin text-muted-foreground",
            sizeClasses[size]
          )}
        />
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner };
