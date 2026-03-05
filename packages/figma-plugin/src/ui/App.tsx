import { useCallback, useEffect, useRef, useState } from 'react';
import type {
    CodeBlockMode,
    CodeBlockTheme,
    InsertCodeBlockMessage,
    MainToUiMessage,
    ResolvedToken,
    SupportedLanguage,
} from '../shared/types';
import { SUPPORTED_LANGUAGES } from '../shared/types';
import { getShellColors, getSyntaxColors, resolveTokenColor, type SyntaxColors } from '../shared/themes';
import { cssVariablesTheme } from '../shared/shiki-theme';
import './styles.css';

// ---------------------------------------------------------------------------
// Shiki setup (runs in browser iframe)
// ---------------------------------------------------------------------------

let highlighterPromise: Promise<import('@shikijs/core').HighlighterCore> | null = null;
const loadedLangs = new Set<string>();

async function getHighlighter() {
    if (highlighterPromise) return highlighterPromise;

    highlighterPromise = (async () => {
        const { createHighlighterCore } = await import('@shikijs/core');
        const { createJavaScriptRegexEngine } = await import('@shikijs/engine-javascript');

        return createHighlighterCore({
            themes: [cssVariablesTheme],
            langs: [],
            engine: createJavaScriptRegexEngine(),
        });
    })();

    return highlighterPromise;
}

const LANG_IMPORTS: Record<string, () => Promise<unknown>> = {
    typescript: () => import('shiki/langs/typescript.mjs'),
    javascript: () => import('shiki/langs/javascript.mjs'),
    tsx: () => import('shiki/langs/tsx.mjs'),
    jsx: () => import('shiki/langs/jsx.mjs'),
    rust: () => import('shiki/langs/rust.mjs'),
    python: () => import('shiki/langs/python.mjs'),
    bash: () => import('shiki/langs/bash.mjs'),
    json: () => import('shiki/langs/json.mjs'),
    html: () => import('shiki/langs/html.mjs'),
    css: () => import('shiki/langs/css.mjs'),
    yaml: () => import('shiki/langs/yaml.mjs'),
    toml: () => import('shiki/langs/toml.mjs'),
    sql: () => import('shiki/langs/sql.mjs'),
    go: () => import('shiki/langs/go.mjs'),
    c: () => import('shiki/langs/c.mjs'),
    cpp: () => import('shiki/langs/cpp.mjs'),
    java: () => import('shiki/langs/java.mjs'),
    swift: () => import('shiki/langs/swift.mjs'),
    kotlin: () => import('shiki/langs/kotlin.mjs'),
    solidity: () => import('shiki/langs/solidity.mjs'),
    markdown: () => import('shiki/langs/markdown.mjs'),
    graphql: () => import('shiki/langs/graphql.mjs'),
    diff: () => import('shiki/langs/diff.mjs'),
};

async function tokenize(code: string, lang: string, syntax: SyntaxColors): Promise<ResolvedToken[]> {
    const hl = await getHighlighter();

    // Load language on demand
    if (!loadedLangs.has(lang) && LANG_IMPORTS[lang]) {
        const mod = (await LANG_IMPORTS[lang]()) as Record<string, unknown>;
        await hl.loadLanguage((mod.default ?? mod) as Parameters<typeof hl.loadLanguage>[0]);
        loadedLangs.add(lang);
    }

    const useLang = loadedLangs.has(lang) ? lang : 'text';
    const result = hl.codeToTokens(code, {
        lang: useLang,
        theme: 'css-variables',
    });

    const tokens: ResolvedToken[] = [];
    let offset = 0;

    for (let lineIdx = 0; lineIdx < result.tokens.length; lineIdx++) {
        for (const token of result.tokens[lineIdx]) {
            const start = offset;
            const end = offset + token.content.length;
            const hexColor = resolveTokenColor(token.color, syntax);
            const isItalic = ((token.fontStyle ?? 0) & 1) !== 0;

            tokens.push({ start, end, color: hexColor, italic: isItalic });
            offset = end;
        }
        // Account for newline between lines
        if (lineIdx < result.tokens.length - 1) {
            offset += 1;
        }
    }

    return tokens;
}

// ---------------------------------------------------------------------------
// Default code sample
// ---------------------------------------------------------------------------

const DEFAULT_CODE = `import { Connection, PublicKey } from "@solana/web3.js";

async function getBalance(address: string) {
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  const pubkey = new PublicKey(address);
  const balance = await connection.getBalance(pubkey);

  // Convert lamports to SOL
  return balance / 1e9;
}`;

// ---------------------------------------------------------------------------
// App component
// ---------------------------------------------------------------------------

