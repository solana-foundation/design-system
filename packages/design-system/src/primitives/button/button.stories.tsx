import {
  ArrowRightIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "./index";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Interactive button with spring-based motion feedback. Supports multiple variants, sizes, and icon configurations.",
      },
    },
    controls: {
      include: ["children", "variant", "size", "radius", "disabled", "loading"],
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["primary", "secondary"],
      description:
        "Visual hierarchy. Primary for main actions, Secondary for supporting.",
      table: {
        category: "Appearance",
        type: { summary: '"primary" | "secondary"' },
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: "radio",
      options: ["xl", "lg", "md", "sm"],
      description: "Size preset: XL=48px, LG=40px, MD=36px, SM=28px.",
      table: {
        category: "Appearance",
        type: { summary: '"xl" | "lg" | "md" | "sm"' },
        defaultValue: { summary: "md" },
      },
    },
    radius: {
      control: "radio",
      options: ["default", "round"],
      description:
        "Corner style. Default uses size-specific radius, Round is fully rounded.",
      table: {
        category: "Appearance",
        type: { summary: '"default" | "round"' },
        defaultValue: { summary: "default" },
      },
    },
    iconLeft: {
      control: "boolean",
      description: "Icon element displayed before the button text.",
      mapping: { true: <PlusIcon />, false: undefined },
      table: { category: "Icons", type: { summary: "ReactNode" } },
    },
    iconRight: {
      control: "boolean",
      description: "Icon element displayed after the button text.",
      mapping: { true: <ArrowRightIcon />, false: undefined },
      table: { category: "Icons", type: { summary: "ReactNode" } },
    },
    iconOnly: {
      control: "boolean",
      description: "Renders as a square icon-only button. Requires aria-label.",
      table: {
        category: "Icons",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction and reduces opacity.",
      table: {
        category: "State",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    loading: {
      control: "boolean",
      description: "Shows spinner and disables interaction.",
      table: {
        category: "State",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    children: {
      control: "text",
      description: "Button label text.",
      table: { category: "Content", type: { summary: "ReactNode" } },
    },
    asChild: {
      control: "boolean",
      description:
        "Renders styles on child element (for links). Motion props unsupported.",
      table: {
        category: "Advanced",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// ANIMATED ICON COMPONENT
// =============================================================================

/**
 * Animated icon for blur+scale crossfade transitions.
 * Uses AnimatePresence with mode="popLayout" for simultaneous exit/enter.
 * Pattern from Jakub Antalik (jakub.kr).
 */
const AnimatedCopyIcon = ({ copied }: { copied: boolean }) => (
  <AnimatePresence initial={false} mode="popLayout">
    <motion.span
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      className="flex items-center justify-center"
      exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
      initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
      key={copied ? "check" : "copy"}
      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
    >
      {copied ? (
        <CheckIcon height={16} width={16} />
      ) : (
        <ClipboardDocumentIcon height={16} width={16} />
      )}
    </motion.span>
  </AnimatePresence>
);

/**
 * Interactive copy button demo with state management.
 */
const CopyButtonDemo = () => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      iconLeft={<AnimatedCopyIcon copied={copied} />}
      onClick={handleClick}
      size="md"
      variant="secondary"
    >
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
};

// =============================================================================
// 1. PLAYGROUND
// =============================================================================

/**
 * Interactive playground for exploring all button props.
 */
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
  render: (args) => {
    const needsDefaultIcon = args.iconOnly && !args.iconLeft && !args.iconRight;
    return (
      <Button
        {...args}
        iconLeft={
          args.iconLeft || (needsDefaultIcon ? <PlusIcon /> : undefined)
        }
      />
    );
  },
};

// =============================================================================
// 2. OVERVIEW
// =============================================================================

/**
 * Visual reference grid showing all button options at a glance.
 */
export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[720px] flex-col gap-10 p-8">
      {/* Variants */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          Variants
        </h4>
        <div className="flex items-center gap-4 rounded-xl border border-border-medium p-6">
          <Button size="lg" variant="primary">
            Primary
          </Button>
          <Button size="lg" variant="secondary">
            Secondary
          </Button>
        </div>
      </section>

      {/* Sizes */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          Sizes
        </h4>
        <div className="flex items-end gap-4 rounded-xl border border-border-medium p-6">
          <div className="flex flex-col items-center gap-2">
            <Button size="xl" variant="primary">
              Button
            </Button>
            <span className="text-text-low text-xs">XL / 48px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button size="lg" variant="primary">
              Button
            </Button>
            <span className="text-text-low text-xs">LG / 40px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button size="md" variant="primary">
              Button
            </Button>
            <span className="text-text-low text-xs">MD / 36px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button size="sm" variant="primary">
              Button
            </Button>
            <span className="text-text-low text-xs">SM / 28px</span>
          </div>
        </div>
      </section>

      {/* Shapes */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          Shapes
        </h4>
        <div className="flex items-center gap-4 rounded-xl border border-border-medium p-6">
          <div className="flex flex-col items-center gap-2">
            <Button radius="default" size="lg" variant="primary">
              Default
            </Button>
            <span className="text-text-low text-xs">Size-specific radius</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button radius="round" size="lg" variant="primary">
              Round
            </Button>
            <span className="text-text-low text-xs">Pill shape</span>
          </div>
        </div>
      </section>

      {/* States */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          States
        </h4>
        <div className="flex items-center gap-4 rounded-xl border border-border-medium p-6">
          <div className="flex flex-col items-center gap-2">
            <Button size="md" variant="primary">
              Default
            </Button>
            <span className="text-text-low text-xs">Interactive</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button disabled size="md" variant="primary">
              Disabled
            </Button>
            <span className="text-text-low text-xs">40% opacity</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button loading size="md" variant="primary">
              Loading
            </Button>
            <span className="text-text-low text-xs">Spinner overlay</span>
          </div>
        </div>
      </section>

      {/* Icons */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          Icons
        </h4>
        <div className="flex items-center gap-4 rounded-xl border border-border-medium p-6">
          <div className="flex flex-col items-center gap-2">
            <Button iconLeft={<PlusIcon />} size="md" variant="primary">
              Leading
            </Button>
            <span className="text-text-low text-xs">Before label</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button iconRight={<ArrowRightIcon />} size="md" variant="primary">
              Trailing
            </Button>
            <span className="text-text-low text-xs">After label</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button
              aria-label="Search"
              iconLeft={<MagnifyingGlassIcon />}
              iconOnly
              size="md"
              variant="primary"
            />
            <span className="text-text-low text-xs">Icon only</span>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          Interactive Demo
        </h4>
        <div className="flex flex-col items-start gap-3 rounded-xl border border-border-medium p-6">
          <CopyButtonDemo />
          <p className="text-body-sm text-text-medium">
            Click to see blur+scale icon transition
          </p>
        </div>
      </section>
    </div>
  ),
};
