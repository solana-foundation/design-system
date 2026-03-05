# Solana CodeBlock — Figma Plugin

Figma plugin that lets designers create fully-styled CodeBlock instances directly on the Figma canvas. Replaces the screenshot-capture approach with native Figma nodes that designers can inspect, measure, and resize.

**Location:** `packages/figma-plugin/` inside the `design-system` monorepo.

---

## Why This Exists

The design system has a CodeBlock web component (`packages/design-system/src/primitives/code-block/`) with 4 themes, light/dark modes, monochrome variants, syntax highlighting via Shiki, line numbers, diff markers, and filename headers. Designers need pixel-accurate representations of these in Figma for mockups and specs. This plugin generates native Figma frames with the exact same colors, fonts, and structure.

---

## Two-Runtime Architecture

Figma plugins run across two isolated runtimes that communicate via `postMessage`:

```
┌─────────────────────────────────────────┐
│  UI iframe (browser environment)        │
│                                         │
│  React app + Shiki tokenizer            │
│  - User enters code, picks theme/lang   │
│  - Shiki tokenizes → CSS variable refs  │
│  - Resolves CSS vars to hex via themes  │
│  - Sends resolved tokens to main thread │
│                                         │
│  postMessage({ pluginMessage: ... })    │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Main thread (QuickJS sandbox)          │
│                                         │
│  Has access to Figma Plugin API only    │
│  - No DOM, no fetch, no window          │
│  - Receives token data + shell colors   │
│  - Creates Figma frames + text nodes    │
│  - Applies setRangeFills per token      │
│  - Applies setRangeFontName for italic  │
│                                         │
│  figma.createFrame(), figma.createText()│
└─────────────────────────────────────────┘
```

This split is a hard Figma constraint — the main thread cannot run Shiki (no WASM, no dynamic imports), and the UI iframe cannot call Figma APIs.

---

## File Map

```
packages/figma-plugin/
├── manifest.json              # Figma plugin manifest
├── package.json               # pnpm workspace member
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config for UI build (singlefile)
├── .gitignore                 # Ignores dist/, node_modules/
├── ARCHITECTURE.md            # This file
│
├── src/
│   ├── code.ts                # MAIN THREAD — font loading, Figma node creation
│   │
│   ├── shared/
│   │   ├── types.ts           # Message protocol types, supported languages
│   │   ├── themes.ts          # OKLCH→hex converter, 16 theme variant color maps
│   │   └── shiki-theme.ts     # CSS variables Shiki theme (mirrors web component)
│   │
│   └── ui/
│       ├── index.html         # HTML entry (Vite root)
│       ├── main.tsx           # React root
│       ├── App.tsx            # Plugin UI + Shiki tokenization + live preview
│       └── styles.css         # Figma-native dark UI styling
│
└── dist/                      # Build output (gitignored)
    ├── code.js                # ~8KB IIFE (esbuild)
    └── index.html             # ~2.3MB single-file bundle (Vite + singlefile)
```

---

## Build Pipeline

Two separate build steps produce two output files — Figma requires exactly one `code.js` and one `ui.html`.

```bash
pnpm build              # rm -rf dist && build:code && build:ui
pnpm build:code         # esbuild src/code.ts → dist/code.js (IIFE, es2020)
pnpm build:ui           # vite build → dist/index.html (single-file, all assets inlined)
```

| Step         | Tool                          | Input               | Output                | Why                                                   |
| ------------ | ----------------------------- | ------------------- | --------------------- | ----------------------------------------------------- |
| `build:code` | esbuild                       | `src/code.ts`       | `dist/code.js` (IIFE) | Figma sandbox needs a plain script, no modules        |
| `build:ui`   | Vite + vite-plugin-singlefile | `src/ui/index.html` | `dist/index.html`     | Figma requires a single HTML file, no external assets |

The Vite config sets `root: "src/ui"` and outputs to `../../dist`. The singlefile plugin inlines all JS and CSS into the HTML.

---

## Data Flow: Code → Figma Nodes

