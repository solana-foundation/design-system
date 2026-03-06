# Getting started (npm)

This guide is for consuming `@solana/design-system` as an npm dependency (not copied via the shadcn registry).

## Install

```bash
pnpm add @solana/design-system @base-ui/react motion
```

You also need React and Tailwind v4 in your app:

- `react`, `react-dom`
- `tailwindcss@^4`

## Add styles (Tailwind v4)

In your app’s Tailwind entry CSS (the file that contains `@import "tailwindcss";`), add:

```css
@import 'tailwindcss';
@import '@solana/design-system/styles';
```

### Optional: base styles

If you want global element defaults (body background/text, baseline outlines/borders), import base styles after `styles`:

```css
@import '@solana/design-system/base.css';
```

For customization and long-term stability, copy `base.css` into your app and edit it there.

## Import components (recommended)

Prefer subpath imports so bundlers can tree-shake more effectively and so Next.js boundaries are clearer:

```ts
import { Button } from '@solana/design-system/button';
import { TextInput } from '@solana/design-system/text-input';
```

Root imports still work:

```ts
import { Button } from '@solana/design-system';
```

## Type guarantees

- All public entrypoints ship TypeScript declarations (`.d.ts`) via the package `exports` map.
- Component prop interfaces are exported (e.g. `ButtonProps`, `TextInputProps`) so apps can reuse them.
- We run consumer fixture typechecks in CI to ensure imports like `@solana/design-system/button` and `@solana/design-system/utils` stay type-safe over time.

## Next.js App Router notes

- Most primitives are **Client Components**.
- Import primitives from inside your app’s client components.
- Keep the CSS imports in `app/globals.css` (or wherever Tailwind is initialized).

Example client wrapper:

```tsx
'use client';

import { Button } from '@solana/design-system/button';

export function Example() {
    return <Button>Click</Button>;
}
```

## Overriding tokens

Override design system tokens via CSS variables in your app. See [`css-overrides.md`](./css-overrides.md).
