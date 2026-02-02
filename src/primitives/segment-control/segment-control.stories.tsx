import type { Meta, StoryObj } from "@storybook/react";
import { Grid3X3, LayoutList, Monitor, Moon, Sun } from "lucide-react";
import { SegmentControl } from "./index";

/**
 * # SegmentControl
 *
 * A segmented control for switching between related options. Features a smooth
 * sliding indicator animation using Motion's shared layout system.
 */
const meta: Meta<typeof SegmentControl> = {
  title: "Primitives/SegmentControl",
  component: SegmentControl,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive playground. Click segments to see the sliding animation.
 */
export const Playground: Story = {
  args: {
    items: [
      { value: "all", label: "All" },
      { value: "active", label: "Active" },
      { value: "completed", label: "Completed" },
    ],
    defaultValue: "all",
  },
};

/**
 * Segments can include icons alongside labels.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <SegmentControl
        defaultValue="grid"
        items={[
          { value: "grid", label: "Grid", icon: <Grid3X3 /> },
          { value: "list", label: "List", icon: <LayoutList /> },
        ]}
      />
      <SegmentControl
        defaultValue="system"
        items={[
          { value: "light", label: "Light", icon: <Sun /> },
          { value: "dark", label: "Dark", icon: <Moon /> },
          { value: "system", label: "System", icon: <Monitor /> },
        ]}
      />
    </div>
  ),
};
