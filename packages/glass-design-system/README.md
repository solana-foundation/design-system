# glass-design-system

Research-backed glass components and tokens.

This package starts from the working Aave glass prototype in `research/prototype`. That prototype remains the lab copy for Safari, SVG filter, canvas fallback, and displacement-map experiments.

The reusable package API begins in `src`:

- `GlassSurface`: a general frosted surface wrapper.
- `GlassLens`: a pill-shaped lens wrapper for the visual language.
- `Slider`: a range slider with a glass thumb node.
- `glassTokens`: radius, blur, border, shadow, and highlight constants.

Import the stylesheet once in an app entrypoint:

```ts
import 'glass-design-system/styles.css';
```

Use the component:

```tsx
import { GlassLens, Slider } from 'glass-design-system';

export function Example() {
    return (
        <>
            <GlassLens interactive>
                <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>Stable</div>
            </GlassLens>
            <Slider label="Liquidity" showValue defaultValue={42} />
        </>
    );
}
```

## Research Copy

The prototype is copied into `research/prototype` so we can keep iterating against the exact Safari path that was tuned in `aave-glass-research` before extracting more production components.
