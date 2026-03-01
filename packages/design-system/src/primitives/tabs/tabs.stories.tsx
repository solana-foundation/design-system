import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart3, FileText, Home, Settings, User, Users } from "lucide-react";
import { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "./index";

const meta: Meta<typeof Tabs> = {
  title: "Primitives/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Underline tab navigation with animated indicator. Two sizes, horizontal/vertical orientation, optional border. Built on Base UI Tabs.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    fullWidth: { control: "boolean" },
    bordered: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Playground
// =============================================================================

export const Playground: Story = {
  args: {
    size: "md",
    orientation: "horizontal",
    fullWidth: false,
    defaultValue: "overview",
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="analytics">Analytics</Tab>
        <Tab value="reports">Reports</Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>
      <TabPanel value="overview">
        <p className="text-body-md text-text-medium">
          Overview content goes here.
        </p>
      </TabPanel>
      <TabPanel value="analytics">
        <p className="text-body-md text-text-medium">
          Analytics content goes here.
        </p>
      </TabPanel>
      <TabPanel value="reports">
        <p className="text-body-md text-text-medium">
          Reports content goes here.
        </p>
      </TabPanel>
      <TabPanel value="settings">
        <p className="text-body-md text-text-medium">
          Settings content goes here.
        </p>
      </TabPanel>
    </Tabs>
  ),
};

// =============================================================================
// Bordered
// =============================================================================

export const Bordered: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-text-low">
          Default (bordered for horizontal)
        </span>
        <Tabs defaultValue="overview">
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="analytics">Analytics</Tab>
            <Tab value="reports">Reports</Tab>
          </TabList>
        </Tabs>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-text-low">
          Explicit bordered=false
        </span>
        <Tabs bordered={false} defaultValue="overview">
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="analytics">Analytics</Tab>
            <Tab value="reports">Reports</Tab>
          </TabList>
        </Tabs>
      </div>
    </div>
  ),
};

// =============================================================================
// Sizes
// =============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      {(["sm", "md"] as const).map((size) => (
        <div className="flex flex-col gap-2" key={size}>
          <span className="text-body-sm text-text-low">{size}</span>
          <Tabs defaultValue="overview" size={size}>
            <TabList>
              <Tab value="overview">Overview</Tab>
              <Tab value="analytics">Analytics</Tab>
              <Tab value="reports">Reports</Tab>
            </TabList>
          </Tabs>
        </div>
      ))}
    </div>
  ),
};

// =============================================================================
// With Icons
// =============================================================================

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabList>
        <Tab icon={<Home />} value="overview">
          Overview
        </Tab>
        <Tab icon={<BarChart3 />} value="analytics">
          Analytics
        </Tab>
        <Tab icon={<FileText />} value="reports">
          Reports
        </Tab>
        <Tab icon={<Settings />} value="settings">
          Settings
        </Tab>
      </TabList>
    </Tabs>
  ),
};

// =============================================================================
// With Badges
// =============================================================================

export const WithBadges: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab badge={12} value="analytics">
          Analytics
        </Tab>
        <Tab badge={3} value="reports">
          Reports
        </Tab>
        <Tab badge={99} value="notifications">
          Notifications
        </Tab>
      </TabList>
    </Tabs>
  ),
};

// =============================================================================
// Icons and Badges
// =============================================================================

export const IconsAndBadges: Story = {
  render: () => (
    <Tabs defaultValue="team">
      <TabList>
        <Tab badge={5} icon={<Users />} value="team">
          Team
        </Tab>
        <Tab icon={<User />} value="profile">
          Profile
        </Tab>
        <Tab badge={12} icon={<FileText />} value="reports">
          Reports
        </Tab>
      </TabList>
    </Tabs>
  ),
};

// =============================================================================
// Full Width
// =============================================================================

export const FullWidth: Story = {
  render: () => (
    <div className="w-[480px]">
      <Tabs defaultValue="overview" fullWidth>
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="analytics">Analytics</Tab>
          <Tab value="reports">Reports</Tab>
        </TabList>
      </Tabs>
    </div>
  ),
};

// =============================================================================
// Vertical
// =============================================================================

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="overview" orientation="vertical">
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="analytics">Analytics</Tab>
        <Tab value="reports">Reports</Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>
      <TabPanel value="overview">
        <p className="text-body-md text-text-medium">Overview content</p>
      </TabPanel>
      <TabPanel value="analytics">
        <p className="text-body-md text-text-medium">Analytics content</p>
      </TabPanel>
      <TabPanel value="reports">
        <p className="text-body-md text-text-medium">Reports content</p>
      </TabPanel>
      <TabPanel value="settings">
        <p className="text-body-md text-text-medium">Settings content</p>
      </TabPanel>
    </Tabs>
  ),
};

// =============================================================================
// Disabled
// =============================================================================

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="analytics">Analytics</Tab>
        <Tab disabled value="reports">
          Reports
        </Tab>
        <Tab disabled value="settings">
          Settings
        </Tab>
      </TabList>
    </Tabs>
  ),
};

// =============================================================================
// Controlled
// =============================================================================

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("overview");

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-body-sm text-text-low">Active tab:</span>
          <span className="text-body-sm-bold text-text-extra-high">
            {value}
          </span>
        </div>
        <Tabs onValueChange={setValue} value={value}>
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="analytics">Analytics</Tab>
            <Tab value="reports">Reports</Tab>
          </TabList>
          <TabPanel value="overview">
            <p className="text-body-md text-text-medium">
              Overview content — controlled
            </p>
          </TabPanel>
          <TabPanel value="analytics">
            <p className="text-body-md text-text-medium">
              Analytics content — controlled
            </p>
          </TabPanel>
          <TabPanel value="reports">
            <p className="text-body-md text-text-medium">
              Reports content — controlled
            </p>
          </TabPanel>
        </Tabs>
      </div>
    );
  },
};
