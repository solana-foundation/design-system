import type { HighlighterCore } from "@shikijs/core";
import type { DecorationItem } from "@shikijs/core/types";
import { startTransition, useEffect, useState } from "react";
import { cssVariablesTheme } from "./themes";

const THEME_VERSION = 1; // bump to force re-highlight after theme changes
let currentThemeVersion = 0;
let highlighterInstance: HighlighterCore | null = null;
let highlighterPromise: Promise<HighlighterCore> | null = null;
const loadedLanguages = new Set<string>();

/** Module-level cache keyed by `lang\0code` to avoid re-highlight flash */
const htmlCache = new Map<string, string>();

async function getHighlighter(): Promise<HighlighterCore> {
  if (highlighterInstance && currentThemeVersion === THEME_VERSION)
    return highlighterInstance;

  // Reset if theme version changed
  if (currentThemeVersion !== THEME_VERSION) {
    highlighterInstance = null;
    highlighterPromise = null;
    htmlCache.clear();
    loadedLanguages.clear();
    currentThemeVersion = THEME_VERSION;
  }

  if (highlighterPromise) return highlighterPromise;

  highlighterPromise = (async () => {
    const { createHighlighterCore } = await import("@shikijs/core");
    const { createOnigurumaEngine } = await import("@shikijs/engine-oniguruma");

    const instance = await createHighlighterCore({
      themes: [cssVariablesTheme],
      langs: [],
      engine: createOnigurumaEngine(import("shiki/wasm")),
    });

    highlighterInstance = instance;
    return instance;
  })();

  return highlighterPromise;
}

/**
 * Static import map for Shiki language grammars.
 * Dynamic imports with variable paths (e.g. `import(\`shiki/langs/${lang}.mjs\`)`)
 * fail in Vite's browser environment because the bundler can't statically analyze them.
 * Each entry must be a literal string so Vite can resolve and bundle it.
 */
const langImportMap: Record<string, () => Promise<unknown>> = {
  typescript: () => import("shiki/langs/typescript.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  rust: () => import("shiki/langs/rust.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  bash: () => import("shiki/langs/bash.mjs"),
  shell: () => import("shiki/langs/shellscript.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
  toml: () => import("shiki/langs/toml.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  graphql: () => import("shiki/langs/graphql.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
  go: () => import("shiki/langs/go.mjs"),
  c: () => import("shiki/langs/c.mjs"),
  cpp: () => import("shiki/langs/cpp.mjs"),
  java: () => import("shiki/langs/java.mjs"),
  swift: () => import("shiki/langs/swift.mjs"),
  kotlin: () => import("shiki/langs/kotlin.mjs"),
  solidity: () => import("shiki/langs/solidity.mjs"),
  diff: () => import("shiki/langs/diff.mjs"),
};

async function ensureLanguage(
  highlighter: HighlighterCore,
  lang: string
): Promise<boolean> {
  if (loadedLanguages.has(lang)) return true;

  const loader = langImportMap[lang];
  if (!loader) return false;

  try {
    const langModule = (await loader()) as Record<string, unknown>;
    await highlighter.loadLanguage(
      (langModule.default ?? langModule) as Parameters<
        HighlighterCore["loadLanguage"]
      >[0]
    );
    loadedLanguages.add(lang);
    return true;
  } catch {
    return false;
  }
}

function makeCacheKey(code: string, language: string): string {
  return `${language}\0${code}`;
}

/**
 * Hook that lazily loads Shiki and highlights code.
 * Uses a singleton highlighter shared across all CodeBlock instances.
 * Dynamically loads languages on demand.
 * Caches results to avoid flash on re-render.
 *
 * @param decorations — optional Shiki decoration items for word-level highlighting
 * @returns `{ html, loading }` — html is null while loading or on error
 */
export function useShiki(
  code: string,
  language: string,
  decorations?: DecorationItem[]
) {
  const cacheKey = makeCacheKey(code, language);
  const [html, setHtml] = useState<string | null>(
    () => htmlCache.get(cacheKey) ?? null
  );
  const [loading, setLoading] = useState(!htmlCache.has(cacheKey));

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const highlighter = await getHighlighter();
        if (cancelled) return;

        const langLoaded = await ensureLanguage(highlighter, language);
        if (cancelled) return;

        const result = highlighter.codeToHtml(code, {
          lang: langLoaded ? language : "text",
          theme: "css-variables",
          decorations,
        });

        if (!cancelled) {
          htmlCache.set(cacheKey, result);
          startTransition(() => {
            setHtml(result);
            setLoading(false);
          });
        }
      } catch {
        if (!cancelled) {
          startTransition(() => {
            setHtml(null);
            setLoading(false);
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code, language, cacheKey, decorations]);

  return { html, loading };
}
