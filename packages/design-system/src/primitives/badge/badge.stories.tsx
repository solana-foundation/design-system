import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./index";

/**
 * # Badge
 *
 * Status indicators and labels with color variants.
 *
 * ## Quick Reference
 * - **Variants**: Default / Success / Warning / Danger / Info
 * - **Dot**: Optional colored circle before label
 * - **Height**: 20px, font: 12px medium weight
 * - **Border**: 1px currentColor at 12% opacity — auto-harmonizes
 * - **Colors**: Systematic OKLCH — one hue per variant, consistent L/C per role
 */
const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Compact status indicator with five color variants and an optional dot.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "success", "warning", "danger", "info"],
      table: {
        category: "Appearance",
        type: {
          summary: '"default" | "success" | "warning" | "danger" | "info"',
        },
        defaultValue: { summary: "default" },
      },
    },
    dot: {
      control: "boolean",
      table: {
        category: "Appearance",
        defaultValue: { summary: "false" },
      },
    },
    children: {
      control: "text",
      table: { category: "Content" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Playground: Story = {
  args: {
    variant: "default",
    dot: false,
    children: "Badge",
  },
};

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

export const WithDot: Story = {
  name: "With Dot",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge dot variant="default">
        Default
      </Badge>
      <Badge dot variant="success">
        Active
      </Badge>
      <Badge dot variant="warning">
        Expiring
      </Badge>
      <Badge dot variant="danger">
        Expired
      </Badge>
      <Badge dot variant="info">
        Pending
      </Badge>
    </div>
  ),
};

export const StatusExamples: Story = {
  name: "Status Examples",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge dot variant="success">
        Active
      </Badge>
      <Badge dot variant="danger">
        Revoked
      </Badge>
      <Badge variant="warning">Mainnet</Badge>
      <Badge variant="info">Devnet</Badge>
      <Badge variant="default">Read-only</Badge>
    </div>
  ),
};

export const ColorSystem: Story = {
  name: "Color System",
  parameters: {
    docs: {
      description: {
        story:
          "All four chromatic variants use a systematic OKLCH formula: one hue per variant, consistent lightness and chroma per role (bg/text/dot), varying only by mode. Light text L=0.40 on bg L=0.955 yields ~7:1 contrast (WCAG AAA).",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-text-medium">
          Chromatic variants — same L/C formula, different hue
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <Badge dot variant="success">
            H=155 Green
          </Badge>
          <Badge dot variant="warning">
            H=84 Amber
          </Badge>
          <Badge dot variant="danger">
            H=29 Red
          </Badge>
          <Badge dot variant="info">
            H=250 Blue
          </Badge>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-text-medium">
          Neutral variant — transparency-based, no OKLCH
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <Badge dot variant="default">
            Default
          </Badge>
          <Badge variant="default">No dot</Badge>
        </div>
      </div>
    </div>
  ),
};

export const OnDarkBackground: Story = {
  name: "On Dark Background",
  parameters: {
    docs: {
      description: {
        story:
          "Dark mode inverts the OKLCH formula: bg L=0.22 (was 0.955), text L=0.82 (was 0.40), dot L=0.60 (was 0.55). Chroma stays consistent.",
      },
    },
  },
  render: () => (
    <div className="dark rounded-xl bg-[#0f0f10] p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge dot variant="default">
            Default
          </Badge>
          <Badge dot variant="success">
            Active
          </Badge>
          <Badge dot variant="warning">
            Expiring
          </Badge>
          <Badge dot variant="danger">
            Expired
          </Badge>
          <Badge dot variant="info">
            Pending
          </Badge>
        </div>
      </div>
    </div>
  ),
};

export const InlineWithText: Story = {
  name: "Inline With Text",
  parameters: {
    docs: {
      description: {
        story:
          "Badges align vertically with body text. The 0.5px translateY on the text span compensates for Inter's ascender-heavy visual center at 12px.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="flex items-center gap-2 text-body-md text-text-high">
        API Key{" "}
        <Badge dot variant="success">
          Active
        </Badge>{" "}
        was created on Jan 15, 2026
      </p>
      <p className="flex items-center gap-2 text-body-md text-text-high">
        Network <Badge variant="warning">Mainnet</Badge> requires additional
        permissions
      </p>
      <p className="flex items-center gap-2 text-body-sm text-text-medium">
        Status:{" "}
        <Badge dot variant="danger">
          Revoked
        </Badge>{" "}
        — contact support for reactivation
      </p>
    </div>
  ),
};
