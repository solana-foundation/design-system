import { Field } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import { Select } from "@base-ui/react/select";
import { Check, ChevronDown, CircleHelp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  useCallback,
  useRef,
} from "react";
import { cn } from "../../utils";
import {
  type FieldSize,
  getFieldSizeConfig,
} from "../_shared/field-size-config";
import { Tooltip } from "../tooltip";

const messageTransition = { duration: 0.15, ease: "easeOut" as const };
const INTERACTIVE_TARGET_SELECTOR = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "[role='button']",
  "[role='checkbox']",
  "[role='link']",
  "[role='menuitem']",
  "[role='option']",
  "[role='radio']",
  "[role='switch']",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
  "[contenteditable='plaintext-only']",
  "[data-input-addon-interactive='true']",
].join(", ");

const setForwardedRef = <T,>(ref: React.ForwardedRef<T>, value: T | null) => {
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  if (ref) {
    ref.current = value;
  }
};

type InputSize = FieldSize;
type AddonKind = "static" | "interactive";
type AddonPosition = "leading" | "trailing";

/**
 * Use `NumberField` for numeric inputs that require spinbutton semantics,
 * and stepped keyboard interactions.
 */
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
  /** Tooltip hint shown via info icon next to the label */
  hint?: string;
  /** Leading addon with divider (dropdown, static text, etc.) */
  leadingAddon?: ReactNode;
  /** Trailing addon with divider (dropdown, button, etc.) */
  trailingAddon?: ReactNode;
  /** First-class trailing interactive control (e.g., "Copy address"). Wins over trailingAddon when both are provided. */
  trailingAction?: ReactNode;
  /** Leading addon behavior mode. Interactive mode makes the full segment clickable. */
  leadingAddonKind?: AddonKind;
  /** Trailing addon behavior mode. Interactive mode makes the full segment clickable. */
  trailingAddonKind?: AddonKind;
  /** Additional class names applied directly to the native input element. */
  inputClassName?: string;
}

const addonSelectIconSizes: Record<FieldSize, React.CSSProperties> = {
  xl: {
    width: "var(--select-trigger-icon-xl)",
    height: "var(--select-trigger-icon-xl)",
  },
  lg: {
    width: "var(--select-trigger-icon-lg)",
    height: "var(--select-trigger-icon-lg)",
  },
  md: {
    width: "var(--select-trigger-icon-md)",
    height: "var(--select-trigger-icon-md)",
  },
};

function getInputConfig(size: FieldSize) {
  const fc = getFieldSizeConfig(size);
  return {
    ...fc,
    wrapperStyle: {
      height: fc.height,
      borderRadius: fc.radius,
    } as React.CSSProperties,
    iconStyle: {
      width: fc.iconSize,
      height: fc.iconSize,
    } as React.CSSProperties,
    addonSelectIconStyle: addonSelectIconSizes[size],
  };
}

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
      "ease opacity-44 transition-opacity duration-150",
      "motion-reduce:transition-none",
      "group-[:not(:focus-within)]/input:group-hover/input:opacity-56",
      "group-focus-within/input:opacity-72"
    )}
    style={style}
  >
    {children}
  </span>
);

const AddonDivider = () => (
  <span
    className={cn(
      "shrink-0 self-stretch",
      "bg-[var(--input-border-idle)]",
      "ease transition-[background-color] duration-150",
      "motion-reduce:transition-none",
      "group-[:not(:focus-within)]/input:group-hover/input:bg-[var(--input-border-hover)]",
      "group-focus-within/input:bg-[var(--input-border-focus)]"
    )}
    style={{
      width: "var(--input-border-width)",
      marginTop: "var(--input-border-width)",
      marginBottom: "var(--input-border-width)",
    }}
  />
);

const AddonWrapper = ({
  children,
  position,
  outerPaddingX,
  innerPaddingX,
  kind,
  textClass,
}: {
  children: ReactNode;
  position: AddonPosition;
  outerPaddingX: string;
  innerPaddingX: string;
  kind: AddonKind;
  textClass: string;
}) => (
  <span
    className={cn(
      "relative z-10 flex shrink-0 items-center self-stretch leading-[var(--input-text-line-height)]",
      textClass,
      "text-text-high"
    )}
    data-input-addon-interactive={kind === "interactive" ? "true" : undefined}
    style={{
      paddingLeft: position === "leading" ? outerPaddingX : innerPaddingX,
      paddingRight: position === "leading" ? innerPaddingX : outerPaddingX,
    }}
  >
    {children}
  </span>
);

const normalizeInteractiveAddonControl = (control: ReactNode) => {
  if (!isValidElement(control)) {
    return control;
  }

  const controlElement = control as ReactElement<Record<string, unknown>>;
  const controlProps = controlElement.props as {
    className?: string;
    style?: React.CSSProperties;
  };

  return cloneElement(controlElement, {
    className: cn(
      controlProps.className,
      "inline-flex h-full min-h-full min-w-0 items-center justify-center",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--input-focus-ring)] focus-visible:ring-inset"
    ),
    style: {
      ...(controlProps.style ?? {}),
      paddingLeft: 0,
      paddingRight: 0,
      minHeight: "100%",
    },
    "data-input-addon-interactive": "true",
  });
};

