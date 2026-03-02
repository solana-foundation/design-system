/**
 * Theme color map for the Figma plugin.
 * Extracts all OKLCH color values from globals.css and converts to hex.
 * Covers all 4 themes x 2 modes x 2 mono = 16 syntax variants + 8 shell variants.
 */

import type { CodeBlockMode, CodeBlockTheme, ShellColors } from "./types";

// ---------------------------------------------------------------------------
// OKLCH → hex conversion
// ---------------------------------------------------------------------------

function oklchToHex(l: number, c: number, h: number): string {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // OKLab → LMS (cube roots)
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const lms_l = l_ * l_ * l_;
  const lms_m = m_ * m_ * m_;
  const lms_s = s_ * s_ * s_;

  // LMS → linear sRGB
  const rl = 4.0767416621 * lms_l - 3.3077115913 * lms_m + 0.2309699292 * lms_s;
  const gl =
    -1.2684380046 * lms_l + 2.6097574011 * lms_m - 0.3413193965 * lms_s;
  const bl =
    -0.0041960863 * lms_l - 0.7034186147 * lms_m + 1.707614701 * lms_s;

  function gamma(x: number): number {
    if (x <= 0.0031308) return 12.92 * x;
    return 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  }

  const clamp = (v: number) => Math.round(Math.max(0, Math.min(1, gamma(v))) * 255);
  const hex = (v: number) => v.toString(16).padStart(2, "0");

  return `#${hex(clamp(rl))}${hex(clamp(gl))}${hex(clamp(bl))}`;
}

