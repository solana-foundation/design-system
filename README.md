# Solana Design System

Component library for Solana Foundation. Built with React, Tailwind CSS v4, Base UI, and Motion.

## Installation

### shadcn CLI (recommended)

Add components individually using the shadcn CLI:

```bash
npx shadcn@latest add https://design.solana.com/r/button.json
```

This copies the component source into your project so you own the code.

### npm package

```bash
pnpm add @solana/design-system
```

```tsx
import { Button, Spinner, SegmentControl } from "@solana/design-system";
import "@solana/design-system/styles";
```

## Components

### Primitives

| Component | Description |
|---|---|
| **Button** | Primary/secondary variants, four sizes (xl/lg/md/sm), icon support, loading state |
| **Spinner** | SVG loading spinner with size variants, respects `prefers-reduced-motion` |
| **Segment Control** | Segmented toggle with smooth sliding indicator animation |
| **Animated Icon** | Icon transitions with blur and scale using AnimatePresence |

### Utilities

| Name | Description |
|---|---|
| **cn** | Minimal class name joiner (no clsx/tailwind-merge) |
| **Slot** | `asChild` pattern — merges props, classNames, styles, and refs |

### Hooks

| Name | Description |
|---|---|
| **useCopyToClipboard** | Clipboard API wrapper with automatic reset timer |

## Tech Stack

- **React 19** + TypeScript
- **Tailwind CSS v4** with `@theme` CSS variables
- **Base UI** (`@base-ui/react`) for accessible headless primitives
- **Motion** for animations
- **Lucide React** for icons
- **Biome** for linting/formatting
- **Storybook 8** for component documentation
- **pnpm workspaces** + **Turborepo** for monorepo orchestration

## Development

```bash
pnpm install
pnpm storybook       # Component docs at localhost:6006
pnpm lint             # Check code with Biome
pnpm build            # Build npm package to dist/
pnpm registry:build   # Build shadcn registry to packages/design-system/public/r/
```

## Project Structure

```
design-system/
├── apps/
│   └── token-list/                   # Example app
└── packages/
    └── design-system/
        ├── src/                      # Source (npm package build)
        │   ├── primitives/           # Button, Spinner, SegmentControl, AnimatedIcon
        │   ├── utils/                # cn, Slot
        │   ├── hooks/                # useCopyToClipboard
        │   ├── components/           # Composed components (planned)
        │   ├── patterns/             # Page patterns (planned)
        │   ├── tokens/               # Design token Storybook stories
        │   └── globals.css           # Theme, CSS variables, utilities
        ├── registry/                 # Source (shadcn CLI build)
        │   └── solana/               # Components with @/ alias imports
        ├── public/r/                 # Generated shadcn registry JSON (gitignored)
        ├── registry.json             # shadcn registry manifest
        └── .storybook/               # Storybook config
```

## Color System

### Primitives
- **Gray scale**: `gray-50` through `gray-1400` (15 steps)
- **Base colors**: `black`, `white`

### Semantic Tokens (transparency-based)

**Text** (uses gray-1400 in light, white in dark):
- `text-extra-high` (100%), `text-high` (88%), `text-medium` (72%), `text-low` (56%), `text-extra-low` (44%)

**Borders** (uses gray-1300 in light, white in dark):
- `border-strongest` (100%), `border-strong` (48%), `border-medium` (20%), `border-light` (12%), `border-extra-light` (4%)

## Contributing

1. Components go in `packages/design-system/src/primitives/` (atoms) or `packages/design-system/src/components/` (molecules)
2. Each component needs a Storybook story in its directory
3. Add new components to both `packages/design-system/src/` (for npm) and `packages/design-system/registry/solana/` (for shadcn CLI)
4. Registry files use `@/` alias imports; source files use relative imports
5. Run `pnpm lint` before committing

## License

ISC
