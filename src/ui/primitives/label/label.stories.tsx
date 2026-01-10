import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Checkbox } from "../checkbox";
import { Input } from "../input";
import { Label } from "./index";

const meta: Meta<typeof Label> = {
  component: Label,
  title: "Primitives/Label",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" placeholder="name@example.com" type="email" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="username">
        Username <span className="text-destructive">*</span>
      </Label>
      <Input id="username" placeholder="johndoe" required />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-2">
      <Label className="peer-disabled:opacity-70" htmlFor="disabled-input">
        Disabled Input
      </Label>
      <Input disabled id="disabled-input" placeholder="Cannot type here" />
    </div>
  ),
};
