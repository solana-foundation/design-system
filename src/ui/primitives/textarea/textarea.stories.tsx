import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Textarea } from "./index";

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  title: "Primitives/Textarea",
  tags: ["autodocs"],
  argTypes: {
    rows: {
      control: { type: "number", min: 1, max: 20 },
    },
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
  },
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here...",
  },
};

export const WithRows: Story = {
  args: {
    rows: 5,
    placeholder: "Enter multiple lines of text...",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled textarea",
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    defaultValue:
      "This is a pre-filled textarea with some content that spans multiple lines to demonstrate how it looks.",
    rows: 4,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <label className="font-medium text-sm" htmlFor="message">
        Message
      </label>
      <Textarea id="message" placeholder="Type your message here..." rows={4} />
    </div>
  ),
};
