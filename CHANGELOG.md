# Changelog

All changes to the Solana Design System with explanations.

---

## 2026-05-06 (Rim Shadows)

### Added opt-in `shadow-rim`, `shadow-rim-elevated`, `shadow-rim-overlay` utilities

**What:** Three new Tailwind shadow utilities providing a dimensional alternative to flat 1px borders. Implements [@nilseller's recipe](https://twitter.com/nilseller) verbatim: `inset 0 0 0 1px white` + `0 0 0 1px rgba(0,0,0,0.04)`. The white inset acts as a top-edge highlight; the 4% outer suggests the surface lifts off the canvas. Elevated adds a soft drop layer (cards, popovers); overlay adds soft + deep layers (modals, dialogs). Four atom tokens (`--rim-highlight`, `--rim-shadow`, `--rim-drop-soft`, `--rim-drop-deep`) drive the variants and adapt automatically across light/dark.

**Why:** Flat 1px gray borders read muddy because they have no directional info. Stacking a bright inset highlight + a subtle outer hairline gives surfaces a sharper, more dimensional feel — the same trick behind Stripe / Linear / Vercel's button polish.

**How to use:**

```html
<!-- Replaces border + bg combinations -->
<div class="bg-gray-50 shadow-rim rounded-xl p-6">Card</div>
<div class="bg-gray-100 shadow-rim-elevated rounded-xl p-6">Popover</div>
<div class="bg-gray-100 shadow-rim-overlay rounded-xl p-6">Modal</div>
```

For Windows High Contrast Mode support, pair with `border border-transparent` — `box-shadow` is stripped in `forced-colors` mode and a transparent border becomes a `CanvasText` boundary.

**When to use it (and when not to):** The rim is for the canonical "card on canvas" pattern — a white surface lifted off a neutral gray page. It does NOT work on tinted/branded surfaces (the dark-gray ring fights the tint), surfaces that match the canvas tonally (no separation to sharpen), or cards darker than their canvas (light-source intuition reverses). For those cases, use `border border-border-medium`. See the Storybook story for examples.

**Scope:** Purely additive. No primitive component changes — every existing flat-border component keeps working as-is.

---

## 2026-02-18 (Seamless Static Addons)

### Seamless static addons in InputField and NumberField

**What:** Static text addons ("https://", "$", "@") now render seamlessly inside both `InputField` and `NumberField` with no separator line, lower emphasis (`text-text-low` / 56%), and tighter spacing (`contentGap / 2` ≈ 3–4px). Interactive addons (dropdowns, buttons) keep their divider and `text-text-high` color. Story addon text no longer applies `font-medium`, letting prefixes recede below the input value.

**Why:** Stripe, Geist, Radix, and Material all render text prefixes as embedded, de-emphasized text with no separator. The previous implementation only covered `InputField` and used `text-text-medium` (72%) with full `contentGap` (6–8px) — still too prominent. Halving the gap approximates a natural word space, and `text-text-low` places the prefix below the input value but above the placeholder in the visual hierarchy.

---

## 2026-02-18 (Tooltip Redesign)

### Added TooltipProvider for skip-delay grouping

**What:** Added `TooltipProvider` component that wraps multiple `Tooltip` instances in a shared `BaseTooltip.Provider`. When a tooltip closes, any other tooltip in the same provider opens instantly (within 300ms) instead of waiting for the full delay.

**Why:** Previously every `<Tooltip>` created its own provider, so the skip-delay pattern never worked — hovering between nearby triggers always incurred the full 200ms wait. Wrapping a toolbar or nav in `<TooltipProvider>` now gives the expected instant-open behavior.

### Added closeDelay (150ms grace period)

**What:** Tooltips now wait 150ms before hiding on mouse-out, both standalone and inside `TooltipProvider`.

**Why:** Instant vanish on mouse-out made tooltips feel twitchy. A 150ms grace period lets users move between nearby triggers without the tooltip flickering away.

### Tuned animation for a satisfying pop

**What:** Changed scale from `0.985` to `0.96` and duration from `140ms` to `125ms`. Added `max-w-[320px]` with `text-pretty` for balanced wrapping.

**Why:** The old 1.5% scale change was barely perceptible — the tooltip just "appeared." A 4% scale change creates a visible, satisfying pop without being distracting. Faster duration makes it feel snappier.

---

## 2026-02-18 (Field Typography Calibration)

### Calibrated placeholder hierarchy for Input, Select, and Number Field

**What:** Added input typography tokens (`--input-text-size-*`, `--input-label-size-*`, `--input-description-size-*`, `--input-text-line-height`, `--input-placeholder-color`) and updated field primitives so placeholder text uses the same size/line-height rhythm as entered value text.

**Why:** Placeholder hierarchy now comes from emphasis color and weight, not reduced type size. This removes the “placeholder feels smaller than label/value” optical mismatch while preserving 48/40/36 control heights.

**Rule:** Placeholder and value share typography; hierarchy is expressed through emphasis (`--input-placeholder-color`), not by shrinking the placeholder.

## 2026-01-19 (Typography System)

### Added Inter Variable typography system

**What:** Implemented comprehensive typography system using Inter Variable font from Google Fonts with fluid responsive scaling.

**Why:** Replacing ABC Diatype headings with Inter Variable provides:

- Continuous weight scale (100-900) for precise typography control
- Optical sizing that automatically adjusts letterforms at different sizes
- Fluid responsive scaling using CSS clamp() for display/title sizes
- Better cross-platform consistency via Google Fonts CDN

### Typography classes added

**What:** 17 new typography classes following `text-{category}-{size}[-variant]` pattern:

| Category         | Classes                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Display & Titles | `text-display`, `text-title-xl`, `text-title-lg`, `text-title-md`, `text-title-sm`                            |
| Headlines        | `text-headline-lg`, `text-headline-md`                                                                        |
| Body             | `text-body-lg`, `text-body-lg-bold`, `text-body-md`, `text-body-md-bold`, `text-body-sm`, `text-body-sm-bold` |
| Buttons          | `text-button-xl`, `text-button-lg`, `text-button-md`, `text-button-sm`                                        |

**Why:** Consistent naming pattern that both developers and AI agents can predict. Size modifiers (xl, lg, md, sm) align with Tailwind conventions.

### Fluid typography for display/titles

**What:** Display and title sizes scale smoothly between 768px and 1440px viewport widths:

| Style    | Mobile (768px) | Desktop (1440px) |
| -------- | -------------- | ---------------- |
| display  | 36px           | 48px             |
| title-xl | 28px           | 36px             |
| title-lg | 22px           | 28px             |
| title-md | 19px           | 24px             |
| title-sm | 16px           | 19px             |

**Why:** Fluid scaling ensures headings look proportional on all screen sizes without breakpoint jumps. Headlines, body, and button text stay static for UI predictability.

### Typography CSS variables

**What:** Added CSS variables for weights, tracking, and line-heights:

- `--font-weight-regular: 450`, `--font-weight-medium: 500`, `--font-weight-semibold: 600`, `--font-weight-bold: 550`
- `--tracking-tight: -0.01em` (most styles use -1% letter-spacing)
- `--leading-none: 1`, `--leading-tight: 1.1`, `--leading-snug: 1.25`, `--leading-normal: 1.5`

**Why:** Design tokens allow consistent typography across components and make future adjustments easier.

### Legacy class aliases

**What:** Added backwards-compatible aliases for old typography classes:

- `.text-h1` → `.text-display`
- `.text-title-2` → `.text-title-xl`
- `.text-h2` → `.text-title-lg`
- `.text-title-4` → `.text-title-md`
- `.text-title-5` → `.text-title-sm`

**Why:** Allows gradual migration without breaking existing code.

### Typography Storybook stories

**What:** Created `src/tokens/typography.stories.tsx` with 7 stories: Overview, Titles, Headlines, Body, Buttons, Fluid Scaling demo, and Weight Scale.

**Why:** Visual documentation for the typography system. The fluid scaling demo shows real-time viewport-responsive behavior.

---

## 2026-01-19

### Removed shadcn/Radix/TanStack dependencies

**What:** Removed all @radix-ui packages, @tanstack/react-table, class-variance-authority, clsx, tailwind-merge, cmdk

**Why:** Starting fresh without shadcn patterns. Building our own component primitives with Motion for animations instead of relying on Radix UI primitives.

### Added Motion

**What:** Added `motion` package (v12.26.0)

**Why:** Modern animation library for React. Note: This was formerly called "framer-motion" but the package is now just "motion". Import with `import { motion } from "motion/react"`.

### Created project context files

**What:** Added CLAUDE.md and CHANGELOG.md

**Why:** CLAUDE.md gives AI agents context about the project. CHANGELOG.md documents all changes with reasoning so future sessions understand why decisions were made.

### Added gray color palette with light/dark mode

**What:** Added 15-step gray scale (50-1400) from designer's palette JSON. Colors automatically switch between light and dark mode.

**Why:** Foundation for the design system's color tokens. The scale uses CSS variables that swap values when `.dark` class is present:

- Light mode: 50 is lightest (#F6F6F9), 1400 is darkest (#0F0F10)
- Dark mode: 50 is darkest (#000000), 1400 is lightest (#DEDDE7)

**Usage:** `bg-gray-500`, `text-gray-1200`, `border-gray-300` etc. Colors adapt automatically to light/dark mode.

### Deleted old Radix-based components

**What:** Removed entire `src/ui/` folder containing old components that depended on Radix UI.

**Why:** Starting fresh. Those components were built with shadcn patterns (Radix + CVA + clsx). We're building our own components from scratch using Motion for animations.

### Created Colors story

**What:** Added `src/tokens/colors.stories.tsx` to preview color palettes in Storybook.

**Why:** Visual reference for the design tokens. Shows all 15 gray steps in both light and dark mode side by side.

### Added Storybook theme toggle

**What:** Installed `@storybook/addon-themes` and configured light/dark mode toggle in toolbar.

**Why:** Allows switching between light and dark mode directly in Storybook toolbar instead of manually adding `.dark` class.

### Added semantic color tokens

**What:** Added semantic token layer in globals.css that references the gray primitives:

- Backgrounds: `bg-app`, `bg-subtle`, `bg-muted`, `bg-emphasized`, `bg-inverse`
- Text: `text-primary`, `text-secondary`, `text-muted`, `text-subtle`, `text-inverse`
- Borders: `border-default`, `border-muted`, `border-emphasized`
- Interactive: `interactive-default`, `interactive-hover`, `interactive-active`, `interactive-disabled`

**Why:** Raw values like `gray-500` don't tell developers when to use them. Semantic tokens provide context (e.g., use `text-primary` for headings, `bg-subtle` for cards).

### Restructured folder layout

**What:** Created atomic design folder structure:

```
src/
├── tokens/       # Design tokens (colors, typography, spacing)
├── primitives/   # Atoms (Button, Input, Badge)
├── components/   # Molecules (Card, SearchBar)
├── patterns/     # Templates (FormLayout, PageHeader)
├── hooks/        # Shared React hooks
└── utils/        # Utility functions (cn)
```

**Why:** Follows industry standard (Shopify Polaris, GitHub Primer). Organizes components by complexity level. Added path aliases (`@tokens`, `@primitives`, etc.) for clean imports.

### Added black and white base colors

**What:** Added `--black` (#000000) and `--white` (#FFFFFF) as base color tokens.

**Why:** Pure black and white are needed for certain use cases separate from the gray scale.

### Replaced text tokens with emphasis scale

**What:** Replaced `text-primary/secondary/muted/subtle/inverse` with new transparency-based emphasis system:

- `text-extra-high`: 100% opacity
- `text-high`: 88% opacity
- `text-medium`: 72% opacity
- `text-low`: 56% opacity
- `text-extra-low`: 44% opacity

**Why:** Using a single base color (gray-1400 in light mode, white in dark mode) with transparency creates more consistent text hierarchy. The opacity values match the Figma design spec.

**Technical note:** Uses CSS `color-mix()` function to apply transparency: `color-mix(in srgb, var(--gray-1400) 88%, transparent)`

### Replaced border tokens with transparency scale

**What:** Replaced `border-default/muted/emphasized` with new transparency-based border system:

- `border-strongest`: 100% (gray-1300 solid)
- `border-strong`: 48% opacity
- `border-medium`: 20% opacity
- `border-light`: 12% opacity
- `border-extra-light`: 4% opacity

**Why:** Consistent with text token approach. Uses gray-1300 as base in light mode, white in dark mode.

### Removed background and interactive tokens

**What:** Removed `bg-app/subtle/muted/emphasized/inverse` and `interactive-default/hover/active/disabled` tokens.

**Why:** Simplifying the token system. Use gray scale directly for backgrounds (e.g., `bg-gray-50`, `bg-gray-100`).

---

## Template for new entries

```
### [Title of change]
**What:** [Brief description of what changed]

**Why:** [Explanation of why this change was made]
```
