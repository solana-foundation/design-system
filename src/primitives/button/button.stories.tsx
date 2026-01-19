import type { Meta, StoryObj } from "@storybook/react";
import { Plus, ArrowRight, Search, Download, Trash2, Settings, Mail, Heart } from "lucide-react";
import { Button } from "./index";
import {
  StorySection,
  StoryGrid,
  GridLabel,
  GridCell,
  DoExample,
  DontExample,
  GuidelinesGrid,
  AnatomyDiagram,
  KeyboardShortcut,
} from "@story-components";

/**
 * # Button
 *
 * Buttons trigger actions or navigation. Use them for primary calls-to-action,
 * form submissions, and interactive controls.
 *
 * ## Features
 * - **Two variants**: Primary (high contrast) and Secondary (subtle)
 * - **Four sizes**: XL (48px), LG (40px), MD (36px), SM (28px)
 * - **iOS-style corners**: Squircle smoothing (60%) for organic feel
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
          "Interactive button component with motion-enhanced feedback, multiple variants, and iOS-style corner smoothing.",
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
      options: ["default", "pill"],
      description:
        "Corner style. **Default** uses size-specific squircle radius. **Pill** is fully rounded.",
      table: {
        category: "Appearance",
        type: { summary: '"default" | "pill"' },
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
      description: "Disables the button, reducing opacity and preventing interaction.",
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
      <div className="flex flex-col gap-6 items-center">
        <div className="flex gap-4 items-center">
          <Button variant="primary" size="lg">
            Primary Action
          </Button>
          <Button variant="secondary" size="lg">
            Secondary Action
          </Button>
        </div>
        <p className="text-body-sm text-text-medium text-center max-w-md">
          Two variants for visual hierarchy. Primary for main actions, Secondary
          for supporting options.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col gap-3 items-center text-center">
          <Button variant="primary" size="md" iconLeft={<Plus />}>
            With Icon
          </Button>
          <p className="text-body-sm text-text-medium">
            Icons reinforce action meaning
          </p>
        </div>
        <div className="flex flex-col gap-3 items-center text-center">
          <Button variant="primary" size="md" loading>
            Loading
          </Button>
          <p className="text-body-sm text-text-medium">
            Smooth loading transitions
          </p>
        </div>
        <div className="flex flex-col gap-3 items-center text-center">
          <Button variant="primary" size="md" radius="pill">
            Pill Shape
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
        title="Visual Hierarchy"
        description="Use variants to establish clear action priority."
      >
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="rounded-lg bg-gray-100 p-6 flex justify-center">
              <Button variant="primary" size="lg">
                Submit Form
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-body-sm text-text-extra-high font-medium">
                Primary
              </span>
              <span className="text-body-sm text-text-medium">
                High contrast, solid background. Use for the single most
                important action.
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-lg bg-gray-100 p-6 flex justify-center">
              <Button variant="secondary" size="lg">
                Cancel
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-body-sm text-text-extra-high font-medium">
                Secondary
              </span>
              <span className="text-body-sm text-text-medium">
                Subtle transparency. Use for supporting actions that
                don&apos;t compete with primary.
              </span>
            </div>
          </div>
        </div>
      </StorySection>

      <StorySection title="Together in Context">
        <div className="rounded-lg bg-gray-100 p-8 flex gap-3 justify-center">
          <Button variant="primary" size="md">
            Confirm
          </Button>
          <Button variant="secondary" size="md">
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
        title="Size Scale"
        description="Each size includes coordinated height, padding, typography, and icon sizing."
      >
        <StoryGrid columns={5}>
          {/* Header */}
          <div />
          <GridLabel header>XL</GridLabel>
          <GridLabel header>LG</GridLabel>
          <GridLabel header>MD</GridLabel>
          <GridLabel header>SM</GridLabel>

          {/* Height row */}
          <GridLabel>Height</GridLabel>
          <GridCell center>
            <span className="text-xs text-text-low font-mono">48px</span>
          </GridCell>
          <GridCell center>
            <span className="text-xs text-text-low font-mono">40px</span>
          </GridCell>
          <GridCell center>
            <span className="text-xs text-text-low font-mono">36px</span>
          </GridCell>
          <GridCell center>
            <span className="text-xs text-text-low font-mono">28px</span>
          </GridCell>

          {/* Primary row */}
          <GridLabel>Primary</GridLabel>
          {sizes.map((size) => (
            <GridCell key={`primary-${size}`} center>
              <Button variant="primary" size={size}>
                Button
              </Button>
            </GridCell>
          ))}

          {/* Secondary row */}
          <GridLabel>Secondary</GridLabel>
          {sizes.map((size) => (
            <GridCell key={`secondary-${size}`} center>
              <Button variant="secondary" size={size}>
                Button
              </Button>
            </GridCell>
          ))}

          {/* Icon size row */}
          <GridLabel>Icon Size</GridLabel>
          <GridCell center>
            <span className="text-xs text-text-low font-mono">20px</span>
          </GridCell>
          <GridCell center>
            <span className="text-xs text-text-low font-mono">18px</span>
          </GridCell>
          <GridCell center>
            <span className="text-xs text-text-low font-mono">16px</span>
          </GridCell>
          <GridCell center>
            <span className="text-xs text-text-low font-mono">14px</span>
          </GridCell>
        </StoryGrid>
      </StorySection>
    </div>
  ),
};

