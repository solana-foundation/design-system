import type { Meta, StoryObj } from "@storybook/react";
import { Squircle, SQUIRCLE_RADIUS, IOS_CORNER_SMOOTHING } from "./index";

const meta: Meta<typeof Squircle> = {
  title: "Primitives/Squircle",
  component: Squircle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    cornerRadius: {
      control: "select",
      options: [...Object.keys(SQUIRCLE_RADIUS), 20, 32],
      description: "Corner radius - preset token or number in pixels",
    },
    cornerSmoothing: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Corner smoothing amount (0-1). 0.6 = iOS preset.",
    },
    borderWidth: {
      control: { type: "number", min: 0, max: 4 },
      description: "Border width in pixels",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Squircle>;

/**
 * Default squircle with iOS-style 60% corner smoothing.
 */
export const Default: Story = {
  args: {
    cornerRadius: "xl",
    cornerSmoothing: IOS_CORNER_SMOOTHING,
    className: "bg-gray-1400 text-white p-6",
    children: "Squircle",
  },
};

/**
 * All radius sizes from the design system tokens.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      {(Object.keys(SQUIRCLE_RADIUS) as Array<keyof typeof SQUIRCLE_RADIUS>).map(
        (size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Squircle
              cornerRadius={size}
              className="bg-gray-1400 text-white flex items-center justify-center"
              style={{ width: 80, height: 80 }}
            >
              {size}
            </Squircle>
            <span className="text-body-sm text-text-medium">
              {SQUIRCLE_RADIUS[size]}px
            </span>
          </div>
        )
      )}
    </div>
  ),
};

/**
 * Comparison between standard border-radius and squircle (60% smoothing).
 * Notice how the squircle has continuous, smooth curvature.
 */
export const ComparisonWithBorderRadius: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="text-headline-md text-text-high mb-2">
        Standard border-radius vs iOS Squircle (60%)
      </div>
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div
            className="bg-gray-1400 text-white flex items-center justify-center"
            style={{ width: 120, height: 120, borderRadius: 24 }}
          >
            Normal
          </div>
          <span className="text-body-sm text-text-medium">border-radius</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Squircle
            cornerRadius={24}
            cornerSmoothing={0.6}
            className="bg-gray-1400 text-white flex items-center justify-center"
            style={{ width: 120, height: 120 }}
          >
            Squircle
          </Squircle>
          <span className="text-body-sm text-text-medium">60% smoothing</span>
        </div>
      </div>

      <div className="text-body-sm text-text-low max-w-md">
        The squircle has a continuous curvature that matches iOS app icons. The
        transition from straight edge to curve is gradual rather than abrupt.
      </div>
    </div>
  ),
};

/**
 * Interactive slider to see how corner smoothing affects the shape.
 * 0 = standard border-radius, 0.6 = iOS, 1 = maximum smoothing.
 */
export const SmoothingLevels: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="text-headline-md text-text-high">
        Corner Smoothing Levels
      </div>
      <div className="flex items-end gap-6">
        {[0, 0.3, 0.6, 0.8, 1].map((smoothing) => (
          <div key={smoothing} className="flex flex-col items-center gap-3">
            <Squircle
              cornerRadius={20}
              cornerSmoothing={smoothing}
              className="bg-gray-1400 text-white flex items-center justify-center text-body-sm"
              style={{ width: 80, height: 80 }}
            >
              {smoothing * 100}%
            </Squircle>
            <span className="text-body-sm text-text-medium">
              {smoothing === 0.6 ? "iOS" : smoothing === 0 ? "None" : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

/**
 * Squircle with shadow utilities.
 * Since clip-path blocks box-shadow, use drop-shadow filter on parent.
 */
export const WithShadow: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="text-headline-md text-text-high">
        Squircle Shadow Utilities
      </div>
      <div className="flex items-center gap-8">
        {["sm", "", "md", "lg", "xl"].map((shadowSize) => (
          <div key={shadowSize || "default"} className="flex flex-col items-center gap-3">
            <div className={`squircle-shadow${shadowSize ? `-${shadowSize}` : ""}`}>
              <Squircle
                cornerRadius="xl"
                className="bg-white flex items-center justify-center"
                style={{ width: 80, height: 80 }}
              >
                <span className="text-body-sm text-text-high">
                  {shadowSize || "default"}
                </span>
              </Squircle>
            </div>
            <span className="text-body-sm text-text-medium">
              squircle-shadow{shadowSize ? `-${shadowSize}` : ""}
            </span>
          </div>
        ))}
      </div>
      <div className="text-body-sm text-text-low max-w-md">
        Apply shadow utility classes to the parent wrapper, not the Squircle
        itself. This uses filter: drop-shadow() which respects the clip-path.
      </div>
    </div>
  ),
};

/**
 * Squircle with border using the borderWidth prop.
 */
export const WithBorder: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="text-headline-md text-text-high">Squircle with Border</div>
      <div className="flex items-center gap-6">
        <Squircle
          cornerRadius="xl"
          borderWidth={1}
          className="p-4"
          style={{
            background: "var(--gray-300)",
          }}
        >
          <div
            className="flex items-center justify-center text-text-high"
            style={{
              width: 72,
              height: 72,
              background: "var(--gray-50)",
            }}
          >
            1px
          </div>
        </Squircle>
        <Squircle
          cornerRadius="xl"
          borderWidth={2}
          className="p-4"
          style={{
            background: "var(--gray-400)",
          }}
        >
          <div
            className="flex items-center justify-center text-text-high"
            style={{
              width: 72,
              height: 72,
              background: "var(--gray-50)",
            }}
          >
            2px
          </div>
        </Squircle>
      </div>
      <div className="text-body-sm text-text-low max-w-md">
        Border color is set via background-color on the Squircle. The inner
        content should have its own background via a ::before pseudo-element or
        nested element.
      </div>
    </div>
  ),
};

/**
 * Card-like example using squircle for smooth corners.
 */
export const CardExample: Story = {
  render: () => (
    <div className="squircle-shadow-lg">
      <Squircle
        cornerRadius="2xl"
        className="bg-white p-6"
        style={{ width: 320 }}
      >
        <div className="flex flex-col gap-4">
          <div className="text-title-sm text-text-extra-high">
            iOS-Style Card
          </div>
          <p className="text-body-md text-text-medium">
            This card uses squircle corners with 60% smoothing, matching the
            continuous curvature found in iOS app icons and UI elements.
          </p>
          <div className="flex gap-2 mt-2">
            <div className="squircle-shadow-sm">
              <Squircle
                cornerRadius="md"
                className="bg-gray-1400 text-white px-4 py-2 text-button-md"
              >
                Action
              </Squircle>
            </div>
          </div>
        </div>
      </Squircle>
    </div>
  ),
};

/**
 * Large squircle demonstrating app icon-like appearance.
 */
export const AppIconStyle: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="squircle-shadow-lg">
        <Squircle
          cornerRadius={32}
          className="bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
          style={{ width: 128, height: 128 }}
        >
          <span className="text-white text-4xl">S</span>
        </Squircle>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-headline-md text-text-high">App Icon Style</div>
        <div className="text-body-sm text-text-medium max-w-xs">
          Large squircles with high corner radius create the signature iOS app
          icon look. The 60% smoothing ensures the curvature is continuous.
        </div>
      </div>
    </div>
  ),
};
