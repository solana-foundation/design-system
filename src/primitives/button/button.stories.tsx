import {
  AnatomyDiagram,
  AnimationPreview,
  DoExample,
  DontExample,
  GridCell,
  GridLabel,
  GuidelinesGrid,
  KeyboardShortcut,
  StoryGrid,
  StorySection,
} from "@story-components";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  Heart,
  Mail,
  Plus,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCopyToClipboard } from "@/hooks";
import { Button } from "./index";

/**
 * # Button
 *
 * Buttons trigger actions or navigation. Use them for primary calls-to-action,
 * form submissions, and interactive controls.
 *
 * ## Features
 * - **Two variants**: Primary (high contrast) and Secondary (subtle)
 * - **Four sizes**: XL (48px), LG (40px), MD (36px), SM (28px)
 * - **Rounded corners**: Size-specific border radius for consistent look
 * - **Icon support**: Leading, trailing, or icon-only configurations
 * - **Motion**: Spring-based hover/press animations with reduced-motion support
 * - **Loading state**: Spinner overlay with content blur transition
 *
 * ## Accessibility
 * - Keyboard navigable with visible focus ring
 * - Supports `aria-label` for icon-only buttons
 * - Loading state announces via `aria-busy`
 * - Respects `prefers-reduced-motion`
 */
