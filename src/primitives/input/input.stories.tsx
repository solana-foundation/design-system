import type { Meta, StoryObj } from "@storybook/react";
import { Mail, Search } from "lucide-react";
import { Input } from "./index";

/**
 * # Input
 *
 * Text input fields for capturing user data. Built on Base UI's Field and Input
 * components for full accessibility (label association, error announcement, ARIA).
 *
 * ## Quick Reference
 * - **Sizes**: XL (48px) / LG (40px) / MD (36px)
 * - **States**: Idle / Hover / Focus / Filled / Disabled / Error
 * - **Field**: Optional label, description, error message
 * - **Icons**: Leading / Trailing slots
 */
const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Styled text input with optional label, description, and error. Uses Base UI Field for accessible form integration.",
      },
    },
    controls: {
      include: [
        "size",
        "label",
        "placeholder",
        "description",
        "error",
        "disabled",
      ],
    },
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["xl", "lg", "md"],
      description: "Size preset: XL=48px, LG=40px, MD=36px.",
      table: {
        category: "Appearance",
        type: { summary: '"xl" | "lg" | "md"' },
        defaultValue: { summary: "xl" },
      },
    },
    label: {
      control: "text",
      description: "Label text displayed above the input.",
      table: { category: "Field", type: { summary: "string" } },
    },
    description: {
      control: "text",
      description: "Helper text displayed below the input.",
      table: { category: "Field", type: { summary: "string" } },
    },
    error: {
      control: "text",
      description: "Error message. Enables error styling when set.",
      table: { category: "Field", type: { summary: "string" } },
    },
    placeholder: {
      control: "text",
      description: "Input placeholder text.",
      table: { category: "Content", type: { summary: "string" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction and reduces opacity.",
      table: {
        category: "State",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    iconLeft: {
      control: "boolean",
      description: "Icon element displayed at the start of the input.",
      mapping: { true: <Search size={16} />, false: undefined },
      table: { category: "Icons", type: { summary: "ReactNode" } },
    },
    iconRight: {
      control: "boolean",
      description: "Icon element displayed at the end of the input.",
      mapping: { true: <Mail size={16} />, false: undefined },
      table: { category: "Icons", type: { summary: "ReactNode" } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// 1. PLAYGROUND
// =============================================================================

export const Playground: Story = {
  args: {
    placeholder: "you@email.com",
    size: "xl",
    label: "Email",
    description: "",
    error: "",
    disabled: false,
  },
};

// =============================================================================
// 2. OVERVIEW
// =============================================================================

export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[720px] flex-col gap-10 p-8">
      {/* Sizes */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          Sizes
        </h4>
        <div className="flex flex-col gap-4 rounded-xl border border-border-medium p-6">
          <div className="flex flex-col gap-1">
            <Input placeholder="you@email.com" size="xl" />
            <span className="text-text-low text-xs">XL / 48px</span>
          </div>
          <div className="flex flex-col gap-1">
            <Input placeholder="you@email.com" size="lg" />
            <span className="text-text-low text-xs">LG / 40px</span>
          </div>
          <div className="flex flex-col gap-1">
            <Input placeholder="you@email.com" size="md" />
            <span className="text-text-low text-xs">MD / 36px</span>
          </div>
        </div>
      </section>

      {/* With Label */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          With Label
        </h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <Input label="Label" placeholder="you@email.com" size="xl" />
          <Input label="Label" placeholder="you@email.com" size="lg" />
        </div>
      </section>

      {/* States */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          States
        </h4>
        <div className="flex flex-col gap-4 rounded-xl border border-border-medium p-6">
          <div className="flex flex-col gap-1">
            <Input placeholder="Idle state" size="lg" />
            <span className="text-text-low text-xs">
              Idle — hover to see smooth border change
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Input defaultValue="Filled value" size="lg" />
            <span className="text-text-low text-xs">
              Filled — click to see smooth focus ring
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Input disabled placeholder="Disabled input" size="lg" />
            <span className="text-text-low text-xs">
              Disabled — 50% opacity
            </span>
          </div>
        </div>
      </section>

      {/* Icons */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          Icons
        </h4>
        <div className="flex flex-col gap-4 rounded-xl border border-border-medium p-6">
          <Input iconLeft={<Search />} placeholder="Search..." size="xl" />
          <Input iconRight={<Mail />} placeholder="you@email.com" size="lg" />
          <Input
            iconLeft={<Search />}
            iconRight={<Mail />}
            placeholder="Search emails..."
            size="md"
          />
        </div>
      </section>

      {/* Validation */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          Validation
        </h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <Input
            description="We'll never share your email."
            label="Email"
            placeholder="you@email.com"
            size="xl"
          />
          <Input
            error="This field is required"
            label="Email"
            placeholder="you@email.com"
            size="xl"
          />
        </div>
      </section>
    </div>
  ),
};
