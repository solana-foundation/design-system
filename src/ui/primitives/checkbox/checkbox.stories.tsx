import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Checkbox } from "./index";

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: "Primitives/Checkbox",
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
    defaultChecked: {
      control: "boolean",
    },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label
        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor="terms"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
};

export const MultipleOptions: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox defaultChecked id="option1" />
        <label className="font-medium text-sm" htmlFor="option1">
          Option 1
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" />
        <label className="font-medium text-sm" htmlFor="option2">
          Option 2
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox disabled id="option3" />
        <label
          className="font-medium text-muted-foreground text-sm"
          htmlFor="option3"
        >
          Option 3 (disabled)
        </label>
      </div>
    </div>
  ),
};
