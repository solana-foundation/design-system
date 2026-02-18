import { Field } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import { AnimatePresence, motion } from "motion/react";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const messageTransition = { duration: 0.15, ease: "easeOut" as const };

type InputSize = "xl" | "lg" | "md";

export interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "size"> {
  /** Size preset: XL=48px, LG=40px, MD=36px */
  size?: InputSize;
  /** Label text rendered above the input */
  label?: string;
  /** Helper text rendered below the input */
  description?: string;
  /** Error message — replaces description when present */
  error?: string;
  /** Icon element displayed before the input */
  iconLeft?: ReactNode;
  /** Icon element displayed after the input */
  iconRight?: ReactNode;
  /** Interactive element (e.g., copy button) displayed at the trailing edge */
  action?: ReactNode;
}

const sizeStyles: Record<
  InputSize,
  {
    wrapperStyle: React.CSSProperties;
    iconStyle: React.CSSProperties;
    textClass: string;
    labelClass: string;
    descriptionClass: string;
  }
> = {
  xl: {
    wrapperStyle: {
      height: "var(--input-height-xl)",
      paddingLeft: "var(--input-padding-x-xl)",
      paddingRight: "var(--input-padding-x-xl)",
      borderRadius: "var(--input-radius-xl)",
      gap: "var(--input-gap-xl)",
    },
    iconStyle: {
      width: "var(--input-icon-xl)",
      height: "var(--input-icon-xl)",
    },
    textClass: "text-[16px]",
    labelClass: "text-[14px]",
    descriptionClass: "text-[14px]",
  },
  lg: {
    wrapperStyle: {
      height: "var(--input-height-lg)",
      paddingLeft: "var(--input-padding-x-lg)",
      paddingRight: "var(--input-padding-x-lg)",
      borderRadius: "var(--input-radius-lg)",
      gap: "var(--input-gap-lg)",
    },
    iconStyle: {
      width: "var(--input-icon-lg)",
      height: "var(--input-icon-lg)",
    },
    textClass: "text-[14px]",
    labelClass: "text-[14px]",
    descriptionClass: "text-[12px]",
  },
  md: {
    wrapperStyle: {
      height: "var(--input-height-md)",
      paddingLeft: "var(--input-padding-x-md)",
      paddingRight: "var(--input-padding-x-md)",
      borderRadius: "var(--input-radius-md)",
      gap: "var(--input-gap-md)",
    },
    iconStyle: {
      width: "var(--input-icon-md)",
      height: "var(--input-icon-md)",
    },
    textClass: "text-[12px]",
    labelClass: "text-[12px]",
    descriptionClass: "text-[12px]",
  },
};

const IconWrapper = ({
  children,
  style,
}: {
  children: ReactNode;
  style: React.CSSProperties;
}) => (
  <span
    className={cn(
      "pointer-events-none inline-flex shrink-0 items-center justify-center text-text-extra-high [&_svg]:size-full",
      "opacity-44 transition-opacity duration-150 ease-out",
      "motion-reduce:transition-none",
      "group-[:not(:focus-within)]/input:group-hover/input:opacity-56",
      "group-focus-within/input:opacity-72"
    )}
    style={style}
  >
    {children}
  </span>
);

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      label,
      description,
      error,
      iconLeft,
      iconRight,
      action,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const config = sizeStyles[size];
    const hasField = label || description || error;

    const inputWrapper = (
      <div
        className={cn(
          "group/input relative flex items-center",
          disabled && "pointer-events-none opacity-40",
          className
        )}
        style={config.wrapperStyle}
      >
        {/* Border layer */}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit]",
            "border-[length:var(--input-border-width)]",
            "border-[var(--input-border-idle)]",
            "bg-[var(--input-bg-idle)]",
            "transition-[border-color,background-color] duration-150 ease-out",
            "motion-reduce:transition-none",
            "group-[:not(:focus-within)]/input:group-hover/input:border-[var(--input-border-hover)]",
            "group-[:not(:focus-within)]/input:group-hover/input:bg-[var(--input-bg-hover)]",
            "group-focus-within/input:border-[var(--input-border-focus)]",
            error && "border-[var(--input-border-error)]"
          )}
        />

        {/* Focus ring — instant on, 150ms ease-out exit */}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit]",
            "shadow-[0_0_0_2px_var(--input-focus-ring)]",
            "opacity-0 transition-opacity duration-150 ease-out",
            "group-focus-within/input:opacity-100 group-focus-within/input:duration-0",
            "motion-reduce:transition-none"
          )}
        />

        {iconLeft && (
          <IconWrapper style={config.iconStyle}>{iconLeft}</IconWrapper>
        )}

        <BaseInput
          className={cn(
            "h-full w-full min-w-0 flex-1 bg-transparent leading-none outline-none",
            "text-text-extra-high placeholder:text-text-extra-low",
            "autofill-transparent",
            config.textClass
          )}
          disabled={disabled}
          ref={ref}
          {...props}
        />

        {iconRight && (
          <IconWrapper style={config.iconStyle}>{iconRight}</IconWrapper>
        )}

        {action && (
          <span className="relative z-10 inline-flex shrink-0 items-center justify-center">
            {action}
          </span>
        )}
      </div>
    );

    if (!hasField) return inputWrapper;

    return (
      <Field.Root
        className="flex flex-col gap-1.5"
        disabled={disabled}
        invalid={!!error}
      >
        {label && (
          <Field.Label
            className={cn("font-medium text-text-high", config.labelClass)}
          >
            {label}
          </Field.Label>
        )}
        {inputWrapper}
        <AnimatePresence initial={false} mode="wait">
          {error ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              initial={{ opacity: 0, y: -4 }}
              key="error"
              transition={messageTransition}
            >
              <Field.Error
                className={cn(
                  "text-[var(--input-error-text)]",
                  config.descriptionClass
                )}
                match
              >
                {error}
              </Field.Error>
            </motion.div>
          ) : description ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              initial={{ opacity: 0, y: -4 }}
              key="description"
              transition={messageTransition}
            >
              <Field.Description
                className={cn("text-text-low", config.descriptionClass)}
              >
                {description}
              </Field.Description>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Field.Root>
    );
  }
);

Input.displayName = "Input";
