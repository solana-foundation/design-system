import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { SolanaIcon, SolanaLogo } from "./index";

const meta: Meta<typeof SolanaLogo> = {
  component: SolanaLogo,
  title: "Primitives/Solana Logo",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof SolanaLogo>;

export const Logo: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <SolanaLogo className="h-16 w-32 text-black" />
      <SolanaLogo className="h-16 w-32 text-purple-600" />
      <SolanaLogo className="h-16 w-32 text-green-500" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <SolanaLogo className="h-8 w-16" />
      <SolanaLogo className="h-16 w-32" />
      <SolanaLogo className="h-24 w-48" />
    </div>
  ),
};

export const Icon: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SolanaIcon className="h-4 w-4" />
      <SolanaIcon className="h-6 w-6" />
      <SolanaIcon className="h-8 w-8" />
      <SolanaIcon className="h-12 w-12" />
    </div>
  ),
};

export const IconWithRounding: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SolanaIcon className="h-8 w-8 rounded-sm" />
      <SolanaIcon className="h-8 w-8 rounded-md" />
      <SolanaIcon className="h-8 w-8 rounded-lg" />
      <SolanaIcon className="h-8 w-8 rounded-full" />
    </div>
  ),
};
