import { Field } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
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
  useState,
} from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";

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

type FieldSize = "xl" | "lg" | "md";
type InputSize = FieldSize;
type AddonKind = "static" | "interactive";
type AddonPosition = "leading" | "trailing";

interface FieldSizeConfig {
  actionGap: string;
  addonInnerPadding: string;
  contentGap: string;
  contentPaddingX: string;
  descriptionClass: string;
  height: string;
  hintIconSize: string;
  iconSize: string;
  labelClass: string;
  radius: string;
  textClass: string;
}

const fieldSizeConfigs: Record<FieldSize, FieldSizeConfig> = {
  xl: {
    height: "var(--input-height-xl)",
    radius: "var(--input-radius-xl)",
    contentGap: "var(--input-gap-xl)",
    contentPaddingX: "var(--input-padding-x-xl)",
    addonInnerPadding: "var(--input-addon-inner-xl)",
    actionGap: "var(--input-action-gap-xl)",
    iconSize: "var(--input-icon-xl)",
    textClass: "text-[length:var(--input-text-size-xl)]",
    labelClass: "text-[length:var(--input-label-size-xl)]",
    descriptionClass: "text-[length:var(--input-description-size-xl)]",
    hintIconSize: "var(--input-hint-icon-xl)",
  },
  lg: {
    height: "var(--input-height-lg)",
    radius: "var(--input-radius-lg)",
    contentGap: "var(--input-gap-lg)",
    contentPaddingX: "var(--input-padding-x-lg)",
    addonInnerPadding: "var(--input-addon-inner-lg)",
    actionGap: "var(--input-action-gap-lg)",
    iconSize: "var(--input-icon-lg)",
    textClass: "text-[length:var(--input-text-size-lg)]",
    labelClass: "text-[length:var(--input-label-size-lg)]",
    descriptionClass: "text-[length:var(--input-description-size-lg)]",
    hintIconSize: "var(--input-hint-icon-lg)",
  },
  md: {
    height: "var(--input-height-md)",
    radius: "var(--input-radius-md)",
    contentGap: "var(--input-gap-md)",
    contentPaddingX: "var(--input-padding-x-md)",
    addonInnerPadding: "var(--input-addon-inner-md)",
    actionGap: "var(--input-action-gap-md)",
    iconSize: "var(--input-icon-md)",
    textClass: "text-[length:var(--input-text-size-md)]",
    labelClass: "text-[length:var(--input-label-size-md)]",
    descriptionClass: "text-[length:var(--input-description-size-md)]",
    hintIconSize: "var(--input-hint-icon-md)",
  },
};

/**
 * Use `NumberInput` for numeric inputs that require spinbutton semantics,
 * and stepped keyboard interactions.
 */
