import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { TokenLogo } from "./index";

const meta: Meta<typeof TokenLogo> = {
  component: TokenLogo,
  title: "Primitives/Token Logo",
  tags: ["autodocs"],
  argTypes: {
    width: {
      control: { type: "number", min: 16, max: 256 },
    },
    height: {
      control: { type: "number", min: 16, max: 256 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof TokenLogo>;

export const Default: Story = {
  args: {
    width: 64,
    height: 64,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <TokenLogo height={32} width={32} />
      <TokenLogo height={48} width={48} />
      <TokenLogo height={64} width={64} />
      <TokenLogo height={96} width={96} />
    </div>
  ),
};

export const WithCustomClass: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <TokenLogo className="opacity-50" height={64} width={64} />
      <TokenLogo className="opacity-75" height={64} width={64} />
      <TokenLogo className="opacity-100" height={64} width={64} />
    </div>
  ),
};
