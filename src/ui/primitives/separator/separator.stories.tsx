import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Separator } from "./index";

const meta: Meta<typeof Separator> = {
  component: Separator,
  title: "Primitives/Separator",
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-sm">Section 1</h4>
        <p className="text-muted-foreground text-sm">Content above separator</p>
      </div>
      <Separator />
      <div>
        <h4 className="font-medium text-sm">Section 2</h4>
        <p className="text-muted-foreground text-sm">Content below separator</p>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center space-x-4">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="w-[350px] rounded-lg border p-6">
      <div className="space-y-1">
        <h4 className="font-medium text-sm">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};