// =============================================================================
// 5. RADIUS
// =============================================================================

/**
 * Corner radius options: squircle vs pill.
 */
export const Radius: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Two corner styles. **Default** uses iOS-style squircle smoothing (60%) for an organic feel. **Pill** uses full rounding for a softer, more playful appearance.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <StorySection
        title="Corner Styles"
        description="Choose based on context and desired personality."
      >
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="rounded-lg bg-gray-100 p-6 flex flex-col gap-3 items-center">
              {sizes.map((size) => (
                <Button key={size} variant="primary" size={size} radius="default">
                  Squircle
                </Button>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-body-sm text-text-extra-high font-medium">
                Default (Squircle)
              </span>
              <span className="text-body-sm text-text-medium">
                iOS-style 60% corner smoothing. Size-specific radii: XL=12px,
                LG=10px, MD=8px, SM=6px.
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-lg bg-gray-100 p-6 flex flex-col gap-3 items-center">
              {sizes.map((size) => (
                <Button key={size} variant="primary" size={size} radius="pill">
                  Pill
                </Button>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-body-sm text-text-extra-high font-medium">
                Pill
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
// 6. WITH ICONS
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
        title="Icon Positions"
        description="Place icons strategically to reinforce the action."
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
            <GridCell key={`left-${size}`} center>
              <Button variant="primary" size={size} iconLeft={<Plus />}>
                Add
              </Button>
            </GridCell>
          ))}

          {/* Right Icon */}
          <GridLabel>Trailing</GridLabel>
          {sizes.map((size) => (
            <GridCell key={`right-${size}`} center>
              <Button variant="primary" size={size} iconRight={<ArrowRight />}>
                Next
              </Button>
            </GridCell>
          ))}

          {/* Both Icons */}
          <GridLabel>Both</GridLabel>
          {sizes.map((size) => (
            <GridCell key={`both-${size}`} center>
              <Button
                variant="primary"
                size={size}
                iconLeft={<Download />}
                iconRight={<ArrowRight />}
              >
                Download
              </Button>
            </GridCell>
          ))}

          {/* Icon Only */}
          <GridLabel>Icon Only</GridLabel>
          {sizes.map((size) => (
            <GridCell key={`icon-only-${size}`} center>
              <Button
                variant="primary"
                size={size}
                iconOnly
                iconLeft={<Search />}
                aria-label="Search"
              />
            </GridCell>
          ))}
        </StoryGrid>
      </StorySection>

      <StorySection
        title="Icon-Only Variants"
        description="Common icon-only button patterns."
      >
        <div className="flex gap-3 items-center justify-center">
          <Button variant="secondary" size="md" iconOnly iconLeft={<Heart />} aria-label="Favorite" />
          <Button variant="secondary" size="md" iconOnly iconLeft={<Mail />} aria-label="Message" />
          <Button variant="secondary" size="md" iconOnly iconLeft={<Settings />} aria-label="Settings" />
          <Button variant="secondary" size="md" iconOnly iconLeft={<Trash2 />} aria-label="Delete" />
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
        title="Interactive States"
        description="Each state provides clear visual feedback."
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
            <GridCell key={`default-${size}`} center>
              <Button variant="primary" size={size}>
                Button
              </Button>
            </GridCell>
          ))}

          {/* Disabled */}
          <GridLabel>Disabled</GridLabel>
          {sizes.map((size) => (
            <GridCell key={`disabled-${size}`} center>
              <Button variant="primary" size={size} disabled>
                Button
              </Button>
            </GridCell>
          ))}

          {/* Loading */}
          <GridLabel>Loading</GridLabel>
          {sizes.map((size) => (
            <GridCell key={`loading-${size}`} center>
              <Button variant="primary" size={size} loading>
                Button
              </Button>
            </GridCell>
          ))}
        </StoryGrid>
      </StorySection>

      <StorySection
        title="State Details"
        description="Hover for scale (1.02) + lift (-1px). Press for scale (0.97). Focus shows ring."
      >
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-2 items-center">
            <div className="text-xs text-text-low font-mono mb-2">Hover</div>
            <div className="rounded-lg bg-gray-100 p-4">
              <Button variant="primary" size="md" className="scale-[1.02] -translate-y-px">
                Hover state
              </Button>
            </div>
            <span className="text-xs text-text-medium">scale(1.02) translateY(-1px)</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="text-xs text-text-low font-mono mb-2">Press</div>
            <div className="rounded-lg bg-gray-100 p-4">
              <Button variant="primary" size="md" className="scale-[0.97]">
                Press state
              </Button>
            </div>
            <span className="text-xs text-text-medium">scale(0.97)</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="text-xs text-text-low font-mono mb-2">Focus</div>
            <div className="rounded-lg bg-gray-100 p-4">
              <Button variant="primary" size="md" className="ring-2 ring-[var(--button-focus-ring)] ring-offset-2">
                Focus state
              </Button>
            </div>
            <span className="text-xs text-text-medium">ring-2 + offset-2</span>
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
                "Squircle-clipped surface with background color and padding. Height varies by size.",
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
              variant="primary"
              size="lg"
              iconLeft={<Download />}
              iconRight={<ArrowRight />}
              className="ring-2 ring-[var(--button-focus-ring)] ring-offset-2"
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
        title="Usage Guidelines"
        description="Best practices for button hierarchy and labeling."
      >
        <GuidelinesGrid>
          <DoExample description="Use one primary button per section for the main action.">
            <div className="flex gap-3">
              <Button variant="primary" size="md">
                Save changes
              </Button>
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </div>
          </DoExample>
          <DontExample description="Avoid multiple primary buttons competing for attention.">
            <div className="flex gap-3">
              <Button variant="primary" size="md">
                Save
              </Button>
              <Button variant="primary" size="md">
                Submit
              </Button>
              <Button variant="primary" size="md">
                Confirm
              </Button>
            </div>
          </DontExample>
        </GuidelinesGrid>

        <GuidelinesGrid>
          <DoExample description="Use clear, action-oriented labels that describe what happens.">
            <Button variant="primary" size="md" iconLeft={<Mail />}>
              Send message
            </Button>
          </DoExample>
          <DontExample description="Avoid vague labels that don't communicate the action.">
            <Button variant="primary" size="md">
              Submit
            </Button>
          </DontExample>
        </GuidelinesGrid>

        <GuidelinesGrid>
          <DoExample description="Include aria-label for icon-only buttons.">
            <Button
              variant="secondary"
              size="md"
              iconOnly
              iconLeft={<Search />}
              aria-label="Search"
            />
          </DoExample>
          <DontExample description="Icon-only buttons without labels are inaccessible.">
            <Button variant="secondary" size="md" iconOnly iconLeft={<Search />} />
          </DontExample>
        </GuidelinesGrid>

        <GuidelinesGrid>
          <DoExample description="Match button size to the context and surrounding elements.">
            <div className="flex items-center gap-4">
              <div className="text-body-md text-text-high">Compact toolbar</div>
              <Button variant="secondary" size="sm" iconOnly iconLeft={<Settings />} aria-label="Settings" />
            </div>
          </DoExample>
          <DontExample description="Oversized buttons in compact layouts feel unbalanced.">
            <div className="flex items-center gap-4">
              <div className="text-body-md text-text-high">Compact toolbar</div>
              <Button variant="secondary" size="xl" iconOnly iconLeft={<Settings />} aria-label="Settings" />
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
        title="Keyboard Navigation"
        description="All buttons are fully keyboard accessible."
      >
        <div className="rounded-lg bg-gray-100 p-6">
          <div className="flex flex-col gap-2 max-w-md">
            <KeyboardShortcut
              keys={["Tab"]}
              description="Move focus to the button"
            />
            <KeyboardShortcut
              keys={["Enter"]}
              description="Activate the button"
            />
            <KeyboardShortcut
              keys={["Space"]}
              description="Activate the button"
            />
            <KeyboardShortcut
              keys={["Shift", "Tab"]}
              description="Move focus to previous element"
            />
          </div>
        </div>
      </StorySection>

      <StorySection
        title="ARIA Attributes"
        description="Semantic attributes for assistive technology."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg bg-gray-100 p-4 flex flex-col gap-2">
            <code className="text-xs font-mono text-text-medium">
              aria-label="Search"
            </code>
            <p className="text-body-sm text-text-medium">
              Required for icon-only buttons. Provides accessible name.
            </p>
          </div>
          <div className="rounded-lg bg-gray-100 p-4 flex flex-col gap-2">
            <code className="text-xs font-mono text-text-medium">
              aria-busy="true"
            </code>
            <p className="text-body-sm text-text-medium">
              Applied during loading state. Announces to screen readers.
            </p>
          </div>
          <div className="rounded-lg bg-gray-100 p-4 flex flex-col gap-2">
            <code className="text-xs font-mono text-text-medium">
              disabled
            </code>
            <p className="text-body-sm text-text-medium">
              Native disabled attribute. Button cannot be focused or activated.
            </p>
          </div>
          <div className="rounded-lg bg-gray-100 p-4 flex flex-col gap-2">
            <code className="text-xs font-mono text-text-medium">
              type="button"
            </code>
            <p className="text-body-sm text-text-medium">
              Default type prevents accidental form submission.
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection
        title="Focus Management"
        description="Visible focus indicators for keyboard users."
      >
        <div className="flex gap-6 items-start">
          <div className="flex flex-col gap-3 items-center">
            <Button
              variant="primary"
              size="lg"
              className="ring-2 ring-[var(--button-focus-ring)] ring-offset-2"
            >
              Focused Primary
            </Button>
            <span className="text-xs text-text-medium">Light mode offset</span>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <Button
              variant="secondary"
              size="lg"
              className="ring-2 ring-[var(--button-focus-ring)] ring-offset-2"
            >
              Focused Secondary
            </Button>
            <span className="text-xs text-text-medium">50% opacity ring</span>
          </div>
        </div>
      </StorySection>

      <StorySection
        title="Reduced Motion"
        description="Animations respect user preferences."
      >
        <div className="rounded-lg bg-gray-100 p-6">
          <p className="text-body-sm text-text-medium max-w-lg">
            When <code className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">prefers-reduced-motion: reduce</code> is
            set, all hover/press scale animations and loading transitions are
            disabled. Color transitions become instant.
          </p>
        </div>
      </StorySection>
    </div>
  ),
};
