import {
  ComputerDesktopIcon,
  ListBulletIcon,
  MoonIcon,
  Squares2X2Icon,
  SunIcon,
} from "@heroicons/react/24/outline";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedControl } from "./index";

const meta: Meta<typeof SegmentedControl> = {
  title: "Primitives/Segmented Control",
  component: SegmentedControl,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Segmented control with a smooth sliding indicator animation using Motion's shared layout system.",
      },
    },
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
      <SegmentedControl
        defaultValue="grid"
        items={[
          { value: "grid", label: "Grid", icon: <Squares2X2Icon /> },
          { value: "list", label: "List", icon: <ListBulletIcon /> },
        ]}
      />
      <SegmentedControl
        defaultValue="system"
        items={[
          { value: "light", label: "Light", icon: <SunIcon /> },
          { value: "dark", label: "Dark", icon: <MoonIcon /> },
          { value: "system", label: "System", icon: <ComputerDesktopIcon /> },
        ]}
      />
    </div>
  ),
};