/** Mix two hex colors in sRGB space: ratio of color1 vs color2 */
function mixHex(hex1: string, hex2: string, ratio: number): string {
  const parse = (h: string, o: number) => parseInt(h.slice(o, o + 2), 16);
  const mix = (a: number, b: number) => Math.round(a * ratio + b * (1 - ratio));
  const hex = (v: number) => v.toString(16).padStart(2, "0");

  const r = mix(parse(hex1, 1), parse(hex2, 1));
  const g = mix(parse(hex1, 3), parse(hex2, 3));
  const b = mix(parse(hex1, 5), parse(hex2, 5));

  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

// shorthand
const o = oklchToHex;

// ---------------------------------------------------------------------------
// Gray palette (pre-computed)
// ---------------------------------------------------------------------------

const GRAY_LIGHT = {
  50: o(0.97, 0.004, 286.0),
  100: o(0.93, 0.008, 289.4),
  1300: o(0.24, 0.003, 286.0),
  1400: o(0.165, 0.002, 286.0),
};

const GRAY_DARK = {
  50: "#000000",
  100: o(0.165, 0.002, 286.0),
  1300: o(0.887, 0.012, 292.6),
  1400: o(0.93, 0.008, 289.4),
};

// ---------------------------------------------------------------------------
// Syntax color definitions (all OKLCH values from globals.css)
// ---------------------------------------------------------------------------

export interface SyntaxColors {
  foreground: string;
  keyword: string;
  string: string;
  comment: string;
  function: string;
  constant: string;
  parameter: string;
  punctuation: string;
  type: string;
  attribute: string;
  escape: string;
  variableLang: string;
}

// Default theme
const DEFAULT_LIGHT: SyntaxColors = {
  foreground: GRAY_LIGHT[1400],
  keyword: o(0.44, 0.16, 301),
  string: o(0.44, 0.12, 160),
  comment: o(0.55, 0.015, 280),
  function: o(0.44, 0.14, 264),
  constant: o(0.47, 0.14, 25),
  parameter: o(0.47, 0.1, 55),
  punctuation: o(0.56, 0.01, 280),
  type: o(0.44, 0.1, 195),
  attribute: o(0.44, 0.1, 145),
  escape: o(0.47, 0.12, 40),
  variableLang: o(0.44, 0.14, 310),
};

const DEFAULT_DARK: SyntaxColors = {
  foreground: GRAY_DARK[1400],
  keyword: o(0.76, 0.14, 301),
  string: o(0.76, 0.1, 160),
  comment: o(0.55, 0.015, 280),
  function: o(0.76, 0.12, 264),
  constant: o(0.78, 0.12, 25),
  parameter: o(0.76, 0.08, 55),
  punctuation: o(0.52, 0.01, 280),
  type: o(0.76, 0.08, 195),
  attribute: o(0.76, 0.08, 145),
  escape: o(0.78, 0.1, 40),
  variableLang: o(0.76, 0.12, 310),
};

// Sand theme
const SAND_LIGHT: SyntaxColors = {
  foreground: o(0.3356, 0.0046, 39.42),
  keyword: o(0.42, 0.06, 30),
  string: o(0.44, 0.09, 40),
  comment: o(0.52, 0.025, 65),
  function: o(0.44, 0.07, 155),
  constant: o(0.46, 0.08, 18),
  parameter: o(0.44, 0.04, 50),
  punctuation: o(0.5, 0.02, 45),
  type: o(0.42, 0.06, 200),
  attribute: o(0.46, 0.06, 130),
  escape: o(0.5, 0.08, 55),
  variableLang: o(0.42, 0.05, 350),
};

const SAND_DARK: SyntaxColors = {
  foreground: o(0.82, 0.01, 55),
  keyword: o(0.7, 0.05, 35),
  string: o(0.72, 0.08, 42),
  comment: o(0.5, 0.02, 55),
  function: o(0.71, 0.06, 155),
  constant: o(0.7, 0.07, 22),
  parameter: o(0.68, 0.03, 55),
  punctuation: o(0.58, 0.015, 50),
  type: o(0.7, 0.05, 200),
  attribute: o(0.7, 0.05, 135),
  escape: o(0.71, 0.07, 55),
  variableLang: o(0.7, 0.04, 350),
};

// Calm theme
const CALM_LIGHT: SyntaxColors = {
  foreground: o(0.28, 0.005, 303),
  keyword: o(0.46, 0.08, 303),
  string: o(0.48, 0.06, 162),
  comment: o(0.6, 0.012, 303),
  function: o(0.46, 0.07, 264),
  constant: o(0.48, 0.07, 25),
  parameter: o(0.5, 0.05, 55),
  punctuation: o(0.62, 0.006, 303),
  type: o(0.46, 0.06, 206),
  attribute: o(0.48, 0.06, 145),
  escape: o(0.48, 0.06, 40),
  variableLang: o(0.46, 0.07, 307),
};

const CALM_DARK: SyntaxColors = {
  foreground: o(0.84, 0.008, 303),
  keyword: o(0.74, 0.07, 303),
  string: o(0.76, 0.05, 162),
  comment: o(0.5, 0.012, 303),
  function: o(0.74, 0.06, 264),
  constant: o(0.76, 0.06, 25),
  parameter: o(0.76, 0.04, 55),
  punctuation: o(0.48, 0.006, 303),
  type: o(0.74, 0.05, 206),
  attribute: o(0.76, 0.05, 145),
  escape: o(0.76, 0.05, 40),
  variableLang: o(0.74, 0.06, 307),
};

// Vivid theme
const VIVID_LIGHT: SyntaxColors = {
  foreground: o(0.22, 0.01, 264),
  keyword: o(0.4, 0.22, 303),
  string: o(0.44, 0.15, 162),
  comment: o(0.54, 0.025, 264),
  function: o(0.4, 0.18, 264),
  constant: o(0.44, 0.17, 25),
  parameter: o(0.44, 0.13, 55),
  punctuation: o(0.56, 0.02, 264),
  type: o(0.4, 0.15, 206),
  attribute: o(0.44, 0.13, 145),
  escape: o(0.44, 0.15, 40),
  variableLang: o(0.4, 0.2, 307),
};

const VIVID_DARK: SyntaxColors = {
  foreground: o(0.88, 0.01, 264),
  keyword: o(0.74, 0.18, 303),
  string: o(0.76, 0.12, 162),
  comment: o(0.5, 0.025, 264),
  function: o(0.74, 0.15, 264),
  constant: o(0.78, 0.14, 25),
  parameter: o(0.76, 0.1, 55),
  punctuation: o(0.48, 0.02, 264),
  type: o(0.76, 0.12, 206),
  attribute: o(0.76, 0.1, 145),
  escape: o(0.78, 0.12, 40),
  variableLang: o(0.74, 0.16, 307),
};

// Mono (default — pure grayscale)
const MONO_LIGHT: SyntaxColors = {
  foreground: GRAY_LIGHT[1400],
  keyword: o(0.3, 0, 0),
  string: o(0.44, 0, 0),
  comment: o(0.65, 0, 0),
  function: o(0.38, 0, 0),
  constant: o(0.44, 0, 0),
  parameter: o(0.5, 0, 0),
  punctuation: o(0.58, 0, 0),
  type: o(0.5, 0, 0),
  attribute: o(0.5, 0, 0),
  escape: o(0.38, 0, 0),
  variableLang: o(0.3, 0, 0),
};

const MONO_DARK: SyntaxColors = {
  foreground: GRAY_DARK[1400],
  keyword: o(0.8, 0, 0),
  string: o(0.66, 0, 0),
  comment: o(0.45, 0, 0),
  function: o(0.72, 0, 0),
  constant: o(0.66, 0, 0),
  parameter: o(0.6, 0, 0),
  punctuation: o(0.52, 0, 0),
  type: o(0.6, 0, 0),
  attribute: o(0.6, 0, 0),
  escape: o(0.72, 0, 0),
  variableLang: o(0.8, 0, 0),
};

// Sand + Mono (warm micro-chroma H=55)
const SAND_MONO_LIGHT: SyntaxColors = {
  foreground: SAND_LIGHT.foreground,
  keyword: o(0.3, 0.008, 55),
  string: o(0.44, 0.008, 55),
  comment: o(0.65, 0.008, 55),
  function: o(0.38, 0.008, 55),
  constant: o(0.44, 0.008, 55),
  parameter: o(0.5, 0.008, 55),
  punctuation: o(0.58, 0.008, 55),
  type: o(0.5, 0.008, 55),
  attribute: o(0.5, 0.008, 55),
  escape: o(0.38, 0.008, 55),
  variableLang: o(0.3, 0.008, 55),
};

const SAND_MONO_DARK: SyntaxColors = {
  foreground: SAND_DARK.foreground,
  keyword: o(0.8, 0.008, 55),
  string: o(0.66, 0.008, 55),
  comment: o(0.45, 0.008, 55),
  function: o(0.72, 0.008, 55),
  constant: o(0.66, 0.008, 55),
  parameter: o(0.6, 0.008, 55),
  punctuation: o(0.52, 0.008, 55),
  type: o(0.6, 0.008, 55),
  attribute: o(0.6, 0.008, 55),
  escape: o(0.72, 0.008, 55),
  variableLang: o(0.8, 0.008, 55),
};

// Calm + Mono (cool purple micro-chroma H=303)
const CALM_MONO_LIGHT: SyntaxColors = {
  foreground: CALM_LIGHT.foreground,
  keyword: o(0.3, 0.008, 303),
  string: o(0.44, 0.008, 303),
  comment: o(0.65, 0.008, 303),
  function: o(0.38, 0.008, 303),
  constant: o(0.44, 0.008, 303),
  parameter: o(0.5, 0.008, 303),
  punctuation: o(0.58, 0.008, 303),
  type: o(0.5, 0.008, 303),
  attribute: o(0.5, 0.008, 303),
  escape: o(0.38, 0.008, 303),
  variableLang: o(0.3, 0.008, 303),
};

const CALM_MONO_DARK: SyntaxColors = {
  foreground: CALM_DARK.foreground,
  keyword: o(0.8, 0.008, 303),
  string: o(0.66, 0.008, 303),
  comment: o(0.45, 0.008, 303),
  function: o(0.72, 0.008, 303),
  constant: o(0.66, 0.008, 303),
  parameter: o(0.6, 0.008, 303),
  punctuation: o(0.52, 0.008, 303),
  type: o(0.6, 0.008, 303),
  attribute: o(0.6, 0.008, 303),
  escape: o(0.72, 0.008, 303),
  variableLang: o(0.8, 0.008, 303),
};

// Vivid + Mono (cool blue micro-chroma H=264)
const VIVID_MONO_LIGHT: SyntaxColors = {
  foreground: VIVID_LIGHT.foreground,
  keyword: o(0.3, 0.01, 264),
  string: o(0.44, 0.01, 264),
  comment: o(0.65, 0.01, 264),
  function: o(0.38, 0.01, 264),
  constant: o(0.44, 0.01, 264),
  parameter: o(0.5, 0.01, 264),
  punctuation: o(0.58, 0.01, 264),
  type: o(0.5, 0.01, 264),
  attribute: o(0.5, 0.01, 264),
  escape: o(0.38, 0.01, 264),
  variableLang: o(0.3, 0.01, 264),
};

const VIVID_MONO_DARK: SyntaxColors = {
  foreground: VIVID_DARK.foreground,
  keyword: o(0.8, 0.01, 264),
  string: o(0.66, 0.01, 264),
  comment: o(0.45, 0.01, 264),
  function: o(0.72, 0.01, 264),
  constant: o(0.66, 0.01, 264),
  parameter: o(0.6, 0.01, 264),
  punctuation: o(0.52, 0.01, 264),
  type: o(0.6, 0.01, 264),
  attribute: o(0.6, 0.01, 264),
  escape: o(0.72, 0.01, 264),
  variableLang: o(0.8, 0.01, 264),
};

// ---------------------------------------------------------------------------
// Syntax color lookup
// ---------------------------------------------------------------------------

const SYNTAX_MAP: Record<
  CodeBlockTheme,
  Record<CodeBlockMode, { color: SyntaxColors; mono: SyntaxColors }>
> = {
  default: {
    light: { color: DEFAULT_LIGHT, mono: MONO_LIGHT },
    dark: { color: DEFAULT_DARK, mono: MONO_DARK },
  },
  sand: {
    light: { color: SAND_LIGHT, mono: SAND_MONO_LIGHT },
    dark: { color: SAND_DARK, mono: SAND_MONO_DARK },
  },
  calm: {
    light: { color: CALM_LIGHT, mono: CALM_MONO_LIGHT },
    dark: { color: CALM_DARK, mono: CALM_MONO_DARK },
  },
  vivid: {
    light: { color: VIVID_LIGHT, mono: VIVID_MONO_LIGHT },
    dark: { color: VIVID_DARK, mono: VIVID_MONO_DARK },
  },
};

export function getSyntaxColors(
  theme: CodeBlockTheme,
  mode: CodeBlockMode,
  mono: boolean,
): SyntaxColors {
  const entry = SYNTAX_MAP[theme][mode];
  return mono ? entry.mono : entry.color;
}

// ---------------------------------------------------------------------------
// Shell color definitions (code-block background, border, header)
// ---------------------------------------------------------------------------

interface ShellDef {
  bg: string;
  border: string;
  borderOpacity: number;
  headerBg: string;
  headerBgOpacity: number;
  headerText: string;
  headerTextOpacity: number;
  lineNumber: string;
  lineNumberOpacity: number;
}

const SHELL_MAP: Record<CodeBlockTheme, Record<CodeBlockMode, ShellDef>> = {
  default: {
    light: {
      bg: mixHex(GRAY_LIGHT[50], "#ffffff", 0.6),
      border: GRAY_LIGHT[1300],
      borderOpacity: 0.08,
      headerBg: GRAY_LIGHT[1400],
      headerBgOpacity: 0.04,
      headerText: GRAY_LIGHT[1400],
      headerTextOpacity: 0.72,
      lineNumber: GRAY_LIGHT[1400],
      lineNumberOpacity: 0.56,
    },
    dark: {
      bg: GRAY_DARK[100],
      border: "#ffffff",
      borderOpacity: 0.08,
      headerBg: "#ffffff",
      headerBgOpacity: 0.04,
      headerText: "#ffffff",
      headerTextOpacity: 0.72,
      lineNumber: "#ffffff",
      lineNumberOpacity: 0.58,
    },
  },
  sand: {
    light: {
      bg: o(0.987, 0.003, 97),
      border: o(0.442, 0.0111, 34.3),
      borderOpacity: 0.14,
      headerBg: o(0.967, 0.006, 97),
      headerBgOpacity: 1,
      headerText: o(0.442, 0.0111, 34.3),
      headerTextOpacity: 1,
      lineNumber: o(0.55, 0.03, 56.8),
      lineNumberOpacity: 1,
    },
    dark: {
      bg: o(0.17, 0.007, 55),
      border: o(0.68, 0.02, 55),
      borderOpacity: 0.18,
      headerBg: o(0.21, 0.006, 52),
      headerBgOpacity: 1,
      headerText: o(0.68, 0.02, 55),
      headerTextOpacity: 1,
      lineNumber: o(0.52, 0.015, 50),
      lineNumberOpacity: 1,
    },
  },
  calm: {
    light: {
      bg: o(0.985, 0.004, 303),
      border: o(0.46, 0.02, 303),
      borderOpacity: 0.1,
      headerBg: o(0.968, 0.006, 303),
      headerBgOpacity: 1,
      headerText: o(0.5, 0.015, 303),
      headerTextOpacity: 1,
      lineNumber: o(0.58, 0.01, 303),
      lineNumberOpacity: 1,
    },
    dark: {
      bg: o(0.155, 0.008, 303),
      border: o(0.8, 0.02, 303),
      borderOpacity: 0.1,
      headerBg: o(0.195, 0.007, 303),
      headerBgOpacity: 1,
      headerText: o(0.65, 0.015, 303),
      headerTextOpacity: 1,
      lineNumber: o(0.5, 0.01, 303),
      lineNumberOpacity: 1,
    },
  },
  vivid: {
    light: {
      bg: o(0.98, 0.005, 264),
      border: o(0.4, 0.04, 264),
      borderOpacity: 0.12,
      headerBg: o(0.96, 0.008, 264),
      headerBgOpacity: 1,
      headerText: o(0.46, 0.03, 264),
      headerTextOpacity: 1,
      lineNumber: o(0.56, 0.02, 264),
      lineNumberOpacity: 1,
    },
    dark: {
      bg: o(0.14, 0.015, 264),
      border: o(0.8, 0.04, 264),
      borderOpacity: 0.12,
      headerBg: o(0.18, 0.013, 264),
      headerBgOpacity: 1,
      headerText: o(0.65, 0.03, 264),
      headerTextOpacity: 1,
      lineNumber: o(0.48, 0.02, 264),
      lineNumberOpacity: 1,
    },
  },
};

export function getShellColors(
  theme: CodeBlockTheme,
  mode: CodeBlockMode,
  syntax: SyntaxColors,
): ShellColors {
  const shell = SHELL_MAP[theme][mode];
  return {
    bg: shell.bg,
    border: shell.border,
    borderOpacity: shell.borderOpacity,
    headerBg: shell.headerBg,
    headerBgOpacity: shell.headerBgOpacity,
    headerText: shell.headerText,
    headerTextOpacity: shell.headerTextOpacity,
    lineNumber: shell.lineNumber,
    lineNumberOpacity: shell.lineNumberOpacity,
    foreground: syntax.foreground,
    diffAddedMarker: mode === "light" ? "#22863a" : "#56d364",
    diffRemovedMarker: mode === "light" ? "#cb2431" : "#f85149",
  };
}

// ---------------------------------------------------------------------------
// CSS variable → hex resolver (for Shiki token output)
// ---------------------------------------------------------------------------

const VAR_TO_KEY: Record<string, keyof SyntaxColors> = {
  "var(--shiki-foreground)": "foreground",
  "var(--shiki-token-keyword)": "keyword",
  "var(--shiki-token-string)": "string",
  "var(--shiki-token-comment)": "comment",
  "var(--shiki-token-function)": "function",
  "var(--shiki-token-constant)": "constant",
  "var(--shiki-token-parameter)": "parameter",
  "var(--shiki-token-punctuation)": "punctuation",
  "var(--shiki-token-type)": "type",
  "var(--shiki-token-attribute)": "attribute",
  "var(--shiki-token-escape)": "escape",
  "var(--shiki-token-variable-lang)": "variableLang",
};

/** Resolve a Shiki CSS variable color string to a hex value */
export function resolveTokenColor(
  cssVar: string | undefined,
  syntax: SyntaxColors,
): string {
  if (!cssVar) return syntax.foreground;
  const key = VAR_TO_KEY[cssVar];
  if (key) return syntax[key];
  // If it's already a hex color (shouldn't happen with CSS vars theme, but just in case)
  if (cssVar.startsWith("#")) return cssVar;
  return syntax.foreground;
}
