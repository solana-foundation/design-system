import type { Meta, StoryObj } from "@storybook/react";
import { AlertCircle, Terminal } from "lucide-react";
import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "./index";

const meta: Meta<typeof Alert> = {
  component: Alert,
  title: "Primitives/Alert",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Notice</AlertTitle>
      <AlertDescription>
        This is an alert without an icon. It still works great!
      </AlertDescription>
    </Alert>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Quick tip: Use keyboard shortcuts!</AlertTitle>
    </Alert>
  ),
};
