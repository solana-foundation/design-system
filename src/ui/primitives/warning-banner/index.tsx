import { AlertCircle } from "lucide-react";
import * as React from "react";
import { cn } from "../../utils";

export interface WarningBannerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Title of the warning */
  title: string;
  /** Message/description of the warning */
  message: string;
  /** Visual variant */
  variant?: "warning" | "danger";
}

/**
 * Warning banner component for displaying important messages
 */
const WarningBanner = React.forwardRef<HTMLDivElement, WarningBannerProps>(
  ({ title, message, variant = "warning", className, ...props }, ref) => {
    const variantStyles = {
      warning: {
        container: "border-yellow-200 bg-yellow-50",
        icon: "text-yellow-600",
        title: "text-yellow-900",
        message: "text-yellow-800",
      },
      danger: {
        container: "border-red-200 bg-red-50",
        icon: "text-red-600",
        title: "text-red-900",
        message: "text-red-800",
      },
    };

    const styles = variantStyles[variant];

    return (
      <div
        className={cn("rounded-lg border p-3", styles.container, className)}
        ref={ref}
        role="alert"
        {...props}
      >
        <div className="flex gap-2">
          <AlertCircle
            className={cn("mt-0.5 h-5 w-5 flex-shrink-0", styles.icon)}
          />
          <div className="text-sm">
            <p className={cn("mb-1 font-medium", styles.title)}>{title}</p>
            <p className={cn(styles.message)}>{message}</p>
          </div>
        </div>
      </div>
    );
  }
);
WarningBanner.displayName = "WarningBanner";

export { WarningBanner };