export interface TextInputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "size"> {
  /** Interactive element (e.g., copy button) displayed at the trailing edge */
  action?: ReactNode;
  /** Helper text rendered below the input */
  description?: string;
  /** Error message — replaces description when present */
  error?: string;
  /** Tooltip hint shown via info icon next to the label */
  hint?: string;
  /** Icon element displayed before the input */
  iconLeft?: ReactNode;
  /** Icon element displayed after the input */
  iconRight?: ReactNode;
  /** Additional class names applied directly to the native input element. */
  inputClassName?: string;
  /** Label text rendered above the input */
  label?: string;
  /** Leading addon with divider (dropdown, static text, etc.) */
  leadingAddon?: ReactNode;
  /** Leading addon behavior mode. Interactive mode makes the full segment clickable. */
  leadingAddonKind?: AddonKind;
  /** Size preset: XL=48px, LG=40px, MD=36px */
  size?: InputSize;
  /** First-class trailing interactive control (e.g., "Copy address"). Wins over trailingAddon when both are provided. */
  trailingAction?: ReactNode;
  /** Trailing addon with divider (dropdown, button, etc.) */
  trailingAddon?: ReactNode;
  /** Trailing addon behavior mode. Interactive mode makes the full segment clickable. */
  trailingAddonKind?: AddonKind;
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
  const fc = fieldSizeConfigs[size];
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
    addonSelectIconStyle: {
      ...addonSelectIconSizes[size],
    } as React.CSSProperties,
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

const AddonWrapper = ({
  children,
  position,
  outerPaddingX,
  innerPaddingX,
  kind,
  textClass,
  isAction,
  innerRadius,
}: {
  children: ReactNode;
  position: AddonPosition;
  outerPaddingX: string;
  innerPaddingX: string;
  kind: AddonKind;
  textClass: string;
  isAction?: boolean;
  innerRadius?: string;
}) => (
  <span
    className={cn(
      "relative z-10 flex shrink-0 items-center self-stretch leading-[var(--input-text-line-height)]",
      textClass,
      kind === "static" ? "text-text-low" : "text-text-high",
      isAction && [
        "cursor-pointer",
        "ease transition-[background-color] duration-150",
        "motion-reduce:transition-none",
        "hover:bg-[var(--input-addon-hover-bg)]",
        "has-[:focus-visible]:bg-[var(--input-addon-hover-bg)]",
      ]
    )}
    data-input-addon-interactive={kind === "interactive" ? "true" : undefined}
    style={{
      paddingLeft:
        position === "leading"
          ? outerPaddingX
          : kind === "static"
            ? "0"
            : innerPaddingX,
      paddingRight:
        position === "leading"
          ? kind === "static"
            ? "0"
            : innerPaddingX
          : outerPaddingX,
      ...(isAction && innerRadius
        ? {
            borderRadius:
              position === "leading"
                ? `${innerRadius} 0 0 ${innerRadius}`
                : `0 ${innerRadius} ${innerRadius} 0`,
          }
        : {}),
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
      isAction: true,
    };
  }

  return {
    addon: trailingAddon,
    content:
      trailingAddonKind === "interactive"
        ? normalizeInteractiveAddonControl(trailingAddon)
        : trailingAddon,
    kind: trailingAddonKind,
    isAction: false,
  };
};

function addonSidePadding(
  hasAddon: boolean,
  kind: AddonKind,
  config: ReturnType<typeof getInputConfig>,
  isAction = false
) {
  if (!hasAddon) return config.contentPaddingX;
  if (isAction) return config.contentGap;
  return kind === "static"
    ? `calc(${config.contentGap} / 2)`
    : config.addonInnerPadding;
}

function getContentStyle(
  config: ReturnType<typeof getInputConfig>,
  opts: {
    hasLeading: boolean;
    leadingKind: AddonKind;
    hasTrailing: boolean;
    trailingKind: AddonKind;
    trailingIsAction?: boolean;
  }
): React.CSSProperties {
  return {
    gap: config.contentGap,
    paddingLeft: addonSidePadding(opts.hasLeading, opts.leadingKind, config),
    paddingRight: addonSidePadding(
      opts.hasTrailing,
      opts.trailingKind,
      config,
      opts.trailingIsAction
    ),
  };
}

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
      "TextInput: received both `trailingAction` and `trailingAddon`; `trailingAction` takes precedence."
    );
    hasWarnedRef.current = true;
  }
};

export interface AddonSelectOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface AddonSelectProps {
  /** ARIA label for the select */
  ariaLabel: string;
  /** Optional className for the wrapper */
  className?: string;
  /** Uncontrolled default value */
  defaultValue?: string | null;
  /** Disabled state */
  disabled?: boolean;
  /** Optional form name */
  name?: string;
  /** Called when selection changes */
  onValueChange?: (value: string | null) => void;
  /** Dropdown options for the addon select */
  options: AddonSelectOption[];
  /** Addon placement to map outer/inner paddings correctly */
  position?: AddonPosition;
  /** Input size token to keep spacing/icon rhythm aligned with parent Input */
  size?: InputSize;
  /** Controlled selected value */
  value?: string | null;
}

