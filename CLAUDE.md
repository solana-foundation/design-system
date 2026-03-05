# Solana Design System

Component library for Solana Foundation. Built by designers using Claude Code.

## Target Audience

This design system serves two audiences:

1. **Developers** in the Solana Foundation and ecosystem building apps and tools
2. **Designers** using AI tools like Claude Code and Cursor to create interfaces

Documentation must be clear to both humans and AI agents. Write concisely, use consistent naming, and include examples that work for copy-paste by either audience.

## Tech Stack

- React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React
- Base UI (`@base-ui/react`) for accessible headless primitives
- Vite, Storybook 10, ESLint, Prettier, pnpm, Turborepo

## Distribution

### Two distribution channels

1. **npm package** (`@solana/design-system`) — compiled build from `packages/design-system/src/`, imported as a dependency
2. **shadcn CLI** — source files from `packages/design-system/registry/solana/`, copied into consumer projects via `npx shadcn add`

### Directory structure

- `packages/design-system/src/` — Source for the npm package build. Uses relative imports.
- `packages/design-system/registry/solana/` — Source for shadcn CLI. Uses `@/` alias imports (`@/lib/`, `@/components/ui/`, `@/hooks/`).
- `packages/design-system/registry.json` — shadcn registry manifest defining all components.
- `packages/design-system/public/r/` — Generated per-component JSON files (gitignored, built by `pnpm registry:build`).

### Adding a new component

1. Create the component in `packages/design-system/src/primitives/<name>/index.tsx` (or `packages/design-system/src/utils/`, `packages/design-system/src/hooks/`)
2. Export it from the appropriate barrel file (`packages/design-system/src/primitives/index.ts`, etc.)
3. Copy the file to `packages/design-system/registry/solana/<name>.tsx`
4. In the registry copy, replace relative imports with `@/` aliases:
    - `../../utils` → `@/lib/cn`
    - `../spinner` → `@/components/ui/spinner`
5. Add an entry to `packages/design-system/registry.json` with `name`, `type`, `title`, `description`, `files`, `dependencies`, and `registryDependencies`
6. Run `pnpm registry:build` to generate `packages/design-system/public/r/<name>.json`

## Color System

### Primitives

- **Gray scale**: `gray-50` through `gray-1400` (15 steps)
- **Base colors**: `black`, `white`

### Semantic Tokens (transparency-based)

**Text** (uses gray-1400 in light, white in dark):

- `text-extra-high` (100%), `text-high` (88%), `text-medium` (72%), `text-low` (56%), `text-extra-low` (44%)

**Borders** (uses gray-1300 in light, white in dark):

- `border-strongest` (100%), `border-strong` (48%), `border-medium` (20%), `border-light` (12%), `border-extra-light` (4%)

### Usage

```html
<h1 class="text-text-extra-high">Heading</h1>
<p class="text-text-high">Body</p>
<div class="bg-gray-50 border border-border-medium">Card</div>
```

## Key Files

- `packages/design-system/src/globals.css` — Styles, CSS variables, theme
- `packages/design-system/src/tokens/` — Color stories for Storybook
- `packages/design-system/registry.json` — shadcn registry manifest
- `packages/design-system/registry/solana/` — Registry component sources
- `CHANGELOG.md` — All changes with explanations

## Commands

- `pnpm storybook` — Preview components
- `pnpm lint` — Lint code
- `pnpm format` — Format code
- `pnpm build` — Build npm package
- `pnpm registry:build` — Build shadcn registry JSON
- `pnpm changeset` — Add a changeset for releases