const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Interactive button component with motion-enhanced feedback and multiple variants.",
      },
    },
  },
  argTypes: {
    // === Appearance ===
    variant: {
      control: "radio",
      options: ["primary", "secondary"],
      description:
        "Visual hierarchy. **Primary** = main action, high contrast. **Secondary** = supporting action, subtle.",
      table: {
        category: "Appearance",
        type: { summary: '"primary" | "secondary"' },
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: "radio",
      options: ["xl", "lg", "md", "sm"],
      description:
        "Size preset controlling height, padding, typography, and icon sizing. XL=48px, LG=40px, MD=36px, SM=28px.",
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
        "Corner style. **Default** uses size-specific radius. **Round** is fully rounded.",
      table: {
        category: "Appearance",
        type: { summary: '"default" | "round"' },
        defaultValue: { summary: "default" },
      },
    },

    // === Icons ===
    iconLeft: {
      control: "boolean",
      description: "Icon element displayed before the button text.",
      mapping: {
        true: <Plus />,
        false: undefined,
      },
      table: {
        category: "Icons",
        type: { summary: "ReactNode" },
      },
    },
    iconRight: {
      control: "boolean",
      description: "Icon element displayed after the button text.",
      mapping: {
        true: <ArrowRight />,
        false: undefined,
      },
      table: {
        category: "Icons",
        type: { summary: "ReactNode" },
      },
    },
    iconOnly: {
      control: "boolean",
      description:
        "Renders as a square button with only an icon. Requires `iconLeft` or `iconRight` and `aria-label`.",
      table: {
        category: "Icons",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    // === State ===
    disabled: {
      control: "boolean",
      description:
        "Disables the button, reducing opacity and preventing interaction.",
      table: {
        category: "State",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    loading: {
      control: "boolean",
      description:
        "Shows a loading spinner and disables interaction. Content blurs during transition.",
      table: {
        category: "State",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    // === Content ===
    children: {
      control: "text",
      description: "Button label text or custom content.",
      table: {
        category: "Content",
        type: { summary: "ReactNode" },
      },
    },

    // === Advanced ===
    asChild: {
      control: "boolean",
      description:
        "Renders button styles on the child element (e.g., for links). Motion props are not supported with asChild.",
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

const sizes = ["xl", "lg", "md", "sm"] as const;

// =============================================================================
// 1. PLAYGROUND
// =============================================================================

/**
 * Interactive playground for exploring all button props.
 * Use the controls panel to experiment with different configurations.
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
  parameters: {
    docs: {
      description: {
        story:
          "Experiment with all button props using the controls panel. Try combining different variants, sizes, and states.",
      },
    },
  },
  render: (args) => {
    const needsDefaultIcon = args.iconOnly && !args.iconLeft && !args.iconRight;
    return (
      <Button
        {...args}
        iconLeft={args.iconLeft || (needsDefaultIcon ? <Plus /> : undefined)}
      />
    );
  },
};

// =============================================================================
// 2. OVERVIEW
// =============================================================================

/**
 * Hero showcase of key button features.
 */
export const Overview: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The Button component is the primary interactive element in the design system. It supports multiple visual hierarchies, sizes, and interaction patterns.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-12 p-8">
      {/* Hero buttons */}
      <div className="flex flex-col items-start gap-6">
        <div className="flex items-center gap-4">
          <Button size="lg" variant="primary">
            Primary Action
          </Button>
          <Button size="lg" variant="secondary">
            Secondary Action
          </Button>
        </div>
        <p className="max-w-md text-body-sm text-text-medium">
          Two variants for visual hierarchy. Primary for main actions, Secondary
          for supporting options.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col items-start gap-3 text-left">
          <Button iconLeft={<Plus />} size="md" variant="primary">
            With Icon
          </Button>
          <p className="text-body-sm text-text-medium">
            Icons reinforce action meaning
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 text-left">
          <Button loading size="md" variant="primary">
            Loading
          </Button>
          <p className="text-body-sm text-text-medium">
            Smooth loading transitions
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 text-left">
          <Button radius="round" size="md" variant="primary">
            Round Shape
          </Button>
          <p className="text-body-sm text-text-medium">
            Alternative corner style
          </p>
        </div>
      </div>
    </div>
  ),
};

// =============================================================================
// 3. VARIANTS
// =============================================================================

/**
 * Primary vs Secondary variants with usage guidance.
 */
export const Variants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "**Primary** buttons have high contrast and should be used for the main action on a page. **Secondary** buttons are subtle and work well for supporting actions.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <StorySection
        description="Use variants to establish clear action priority."
        title="Visual Hierarchy"
      >
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-center rounded-lg bg-gray-100 p-6">
              <Button size="lg" variant="primary">
                Submit Form
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-body-sm text-text-extra-high">
                Primary
              </span>
              <span className="text-body-sm text-text-medium">
                High contrast, solid background. Use for the single most
                important action.
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-center rounded-lg bg-gray-100 p-6">
              <Button size="lg" variant="secondary">
                Cancel
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-body-sm text-text-extra-high">
                Secondary
              </span>
              <span className="text-body-sm text-text-medium">
                Subtle transparency. Use for supporting actions that don&apos;t
                compete with primary.
              </span>
            </div>
          </div>
        </div>
      </StorySection>

      <StorySection title="Together in Context">
        <div className="flex justify-center gap-3 rounded-lg bg-gray-100 p-8">
          <Button size="md" variant="primary">
            Confirm
          </Button>
          <Button size="md" variant="secondary">
            Cancel
          </Button>
        </div>
      </StorySection>
    </div>
  ),
};

// =============================================================================
// 4. SIZES
// =============================================================================

/**
 * All four size presets with specifications.
 */
export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Four size presets designed for different contexts. XL for hero sections, LG for primary actions, MD for standard UI, SM for compact layouts.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <StorySection
        description="Each size includes coordinated height, padding, typography, and icon sizing."
        title="Size Scale"
      >
        <StoryGrid columns={5}>
          {/* Header */}
          <div />
          <GridLabel header>XL</GridLabel>
          <GridLabel header>LG</GridLabel>
          <GridLabel header>MD</GridLabel>
          <GridLabel header>SM</GridLabel>

          {/* Primary row */}
          <GridLabel>Primary</GridLabel>
          {sizes.map((size) => (
            <GridCell center key={`primary-${size}`}>
              <Button size={size} variant="primary">
                Button
              </Button>
            </GridCell>
          ))}

          {/* Secondary row */}
          <GridLabel>Secondary</GridLabel>
          {sizes.map((size) => (
            <GridCell center key={`secondary-${size}`}>
              <Button size={size} variant="secondary">
                Button
              </Button>
            </GridCell>
          ))}
        </StoryGrid>
      </StorySection>
    </div>
  ),
};

// =============================================================================
// 5. RADIUS
// =============================================================================

/**
 * Corner radius options: default vs round.
 */
export const Radius: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Two corner styles. **Default** uses size-specific border radius. **Round** uses full rounding for a softer, more playful appearance.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <StorySection
        description="Choose based on context and desired personality."
        title="Corner Styles"
      >
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-3 rounded-lg bg-gray-100 p-6">
              {sizes.map((size) => (
                <Button
                  key={size}
                  radius="default"
                  size={size}
                  variant="primary"
                >
                  Default
                </Button>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-body-sm text-text-extra-high">
                Default
              </span>
              <span className="text-body-sm text-text-medium">
                Size-specific radii: XL=12px, LG=10px, MD=8px, SM=6px.
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-3 rounded-lg bg-gray-100 p-6">
              {sizes.map((size) => (
                <Button key={size} radius="round" size={size} variant="primary">
                  Round
                </Button>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-body-sm text-text-extra-high">
                Round
              </span>
              <span className="text-body-sm text-text-medium">
                Fully rounded corners (9999px). Creates a softer, more playful
                look.
              </span>
            </div>
          </div>
        </div>
      </StorySection>
    </div>
  ),
};

// =============================================================================
// 6. RADIUS PADDING COMPARISON
// =============================================================================

/**
 * Side-by-side comparison of default vs round padding.
 * Round buttons use increased horizontal padding to compensate for the
 * optical illusion where curved ends "eat into" visual space.
 */
export const RadiusPaddingComparison: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Round buttons use increased horizontal padding (approximately 2:1 ratio vs default) to maintain visual balance. The curved ends create an optical illusion of less space, so extra padding compensates.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <StorySection
        description="Round buttons have increased horizontal padding to maintain visual balance."
        title="Default vs Round Padding"
      >
        <StoryGrid columns={3}>
          {/* Header */}
          <GridLabel header>Size</GridLabel>
          <GridLabel header>Default</GridLabel>
          <GridLabel header>Round</GridLabel>

          {/* Size rows */}
          {sizes.map((size) => (
            <>
              <GridLabel key={`label-${size}`}>{size.toUpperCase()}</GridLabel>
              <GridCell center key={`default-${size}`}>
                <Button radius="default" size={size} variant="primary">
                  Connect Wallet
                </Button>
              </GridCell>
              <GridCell center key={`round-${size}`}>
                <Button radius="round" size={size} variant="primary">
                  Connect Wallet
                </Button>
              </GridCell>
            </>
          ))}
        </StoryGrid>
      </StorySection>

      <StorySection
        description="Visual comparison with secondary variant."
        title="Secondary Variant Comparison"
      >
        <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg bg-gray-100 p-6">
          <Button radius="default" size="lg" variant="secondary">
            Default
          </Button>
          <Button radius="round" size="lg" variant="secondary">
            Round
          </Button>
        </div>
      </StorySection>
    </div>
  ),
};

// =============================================================================
// 7. WITH ICONS
// =============================================================================

/**
 * Icon positioning patterns: left, right, both, icon-only.
 */
export const WithIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Icons can appear before (leading), after (trailing), or as the only content. Icon size scales automatically with button size.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <StorySection
        description="Place icons strategically to reinforce the action."
        title="Icon Positions"
      >
        <StoryGrid columns={5}>
          {/* Header */}
          <div />
          <GridLabel header>XL</GridLabel>
          <GridLabel header>LG</GridLabel>
          <GridLabel header>MD</GridLabel>
          <GridLabel header>SM</GridLabel>

          {/* Left Icon */}
          <GridLabel>Leading</GridLabel>
          {sizes.map((size) => (
            <GridCell center key={`left-${size}`}>
              <Button iconLeft={<Plus />} size={size} variant="primary">
                Add
              </Button>
            </GridCell>
          ))}

          {/* Right Icon */}
          <GridLabel>Trailing</GridLabel>
          {sizes.map((size) => (
            <GridCell center key={`right-${size}`}>
              <Button iconRight={<ArrowRight />} size={size} variant="primary">
                Next
              </Button>
            </GridCell>
          ))}

          {/* Both Icons */}
          <GridLabel>Both</GridLabel>
          {sizes.map((size) => (
            <GridCell center key={`both-${size}`}>
              <Button
                iconLeft={<Download />}
                iconRight={<ArrowRight />}
                size={size}
                variant="primary"
              >
                Download
              </Button>
            </GridCell>
          ))}

          {/* Icon Only */}
          <GridLabel>Icon Only</GridLabel>
          {sizes.map((size) => (
            <GridCell center key={`icon-only-${size}`}>
              <Button
                aria-label="Search"
                iconLeft={<Search />}
                iconOnly
                size={size}
                variant="primary"
              />
            </GridCell>
          ))}
        </StoryGrid>
      </StorySection>

      <StorySection
        description="Common icon-only button patterns."
        title="Icon-Only Variants"
      >
        <div className="flex items-center justify-center gap-3">
          <Button
            aria-label="Favorite"
            iconLeft={<Heart />}
            iconOnly
            size="md"
            variant="secondary"
          />
          <Button
            aria-label="Message"
            iconLeft={<Mail />}
            iconOnly
            size="md"
            variant="secondary"
          />
          <Button
            aria-label="Settings"
            iconLeft={<Settings />}
            iconOnly
            size="md"
            variant="secondary"
          />
          <Button
            aria-label="Delete"
            iconLeft={<Trash2 />}
            iconOnly
            size="md"
            variant="secondary"
          />
        </div>
      </StorySection>
    </div>
  ),
};

// =============================================================================
// 7. STATES
// =============================================================================

/**
 * All interactive states: default, hover, disabled, loading, focused.
 */
export const States: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Buttons support multiple states with appropriate visual feedback. Hover and focus states provide interaction cues, while disabled and loading states communicate availability.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <StorySection
        description="Each state provides clear visual feedback."
        title="Interactive States"
      >
        <StoryGrid columns={5}>
          {/* Header */}
          <div />
          <GridLabel header>XL</GridLabel>
          <GridLabel header>LG</GridLabel>
          <GridLabel header>MD</GridLabel>
          <GridLabel header>SM</GridLabel>

          {/* Default */}
          <GridLabel>Default</GridLabel>
          {sizes.map((size) => (
            <GridCell center key={`default-${size}`}>
              <Button size={size} variant="primary">
                Button
              </Button>
            </GridCell>
          ))}

          {/* Disabled */}
          <GridLabel>Disabled</GridLabel>
          {sizes.map((size) => (
            <GridCell center key={`disabled-${size}`}>
              <Button disabled size={size} variant="primary">
                Button
              </Button>
            </GridCell>
          ))}
        </StoryGrid>
      </StorySection>

      <StorySection
        description="Loading spinner animation respects reduced motion. Click Play to preview."
        title="Loading State"
      >
        <AnimationPreview label="Spinner rotation - 1s linear, infinite">
          <div className="flex items-center justify-center gap-4">
            {sizes.map((size) => (
              <Button
                key={`loading-${size}`}
                loading
                size={size}
                variant="primary"
              >
                Button
              </Button>
            ))}
          </div>
        </AnimationPreview>
      </StorySection>

      <StorySection
        description="Hover for scale (1.02) + lift (-1px). Press for scale (0.97). Focus shows ring."
        title="State Details"
      >
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="mb-2 font-mono text-text-low text-xs">Hover</div>
            <div className="rounded-lg bg-gray-100 p-4">
              <Button
                className="-translate-y-px scale-[1.02]"
                size="md"
                variant="primary"
              >
                Hover state
              </Button>
            </div>
            <span className="text-text-medium text-xs">
              scale(1.02) translateY(-1px)
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="mb-2 font-mono text-text-low text-xs">Press</div>
            <div className="rounded-lg bg-gray-100 p-4">
              <Button className="scale-[0.97]" size="md" variant="primary">
                Press state
              </Button>
            </div>
            <span className="text-text-medium text-xs">scale(0.97)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="mb-2 font-mono text-text-low text-xs">Focus</div>
            <div className="rounded-lg bg-gray-100 p-4">
              <Button
                className="ring-2 ring-[var(--button-focus-ring)] ring-offset-2"
                size="md"
                variant="primary"
              >
                Focus state
              </Button>
            </div>
            <span className="text-text-medium text-xs">ring-2 + offset-2</span>
          </div>
        </div>
      </StorySection>
    </div>
  ),
};

// =============================================================================
// 8. ANATOMY
// =============================================================================

/**
 * Labeled component parts diagram.
 */
export const Anatomy: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Understanding the button's structure helps with customization and ensuring consistent implementation.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <StorySection title="Component Structure">
        <AnatomyDiagram
          parts={[
            {
              number: 1,
              name: "Container",
              description:
                "Rounded surface with background color and padding. Height varies by size.",
            },
            {
              number: 2,
              name: "Leading Icon",
              description:
                "Optional icon before label. Size matches button size token.",
            },
            {
              number: 3,
              name: "Label",
              description:
                "Text content using button typography preset. Medium weight with wide tracking.",
            },
            {
              number: 4,
              name: "Trailing Icon",
              description:
                "Optional icon after label. Commonly used for navigation arrows.",
            },
            {
              number: 5,
              name: "Focus Ring",
              description:
                "Visible outline on keyboard focus. 2px ring with 2px offset.",
            },
          ]}
        >
          <div className="relative">
            {/* Annotated button */}
            <Button
              className="ring-2 ring-[var(--button-focus-ring)] ring-offset-2"
              iconLeft={<Download />}
              iconRight={<ArrowRight />}
              size="lg"
              variant="primary"
            >
              Download App
            </Button>
            {/* Annotation markers would go here in a full implementation */}
          </div>
        </AnatomyDiagram>
      </StorySection>
    </div>
  ),
};