```
1. User pastes code in <textarea>
2. User selects language, theme, mode, mono, dimensions, features
3. User clicks "Insert CodeBlock"
                │
                ▼
4. App.tsx calls tokenize(code, lang, syntaxColors)
   ├── Lazy-loads Shiki highlighter (createHighlighterCore + JS regex engine)
   ├── Lazy-loads language grammar (import("shiki/langs/typescript.mjs"))
   ├── Calls highlighter.codeToTokens(code, { lang, theme: "css-variables" })
   │   └── Returns tokens with colors like "var(--shiki-token-keyword)"
   ├── For each token, resolves CSS variable → hex via resolveTokenColor()
   └── Returns ResolvedToken[] with { start, end, color: "#hex", italic: bool }
                │
                ▼
5. App.tsx builds InsertCodeBlockMessage with:
   ├── config: { code, width, borderRadius, fontSize, ... }
   ├── colors: ShellColors (bg, border, headerBg, ... all hex + opacity)
   └── tokens: ResolvedToken[]
                │
                ▼
6. parent.postMessage({ pluginMessage: msg }, "*")
                │
                ▼
7. code.ts receives message via figma.ui.onmessage
8. code.ts calls createCodeBlock(config, colors, tokens)
   ├── Loads fonts (fallback chain, see below)
   ├── Creates outer Frame (auto-layout vertical, bg fill, border stroke)
   ├── [Optional] Creates Header frame with filename text
   ├── Creates CodeArea frame (auto-layout horizontal)
   │   ├── [Optional] LineNumbers text (right-aligned, faded)
   │   ├── [Optional] DiffMarkers text ("+"/"-"/" " per line, colored)
   │   └── Code text node
   │       ├── Sets characters = full code string
   │       ├── Sets default fill = foreground color
   │       ├── For each token: setRangeFills(start, end, [solidPaint(hex)])
   │       └── For italic tokens: setRangeFontName(start, end, italicFont)
   ├── Centers on viewport
   └── Selects the new frame
```

---

## Theme System

### Source of Truth

All theme colors are defined in `packages/design-system/src/globals.css` as CSS custom properties using OKLCH color space. The Figma plugin extracts these values and converts them to hex.

### 16 Variants

3 dimensions: **theme** (4) × **mode** (2) × **mono** (2) = 16 syntax color sets + 8 shell color sets (shell colors are not affected by mono).

| Theme   | Personality                 | Hue Axis                     |
| ------- | --------------------------- | ---------------------------- |
| default | Neutral, Solana purple→teal | H=264–310                    |
| sand    | Warm editorial              | H=18–200 (warm arc)          |
| calm    | Serene, desaturated         | H=303 (purple whisper)       |
| vivid   | Electric, high-chroma       | H=264–307 (brand saturation) |

**Mono variants** replace all syntax token chroma with near-zero values:

- Default mono: `C=0` (pure grayscale)
- Sand mono: `C=0.008, H=55` (warm micro-tint)
- Calm mono: `C=0.008, H=303` (cool purple micro-tint)
- Vivid mono: `C=0.01, H=264` (cool blue micro-tint)

### OKLCH → Hex Conversion

`themes.ts` contains a pure-math converter:

```
OKLCH(L, C, H)
  → OKLab(L, a=C·cos(H), b=C·sin(H))
  → LMS (cube roots of linear transform)
  → linear sRGB (3×3 matrix)
  → sRGB (gamma curve)
  → hex (#RRGGBB)
```

All theme colors are computed at module load time (in the UI iframe). The conversion runs once and the results are cached as hex strings.

### Shell Colors

Each theme/mode has background, border, header, and line number colors. Some use `color-mix()` in CSS — the plugin resolves these:

- **Solid backgrounds** (sand, calm, vivid): Direct OKLCH → hex
- **Mixed backgrounds** (default light): `mixHex(gray50, white, 0.6)` computed in themes.ts
- **Semi-transparent borders/text**: Sent as `{ hex, opacity }` pairs — Figma's `SolidPaint` supports `opacity` natively

### CSS Variable Resolution

Shiki outputs token colors as CSS variable references (e.g. `"var(--shiki-token-keyword)"`). The `resolveTokenColor()` function maps these to hex:

