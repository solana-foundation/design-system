import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eye, Mail, Search } from "lucide-react";
import { CopyButton } from "../copy-button";
import { Input } from "./index";

/**
 * # Input Field
 *
 * Accessible text input with label, description, error, and icon slots.
 * Built on Base UI Field + Input for automatic ARIA association.
 *
 * ## Quick Reference
 * - **Sizes**: XL (48px) / LG (40px) / MD (36px)
 * - **States**: Idle / Hover / Focused / Disabled
 * - **Slots**: Label / Description / Error / Icon Left / Icon Right
 */
const meta: Meta<typeof Input> = {
  title: "Primitives/Input Field",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Text input with focus ring animation, icon slots, and Base UI Field integration for accessible labels and validation.",
      },
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
        defaultValue: { summary: "md" },
      },
    },
    label: {
      control: "text",
      description: "Label text rendered above the input.",
      table: { category: "Field" },
    },
    description: {
      control: "text",
      description: "Helper text rendered below the input.",
      table: { category: "Field" },
    },
    error: {
      control: "text",
      description: "Error message — replaces description when present.",
      table: { category: "Field" },
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
    placeholder: {
      control: "text",
      description: "Placeholder text.",
      table: { category: "Content" },
    },
    showIcon: {
      control: "boolean",
      description: "Toggle an icon inside the input.",
      table: {
        category: "Content",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
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
    size: "md",
    placeholder: "Enter text...",
    label: "Label",
    description: "",
    error: "",
    disabled: false,
    showIcon: false,
  },
  render: ({ showIcon, ...args }) => (
    <div className="w-[320px]">
      <Input {...args} iconLeft={showIcon ? <Search /> : undefined} />
    </div>
  ),
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
            <Input placeholder="XL — 48px" size="xl" />
            <span className="text-text-low text-xs">XL / 48px</span>
          </div>
          <div className="flex flex-col gap-1">
            <Input placeholder="LG — 40px" size="lg" />
            <span className="text-text-low text-xs">LG / 40px</span>
          </div>
          <div className="flex flex-col gap-1">
            <Input placeholder="MD — 36px" size="md" />
            <span className="text-text-low text-xs">MD / 36px</span>
          </div>
        </div>
      </section>

      {/* With Labels */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          Labels
        </h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <Input label="Email" placeholder="you@example.com" />
          <Input
            description="Must be at least 8 characters"
            label="Password"
            placeholder="Enter password"
            type="password"
          />
        </div>
      </section>

      {/* States */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          States
        </h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <div className="flex flex-col gap-1">
            <Input placeholder="Idle" />
            <span className="text-text-low text-xs">Idle — click to focus</span>
          </div>
          <div className="flex flex-col gap-1">
            <Input defaultValue="Filled value" />
            <span className="text-text-low text-xs">Filled</span>
          </div>
          <div className="flex flex-col gap-1">
            <Input disabled placeholder="Disabled" />
            <span className="text-text-low text-xs">
              Disabled — 40% opacity
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
          <div className="flex flex-col gap-1">
            <Input iconLeft={<Search />} placeholder="Search..." />
            <span className="text-text-low text-xs">Icon left</span>
          </div>
          <div className="flex flex-col gap-1">
            <Input iconRight={<Eye />} placeholder="Password" type="password" />
            <span className="text-text-low text-xs">Icon right</span>
          </div>
          <div className="flex flex-col gap-1">
            <Input
              iconLeft={<Mail />}
              iconRight={<Search />}
              placeholder="Both icons"
            />
            <span className="text-text-low text-xs">Both icons</span>
          </div>
        </div>
      </section>

      {/* Validation */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          Validation
        </h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <Input
            description="Letters, numbers, and underscores only"
            label="Username"
            placeholder="Choose a username"
          />
          <Input
            defaultValue="invalid-email"
            error="Please enter a valid email address"
            label="Email"
            placeholder="you@example.com"
          />
        </div>
      </section>

      {/* Copy to Clipboard */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          Copy to Clipboard
        </h4>
        <div className="flex flex-col gap-4 rounded-xl border border-border-medium p-6">
          <div className="flex flex-col gap-1">
            <Input
              action={
                <CopyButton
                  size="md"
                  value="sk_live_abc123def456ghi789jkl012mno345"
                />
              }
              className="font-mono"
              defaultValue="sk_live_abc123def456ghi789jkl012mno345"
              label="API Key"
              readOnly
            />
            <span className="text-text-low text-xs">
              Readonly + monospace + CopyButton action
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Input
              action={<CopyButton size="md" value="s3cur3-p@ssw0rd!" />}
              defaultValue="s3cur3-p@ssw0rd!"
              label="Password"
              readOnly
              type="password"
            />
            <span className="text-text-low text-xs">
              Password field with CopyButton action
            </span>
          </div>
        </div>
      </section>
    </div>
  ),
};