// =============================================================================
// 9. GUIDELINES
// =============================================================================

/**
 * Do/Don't usage examples.
 */
export const Guidelines: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Follow these guidelines to ensure consistent and effective button usage across your application.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <StorySection
        description="Best practices for button hierarchy and labeling."
        title="Usage Guidelines"
      >
        <GuidelinesGrid>
          <DoExample description="Use one primary button per section for the main action.">
            <div className="flex gap-3">
              <Button size="md" variant="primary">
                Save changes
              </Button>
              <Button size="md" variant="secondary">
                Cancel
              </Button>
            </div>
          </DoExample>
          <DontExample description="Avoid multiple primary buttons competing for attention.">
            <div className="flex gap-3">
              <Button size="md" variant="primary">
                Save
              </Button>
              <Button size="md" variant="primary">
                Submit
              </Button>
              <Button size="md" variant="primary">
                Confirm
              </Button>
            </div>
          </DontExample>
        </GuidelinesGrid>

        <GuidelinesGrid>
          <DoExample description="Use clear, action-oriented labels that describe what happens.">
            <Button iconLeft={<Mail />} size="md" variant="primary">
              Send message
            </Button>
          </DoExample>
          <DontExample description="Avoid vague labels that don't communicate the action.">
            <Button size="md" variant="primary">
              Submit
            </Button>
          </DontExample>
        </GuidelinesGrid>

        <GuidelinesGrid>
          <DoExample description="Include aria-label for icon-only buttons.">
            <Button
              aria-label="Search"
              iconLeft={<Search />}
              iconOnly
              size="md"
              variant="secondary"
            />
          </DoExample>
          <DontExample description="Icon-only buttons without labels are inaccessible.">
            <Button
              iconLeft={<Search />}
              iconOnly
              size="md"
              variant="secondary"
            />
          </DontExample>
        </GuidelinesGrid>

        <GuidelinesGrid>
          <DoExample description="Match button size to the context and surrounding elements.">
            <div className="flex items-center gap-4">
              <div className="text-body-md text-text-high">Compact toolbar</div>
              <Button
                aria-label="Settings"
                iconLeft={<Settings />}
                iconOnly
                size="sm"
                variant="secondary"
              />
            </div>
          </DoExample>
          <DontExample description="Oversized buttons in compact layouts feel unbalanced.">
            <div className="flex items-center gap-4">
              <div className="text-body-md text-text-high">Compact toolbar</div>
              <Button
                aria-label="Settings"
                iconLeft={<Settings />}
                iconOnly
                size="xl"
                variant="secondary"
              />
            </div>
          </DontExample>
        </GuidelinesGrid>
      </StorySection>
    </div>
  ),
};

