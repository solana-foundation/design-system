import { Field } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import { useReducedMotion } from "motion/react";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

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
    height: string;
    paddingX: string;
    radius: string;
    iconSize: string;
    gap: string;
    textClass: string;
  }
> = {
  xl: {
    height: "var(--input-height-xl)",
    paddingX: "var(--input-padding-x-xl)",
    radius: "var(--input-radius-xl)",
    iconSize: "var(--input-icon-xl)",
    gap: "var(--input-gap-xl)",
    textClass: "text-[16px]",
  },
  lg: {
    height: "var(--input-height-lg)",
    paddingX: "var(--input-padding-x-lg)",
    radius: "var(--input-radius-lg)",
    iconSize: "var(--input-icon-lg)",
    gap: "var(--input-gap-lg)",
    textClass: "text-[14px]",
  },
  md: {
    height: "var(--input-height-md)",
    paddingX: "var(--input-padding-x-md)",
    radius: "var(--input-radius-md)",
    iconSize: "var(--input-icon-md)",
    gap: "var(--input-gap-md)",
    textClass: "text-[12px]",
  },
};

const IconWrapper = ({ children }: { children: ReactNode }) => (
  <span
    className={cn(
      "pointer-events-none inline-flex shrink-0 items-center justify-center text-text-extra-high [&_svg]:size-full",
      "opacity-44 transition-opacity duration-150 ease-out",
      "group-[:not(:focus-within)]/input:group-hover/input:opacity-56",
      "group-focus-within/input:opacity-72"
    )}
    style={{
      width: "var(--icon-size)",
      height: "var(--icon-size)",
    }}
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
    const prefersReducedMotion = useReducedMotion();
    const config = sizeStyles[size];
    const hasField = label || description || error;

    const inputWrapper = (
      <div
        className={cn(
          "group/input relative flex items-center",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        style={
          {
            height: config.height,
            paddingLeft: config.paddingX,
            paddingRight: config.paddingX,
            borderRadius: config.radius,
            gap: config.gap,
            "--icon-size": config.iconSize,
          } as React.CSSProperties
        }
      >
        {/* Border layer */}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit]",
            "border-[length:var(--input-border-width)]",
            "border-[var(--input-border-idle)]",
            "transition-[border-color,background-color] duration-150 ease-out",
            "group-[:not(:focus-within)]/input:group-hover/input:border-[var(--input-border-hover)]",
            "group-[:not(:focus-within)]/input:group-hover/input:bg-[var(--input-bg-hover)]",
            "group-focus-within/input:border-[var(--input-border-focus)]",
            error && "border-red-500/60"
          )}
        />

        {/* Focus ring overlay — instant on, 120ms ease-out exit */}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit]",
            "shadow-[0_0_0_2px_var(--input-focus-ring)]",
            "opacity-0 transition-[opacity,transform] duration-120 ease-out",
            "group-focus-within/input:opacity-100 group-focus-within/input:duration-0",
            !prefersReducedMotion &&
              "scale-[0.99] group-focus-within/input:scale-100",
            "motion-reduce:!scale-100"
          )}
        />

        {iconLeft && <IconWrapper>{iconLeft}</IconWrapper>}

        <BaseInput
          className={cn(
            "h-full w-full min-w-0 flex-1 bg-transparent outline-none",
            "text-text-extra-high placeholder:text-text-extra-low",
            "autofill-transparent",
            config.textClass
          )}
          disabled={disabled}
          ref={ref}
          {...props}
        />

        {iconRight && <IconWrapper>{iconRight}</IconWrapper>}

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
          <Field.Label className="font-medium text-[14px] text-text-high">
            {label}
          </Field.Label>
        )}
        {inputWrapper}
        {error ? (
          <Field.Error className="text-[12px] text-red-500" match>
            {error}
          </Field.Error>
        ) : description ? (
          <Field.Description className="text-[12px] text-text-low">
            {description}
          </Field.Description>
        ) : null}
      </Field.Root>
    );
  }
);

Input.displayName = "Input";