```
"var(--shiki-token-keyword)" → syntax.keyword → "#6b21a8"
"var(--shiki-token-string)"  → syntax.string  → "#166534"
...
```

---

## Figma Node Structure

```
CodeBlock (Frame)
├── layoutMode: VERTICAL
├── counterAxisSizingMode: FIXED (width from config)
├── primaryAxisSizingMode: AUTO (height grows with content)
├── cornerRadius: config.borderRadius
├── fills: [{ SOLID, bg hex }]
├── strokes: [{ SOLID, border hex, opacity }]
├── strokeWeight: 1, strokeAlign: INSIDE
├── clipsContent: true
│
├── Header (Frame) [optional, if showHeader && filename]
│   ├── layoutMode: HORIZONTAL
│   ├── layoutAlign: STRETCH
│   ├── padding: 10/10/16/16
│   ├── fills: [{ SOLID, headerBg, headerBgOpacity }]
│   ├── strokes: bottom-only 1px border
│   └── Filename (Text)
│       ├── fontSize: 13, lineHeight: 18px
│       └── fills: [{ SOLID, headerText, headerTextOpacity }]
│
└── CodeArea (Frame)
    ├── layoutMode: HORIZONTAL
    ├── layoutAlign: STRETCH
    ├── padding: 16 all sides
    ├── itemSpacing: 16
    ├── fills: [] (transparent)
    │
    ├── LineNumbers (Text) [optional]
    │   ├── textAlignHorizontal: RIGHT
    │   ├── layoutSizingHorizontal: HUG
    │   ├── characters: "1\n2\n3\n..."
    │   └── fills: [{ SOLID, lineNumber, lineNumberOpacity }]
    │
    ├── DiffMarkers (Text) [optional, if addedLines or removedLines]
    │   ├── layoutSizingHorizontal: HUG
    │   ├── characters: "+\n \n-\n ..."
    │   └── per-character fills (green/red/transparent)
    │
    └── Code (Text)
        ├── layoutSizingHorizontal: FILL
        ├── layoutSizingVertical: HUG
        ├── characters: raw code string
        ├── default fills: [{ SOLID, foreground }]
        ├── setRangeFills: per token → hex color
        └── setRangeFontName: italic tokens → italic font variant
```

---

## Font Fallback Chain

The main thread tries these fonts in order. First one that loads successfully is used for all text:

| Priority | Family          | Regular Style | Italic Style   | Notes                                    |
| -------- | --------------- | ------------- | -------------- | ---------------------------------------- |
| 1        | Berkeley Mono   | Regular       | Italic         | Solana design system preferred font      |
| 2        | SF Mono         | Regular       | Regular Italic | macOS system monospace                   |
| 3        | JetBrains Mono  | Regular       | Italic         | Free, widely installed                   |
| 4        | Fira Code       | Regular       | _(none)_       | No italic variant — skips italic styling |
| 5        | Source Code Pro | Regular       | Italic         | Google Fonts                             |
| 6        | Roboto Mono     | Regular       | Italic         | Google Fonts                             |
| 7        | Courier New     | Regular       | Italic         | System fallback                          |

If no font loads, the plugin throws an error and notifies the user.

---

## Supported Languages

23 languages, dynamically loaded on first use:

```
typescript  javascript  tsx       jsx       rust      python
bash        json        html      css       yaml      toml
sql         go          c         cpp       java      swift
kotlin      solidity    markdown  graphql   diff
```

Languages are loaded lazily from `shiki/langs/*.mjs` to avoid bundling all grammars upfront. The Shiki JavaScript regex engine (`@shikijs/engine-javascript`) is used instead of Oniguruma WASM for smaller bundle size.

---

## Message Protocol

### UI → Main Thread

**InsertCodeBlockMessage** — sent when user clicks "Insert CodeBlock":

