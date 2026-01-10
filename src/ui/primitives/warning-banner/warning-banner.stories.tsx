import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { WarningBanner } from "./index";

const meta: Meta<typeof WarningBanner> = {
  component: WarningBanner,
  title: "Primitives/Warning Banner",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["warning", "danger"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof WarningBanner>;

export const Warning: Story = {
  args: {
    title: "Caution",
    message:
      "This action may have unexpected consequences. Please review before proceeding.",
    variant: "warning",
  },
};

export const Danger: Story = {
  args: {
    title: "Critical Warning",
    message:
      "This action is irreversible and will permanently delete all your data. Use with extreme caution.",
    variant: "danger",
  },
};

export const NetworkWarning: Story = {
  args: {
    title: "Using Devnet",
    message:
      "You are currently connected to the Solana devnet. Transactions will not use real funds.",
    variant: "warning",
  },
};

export const InsufficientFunds: Story = {
  args: {
    title: "Insufficient Balance",
    message:
      "Your wallet does not have enough SOL to complete this transaction. Please add funds before continuing.",
    variant: "danger",
  },
};

export const SlippageWarning: Story = {
  args: {
    title: "High Slippage Detected",
    message:
      "The slippage for this swap is unusually high. You may receive significantly fewer tokens than expected.",
    variant: "warning",
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="space-y-4">
      <WarningBanner
        message="The Solana network is experiencing high traffic. Transactions may take longer than usual."
        title="Network Congestion"
        variant="warning"
      />
      <WarningBanner
        message="This contract has not been audited. Interact at your own risk."
        title="Security Alert"
        variant="danger"
      />
      <WarningBanner
        message="This feature is in beta. Some functionality may be limited or unstable."
        title="Beta Feature"
        variant="warning"
      />
    </div>
  ),
};

export const LongMessage: Story = {
  args: {
    title: "Important Information",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    variant: "warning",
  },
};
