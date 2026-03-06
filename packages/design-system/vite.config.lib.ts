import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import preserveUseClientDirective from 'rollup-plugin-preserve-use-client';

export default defineConfig({
    plugins: [
        dts({
            tsconfigPath: './tsconfig.build.json',
            outDir: 'dist',
        }),
    ],
    build: {
        lib: {
            entry: {
                index: resolve(import.meta.dirname, 'src/index.ts'),
                'animated-icon': resolve(import.meta.dirname, 'src/animated-icon.ts'),
                badge: resolve(import.meta.dirname, 'src/badge.ts'),
                button: resolve(import.meta.dirname, 'src/button.ts'),
                'code-block': resolve(import.meta.dirname, 'src/code-block.ts'),
                'code-block-group': resolve(import.meta.dirname, 'src/code-block-group.ts'),
                'copy-button': resolve(import.meta.dirname, 'src/copy-button.ts'),
                'inline-code': resolve(import.meta.dirname, 'src/inline-code.ts'),
                'segmented-control': resolve(import.meta.dirname, 'src/segmented-control.ts'),
                select: resolve(import.meta.dirname, 'src/select.ts'),
                spinner: resolve(import.meta.dirname, 'src/spinner.ts'),
                table: resolve(import.meta.dirname, 'src/table.ts'),
                tabs: resolve(import.meta.dirname, 'src/tabs.ts'),
                'text-input': resolve(import.meta.dirname, 'src/text-input.ts'),
                tooltip: resolve(import.meta.dirname, 'src/tooltip.ts'),
                'utils/index': resolve(import.meta.dirname, 'src/utils/index.ts'),
                'hooks/index': resolve(import.meta.dirname, 'src/hooks/index.ts'),
            },
            formats: ['es'],
            fileName: (_format, entryName) => `${entryName}.js`,
        },
        rollupOptions: {
            plugins: [preserveUseClientDirective()],
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                /^react\//,
                /^react-dom\//,
                /^@base-ui\//,
                /^motion\//,
                /^@heroicons\/react/,
                /^lucide-react/,
                /^@shikijs\//,
                /^shiki(\/.*)?$/,
            ],
        },
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true,
        minify: false,
    },
    resolve: {
        alias: {
            '@': resolve(import.meta.dirname, 'src'),
        },
    },
});
