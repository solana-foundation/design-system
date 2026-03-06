# Component structure template

For primitives in `src/primitives/<component>/`, keep a consistent structure so components stay maintainable as they grow.

## Recommended file layout

- `index.tsx`: public exports + main component(s) + minimal glue
- `constants.ts`: token maps, selector strings, animation constants
- `helpers.ts`: pure helpers (no React hooks)
- `types.ts` (optional): shared internal types when `index.tsx` gets crowded
- `*.stories.tsx`: Storybook stories

## Ordering inside `index.tsx`

1. Public exports + exported interfaces\n+2. Subcomponents (only if they’re part of the public API)\n+3. Internal helpers/constants should live in sibling files\n+4. Main component\n+
   The goal is that `index.tsx` reads like an API surface, not like a full implementation dump.
