import { Field } from "@base-ui/react/field";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
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

const setForwardedRef = <T,>(
  ref: React.Ref<T> | undefined,
  value: T | null
) => {
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  if (ref && "current" in ref) {
    ref.current = value;
  }
};

export type NumberFieldSize = FieldSize;

type AddonKind = "static" | "interactive";
type AddonPosition = "leading" | "trailing";

type BaseNumberFieldRootProps = Omit<
  React.ComponentPropsWithoutRef<typeof BaseNumberField.Root>,
  "children" | "className" | "style" | "disabled" | "onPointerDown" | "inputRef"
>;

export interface NumberFieldProps extends BaseNumberFieldRootProps {
  /** Size preset: XL=48px, LG=40px, MD=36px */
  size?: NumberFieldSize;
  /** Label text rendered above the number field */
  label?: string;
  /** Helper text rendered below the number field */
  description?: string;
  /** Error message — replaces description when present */
  error?: string;
  /** Tooltip hint shown via info icon next to the label */
  hint?: string;
  /** Placeholder text rendered in the number input */
  placeholder?: string;
  /** Disables interaction and reduces opacity */
  disabled?: boolean;
  /** Forwarded className applied to the outer wrapper */
  className?: string;
  /** Ref to the interactive text input element */
  inputRef?: React.Ref<HTMLInputElement>;
  /** Leading addon with divider (dropdown, static text, etc.) */
  leadingAddon?: ReactNode;
  /** Trailing addon with divider (dropdown, button, etc.) */
  trailingAddon?: ReactNode;
  /** First-class trailing interactive control. Wins over trailingAddon when both are provided. */
  trailingAction?: ReactNode;
  /** Leading addon behavior mode. Interactive mode makes the full segment clickable. */
  leadingAddonKind?: AddonKind;
  /** Trailing addon behavior mode. Interactive mode makes the full segment clickable. */
  trailingAddonKind?: AddonKind;
}

function getNumberFieldConfig(size: FieldSize) {
  const fc = getFieldSizeConfig(size);
  return {
    ...fc,
    wrapperStyle: {
      height: fc.height,
      borderRadius: fc.radius,
    } as React.CSSProperties,
  };
}

const AddonDivider = () => (
  <span
    className={cn(
      "shrink-0 self-stretch",
      "bg-[var(--input-border-idle)]",
      "transition-[background-color] duration-150 ease-out",
      "motion-reduce:transition-none",
      "group-[:not(:focus-within)]/number-field:group-hover/number-field:bg-[var(--input-border-hover)]",
      "group-focus-within/number-field:bg-[var(--input-border-focus)]"
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
      kind === "static" ? "text-text-low" : "text-text-high"
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

function addonSidePadding(
  hasAddon: boolean,
  kind: AddonKind,
  config: ReturnType<typeof getNumberFieldConfig>
) {
  if (!hasAddon) return config.contentPaddingX;
  return kind === "static"
    ? `calc(${config.contentGap} / 2)`
    : config.addonInnerPadding;
}

function getContentStyle(
  config: ReturnType<typeof getNumberFieldConfig>,
  opts: {
    hasLeading: boolean;
    leadingKind: AddonKind;
    hasTrailing: boolean;
    trailingKind: AddonKind;
  }
): React.CSSProperties {
  return {
    gap: config.contentGap,
    paddingLeft: addonSidePadding(opts.hasLeading, opts.leadingKind, config),
    paddingRight: addonSidePadding(opts.hasTrailing, opts.trailingKind, config),
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
    console.warn(
      "NumberField: received both `trailingAction` and `trailingAddon`; `trailingAction` takes precedence."
    );
    hasWarnedRef.current = true;
  }
};

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      size = "md",
      label,
      description,
      error,
      hint,
      placeholder,
      disabled,
      className,
      inputRef,
      leadingAddon,
      leadingAddonKind = "static",
      trailingAddon,
      trailingAction,
      trailingAddonKind = "static",
      step = 0.01,
      smallStep = 0.01,
      largeStep = 1,
      allowWheelScrub = false,
      ...rootProps
    },
    ref
  ) => {
    const config = getNumberFieldConfig(size);
    const hasField = label || description || error;
    const numberInputRef = useRef<HTMLInputElement | null>(null);
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
        numberInputRef.current = node;
        setForwardedRef(ref, node);
        setForwardedRef(inputRef, node);
      },
      [inputRef, ref]
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
        numberInputRef.current?.focus();
      },
      [disabled]
    );

    const contentStyle = getContentStyle(config, {
      hasLeading: !!leadingAddon,
      leadingKind: leadingAddonKind,
      hasTrailing: !!resolvedTrailingAddon,
      trailingKind: resolvedTrailingAddonKind,
    });

    const numberFieldWrapper = (
      <BaseNumberField.Root
        allowWheelScrub={allowWheelScrub}
        className={cn(
          "group/number-field relative flex items-center",
          !disabled && "cursor-text",
          disabled && "pointer-events-none opacity-40",
          className
        )}
        disabled={disabled}
        inputRef={handleInputRef}
        largeStep={largeStep}
        onPointerDown={handleWrapperPointerDown}
        smallStep={smallStep}
        step={step}
        style={config.wrapperStyle}
        {...rootProps}
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
            "group-[:not(:focus-within)]/number-field:group-hover/number-field:border-[var(--input-border-hover)]",
            "group-[:not(:focus-within)]/number-field:group-hover/number-field:bg-[var(--input-bg-hover)]",
            "group-focus-within/number-field:border-[var(--input-border-focus)]",
            error && "border-[var(--input-border-error)]"
          )}
        />

        {/* Focus ring — instant on, 150ms ease-out exit */}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit]",
            "shadow-[0_0_0_2px_var(--input-focus-ring)]",
            "opacity-0 transition-opacity duration-150 ease-out",
            "group-focus-within/number-field:opacity-100 group-focus-within/number-field:duration-0",
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
            {leadingAddonKind === "interactive" && <AddonDivider />}
          </>
        )}

        <span
          className="flex min-w-0 flex-1 items-center self-stretch"
          style={contentStyle}
        >
          <BaseNumberField.Input
            className={cn(
              "m-0 w-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 leading-[var(--input-text-line-height)] outline-none",
              "text-text-extra-high placeholder:text-[var(--input-placeholder-color)]",
              config.textClass
            )}
            placeholder={placeholder}
          />
        </span>

        {resolvedTrailingAddonContent && (
          <>
            {resolvedTrailingAddonKind === "interactive" && <AddonDivider />}
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
      </BaseNumberField.Root>
    );

    if (!hasField) return numberFieldWrapper;

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
                  className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-sm text-text-low transition-colors hover:text-text-medium"
                  type="button"
                >
                  <QuestionMarkCircleIcon
                    style={
                      {
                        width: config.hintIconSize,
                        height: config.hintIconSize,
                        "--icon-stroke-width": config.hintIconStrokeWidth,
                      } as React.CSSProperties
                    }
                  />
                </button>
              </Tooltip>
            )}
          </div>
        )}
        {numberFieldWrapper}
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

NumberField.displayName = "NumberField";