```typescript
{
  type: "insert-code-block",
  config: {
    code: string,           // Full source code
    width: number,          // Frame width (px)
    borderRadius: number,   // Corner radius (px)
    fontSize: number,       // Code font size (px)
    lineHeight: number,     // Code line height (px)
    showHeader: boolean,    // Show filename bar
    filename: string,       // Filename text
    showLineNumbers: boolean,
    addedLines: number[],   // 1-indexed diff added lines
    removedLines: number[], // 1-indexed diff removed lines
  },
  colors: {
    bg: "#hex",                  border: "#hex",
    borderOpacity: 0.08,         headerBg: "#hex",
    headerBgOpacity: 0.04,       headerText: "#hex",
    headerTextOpacity: 0.72,     lineNumber: "#hex",
    lineNumberOpacity: 0.56,     foreground: "#hex",
    diffAddedMarker: "#hex",     diffRemovedMarker: "#hex",
  },
  tokens: [
    { start: 0, end: 6, color: "#6b21a8", italic: true },  // "import"
    { start: 7, end: 8, color: "#737373", italic: false },  // "{"
    // ... one entry per Shiki token
  ],
}
```

**ResizeMessage** — resize the plugin window:

```typescript
{ type: "resize", width: number, height: number }
```

---

## Dependencies

| Package                      | Purpose                                 | Used By |
| ---------------------------- | --------------------------------------- | ------- |
| `shiki`                      | Language grammars (`shiki/langs/*.mjs`) | UI      |
| `@shikijs/core`              | `createHighlighterCore`, `codeToTokens` | UI      |
| `@shikijs/engine-javascript` | JS regex engine (no WASM)               | UI      |
| `react`, `react-dom`         | Plugin UI                               | UI      |
| `@figma/plugin-typings`      | Figma API types                         | code.ts |
| `esbuild`                    | Bundles code.ts → IIFE                  | Build   |
| `vite`                       | Bundles UI → HTML                       | Build   |
| `vite-plugin-singlefile`     | Inlines all assets into single HTML     | Build   |
| `@vitejs/plugin-react`       | JSX transform for Vite                  | Build   |

---

## Relationship to Web Component

The Figma plugin mirrors the web component but in a different rendering target:

| Aspect           | Web Component                             | Figma Plugin                                  |
| ---------------- | ----------------------------------------- | --------------------------------------------- |
| Theme definition | CSS custom properties in globals.css      | Same values, pre-converted to hex             |
| Shiki theme      | `cssVariablesTheme` → CSS vars            | Same theme → CSS vars → resolved to hex       |
| Token styling    | `dangerouslySetInnerHTML` with Shiki HTML | `setRangeFills()` per token on Figma Text     |
| Italic tokens    | CSS `font-style: italic`                  | `setRangeFontName()` with italic font variant |
| Background       | CSS `background` property                 | Figma Frame `fills`                           |
| Border           | CSS `border` property                     | Figma Frame `strokes` with `opacity`          |
| Line numbers     | CSS counters on `.line` spans             | Separate Figma Text node                      |
| Diff markers     | CSS `::before` pseudo-elements            | Separate Figma Text node with per-char fills  |

---

## Development

### Install in Figma

1. `pnpm build` in `packages/figma-plugin/`
2. Figma desktop → Plugins → Development → "Import plugin from manifest"
3. Select `packages/figma-plugin/manifest.json`
4. Run from Plugins → Development → "Solana CodeBlock"

### Adding a New Theme

1. Add the OKLCH color values to `globals.css` (web component)
2. Add corresponding entries in `themes.ts`:
    - New `SyntaxColors` objects for light/dark/mono variants
    - New `ShellDef` entries in `SHELL_MAP`
    - Add to `SYNTAX_MAP`
3. Add the theme name to the `CodeBlockTheme` type in `types.ts`
4. Add radio button in `App.tsx`

### Adding a New Language

1. Add to `SUPPORTED_LANGUAGES` array in `types.ts`
2. Add dynamic import entry in `LANG_IMPORTS` in `App.tsx`:
    ```typescript
    newlang: () => import("shiki/langs/newlang.mjs"),
    ```
3. Rebuild

### Debugging

- Plugin UI console: Figma → Plugins → Development → "Open console"
- Main thread errors: Shown via `figma.notify()` with error flag
- Tokenization issues: Check browser console in the plugin dev tools