const resolveTrailingSlot = ({
  trailingAction,
  trailingAddon,
  trailingAddonKind,
}: {
  trailingAction?: ReactNode;
  trailingAddon?: ReactNode;
  trailingAddonKind: AddonKind;
}) => {
  if (trailingAction) {
    return {
      addon: trailingAction,
      content: normalizeInteractiveAddonControl(trailingAction),
      kind: "interactive" as const,
    };
  }

  return {
    addon: trailingAddon,
    content:
      trailingAddonKind === "interactive"
        ? normalizeInteractiveAddonControl(trailingAddon)
        : trailingAddon,
    kind: trailingAddonKind,
  };
};

const warnTrailingActionConflict = ({
  trailingAction,
  trailingAddon,
  hasWarnedRef,
}: {
  trailingAction?: ReactNode;
  trailingAddon?: ReactNode;
  hasWarnedRef: MutableRefObject<boolean>;
}) => {
  if (
    process.env.NODE_ENV !== "production" &&
    trailingAction &&
    trailingAddon &&
    !hasWarnedRef.current
  ) {
    // trailingAction is the preferred API for interactive trailing controls.
    console.warn(
      "Input: received both `trailingAction` and `trailingAddon`; `trailingAction` takes precedence."
    );
    hasWarnedRef.current = true;
  }
};

export interface InputAddonSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface InputAddonSelectProps {
  /** ARIA label for the trigger button */
  ariaLabel: string;
  /** Dropdown options for the addon select */
  options: InputAddonSelectOption[];
  /** Input size token to keep spacing/icon rhythm aligned with parent Input */
  size?: InputSize;
  /** Addon placement to map outer/inner paddings correctly */
  position?: AddonPosition;
  /** Controlled selected value */
  value?: string | null;
  /** Uncontrolled default value */
  defaultValue?: string | null;
  /** Called when selection changes */
  onValueChange?: (value: string | null) => void;
  /** Optional form name */
  name?: string;
  /** Popup offset from trigger */
  sideOffset?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Optional className for the trigger */
  className?: string;
}

