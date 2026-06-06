# @solana/design-system

Solana Design System — React components, tokens, and styles for Solana apps.

## Install

```bash
pnpm add @solana/design-system @base-ui/react motion
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

For deeper guidance on overrides and theming, see [`docs/css-overrides.md`](./docs/css-overrides.md).

For a complete npm setup guide, see [`docs/getting-started-npm.md`](./docs/getting-started-npm.md).

Then import components.

```tsx
import { Button } from '@solana/design-system/button';
```

You can also import from the root entrypoint (less tree-shaking friendly).

```tsx
import { Button } from '@solana/design-system';
```

## Glass

Glass components are bundled into `@solana/design-system` and use the same default stylesheet.

```tsx
import { GlassSurface, Slider, Switch } from '@solana/design-system';
import '@solana/design-system/defaults.css';

export function Example() {
    return (
        <>
            <GlassSurface tone="clear" shape="pill">
                Stable
            </GlassSurface>
            <Slider label="Liquidity" showValue defaultValue={42} />
            <Switch label="Auto-compound" defaultChecked />
        </>
    );
}
```

The glass engine is also available for custom components.

```tsx
import { GlassFilter, GlassRefraction, generateDisplacementMap } from '@solana/design-system/glass';
```

For glass-only styles, import:

```tsx
import '@solana/design-system/glass.css';
```

## Development (monorepo)

From the repository root:

```bash
pnpm --filter @solana/design-system storybook
pnpm --filter @solana/design-system build
```
