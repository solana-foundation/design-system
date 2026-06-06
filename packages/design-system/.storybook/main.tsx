// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from 'node:module';
import path, { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
    previewAnnotations: ['../../.forma/storybook/previewBridge.js'],
    stories: [
        '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
        '../../glass-design-system/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    ],

    addons: [
        getAbsolutePath('@storybook/addon-links'),
        getAbsolutePath('@storybook/addon-a11y'),
        getAbsolutePath('@storybook/addon-themes'),
        getAbsolutePath('@storybook/addon-docs'),
    ],

    framework: {
        name: getAbsolutePath('@storybook/react-vite'),
        options: {},
    },

    core: { disableTelemetry: true },

    viteFinal: async config => {
        if (config.resolve) {
            config.resolve.alias = {
                ...config.resolve.alias,
                '@tokens': path.resolve(__dirname, '../src/tokens'),
                '@primitives': path.resolve(__dirname, '../src/primitives'),
                '@components': path.resolve(__dirname, '../src/components'),
                '@patterns': path.resolve(__dirname, '../src/patterns'),
                '@hooks': path.resolve(__dirname, '../src/hooks'),
                '@utils': path.resolve(__dirname, '../src/utils'),
                '@story-components': path.resolve(__dirname, '../src/story-components'),
                '@/hooks': path.resolve(__dirname, '../src/hooks'),
                '@/utils': path.resolve(__dirname, '../src/utils'),
                '@/primitives': path.resolve(__dirname, '../src/primitives'),
                '@/components': path.resolve(__dirname, '../src/components'),
                '@': path.resolve(__dirname, '../src'),
            };
        }

        // Add Tailwind CSS v4 Vite plugin
        config.plugins = config.plugins || [];
        config.plugins.push(tailwindcss());

        return config;
    },

    typescript: {
        reactDocgen: 'react-docgen-typescript',
    },
};
export default config;

function getAbsolutePath(value: string): string {
    return dirname(require.resolve(join(value, 'package.json')));
}
