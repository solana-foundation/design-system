import type { Meta, StoryObj } from "@storybook/react";
import { Plus, ArrowRight } from "lucide-react";
import { Button } from "./index";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description: "Visual style variant",
    },
    size: {
      control: "select",
      options: ["xl", "lg", "md", "sm"],
      description: "Size preset",
    },
    radius: {
      control: "select",
      options: ["default", "pill"],
      description: "Border radius style",
    },
    iconLeft: {
      control: "boolean",
      description: "Show left icon",
      mapping: {
        true: <Plus />,
        false: undefined,
      },
    },
    iconRight: {
      control: "boolean",
      description: "Show right icon",
      mapping: {
        true: <ArrowRight />,
        false: undefined,
      },
    },
    iconOnly: {
      control: "boolean",
      description: "Render as square icon-only button",
    },
    loading: {
      control: "boolean",
      description: "Show loading spinner",
    },
    disabled: {
      control: "boolean",
      description: "Disable the button",
    },
    children: {
      control: "text",
      description: "Button label text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sizes = ["xl", "lg", "md", "sm"] as const;

export const Playground: Story = {
  args: {
    children: "Connect wallet",
    variant: "primary",
    size: "md",
    radius: "default",
    iconLeft: false,
    iconRight: false,
    iconOnly: false,
    loading: false,
    disabled: false,
  },
  parameters: {
    controls: {
      include: [
        "variant",
        "size",
        "radius",
        "iconLeft",
        "iconRight",
        "iconOnly",
        "loading",
        "disabled",
        "children",
      ],
    },
  },
  render: (args) => {
    // When iconOnly is true but no icon is provided, default to Plus icon
    const needsDefaultIcon = args.iconOnly && !args.iconLeft && !args.iconRight;
    return (
      <Button
        {...args}
        iconLeft={args.iconLeft || (needsDefaultIcon ? <Plus /> : undefined)}
      />
    );
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="grid grid-cols-[100px_auto_auto_auto_auto] gap-x-6 gap-y-4 items-center">
      {/* Header */}
      <div />
      <div className="text-xs font-medium text-text-low text-center">XL</div>
      <div className="text-xs font-medium text-text-low text-center">LG</div>
      <div className="text-xs font-medium text-text-low text-center">MD</div>
      <div className="text-xs font-medium text-text-low text-center">SM</div>

      {/* Primary */}
      <div className="text-xs font-medium text-text-low">Primary</div>
      {sizes.map((size) => (
        <Button key={`primary-${size}`} variant="primary" size={size}>
          Connect wallet
        </Button>
      ))}

      {/* Secondary */}
      <div className="text-xs font-medium text-text-low">Secondary</div>
      {sizes.map((size) => (
        <Button key={`secondary-${size}`} variant="secondary" size={size}>
          Connect wallet
        </Button>
      ))}
    </div>
  ),
};

export const States: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="grid grid-cols-[100px_auto_auto_auto_auto] gap-x-6 gap-y-4 items-center">
      {/* Header */}
      <div />
      <div className="text-xs font-medium text-text-low text-center">XL</div>
      <div className="text-xs font-medium text-text-low text-center">LG</div>
      <div className="text-xs font-medium text-text-low text-center">MD</div>
      <div className="text-xs font-medium text-text-low text-center">SM</div>

      {/* Default */}
      <div className="text-xs font-medium text-text-low">Default</div>
      {sizes.map((size) => (
        <Button key={`default-${size}`} variant="primary" size={size}>
          Connect wallet
        </Button>
      ))}

      {/* Disabled */}
      <div className="text-xs font-medium text-text-low">Disabled</div>
      {sizes.map((size) => (
        <Button key={`disabled-${size}`} variant="primary" size={size} disabled>
          Connect wallet
        </Button>
      ))}

      {/* Loading */}
      <div className="text-xs font-medium text-text-low">Loading</div>
      {sizes.map((size) => (
        <Button key={`loading-${size}`} variant="primary" size={size} loading>
          Connect wallet
        </Button>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="grid grid-cols-[100px_auto_auto_auto_auto] gap-x-6 gap-y-4 items-center">
      {/* Header */}
      <div />
      <div className="text-xs font-medium text-text-low text-center">XL</div>
      <div className="text-xs font-medium text-text-low text-center">LG</div>
      <div className="text-xs font-medium text-text-low text-center">MD</div>
      <div className="text-xs font-medium text-text-low text-center">SM</div>

      {/* Left Icon */}
      <div className="text-xs font-medium text-text-low">Left</div>
      {sizes.map((size) => (
        <Button
          key={`left-${size}`}
          variant="primary"
          size={size}
          iconLeft={<Plus />}
        >
          Connect wallet
        </Button>
      ))}

      {/* Right Icon */}
      <div className="text-xs font-medium text-text-low">Right</div>
      {sizes.map((size) => (
        <Button
          key={`right-${size}`}
          variant="primary"
          size={size}
          iconRight={<ArrowRight />}
        >
          Connect wallet
        </Button>
      ))}

      {/* Both Icons */}
      <div className="text-xs font-medium text-text-low">Both</div>
      {sizes.map((size) => (
        <Button
          key={`both-${size}`}
          variant="primary"
          size={size}
          iconLeft={<Plus />}
          iconRight={<ArrowRight />}
        >
          Connect wallet
        </Button>
      ))}

      {/* Icon Only */}
      <div className="text-xs font-medium text-text-low">Icon Only</div>
      {sizes.map((size) => (
        <Button
          key={`icon-only-${size}`}
          variant="primary"
          size={size}
          iconOnly
          iconLeft={<Plus />}
          aria-label="Add"
        />
      ))}
    </div>
  ),
};
