import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "./index";

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
  title: "Primitives/RadioGroup",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="r1" value="default" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="r2" value="comfortable" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="r3" value="compact" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup className="flex gap-6" defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="h1" value="option-one" />
        <Label htmlFor="h1">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="h2" value="option-two" />
        <Label htmlFor="h2">Option Two</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="h3" value="option-three" />
        <Label htmlFor="h3">Option Three</Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="d1" value="option-one" />
        <Label htmlFor="d1">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem disabled id="d2" value="option-two" />
        <Label className="text-muted-foreground" htmlFor="d2">
          Option Two (disabled)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="d3" value="option-three" />
        <Label htmlFor="d3">Option Three</Label>
      </div>
    </RadioGroup>
  ),
};

export const CardLayout: Story = {
  render: () => (
    <RadioGroup className="grid grid-cols-3 gap-4" defaultValue="card">
      <div>
        <RadioGroupItem className="peer sr-only" id="card" value="card" />
        <Label
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          htmlFor="card"
        >
          Card
        </Label>
      </div>
      <div>
        <RadioGroupItem className="peer sr-only" id="paypal" value="paypal" />
        <Label
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          htmlFor="paypal"
        >
          PayPal
        </Label>
      </div>
      <div>
        <RadioGroupItem className="peer sr-only" id="apple" value="apple" />
        <Label
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          htmlFor="apple"
        >
          Apple
        </Label>
      </div>
    </RadioGroup>
  ),
};