export function App() {
    const [code, setCode] = useState(DEFAULT_CODE);
    const [language, setLanguage] = useState<SupportedLanguage>('typescript');
    const [theme, setTheme] = useState<CodeBlockTheme>('default');
    const [mode, setMode] = useState<CodeBlockMode>('light');
    const [mono, setMono] = useState(false);
    const [width, setWidth] = useState(560);
    const [borderRadius, setBorderRadius] = useState(8);
    const [fontSize, setFontSize] = useState(14);
    const [lineHeight, setLineHeight] = useState(21);
    const [showHeader, setShowHeader] = useState(false);
    const [filename, setFilename] = useState('index.ts');
    const [showLineNumbers, setShowLineNumbers] = useState(false);
    const [addedLinesStr, setAddedLinesStr] = useState('');
    const [removedLinesStr, setRemovedLinesStr] = useState('');
    const [inserting, setInserting] = useState(false);
    const [selectedFrame, setSelectedFrame] = useState<{
        name: string;
        width: number;
        height: number;
    } | null>(null);

    // Listen for selection info from main thread
    useEffect(() => {
        const handler = (e: MessageEvent) => {
            const msg = e.data?.pluginMessage as MainToUiMessage | undefined;
            if (!msg || msg.type !== 'selection-info') return;
            if (msg.hasFrame) {
                setSelectedFrame({
                    name: msg.frameName,
                    width: msg.frameWidth,
                    height: msg.frameHeight,
                });
                setWidth(msg.frameWidth);
            } else {
                setSelectedFrame(null);
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    // Preview
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const syntax = getSyntaxColors(theme, mode, mono);
    const shell = getShellColors(theme, mode, syntax);

    // Generate live preview
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const hl = await getHighlighter();
                if (!loadedLangs.has(language) && LANG_IMPORTS[language]) {
                    const mod = (await LANG_IMPORTS[language]()) as Record<string, unknown>;
                    await hl.loadLanguage((mod.default ?? mod) as Parameters<typeof hl.loadLanguage>[0]);
                    loadedLangs.add(language);
                }

                const useLang = loadedLangs.has(language) ? language : 'text';
                const html = hl.codeToHtml(code, {
                    lang: useLang,
                    theme: 'css-variables',
                });

                if (!cancelled) setPreviewHtml(html);
            } catch {
                if (!cancelled) setPreviewHtml(null);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [code, language]);

    const parseLineNums = (s: string): number[] =>
        s
            .split(',')
            .map(n => parseInt(n.trim(), 10))
            .filter(n => !isNaN(n) && n > 0);

    const handleInsert = useCallback(async () => {
        setInserting(true);
        try {
            const tokens = await tokenize(code, language, syntax);
            const msg: InsertCodeBlockMessage = {
                type: 'insert-code-block',
                config: {
                    code,
                    width,
                    borderRadius,
                    fontSize,
                    lineHeight,
                    showHeader,
                    filename,
                    showLineNumbers,
                    addedLines: parseLineNums(addedLinesStr),
                    removedLines: parseLineNums(removedLinesStr),
                },
                colors: shell,
                tokens,
            };
            parent.postMessage({ pluginMessage: msg }, '*');
        } catch (err) {
            console.error('Tokenization error:', err);
        } finally {
            setInserting(false);
        }
    }, [
        code,
        language,
        syntax,
        shell,
        width,
        borderRadius,
        fontSize,
        lineHeight,
        showHeader,
        filename,
        showLineNumbers,
        addedLinesStr,
        removedLinesStr,
    ]);

    // Build inline CSS variables for the preview
    const previewVars: Record<string, string> = {
        '--shiki-foreground': syntax.foreground,
        '--shiki-background': 'transparent',
        '--shiki-token-keyword': syntax.keyword,
        '--shiki-token-string': syntax.string,
        '--shiki-token-comment': syntax.comment,
        '--shiki-token-function': syntax.function,
        '--shiki-token-constant': syntax.constant,
        '--shiki-token-parameter': syntax.parameter,
        '--shiki-token-punctuation': syntax.punctuation,
        '--shiki-token-type': syntax.type,
        '--shiki-token-attribute': syntax.attribute,
        '--shiki-token-escape': syntax.escape,
        '--shiki-token-variable-lang': syntax.variableLang,
    };

    return (
        <div className="plugin">
            {/* Code input */}
            <section className="section">
                <label className="label">Code</label>
                <textarea
                    className="code-input"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    spellCheck={false}
                    rows={8}
                />
            </section>

            {/* Language */}
            <section className="section">
                <label className="label">Language</label>
                <select
                    className="select"
                    value={language}
                    onChange={e => setLanguage(e.target.value as SupportedLanguage)}
                >
                    {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang} value={lang}>
                            {lang}
                        </option>
                    ))}
                </select>
            </section>

            {/* Theme controls */}
            <section className="section row">
                <div className="col">
                    <label className="label">Theme</label>
                    <div className="radio-group">
                        {(['default', 'sand', 'calm', 'vivid'] as const).map(t => (
                            <label key={t} className="radio-label">
                                <input
                                    type="radio"
                                    name="theme"
                                    value={t}
                                    checked={theme === t}
                                    onChange={() => setTheme(t)}
                                />
                                {t}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="col">
                    <label className="label">Mode</label>
                    <div className="radio-group">
                        {(['light', 'dark'] as const).map(m => (
                            <label key={m} className="radio-label">
                                <input
                                    type="radio"
                                    name="mode"
                                    value={m}
                                    checked={mode === m}
                                    onChange={() => setMode(m)}
                                />
                                {m}
                            </label>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <label className="checkbox-label">
                    <input type="checkbox" checked={mono} onChange={e => setMono(e.target.checked)} />
                    Monochrome
                </label>
            </section>

            {/* Target indicator */}
            {selectedFrame && (
                <section className="section">
                    <div className="target-indicator">
                        Inserting into <strong>{selectedFrame.name}</strong>{' '}
                        <span className="target-dims">
                            {selectedFrame.width} x {selectedFrame.height}
                        </span>
                    </div>
                </section>
            )}

            {/* Dimensions */}
            <section className="section row">
                <div className="col">
                    <label className="label">Width (px)</label>
                    <input
                        className="number-input"
                        type="number"
                        value={width}
                        min={200}
                        max={1600}
                        onChange={e => setWidth(Number(e.target.value))}
                    />
                </div>
                <div className="col">
                    <label className="label">Radius (px)</label>
                    <input
                        className="number-input"
                        type="number"
                        value={borderRadius}
                        min={0}
                        max={24}
                        onChange={e => setBorderRadius(Number(e.target.value))}
                    />
                </div>
                <div className="col">
                    <label className="label">Font (px)</label>
                    <input
                        className="number-input"
                        type="number"
                        value={fontSize}
                        min={10}
                        max={24}
                        onChange={e => setFontSize(Number(e.target.value))}
                    />
                </div>
                <div className="col">
                    <label className="label">Line H (px)</label>
                    <input
                        className="number-input"
                        type="number"
                        value={lineHeight}
                        min={14}
                        max={36}
                        onChange={e => setLineHeight(Number(e.target.value))}
                    />
                </div>
            </section>

            {/* Features */}
            <section className="section">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={showLineNumbers}
                        onChange={e => setShowLineNumbers(e.target.checked)}
                    />
                    Show line numbers
                </label>

                <label className="checkbox-label">
                    <input type="checkbox" checked={showHeader} onChange={e => setShowHeader(e.target.checked)} />
                    Show filename header
                </label>

                {showHeader && (
                    <input
                        className="text-input"
                        type="text"
                        value={filename}
                        placeholder="filename.ts"
                        onChange={e => setFilename(e.target.value)}
                    />
                )}
            </section>

            {/* Diff */}
            <section className="section">
                <label className="label">Diff markers (comma-separated line numbers)</label>
                <div className="row" style={{ gap: 8 }}>
                    <input
                        className="text-input"
                        type="text"
                        value={addedLinesStr}
                        placeholder="Added: 3,5,6"
                        onChange={e => setAddedLinesStr(e.target.value)}
                    />
                    <input
                        className="text-input"
                        type="text"
                        value={removedLinesStr}
                        placeholder="Removed: 2,8"
                        onChange={e => setRemovedLinesStr(e.target.value)}
                    />
                </div>
            </section>

            {/* Preview */}
            <section className="section">
                <label className="label">Preview</label>
                <div
                    className="preview"
                    ref={previewRef}
                    style={
                        {
                            background: shell.bg,
                            borderColor: shell.border,
                            borderRadius,
                            ...previewVars,
                        } as React.CSSProperties
                    }
                >
                    {previewHtml ? (
                        <div className="preview-code" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    ) : (
                        <pre className="preview-code">
                            <code>{code}</code>
                        </pre>
                    )}
                </div>
            </section>

            {/* Insert button */}
            <section className="section">
                <button className="insert-btn" onClick={handleInsert} disabled={inserting || !code.trim()}>
                    {inserting ? 'Inserting...' : 'Insert CodeBlock'}
                </button>
            </section>
        </div>
    );
}
