import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberField } from "./index";

/**
 * # Number Field
 *
 * Accessible numeric input with locale-aware parsing/formatting, keyboard stepping,
 * and optional min/max bounds.
 * Built on Base UI NumberField for robust spinbutton semantics.
 */
const meta: Meta<typeof NumberField> = {
  title: "Primitives/Number Field",
  component: NumberField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Numeric input primitive with stepped interactions, focusable field shell, and support for label/description/error/hint.",
      },
    },
  },
  args: {
    largeStep: 1,
    placeholder: "0.00",
    size: "lg",
    smallStep: 0.01,
    step: 0.01,
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["xl", "lg", "md"],
      table: {
        category: "Appearance",
        defaultValue: { summary: "lg" },
        type: { summary: '"xl" | "lg" | "md"' },
      },
    },
    step: {
      control: { type: "number", min: 0.0001, step: 0.01 },
      table: { category: "Behavior" },
    },
    smallStep: {
      control: { type: "number", min: 0.0001, step: 0.01 },
      table: { category: "Behavior" },
    },
    largeStep: {
      control: { type: "number", min: 0.01, step: 1 },
      table: { category: "Behavior" },
    },
    min: {
      control: { type: "number", step: 0.01 },
      table: { category: "Behavior" },
    },
    max: {
      control: { type: "number", step: 0.01 },
      table: { category: "Behavior" },
    },
    allowWheelScrub: {
      control: "boolean",
      table: {
        category: "Behavior",
        defaultValue: { summary: "false" },
      },
    },
    label: { control: "text", table: { category: "Field" } },
    description: { control: "text", table: { category: "Field" } },
    error: { control: "text", table: { category: "Field" } },
    hint: { control: "text", table: { category: "Field" } },
    disabled: { control: "boolean", table: { category: "State" } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    defaultValue: 34,
    description: "Use ArrowUp/ArrowDown to step by 0.01.",
    label: "Amount",
  },
  render: (args) => (
    <div className="w-[320px]">
      <NumberField {...args} />
    </div>
  ),
};

export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[720px] flex-col gap-10 p-8">
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">Sizes</h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <div className="flex flex-col gap-1">
            <NumberField defaultValue={120.5} placeholder="0.00" size="xl" />
            <span className="text-text-low text-xs">XL / 48px</span>
          </div>
          <div className="flex flex-col gap-1">
            <NumberField defaultValue={34} placeholder="0.00" size="lg" />
            <span className="text-text-low text-xs">LG / 40px</span>
          </div>
          <div className="flex flex-col gap-1">
            <NumberField defaultValue={7.5} placeholder="0.00" size="md" />
            <span className="text-text-low text-xs">MD / 36px</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">Decimal Defaults</h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <NumberField
            defaultValue={34}
            description="Default step=0.01, smallStep=0.01, largeStep=1."
            label="Token Amount"
            placeholder="0.00"
            size="lg"
          />
          <NumberField
            defaultValue={1.234}
            label="Precision Input"
            placeholder="0.000"
            size="lg"
            step={0.001}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">Min / Max Bounds</h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <NumberField
            defaultValue={5}
            label="Allocation (0-10)"
            max={10}
            min={0}
            size="lg"
            step={0.25}
          />
          <NumberField
            defaultValue={0}
            description="Home jumps to min, End jumps to max."
            label="Priority (-5 to 5)"
            max={5}
            min={-5}
            size="md"
            step={1}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">States</h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <NumberField
            defaultValue={12.5}
            description="Helper text when valid."
            label="With Description"
            size="lg"
          />
          <NumberField
            defaultValue={-2}
            error="Value must be greater than or equal to 0."
            label="Error State"
            min={0}
            size="lg"
          />
          <NumberField defaultValue={20} disabled label="Disabled" size="lg" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">Keyboard Notes</h4>
        <div className="rounded-xl border border-border-medium p-6 text-text-medium text-xs">
          ArrowUp / ArrowDown = step. Shift + Arrow = largeStep. Home / End =
          min/max when provided.
        </div>
      </section>
    </div>
  ),
};
