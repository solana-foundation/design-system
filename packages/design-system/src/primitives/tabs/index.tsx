import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import { cn } from "../../utils";

// =============================================================================
// Types
// =============================================================================

type TabsVariant = "underline" | "pill" | "enclosed";
type TabsSize = "sm" | "md";

interface TabsContextValue {
  variant: TabsVariant;
  size: TabsSize;
  orientation: "horizontal" | "vertical";
  fullWidth: boolean;
  bordered: boolean;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab components must be used within <Tabs>");
  return ctx;
}

// =============================================================================
// Size config
// =============================================================================

const tabsSizeConfig = {
  sm: {
    textClass: "text-button-sm",
    paddingX: "12px",
    paddingTop: "6px",
    paddingBottom: "10px",
    gap: "6px",
    iconSize: "14px",
  },
  md: {
    textClass: "text-button-md",
    paddingX: "16px",
    paddingTop: "8px",
    paddingBottom: "12px",
    gap: "8px",
    iconSize: "16px",
  },
} as const;

// =============================================================================
// Tabs (root)
// =============================================================================

export interface TabsProps {
  /** Visual style variant */
  variant?: TabsVariant;
  /** Size preset */
  size?: TabsSize;
  /** Tab layout direction */
  orientation?: "horizontal" | "vertical";
  /** Stretch tabs to fill container width */
  fullWidth?: boolean;
  /** Add border along the list edge (underline "line" sub-style) */
  bordered?: boolean;
  /** Controlled active tab value */
  value?: string;
  /** Initial active tab value (uncontrolled) */
  defaultValue?: string;
  /** Callback when active tab changes */
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  variant = "underline",
  size = "md",
  orientation = "horizontal",
  fullWidth = false,
  bordered = false,
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const ctxValue = useMemo(
    () => ({ variant, size, orientation, fullWidth, bordered }),
    [variant, size, orientation, fullWidth, bordered]
  );

  return (
    <TabsContext.Provider value={ctxValue}>
      <BaseTabs.Root
        className={cn(
          "flex",
          orientation === "vertical" ? "flex-row gap-4" : "flex-col",
          className
        )}
        defaultValue={defaultValue}
        onValueChange={
          onValueChange
            ? (val: string | number | null) => {
                if (val != null) onValueChange(String(val));
              }
            : undefined
        }
        orientation={orientation}
        value={value}
      >
        {children}
      </BaseTabs.Root>
    </TabsContext.Provider>
  );
}

Tabs.displayName = "Tabs";

// =============================================================================
// TabList
// =============================================================================

export interface TabListProps {
  children: ReactNode;
  className?: string;
}

export function TabList({ children, className }: TabListProps) {
  const { variant, orientation, fullWidth, bordered } = useTabsContext();
  const isHorizontal = orientation === "horizontal";

  return (
    <BaseTabs.List
      className={cn(
        "relative flex",
        isHorizontal ? "flex-row" : "flex-col",
        // Variant-specific list styles
        variant === "pill" &&
          "rounded-lg bg-black/[0.04] p-0.5 dark:bg-white/[0.08]",
        variant === "underline" &&
          bordered &&
          (isHorizontal
            ? "shadow-[inset_0_-1px_0_0_var(--color-border-light)]"
            : "shadow-[inset_-1px_0_0_0_var(--color-border-light)]"),
        variant === "enclosed" &&
          (isHorizontal
            ? "shadow-[inset_0_-1px_0_0_var(--color-border-light)]"
            : "shadow-[inset_-1px_0_0_0_var(--color-border-light)]"),
        fullWidth && "w-full",
        className
      )}
    >
      {children}
      <TabIndicator />
    </BaseTabs.List>
  );
}

TabList.displayName = "TabList";

// =============================================================================
// TabIndicator (internal — rendered inside TabList)
// =============================================================================

