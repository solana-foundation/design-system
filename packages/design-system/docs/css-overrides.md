# CSS overrides (npm consumers)

The design system is designed to be imported from npm while still letting each app customize its look.

## Recommended import order

Import the design system styles from the same CSS file that Tailwind processes (your “Tailwind entry” CSS).

```css
@import 'tailwindcss';
@import '@solana/design-system/styles';

/* Your app overrides go after */
/* :root { --button-primary-bg: ... } */
```

## Opt-in base styles

If you want global element defaults (body background/text, baseline outlines/borders), import `base.css` **after** `styles`.

```css
@import '@solana/design-system/base.css';
```

For maximum control, copy `base.css` into your app and edit it there.

## Override tokens via CSS variables

Most design choices are expressed as CSS variables in `globals.css`. Override them in your app:

```css
:root {
    --button-primary-bg: oklch(0.2 0 0);
}

.dark {
    --button-primary-bg: oklch(0.9 0 0);
}
```

## Specificity rules (why overrides work)

- `base.css` uses low-specificity selectors (e.g. `:where(body)`) so apps can override without `!important`.
- Prefer overrides via variables over rewriting component classnames.