// =============================================================================
// 10. ACCESSIBILITY
// =============================================================================

/**
 * Keyboard navigation, ARIA, and focus states.
 */
export const Accessibility: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The Button component follows WAI-ARIA button pattern guidelines and supports full keyboard navigation.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <StorySection
        description="All buttons are fully keyboard accessible."
        title="Keyboard Navigation"
      >
        <div className="rounded-lg bg-gray-100 p-6">
          <div className="flex max-w-md flex-col gap-2">
            <KeyboardShortcut
              description="Move focus to the button"
              keys={["Tab"]}
            />
            <KeyboardShortcut
              description="Activate the button"
              keys={["Enter"]}
            />
            <KeyboardShortcut
              description="Activate the button"
              keys={["Space"]}
            />
            <KeyboardShortcut
              description="Move focus to previous element"
              keys={["Shift", "Tab"]}
            />
          </div>
        </div>
      </StorySection>

      <StorySection
        description="Semantic attributes for assistive technology."
        title="ARIA Attributes"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg bg-gray-100 p-4">
            <code className="font-mono text-text-medium text-xs">
              aria-label="Search"
            </code>
            <p className="text-body-sm text-text-medium">
              Required for icon-only buttons. Provides accessible name.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-lg bg-gray-100 p-4">
            <code className="font-mono text-text-medium text-xs">
              aria-busy="true"
            </code>
            <p className="text-body-sm text-text-medium">
              Applied during loading state. Announces to screen readers.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-lg bg-gray-100 p-4">
            <code className="font-mono text-text-medium text-xs">disabled</code>
            <p className="text-body-sm text-text-medium">
              Native disabled attribute. Button cannot be focused or activated.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-lg bg-gray-100 p-4">
            <code className="font-mono text-text-medium text-xs">
              type="button"
            </code>
            <p className="text-body-sm text-text-medium">
              Default type prevents accidental form submission.
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection
        description="Visible focus indicators for keyboard users."
        title="Focus Management"
      >
        <div className="flex items-start gap-6">
          <div className="flex flex-col items-center gap-3">
            <Button
              className="ring-2 ring-[var(--button-focus-ring)] ring-offset-2"
              size="lg"
              variant="primary"
            >
              Focused Primary
            </Button>
            <span className="text-text-medium text-xs">Light mode offset</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Button
              className="ring-2 ring-[var(--button-focus-ring)] ring-offset-2"
              size="lg"
              variant="secondary"
            >
              Focused Secondary
            </Button>
            <span className="text-text-medium text-xs">50% opacity ring</span>
          </div>
        </div>
      </StorySection>

      <StorySection
        description="Animations respect user preferences."
        title="Reduced Motion"
      >
        <div className="rounded-lg bg-gray-100 p-6">
          <p className="max-w-lg text-body-sm text-text-medium">
            When{" "}
            <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs">
              prefers-reduced-motion: reduce
            </code>{" "}
            is set, all hover/press scale animations and loading transitions are
            disabled. Color transitions become instant.
          </p>
        </div>
      </StorySection>
    </div>
  ),
};