export function InputAddonSelect({
  ariaLabel,
  className,
  defaultValue,
  disabled,
  name,
  onValueChange,
  options,
  position = "leading",
  sideOffset = 8,
  size = "md",
  value,
}: InputAddonSelectProps) {
  const config = getInputConfig(size);
  const selectActionsRef = useRef<{ unmount: () => void } | null>(null);
  const indicatorSizeBySize: Record<FieldSize, string> = {
    xl: "var(--select-indicator-size-xl)",
    lg: "var(--select-indicator-size-lg)",
    md: "var(--select-indicator-size-md)",
  };
  const indicatorSize = indicatorSizeBySize[size];
  const triggerStyle: React.CSSProperties = {
    gap: config.contentGap,
  };

  return (
    <Select.Root
      actionsRef={selectActionsRef}
      defaultValue={defaultValue ?? undefined}
      disabled={disabled}
      modal={false}
      name={name}
      onValueChange={onValueChange}
      value={value}
    >
      <Select.Trigger
        aria-label={ariaLabel}
        className={cn(
          "group/input-addon relative flex h-full min-w-0 items-center text-left outline-none",
          config.textClass,
          className
        )}
        data-input-addon-interactive="true"
        style={triggerStyle}
      >
        <Select.Value className="truncate text-text-high" />
        <Select.Icon
          className={cn(
            "inline-flex shrink-0 items-center justify-center text-text-medium",
            "transition-transform duration-150 ease-out motion-reduce:transition-none",
            "group-[[data-popup-open]]/input-addon:rotate-180"
          )}
        >
          <ChevronDown
            absoluteStrokeWidth
            style={config.addonSelectIconStyle}
          />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner
          alignItemWithTrigger={false}
          className="z-50"
          disableAnchorTracking
          side="bottom"
          sideOffset={sideOffset}
        >
          <Select.Popup
            className={cn(
              "origin-[var(--transform-origin)]",
              "rounded-[var(--select-popup-radius)]",
              "border border-[var(--select-popup-border)]",
              "bg-[var(--select-popup-bg)]",
              "shadow-[var(--select-popup-shadow)]",
              "p-[var(--select-popup-padding)]",
              "min-w-[var(--anchor-width)]",
              "max-h-[var(--available-height)]",
              "overflow-y-auto outline-none",
              "transform-gpu will-change-[transform,opacity]",
              "transition-[transform,opacity] duration-[140ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
              "data-[starting-style]:scale-[0.985] data-[starting-style]:opacity-0",
              "data-[ending-style]:scale-[0.985] data-[ending-style]:opacity-0",
              "motion-reduce:transition-none"
            )}
          >
            <Select.List>
              {options.map((option) => (
                <Select.Item
                  className={cn(
                    "relative flex min-h-9 cursor-pointer select-none items-center rounded-[var(--select-item-radius)] px-2 py-1.5 outline-none",
                    "data-[highlighted]:bg-[var(--select-item-highlight-bg)]",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
                    "[@media(pointer:coarse)]:min-h-11",
                    config.textClass
                  )}
                  disabled={option.disabled}
                  key={option.value}
                  style={{
                    paddingRight:
                      "calc(0.5rem + var(--select-item-indicator-slot) + var(--select-item-indicator-gap))",
                  }}
                  value={option.value}
                >
                  <Select.ItemText className="block min-w-0 truncate text-text-extra-high">
                    {option.label}
                  </Select.ItemText>

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-2 inline-flex -translate-y-1/2 items-center justify-center"
                    style={{
                      width: "var(--select-item-indicator-slot)",
                      height: "var(--select-item-indicator-slot)",
                    }}
                  >
                    <Select.ItemIndicator className="inline-flex items-center justify-center">
                      <Check
                        absoluteStrokeWidth
                        className="text-text-extra-high"
                        style={{
                          width: indicatorSize,
                          height: indicatorSize,
                        }}
                      />
                    </Select.ItemIndicator>
                  </span>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

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
      hint,
      leadingAddon,
      leadingAddonKind = "static",
      trailingAddon,
      trailingAction,
      trailingAddonKind = "static",
      disabled,
      inputClassName,
      className,
      ...props
    },
    ref
  ) => {
    const config = getInputConfig(size);
    const hasField = label || description || error;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const hasWarnedTrailingActionRef = useRef(false);

    warnTrailingActionConflict({
      hasWarnedRef: hasWarnedTrailingActionRef,
      trailingAction,
      trailingAddon,
    });

    const {
      addon: resolvedTrailingAddon,
      content: resolvedTrailingAddonContent,
      kind: resolvedTrailingAddonKind,
    } = resolveTrailingSlot({
      trailingAction,
      trailingAddon,
      trailingAddonKind,
    });

    const handleInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        setForwardedRef(ref, node);
      },
      [ref]
    );

    const handleWrapperPointerDown = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (disabled || event.button !== 0) {
          return;
        }

        if (!(event.target instanceof Element)) {
          return;
        }

        if (event.target.closest(INTERACTIVE_TARGET_SELECTOR)) {
          return;
        }

        event.preventDefault();
        inputRef.current?.focus();
      },
      [disabled]
    );

    const contentStyle: React.CSSProperties = {
      gap: config.contentGap,
      paddingLeft: leadingAddon
        ? config.addonInnerPadding
        : config.contentPaddingX,
      paddingRight: resolvedTrailingAddon
        ? config.addonInnerPadding
        : config.contentPaddingX,
    };

    const inputWrapper = (
      <div
        className={cn(
          "group/input relative flex items-center",
          !disabled && "cursor-text",
          disabled && "pointer-events-none opacity-40",
          className
        )}
        onPointerDown={handleWrapperPointerDown}
        style={config.wrapperStyle}
      >
        {/* Border layer */}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit]",
            "border-[length:var(--input-border-width)]",
            "border-[var(--input-border-idle)]",
            "bg-[var(--input-bg-idle)]",
            "ease transition-[border-color,background-color] duration-150",
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

        {leadingAddon && (
          <>
            <AddonWrapper
              innerPaddingX={config.addonInnerPadding}
              kind={leadingAddonKind}
              outerPaddingX={config.contentPaddingX}
              position="leading"
              textClass={config.textClass}
            >
              {leadingAddonKind === "interactive"
                ? normalizeInteractiveAddonControl(leadingAddon)
                : leadingAddon}
            </AddonWrapper>
            <AddonDivider />
          </>
        )}

        {/* Inner content area controls text/icon rhythm and divider-side inset */}
        <span
          className="flex min-w-0 flex-1 items-center self-stretch"
          style={contentStyle}
        >
          {iconLeft && (
            <IconWrapper style={config.iconStyle}>{iconLeft}</IconWrapper>
          )}

          <BaseInput
            className={cn(
              "m-0 h-full w-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 leading-[var(--input-text-line-height)] outline-none",
              "text-text-extra-high placeholder:text-[var(--input-placeholder-color)]",
              "autofill-transparent",
              config.textClass,
              inputClassName
            )}
            disabled={disabled}
            ref={handleInputRef}
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
        </span>

        {resolvedTrailingAddonContent && (
          <>
            <AddonDivider />
            <AddonWrapper
              innerPaddingX={config.addonInnerPadding}
              kind={resolvedTrailingAddonKind}
              outerPaddingX={config.contentPaddingX}
              position="trailing"
              textClass={config.textClass}
            >
              {resolvedTrailingAddonContent}
            </AddonWrapper>
          </>
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
          <div className="flex items-center gap-1">
            <Field.Label
              className={cn("font-medium text-text-high", config.labelClass)}
            >
              {label}
            </Field.Label>
            {hint && (
              <Tooltip content={hint}>
                <button
                  aria-label="More information"
                  className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-sm text-text-low transition-colors hover:text-text-medium motion-reduce:transition-none"
                  type="button"
                >
                  <CircleHelp
                    style={{
                      width: config.hintIconSize,
                      height: config.hintIconSize,
                    }}
                  />
                </button>
              </Tooltip>
            )}
          </div>
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
