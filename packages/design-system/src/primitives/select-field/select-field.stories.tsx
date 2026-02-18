import {
  BeakerIcon,
  BoltIcon,
  CodeBracketIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  GlobeAltIcon,
  Square2StackIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  SelectField,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
} from "./index";

const meta: Meta<typeof SelectField> = {
  title: "Primitives/Select Field",
  component: SelectField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Dropdown select with focus ring animation, icon sync from selected item, and Base UI Field integration for accessible labels and validation.",
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
      description: "Label text rendered above the select.",
      table: { category: "Field" },
    },
    description: {
      control: "text",
      description: "Helper text rendered below the select.",
      table: { category: "Field" },
    },
    error: {
      control: "text",
      description: "Error message — replaces description when present.",
      table: { category: "Field" },
    },
    placeholder: {
      control: "text",
      description: "Placeholder shown when no value is selected.",
      table: { category: "Content" },
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
    multiple: {
      control: "boolean",
      description: "Enable multi-select mode.",
      table: {
        category: "Behavior",
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
    placeholder: "Select an option...",
    label: "Network",
    description: "",
    error: "",
    disabled: false,
  },
  render: (args) => (
    <div className="w-[320px]">
      <SelectField {...args}>
        <SelectItem icon={<GlobeAltIcon />} value="mainnet">
          Mainnet
        </SelectItem>
        <SelectItem icon={<CodeBracketIcon />} value="devnet">
          Devnet
        </SelectItem>
        <SelectItem icon={<BeakerIcon />} value="testnet">
          Testnet
        </SelectItem>
      </SelectField>
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
            <SelectField placeholder="XL — 48px" size="xl">
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
            </SelectField>
            <span className="text-text-low text-xs">XL / 48px</span>
          </div>
          <div className="flex flex-col gap-1">
            <SelectField placeholder="LG — 40px" size="lg">
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
            </SelectField>
            <span className="text-text-low text-xs">LG / 40px</span>
          </div>
          <div className="flex flex-col gap-1">
            <SelectField placeholder="MD — 36px" size="md">
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
            </SelectField>
            <span className="text-text-low text-xs">MD / 36px</span>
          </div>
        </div>
      </section>

      {/* With Labels */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">
          Labels & Descriptions
        </h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <SelectField label="Network" placeholder="Choose a network" size="xl">
            <SelectItem icon={<GlobeAltIcon />} value="mainnet">
              Mainnet
            </SelectItem>
            <SelectItem icon={<CodeBracketIcon />} value="devnet">
              Devnet
            </SelectItem>
          </SelectField>
          <SelectField
            description="Select the wallet you want to use"
            label="Wallet"
            placeholder="Choose wallet"
            size="lg"
          >
            <SelectItem icon={<WalletIcon />} value="phantom">
              Phantom
            </SelectItem>
            <SelectItem icon={<BoltIcon />} value="solflare">
              Solflare
            </SelectItem>
          </SelectField>
          <SelectField label="Priority" placeholder="Set priority" size="md">
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectField>
        </div>
      </section>

      {/* States */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">States</h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <div className="flex flex-col gap-1">
            <SelectField placeholder="Idle">
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
            </SelectField>
            <span className="text-text-low text-xs">Idle — click to open</span>
          </div>
          <div className="flex flex-col gap-1">
            <SelectField defaultValue="filled">
              <SelectItem value="filled">Filled value</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectField>
            <span className="text-text-low text-xs">Filled</span>
          </div>
          <div className="flex flex-col gap-1">
            <SelectField disabled placeholder="Disabled">
              <SelectItem value="a">Option A</SelectItem>
            </SelectField>
            <span className="text-text-low text-xs">
              Disabled — 40% opacity
            </span>
          </div>
        </div>
      </section>

      {/* Icons */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">Icon Sync</h4>
        <div className="flex flex-col gap-4 rounded-xl border border-border-medium p-6">
          <div className="flex flex-col gap-1">
            <SelectField
              defaultValue="mainnet"
              label="Network"
              placeholder="Select network"
            >
              <SelectItem icon={<GlobeAltIcon />} value="mainnet">
                Mainnet Beta
              </SelectItem>
              <SelectItem icon={<CodeBracketIcon />} value="devnet">
                Devnet
              </SelectItem>
              <SelectItem icon={<BeakerIcon />} value="testnet">
                Testnet
              </SelectItem>
            </SelectField>
            <span className="text-text-low text-xs">
              Icon in trigger syncs with selected item
            </span>
          </div>
        </div>
      </section>

      {/* Validation */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">Validation</h4>
        <div className="flex flex-col gap-6 rounded-xl border border-border-medium p-6">
          <SelectField
            description="Choose the network for deployment"
            label="Network"
            placeholder="Select..."
          >
            <SelectItem value="mainnet">Mainnet</SelectItem>
            <SelectItem value="devnet">Devnet</SelectItem>
          </SelectField>
          <SelectField
            error="Please select a network"
            label="Network"
            placeholder="Select..."
          >
            <SelectItem value="mainnet">Mainnet</SelectItem>
            <SelectItem value="devnet">Devnet</SelectItem>
          </SelectField>
        </div>
      </section>

      {/* Groups & Separators */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">
          Groups & Separators
        </h4>
        <div className="flex flex-col gap-4 rounded-xl border border-border-medium p-6">
          <SelectField label="Device" placeholder="Select device" size="lg">
            <SelectGroup>
              <SelectGroupLabel>Mobile</SelectGroupLabel>
              <SelectItem icon={<DevicePhoneMobileIcon />} value="iphone">
                iPhone
              </SelectItem>
              <SelectItem icon={<DevicePhoneMobileIcon />} value="android">
                Android
              </SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectGroupLabel>Desktop</SelectGroupLabel>
              <SelectItem icon={<ComputerDesktopIcon />} value="laptop">
                Laptop
              </SelectItem>
              <SelectItem icon={<DeviceTabletIcon />} value="tablet">
                Tablet
              </SelectItem>
            </SelectGroup>
          </SelectField>
        </div>
      </section>

      {/* Descriptions & Disabled Items */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">
          Item Descriptions & Disabled
        </h4>
        <div className="flex flex-col gap-4 rounded-xl border border-border-medium p-6">
          <SelectField
            label="Environment"
            placeholder="Select environment"
            size="lg"
          >
            <SelectItem
              description="Production environment"
              icon={<GlobeAltIcon />}
              value="mainnet"
            >
              Mainnet
            </SelectItem>
            <SelectItem
              description="For development and testing"
              icon={<CodeBracketIcon />}
              value="devnet"
            >
              Devnet
            </SelectItem>
            <SelectItem
              description="Currently unavailable"
              disabled
              icon={<BeakerIcon />}
              value="testnet"
            >
              Testnet
            </SelectItem>
          </SelectField>
        </div>
      </section>

      {/* Multi-select */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs">Multi-Select</h4>
        <div className="flex flex-col gap-4 rounded-xl border border-border-medium p-6">
          <MultiSelectDemo />
        </div>
      </section>
    </div>
  ),
};

function MultiSelectDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-1">
      <SelectField
        label="Features"
        multiple
        onValueChange={setSelected}
        placeholder="Select features..."
        size="lg"
        value={selected}
      >
        <SelectItem icon={<Square2StackIcon />} value="staking">
          Staking
        </SelectItem>
        <SelectItem icon={<GlobeAltIcon />} value="governance">
          Governance
        </SelectItem>
        <SelectItem icon={<BoltIcon />} value="defi">
          DeFi
        </SelectItem>
        <SelectItem icon={<ComputerDesktopIcon />} value="nft">
          NFTs
        </SelectItem>
      </SelectField>
      <span className="text-text-low text-xs">
        Selected: {selected.length > 0 ? selected.join(", ") : "none"}
      </span>
    </div>
  );
}
