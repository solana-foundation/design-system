# Storybook Guide

Keep it simple. Show the component, let people play with it. Done.

## Structure

Every component needs exactly **2 stories**:

| Story | Purpose |
|-------|---------|
| **Playground** | Interactive controls for all props |
| **Overview** | Visual reference showing all options at a glance |

That's it. No guidelines, no accessibility lectures, no anatomy diagrams. Developers can figure it out.

## Playground

The interactive sandbox. Enable all controls.

```tsx
export const Playground: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
  },
};
```

## Overview

One page showing everything the component can do. Visual grid format.

```tsx
export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[720px] flex-col gap-10 p-8">
      {/* Variants */}
      <section className="flex flex-col gap-4">
        <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">
          Variants
        </h4>
        <div className="flex items-center gap-4 rounded-xl bg-gray-100 p-6">
          <Component variant="primary" />
          <Component variant="secondary" />
        </div>
      </section>

      {/* Sizes */}
      <section className="flex flex-col gap-4">
        <h4 className="...">Sizes</h4>
        <div className="...">
          {/* Show all sizes */}
        </div>
      </section>

      {/* States, Icons, etc. */}
    </div>
  ),
};
```

## Visual Design

- **Background**: `bg-gray-100 rounded-xl p-6`
- **Section labels**: `text-xs text-text-low uppercase tracking-wide`
- **Fixed width**: `w-[720px]` for consistency
- **Gap between sections**: `gap-10`

## What NOT to Do

- Don't create separate stories for each variant/size/state
- Don't write usage guidelines - the code is the documentation
- Don't add "do/don't" examples - it's patronizing
- Don't explain what a button is - people know
- Don't add accessibility lectures - put aria-label in examples and move on

## The Test

If you're about to add a third story, stop and ask: can this just be another section in Overview?

The answer is almost always yes.
