# @solana/design-system

Solana Design System — React components, tokens, and styles for Solana apps.

## Install

```bash
pnpm add @solana/design-system
```

## Usage

Add the design system styles to your Tailwind entry CSS (the file that contains `@import "tailwindcss";`).

```css
@import 'tailwindcss';
@import '@solana/design-system/styles';
```

Optional (opt-in global base styles): copy `@solana/design-system/base.css` into your app and customize it, or import it after `styles`.

```css
@import '@solana/design-system/base.css';
```

Then import components.

```tsx
import { Button } from '@solana/design-system/button';
```

You can also import from the root entrypoint (less tree-shaking friendly).

```tsx
import { Button } from '@solana/design-system';
```

## Development (monorepo)

From the repository root:

```bash
pnpm --filter @solana/design-system storybook
pnpm --filter @solana/design-system build
```