function TabIndicator() {
  const { variant, orientation } = useTabsContext();
  const isHorizontal = orientation === "horizontal";

  // Position via Base UI CSS variables + translate for GPU acceleration
  const style: React.CSSProperties = isHorizontal
    ? {
        left: 0,
        translate: "var(--active-tab-left) 0",
        width: "var(--active-tab-width)",
      }
    : {
        top: 0,
        translate: "0 var(--active-tab-top)",
        height: "var(--active-tab-height)",
      };

  return (
    <BaseTabs.Indicator
      className={cn(
        "absolute",
        // Smooth transition
        "transition-[translate,width,height] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)]",
        "motion-reduce:transition-none",
        // Underline variant
        variant === "underline" &&
          (isHorizontal
            ? "bottom-0 h-0.5 rounded-full bg-text-extra-high"
            : "left-0 w-0.5 rounded-full bg-text-extra-high"),
        // Pill variant (matches SegmentControl)
        variant === "pill" &&
          "rounded-md bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.07)] dark:bg-gray-100",
        variant === "pill" &&
          (isHorizontal ? "top-0.5 bottom-0.5" : "right-0.5 left-0.5"),
        // Enclosed variant
        variant === "enclosed" &&
          "rounded-t-md border border-border-light bg-white dark:bg-gray-100",
        variant === "enclosed" &&
          (isHorizontal
            ? "top-0 -bottom-px border-b-transparent"
            : "-right-px left-0 border-r-transparent")
      )}
      style={style}
    />
  );
}

// =============================================================================
// Tab
// =============================================================================

export interface TabProps {
  /** Unique value identifying this tab */
  value: string;
  /** Disable this tab */
  disabled?: boolean;
  /** Icon to display before the label */
  icon?: ReactNode;
  /** Badge content (number or text) */
  badge?: ReactNode;
  /** Tab label */
  children: ReactNode;
  className?: string;
}

export function Tab({
  value,
  disabled,
  icon,
  badge,
  children,
  className,
}: TabProps) {
  const { size, fullWidth } = useTabsContext();
  const config = tabsSizeConfig[size];

  return (
    <BaseTabs.Tab
      className={cn(
        "relative z-10 inline-flex items-center justify-center",
        config.textClass,
        // Colors
        "text-text-low",
        "data-[selected]:text-text-extra-high",
        "hover:text-text-medium data-[selected]:hover:text-text-extra-high",
        // Transitions
        "transition-colors duration-150 ease-out",
        "motion-reduce:transition-none",
        // Focus
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--button-focus-ring)]",
        // Disabled
        disabled && "pointer-events-none opacity-40",
        // Cursor
        !disabled && "cursor-pointer",
        // Full width
        fullWidth && "flex-1",
        className
      )}
      disabled={disabled}
      style={{
        paddingLeft: config.paddingX,
        paddingRight: config.paddingX,
        paddingTop: config.paddingTop,
        paddingBottom: config.paddingBottom,
        gap: config.gap,
      }}
      value={value}
    >
      {icon && (
        <span
          className="inline-flex shrink-0 items-center justify-center [&_svg]:size-full"
          style={{ width: config.iconSize, height: config.iconSize }}
        >
          {icon}
        </span>
      )}
      <span>{children}</span>
      {badge != null && (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full",
            "bg-black/[0.08] dark:bg-white/[0.12]",
            "tabular-nums leading-none",
            size === "sm"
              ? "h-[18px] min-w-[18px] px-1.5 text-[11px]"
              : "h-[20px] min-w-[20px] px-2 text-[12px]"
          )}
        >
          {badge}
        </span>
      )}
    </BaseTabs.Tab>
  );
}

Tab.displayName = "Tab";

// =============================================================================
// TabPanel
// =============================================================================

export interface TabPanelProps {
  /** Value matching the corresponding Tab */
  value: string;
  /** Keep panel in DOM when not active */
  keepMounted?: boolean;
  children: ReactNode;
  className?: string;
}

export function TabPanel({
  value,
  keepMounted,
  children,
  className,
}: TabPanelProps) {
  return (
    <BaseTabs.Panel
      className={cn("pt-4 focus-visible:outline-none", className)}
      keepMounted={keepMounted}
      value={value}
    >
      {children}
    </BaseTabs.Panel>
  );
}

TabPanel.displayName = "TabPanel";