// =============================================================================
// 11. ICON TRANSITIONS
// =============================================================================

/**
 * Animated icon component for blur+scale crossfade transitions.
 * Uses AnimatePresence with mode="popLayout" for simultaneous exit/enter.
 * The popLayout mode automatically handles positioning for crossfade:
 * - Entering element takes normal layout flow
 * - Exiting element is removed from flow and positioned absolutely
 * Pattern from Jakub Antalik (jakub.kr).
 */
const AnimatedCopyIcon = ({ copied }: { copied: boolean }) => (
  <AnimatePresence initial={false} mode="popLayout">
    <motion.span
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      // Flex display for centering, popLayout handles crossfade positioning
      className="flex items-center justify-center"
      exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
      initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
      key={copied ? "check" : "copy"}
      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </motion.span>
  </AnimatePresence>
);

/**
 * Story render component with stateful icon animation.
 * Must be a proper React component to use hooks.
 */
const IconTransitionsDemo = () => {
  // Use local state for reliable animation testing
  // In production, use useCopyToClipboard() hook instead
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    setCopied(true);
    // Reset after 2 seconds to match useCopyToClipboard behavior
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

/**
 * Animated icon transitions using Motion's AnimatePresence.
 * Pattern inspired by Jakub.kr's blur-scale micro-interactions.
 *
 * Click the button to see the blur+scale crossfade animation.
 * The icon transitions from Copy to Check with a smooth animation.
 */
export const IconTransitions: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Smooth icon transitions for state changes. Use `AnimatePresence` with `mode="popLayout"` and a blur-scale animation for delightful feedback.',
      },
    },
  },
  render: () => <IconTransitionsDemo />,
};
