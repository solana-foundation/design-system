import {
  EnvelopeIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyButton } from "../copy-button";
import { NumberField } from "../number-field";
import { Input, InputAddonSelect } from "./index";

const meta: Meta<typeof Input> = {
  title: "Primitives/Input Field",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Text input with full-surface click-to-focus (excluding interactive addons), focus ring animation, and Base UI Field integration for accessible labels and validation.",
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
    showCopyButton: {
      control: "boolean",
      description: "Toggle an inline CopyButton in the trailing action slot.",
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

const addonTextClass = "whitespace-nowrap";
const countryCodeOptions = [
  { value: "+1", label: "+1" },
  { value: "+44", label: "+44" },
  { value: "+49", label: "+49" },
  { value: "+81", label: "+81" },
  { value: "+33", label: "+33" },
  { value: "+61", label: "+61" },
];

const currencyOptions = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "SOL", label: "SOL" },
];

const domainOptions = [
  { value: ".com", label: ".com" },
  { value: ".org", label: ".org" },
  { value: ".io", label: ".io" },
  { value: ".dev", label: ".dev" },
];

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
    showCopyButton: false,
  },
  render: ({ showIcon, showCopyButton, size, ...args }) => (
    <div className="w-[320px]">
      <Input
        {...args}
        iconLeft={showIcon ? <MagnifyingGlassIcon /> : undefined}
        size={size}
        trailingAction={
          showCopyButton ? (
            <CopyButton
              copiedLabel="Copied"
              label="Copy"
              size={size}
              value={
                typeof args.placeholder === "string" ? args.placeholder : ""
              }
              variant="inline"
            />
          ) : undefined
        }
      />
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
        <h4 className="font-medium text-text-low text-xs">Sizes</h4>
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
        <h4 className="font-medium text-text-low text-xs">Labels</h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <Input label="Email" placeholder="you@example.com" size="xl" />
          <Input
            description="Must be at least 8 characters"
            label="Password"
            placeholder="Enter password"
            size="lg"
            type="password"
          />
          <Input label="Username" placeholder="Choose a username" size="md" />
        </div>
      </section>

      {/* States */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">States</h4>
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
        <h4 className="font-medium text-text-low text-xs">Icons</h4>
        <div className="flex flex-col gap-4 rounded-xl border border-border-medium p-6">
          <div className="flex flex-col gap-1">
            <Input iconLeft={<MagnifyingGlassIcon />} placeholder="Search..." />
            <span className="text-text-low text-xs">Icon left</span>
          </div>
          <div className="flex flex-col gap-1">
            <Input
              iconRight={<EyeIcon />}
              placeholder="Password"
              type="password"
            />
            <span className="text-text-low text-xs">Icon right</span>
          </div>
          <div className="flex flex-col gap-1">
            <Input
              iconLeft={<EnvelopeIcon />}
              iconRight={<MagnifyingGlassIcon />}
              placeholder="Both icons"
            />
            <span className="text-text-low text-xs">Both icons</span>
          </div>
        </div>
      </section>

      {/* Validation */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">Validation</h4>
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
        <h4 className="font-medium text-text-low text-xs">Copy to Clipboard</h4>
        <div className="flex flex-col gap-4 rounded-xl border border-border-medium p-6">
          <div className="flex flex-col gap-1">
            <Input
              action={
                <CopyButton
                  size="md"
                  value="sk_live_abc123def456ghi789jkl012mno345"
                />
              }
              defaultValue="sk_live_abc123def456ghi789jkl012mno345"
              inputClassName="font-mono"
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
          <div className="flex flex-col gap-1">
            <Input
              defaultValue="Fh8W2J1Y3n6K9pQ4rT7uV2xZ5mA8cD3eF6hJ9kL2pN4q"
              inputClassName="font-mono"
              label="Wallet Address"
              readOnly
              size="lg"
              trailingAction={
                <CopyButton
                  copiedLabel="Copied"
                  label="Copy address"
                  size="lg"
                  value="Fh8W2J1Y3n6K9pQ4rT7uV2xZ5mA8cD3eF6hJ9kL2pN4q"
                  variant="inline"
                />
              }
            />
            <span className="text-text-low text-xs">
              Trailing action with inline CopyButton
            </span>
          </div>
        </div>
      </section>
    </div>
  ),
};

// =============================================================================
// 3. HINT TOOLTIP
// =============================================================================

export const HintTooltip: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[720px] flex-col gap-10 p-8">
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">Hint Tooltip</h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <Input
            hint="Your email will be used for account recovery and notifications."
            label="Email"
            placeholder="you@example.com"
            size="xl"
          />
          <Input
            hint="Must be at least 8 characters with a number and special character."
            label="Password"
            placeholder="Enter password"
            size="lg"
            type="password"
          />
          <Input
            hint="3-20 characters. Letters, numbers, and underscores only."
            label="Username"
            placeholder="Choose a username"
            size="md"
          />
        </div>
      </section>
    </div>
  ),
};

