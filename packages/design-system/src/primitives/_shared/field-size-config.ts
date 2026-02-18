export type FieldSize = "xl" | "lg" | "md";

export interface FieldSizeConfig {
  height: string;
  radius: string;
  contentGap: string;
  contentPaddingX: string;
  addonInnerPadding: string;
  actionGap: string;
  iconSize: string;
  textClass: string;
  labelClass: string;
  descriptionClass: string;
  hintIconSize: string;
}

const configs: Record<FieldSize, FieldSizeConfig> = {
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

export function getFieldSizeConfig(size: FieldSize): FieldSizeConfig {
  return configs[size];
}
