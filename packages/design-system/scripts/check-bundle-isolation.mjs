import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const distDir = resolve(import.meta.dirname, '..', 'dist');

const safeEntries = [
    'animated-icon.js',
    'badge.js',
    'button.js',
    'copy-button.js',
    'inline-code.js',
    'segmented-control.js',
    'select.js',
    'spinner.js',
    'table.js',
    'tabs.js',
    'text-input.js',
    'tooltip.js',
];

const heavyEntry = 'code-block.js';

const heavyNeedles = ['@shikijs/', 'shiki/wasm', 'shiki/langs/', "import('@shikijs/core')", "import('shiki/wasm')"];

async function readUtf8(filePath) {
    return readFile(filePath, 'utf8');
}

async function fileContainsAny(filePath, needles) {
    const contents = await readUtf8(filePath);
    return needles.some(needle => contents.includes(needle));
}

function* getLocalImports(jsSource) {
    const re =
        /\bfrom\s+["'](?<from>\.\/[^"']+|\.\.\/[^"']+)["']|import\(\s*["'](?<dyn>\.\/[^"']+|\.\.\/[^"']+)["']\s*\)/g;

    for (const match of jsSource.matchAll(re)) {
        const spec = match.groups?.from ?? match.groups?.dyn;
        if (spec) yield spec;
    }
}

async function collectReachableFiles(entryFilePath) {
    const seen = new Set([entryFilePath]);
    const queue = [entryFilePath];

    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) continue;

        const src = await readUtf8(current);
        const baseDir = dirname(current);

        for (const spec of getLocalImports(src)) {
            const resolved = resolve(baseDir, spec);
            if (!resolved.startsWith(distDir)) continue;
            if (seen.has(resolved)) continue;
            seen.add(resolved);
            queue.push(resolved);
        }
    }

    return [...seen];
}

async function main() {
    const offenders = [];

    for (const filename of safeEntries) {
        const entryPath = resolve(distDir, filename);
        const graphFiles = await collectReachableFiles(entryPath);

        let found = false;
        for (const filePath of graphFiles) {
            if (await fileContainsAny(filePath, heavyNeedles)) {
                found = true;
                break;
            }
        }

        if (found) offenders.push(filename);
    }

    const heavyPath = resolve(distDir, heavyEntry);
    const heavyGraphFiles = await collectReachableFiles(heavyPath);
    const heavyHasNeedle = await (async () => {
        for (const filePath of heavyGraphFiles) {
            if (await fileContainsAny(filePath, heavyNeedles)) return true;
        }
        return false;
    })();

    if (offenders.length > 0) {
        throw new Error(`Bundle isolation failed. Shiki references found in: ${offenders.join(', ')}`);
    }

    if (!heavyHasNeedle) {
        throw new Error(`Bundle isolation failed. Expected Shiki references in ${heavyEntry}, but found none.`);
    }
}

await main();