export function AddonSelect({
  ariaLabel,
  className,
  defaultValue,
  disabled,
  name,
  onValueChange,
  options,
  position = "leading",
  size = "md",
  value,
}: AddonSelectProps) {
  const config = getInputConfig(size);

  // Track internal value for label display in uncontrolled mode
  const isControlled = value !== undefined && value !== null;
  const [internalValue, setInternalValue] = useState(
    () => defaultValue ?? options[0]?.value ?? ""
  );
  const currentValue = isControlled ? value : internalValue;
  const selectedLabel =
    options.find((o) => o.value === currentValue)?.label ??
    String(currentValue ?? "");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  // Extend into AddonWrapper's padding so overlay covers the full addon segment
  const padLeft =
    position === "leading" ? config.contentPaddingX : config.addonInnerPadding;
  const padRight =
    position === "leading" ? config.addonInnerPadding : config.contentPaddingX;
  const innerRadius = `calc(${config.radius} - var(--input-border-width))`;

  return (
    <span
      className={cn(
        "group/addon relative flex items-center self-stretch",
        "cursor-pointer",
        "ease transition-[background-color] duration-150",
        "motion-reduce:transition-none",
        "has-[select:hover]:bg-[var(--input-addon-hover-bg)]",
        "has-[select:focus-visible]:bg-[var(--input-addon-hover-bg)]",
        className
      )}
      data-input-addon-interactive="true"
      style={{
        gap: config.contentGap,
        marginLeft: `calc(-1 * ${padLeft})`,
        marginRight: `calc(-1 * ${padRight})`,
        paddingLeft: padLeft,
        paddingRight: padRight,
        borderRadius:
          position === "leading"
            ? `${innerRadius} 0 0 ${innerRadius}`
            : `0 ${innerRadius} ${innerRadius} 0`,
      }}
    >
      {/* Display label — pointer-events-none, clicks pass through to select */}
      <span
        className={cn(
          "pointer-events-none select-none text-text-high",
          config.textClass
        )}
      >
        {selectedLabel}
      </span>

      {/* Chevron indicator */}
      <ChevronDownIcon
        className="pointer-events-none shrink-0 text-text-medium"
        style={config.addonSelectIconStyle}
      />

      {/* Invisible native select — covers full addon area for click/touch */}
      <select
        aria-label={ariaLabel}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none border-0 bg-transparent opacity-0 outline-none"
        defaultValue={isControlled ? undefined : (defaultValue ?? undefined)}
        disabled={disabled}
        name={name}
        onChange={handleChange}
        value={isControlled ? (value ?? undefined) : undefined}
      >
        {options.map((opt) => (
          <option disabled={opt.disabled} key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </span>
  );
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
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
      isAction: resolvedTrailingIsAction,
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

    const contentStyle = getContentStyle(config, {
      hasLeading: !!leadingAddon,
      leadingKind: leadingAddonKind,
      hasTrailing: !!resolvedTrailingAddon,
      trailingKind: resolvedTrailingAddonKind,
      trailingIsAction: resolvedTrailingIsAction,
    });

    const trailingOuterPaddingX = resolvedTrailingIsAction
      ? config.addonInnerPadding
      : config.contentPaddingX;

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
              "m-0 w-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 leading-[var(--input-text-line-height)] outline-none",
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
          <AddonWrapper
            innerPaddingX={
              resolvedTrailingIsAction
                ? config.contentGap
                : config.addonInnerPadding
            }
            innerRadius={
              resolvedTrailingIsAction
                ? `calc(${config.radius} - var(--input-border-width))`
                : undefined
            }
            isAction={resolvedTrailingIsAction}
            kind={resolvedTrailingAddonKind}
            outerPaddingX={trailingOuterPaddingX}
            position="trailing"
            textClass={config.textClass}
          >
            {resolvedTrailingAddonContent}
          </AddonWrapper>
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
                  className="inline-flex items-center justify-center rounded-sm text-text-low transition-colors hover:text-text-medium motion-reduce:transition-none"
                  style={{
                    padding: `calc((1.5rem - ${config.hintIconSize}) / 2)`,
                    margin: `calc(-1 * (1.5rem - ${config.hintIconSize}) / 2)`,
                  }}
                  type="button"
                >
                  <QuestionMarkCircleIcon
                    style={
                      {
                        width: config.hintIconSize,
                        height: config.hintIconSize,
                      } as React.CSSProperties
                    }
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

TextInput.displayName = "TextInput";
