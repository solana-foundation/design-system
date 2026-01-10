import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./index";

const meta: Meta<typeof Tabs> = {
  component: Tabs,
  title: "Primitives/Tabs",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs className="w-[400px]" defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="mt-2 rounded-md border p-4">
          <h3 className="font-medium">Account Settings</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            Make changes to your account here.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="mt-2 rounded-md border p-4">
          <h3 className="font-medium">Password Settings</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            Change your password here.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const MultipleTabs: Story = {
  render: () => (
    <Tabs className="w-[500px]" defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="mt-2 rounded-md border p-4">
          <p className="text-sm">Overview content goes here.</p>
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="mt-2 rounded-md border p-4">
          <p className="text-sm">Analytics content goes here.</p>
        </div>
      </TabsContent>
      <TabsContent value="reports">
        <div className="mt-2 rounded-md border p-4">
          <p className="text-sm">Reports content goes here.</p>
        </div>
      </TabsContent>
      <TabsContent value="notifications">
        <div className="mt-2 rounded-md border p-4">
          <p className="text-sm">Notifications content goes here.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const DisabledTab: Story = {
  render: () => (
    <Tabs className="w-[400px]" defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger disabled value="tab2">
          Tab 2 (disabled)
        </TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="mt-2 rounded-md border p-4">
          <p className="text-sm">Content for Tab 1</p>
        </div>
      </TabsContent>
      <TabsContent value="tab3">
        <div className="mt-2 rounded-md border p-4">
          <p className="text-sm">Content for Tab 3</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};