// =============================================================================
// 4. LEADING TEXT
// =============================================================================

export const LeadingText: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[720px] flex-col gap-10 p-8">
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">
          Leading Text Addon
        </h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <Input
            label="Website"
            leadingAddon={<span className={addonTextClass}>https://</span>}
            placeholder="example.com"
            size="xl"
          />
          <NumberField
            defaultValue={34}
            label="Price"
            leadingAddon={<span className={addonTextClass}>$</span>}
            placeholder="0.00"
            size="lg"
          />
          <Input
            label="Handle"
            leadingAddon={<span className={addonTextClass}>@</span>}
            placeholder="username"
            size="md"
          />
        </div>
      </section>
    </div>
  ),
};

// =============================================================================
// 5. LEADING DROPDOWN
// =============================================================================

export const LeadingDropdown: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[720px] flex-col gap-10 p-8">
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">
          Leading Dropdown Addon
        </h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <Input
            autoComplete="tel-national"
            label="Phone Number"
            leadingAddon={
              <InputAddonSelect
                ariaLabel="Country calling code"
                defaultValue="+1"
                options={countryCodeOptions}
                position="leading"
                size="lg"
              />
            }
            leadingAddonKind="interactive"
            placeholder="(555) 000-0000"
            size="lg"
            type="tel"
          />
        </div>
      </section>
    </div>
  ),
};

// =============================================================================
// 6. TRAILING DROPDOWN
// =============================================================================

export const TrailingDropdown: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[720px] flex-col gap-10 p-8">
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">
          Trailing Dropdown Addon
        </h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <Input
            inputMode="decimal"
            label="Amount"
            placeholder="0.00"
            size="lg"
            trailingAddon={
              <InputAddonSelect
                ariaLabel="Currency"
                defaultValue="USD"
                options={currencyOptions}
                position="trailing"
                size="lg"
              />
            }
            trailingAddonKind="interactive"
          />
        </div>
      </section>
    </div>
  ),
};

// =============================================================================
// 7. COMBINED ADDONS
// =============================================================================

export const CombinedAddons: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[720px] flex-col gap-10 p-8">
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">Combined Addons</h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <Input
            inputMode="decimal"
            label="Transfer Amount"
            leadingAddon={<span className={addonTextClass}>$</span>}
            placeholder="0.00"
            size="lg"
            trailingAddon={
              <InputAddonSelect
                ariaLabel="Transfer currency"
                defaultValue="USD"
                options={currencyOptions}
                position="trailing"
                size="lg"
              />
            }
            trailingAddonKind="interactive"
          />
        </div>
      </section>
    </div>
  ),
};

// =============================================================================
// 8. ADDON SIZES
// =============================================================================

export const AddonSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[720px] flex-col gap-10 p-8">
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">Addon Sizes</h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <div className="flex flex-col gap-1">
            <Input
              leadingAddon={<span className={addonTextClass}>https://</span>}
              placeholder="example"
              size="xl"
              trailingAddon={
                <InputAddonSelect
                  ariaLabel="Domain suffix"
                  defaultValue=".com"
                  options={domainOptions}
                  position="trailing"
                  size="xl"
                />
              }
              trailingAddonKind="interactive"
            />
            <span className="text-text-low text-xs">XL / 48px</span>
          </div>
          <div className="flex flex-col gap-1">
            <Input
              leadingAddon={<span className={addonTextClass}>https://</span>}
              placeholder="example"
              size="lg"
              trailingAddon={
                <InputAddonSelect
                  ariaLabel="Domain suffix"
                  defaultValue=".com"
                  options={domainOptions}
                  position="trailing"
                  size="lg"
                />
              }
              trailingAddonKind="interactive"
            />
            <span className="text-text-low text-xs">LG / 40px</span>
          </div>
          <div className="flex flex-col gap-1">
            <Input
              leadingAddon={<span className={addonTextClass}>https://</span>}
              placeholder="example"
              size="md"
              trailingAddon={
                <InputAddonSelect
                  ariaLabel="Domain suffix"
                  defaultValue=".com"
                  options={domainOptions}
                  position="trailing"
                  size="md"
                />
              }
              trailingAddonKind="interactive"
            />
            <span className="text-text-low text-xs">MD / 36px</span>
          </div>
        </div>
      </section>
    </div>
  ),
};
