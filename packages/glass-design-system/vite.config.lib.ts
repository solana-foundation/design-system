import { resolve } from 'node:path';
import preserveUseClientDirective from 'rollup-plugin-preserve-use-client';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

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
                'displacement-map': resolve(import.meta.dirname, 'src/displacement-map.ts'),
                'glass-filter': resolve(import.meta.dirname, 'src/glass-filter.tsx'),
                index: resolve(import.meta.dirname, 'src/index.ts'),
                'glass-surface': resolve(import.meta.dirname, 'src/glass-surface.tsx'),
                slider: resolve(import.meta.dirname, 'src/slider.tsx'),
                switch: resolve(import.meta.dirname, 'src/switch.tsx'),
                tokens: resolve(import.meta.dirname, 'src/tokens.ts'),
            },
            formats: ['es'],
            fileName: (_format, entryName) => `${entryName}.js`,
        },
        rollupOptions: {
            onwarn(warning, warn) {
                if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')) return;
                warn(warning);
            },
            plugins: [preserveUseClientDirective()],
            external: ['react', 'react-dom', 'react/jsx-runtime', /^react\//, /^react-dom\//],
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
