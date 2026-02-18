---
name: storybook
description: Write Storybook stories for Solana design system components. Use after creating or modifying a component, when asked to write stories, or when "storybook" or "story" is mentioned.
argument-hint: [component-path]
---

# Storybook Story Generator

Write stories matching the exact patterns used in the Solana design system.

## Step 1: Read the component

Read the component source at `$ARGUMENTS` (or infer from conversation context).

Extract:
- Props/types interface (all prop names, types, defaults)
- Variants (e.g., `"primary" | "secondary"`)
- Sizes (e.g., `"xl" | "lg" | "md" | "sm"`)
- States (e.g., disabled, loading, error)
- Icon props (iconLeft, iconRight, iconOnly)
- Whether it imports from `motion/react` (triggers Motion Playground section)

## Step 2: Write the story file

Place the story file next to the component: `<component-dir>/<component-name>.stories.tsx`

Follow this exact structure:

### 1. Imports

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
// Lucide icons as needed
import { Component } from "./index";
```

CRITICAL: Import from `@storybook/react-vite`, NOT `@storybook/react`.

### 2. JSDoc block

```tsx
/**
 * # ComponentName
 *
 * One-line description of what this component does.
 *
 * ## Quick Reference
 * - **Variants**: List variants with brief explanation
 * - **Sizes**: List sizes with pixel heights
 * - **States**: List interactive states
 * - **Slots**: List configurable slots (icons, labels, etc.)
 */
```

### 3. Meta object

```tsx
const meta: Meta<typeof Component> = {
  title: "Primitives/ComponentName",
  component: Component,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Short description for the docs page.",
      },
    },
    controls: {
      include: [/* list of primary controls to show by default */],
    },
  },
  argTypes: {
    // Group all argTypes by table.category:
    //   "Appearance" — variant, size, radius
    //   "State"      — disabled, loading
    //   "Icons"      — iconLeft, iconRight, iconOnly
    //   "Content"    — children, placeholder, label
    //   "Field"      — label, description, error (for form components)
    //   "Advanced"   — asChild
  },
};
```

#### argType patterns

**Enum props** (variant, size, radius):
```tsx
variant: {
  control: "radio",
  options: ["primary", "secondary"],
  description: "Visual hierarchy. Primary for main actions, Secondary for supporting.",
  table: {
    category: "Appearance",
    type: { summary: '"primary" | "secondary"' },
    defaultValue: { summary: "primary" },
  },
},
```

**Boolean props** (disabled, loading):
```tsx
disabled: {
  control: "boolean",
  description: "Disables interaction and reduces opacity.",
  table: {
    category: "State",
    type: { summary: "boolean" },
    defaultValue: { summary: "false" },
  },
},
```

**Icon props** — use boolean control with mapping:
```tsx
iconLeft: {
  control: "boolean",
  description: "Icon element displayed before the text.",
  mapping: { true: <Search />, false: undefined },
  table: { category: "Icons", type: { summary: "ReactNode" } },
},
```

**Text props** (children, placeholder):
```tsx
children: {
  control: "text",
  description: "Button label text.",
  table: { category: "Content", type: { summary: "ReactNode" } },
},
```

### 4. Story type alias

```tsx
export default meta;
type Story = StoryObj<typeof meta>;
```

### 5. PLAYGROUND (always first story)

```tsx
// =============================================================================
// 1. PLAYGROUND
// =============================================================================

/**
 * Interactive playground for exploring all props.
 */
export const Playground: Story = {
  args: {
    // All controllable defaults
  },
  // render function only if needed for conditional logic
  render: (args) => <Component {...args} />,
};
```

- Always named `Playground`
- Set sensible defaults for every controllable prop
- Use a `render` function only when needed (e.g., toggling icons, wrapping in a container for width)

### 6. OVERVIEW (always second story)

```tsx
// =============================================================================
// 2. OVERVIEW
// =============================================================================

/**
 * Visual reference grid showing all component options at a glance.
 */
export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[720px] flex-col gap-10 p-8">
      {/* Section Name */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          Section Name
        </h4>
        <div className="flex items-center gap-4 rounded-xl border border-border-medium p-6">
          {/* Items with captions */}
          <div className="flex flex-col items-center gap-2">
            <Component />
            <span className="text-text-low text-xs">Caption</span>
          </div>
        </div>
      </section>
    </div>
  ),
};
```

Key Overview rules:
- `parameters: { controls: { disable: true } }` — no controls panel
- Outer container: `w-[720px] flex-col gap-10 p-8`
- Each section: `<section>` with `<h4>` heading + bordered container
- Heading style: `font-medium text-text-low text-xs uppercase tracking-wide`
- Container style: `rounded-xl border border-border-medium p-6`
- Item captions: `<span className="text-text-low text-xs">`
- For horizontal items: `flex items-center gap-4` (or `items-end` for different heights)
- For vertical items: `flex flex-col gap-4`

Sections to include (only those relevant to the component):
- **Variants** — show each variant side by side
- **Sizes** — show each size with pixel label
- **Shapes** — if radius options exist
- **States** — default, disabled, loading, error, etc.
- **Icons** — leading, trailing, icon-only configurations
- **Labels/Fields** — for form components (label, description, error)
- **Validation** — for form components with error states
- **Interactive Demo** — if component has interesting stateful behavior (e.g., copy button, toggle)

### 7. MOTION PLAYGROUND (optional — only for animated components)

Only include when the component imports from `motion/react`.

```tsx
// =============================================================================
// 3. MOTION PLAYGROUND
// =============================================================================

/**
 * Motion playground for exploring animation parameters.
 */
export const MotionPlayground: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[720px] flex-col gap-10 p-8">
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          Animation Preview
        </h4>
        <AnimationPreview label="Description of the animation">
          {/* Component in its animated state */}
        </AnimationPreview>
      </section>
    </div>
  ),
};
```

Import the reusable component:
```tsx
import { AnimationPreview } from "../story-components/animation-preview";
```

### 8. INTERACTIVE DEMO (optional)

Only for components with interesting stateful behavior (e.g., copy-to-clipboard, toggles, multi-step flows).

Define the demo component above the stories:
```tsx
// =============================================================================
// DEMO COMPONENT
// =============================================================================

const DemoComponent = () => {
  const [state, setState] = useState(false);
  // Self-contained stateful demo
  return <Component />;
};
```

Then embed it in the Overview or as a separate story.

## Key rules

1. **Dark mode** — handled by Storybook's `withThemeByClassName` decorator globally. Never create separate dark-mode stories.
2. **Icons** — always use Lucide React. Never hardcode SVGs.
3. **Controls over stories** — prefer argType controls for variant exploration rather than separate named stories.
4. **Section banners** — use the full-width comment banner between sections:
   ```
   // =============================================================================
   ```
5. **Prop sorting** — sort JSX props alphabetically (Biome enforces this).
6. **One story file per component** — place it next to `index.tsx` in the component directory.

## Reference files

If you need to see gold-standard examples:
- `packages/design-system/src/primitives/button/button.stories.tsx` — full Playground + Overview + Interactive Demo
- `packages/design-system/src/primitives/input-field/input-field.stories.tsx` — simpler component with form fields
- `packages/design-system/.storybook/preview.tsx` — theme decorator config
- `packages/design-system/src/story-components/animation-preview.tsx` — reusable animation preview wrapper
