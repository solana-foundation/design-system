import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import { cn } from "../../utils";

// =============================================================================
// Types
// =============================================================================

type TabsSize = "sm" | "md";

interface TabsContextValue {
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
    textSize: "var(--text-button-sm)",
    paddingX: "var(--tab-padding-x-sm)",
    paddingY: "var(--tab-padding-y-sm)",
    gap: "var(--tab-gap-sm)",
    iconSize: "var(--tab-icon-sm)",
  },
  md: {
    textSize: "var(--text-button-md)",
    paddingX: "var(--tab-padding-x-md)",
    paddingY: "var(--tab-padding-y-md)",
    gap: "var(--tab-gap-md)",
    iconSize: "var(--tab-icon-md)",
  },
} as const;

// =============================================================================
// Tabs (root)
// =============================================================================

export interface TabsProps {
  /** Size preset */
  size?: TabsSize;
  /** Tab layout direction */
  orientation?: "horizontal" | "vertical";
  /** Stretch tabs to fill container width */
  fullWidth?: boolean;
  /** Add border along the list edge */
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
  size = "md",
  orientation = "horizontal",
  fullWidth = false,
  bordered,
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const effectiveBordered = bordered ?? orientation === "horizontal";
  const ctxValue = useMemo(
    () => ({ size, orientation, fullWidth, bordered: effectiveBordered }),
    [size, orientation, fullWidth, effectiveBordered]
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
  const { orientation, fullWidth, bordered } = useTabsContext();
  const isHorizontal = orientation === "horizontal";

  return (
    <BaseTabs.List
      className={cn(
        "relative flex",
        isHorizontal ? "flex-row" : "flex-col",
        bordered &&
          (isHorizontal
            ? "shadow-[inset_0_-1px_0_var(--color-border-light)]"
            : "shadow-[inset_-1px_0_0_var(--color-border-light)]"),
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
  const { orientation, size } = useTabsContext();
  const isHorizontal = orientation === "horizontal";
  const config = tabsSizeConfig[size];

  const style: React.CSSProperties = isHorizontal
    ? {
        left: 0,
        translate: `calc(var(--active-tab-left) + ${config.paddingX}) 0`,
        width: `calc(var(--active-tab-width) - 2 * ${config.paddingX})`,
      }
    : {
        top: 0,
        translate: `0 calc(var(--active-tab-top) + ${config.paddingY})`,
        height: `calc(var(--active-tab-height) - 2 * ${config.paddingY})`,
      };

  return (
    <BaseTabs.Indicator
      className={cn(
        "absolute bg-[var(--tab-indicator-color)]",
        "transition-[translate,width,height] duration-200 ease-out",
        "motion-reduce:transition-none",
        isHorizontal
          ? "bottom-0 h-[var(--tab-indicator-height)]"
          : "left-0 w-[var(--tab-indicator-height)]"
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
        "leading-none tracking-wide",
        "font-[number:var(--tab-weight-idle)]",
        "data-[selected]:font-[number:var(--tab-weight-active)]",
        "transition-[color,font-weight] duration-150 ease-out",
        "motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--button-focus-ring)]",
        disabled
          ? "pointer-events-none text-[var(--tab-text-disabled)]"
          : cn(
              "cursor-pointer",
              "text-[var(--tab-text-idle)]",
              "hover:text-[var(--tab-text-hover)]",
              "data-[selected]:text-[var(--tab-text-active)]"
            ),
        fullWidth && "flex-1",
        className
      )}
      disabled={disabled}
      style={{
        fontSize: config.textSize,
        paddingLeft: config.paddingX,
        paddingRight: config.paddingX,
        paddingTop: config.paddingY,
        paddingBottom: config.paddingY,
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
            "bg-[var(--tab-badge-bg)] text-[var(--tab-badge-text)]",
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
