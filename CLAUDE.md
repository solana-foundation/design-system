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
- Vite, Storybook 8, Biome, pnpm

## Distribution

### Two distribution channels
1. **npm package** (`@solana/design-system`) — compiled build from `src/`, imported as a dependency
2. **shadcn CLI** — source files from `registry/solana/`, copied into consumer projects via `npx shadcn add`

### Directory structure
- `src/` — Source for the npm package build. Uses relative imports.
- `registry/solana/` — Source for shadcn CLI. Uses `@/` alias imports (`@/lib/`, `@/components/ui/`, `@/hooks/`).
- `registry.json` — shadcn registry manifest defining all components.
- `public/r/` — Generated per-component JSON files (gitignored, built by `pnpm registry:build`).

### Adding a new component
1. Create the component in `src/primitives/<name>/index.tsx` (or `src/utils/`, `src/hooks/`)
2. Export it from the appropriate barrel file (`src/primitives/index.ts`, etc.)
3. Copy the file to `registry/solana/<name>.tsx`
4. In the registry copy, replace relative imports with `@/` aliases:
   - `../../utils` → `@/lib/cn`
   - `../spinner` → `@/components/ui/spinner`
5. Add an entry to `registry.json` with `name`, `type`, `title`, `description`, `files`, `dependencies`, and `registryDependencies`
6. Run `pnpm registry:build` to generate `public/r/<name>.json`

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
- `src/globals.css` — Styles, CSS variables, theme
- `src/tokens/` — Color stories for Storybook
- `registry.json` — shadcn registry manifest
- `registry/solana/` — Registry component sources
- `CHANGELOG.md` — All changes with explanations

## Commands
- `pnpm storybook` — Preview components
- `pnpm lint` — Check code
- `pnpm build` — Build npm package
- `pnpm registry:build` — Build shadcn registry JSON
