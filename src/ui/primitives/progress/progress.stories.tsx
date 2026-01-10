import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Progress } from "./index";

const meta: Meta<typeof Progress> = {
  component: Progress,
  title: "Primitives/Progress",
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 33,
  },
};

export const Half: Story = {
  args: {
    value: 50,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
};

export const Zero: Story = {
  args: {
    value: 0,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div className="space-y-2">
        <p className="font-medium text-sm">Thin</p>
        <Progress className="h-1" value={33} />
      </div>
      <div className="space-y-2">
        <p className="font-medium text-sm">Default</p>
        <Progress className="h-2" value={50} />
      </div>
      <div className="space-y-2">
        <p className="font-medium text-sm">Thick</p>
        <Progress className="h-4" value={75} />
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <div className="flex justify-between text-sm">
        <span>Upload progress</span>
        <span>66%</span>
      </div>
      <Progress value={66} />
    </div>
  ),
};
