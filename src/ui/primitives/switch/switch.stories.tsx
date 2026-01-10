import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Switch } from "./index";

const meta: Meta<typeof Switch> = {
  component: Switch,
  title: "Primitives/Switch",
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
type Story = StoryObj<typeof Switch>;

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
      <Switch id="airplane-mode" />
      <label className="font-medium text-sm" htmlFor="airplane-mode">
        Airplane Mode
      </label>
    </div>
  ),
};

export const SettingsExample: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">Email notifications</p>
          <p className="text-muted-foreground text-xs">
            Receive emails about account activity
          </p>
        </div>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">Push notifications</p>
          <p className="text-muted-foreground text-xs">
            Receive push notifications
          </p>
        </div>
        <Switch />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">Marketing emails</p>
          <p className="text-muted-foreground text-xs">
            Receive marketing emails
          </p>
        </div>
        <Switch disabled />
      </div>
    </div>
  ),
};
