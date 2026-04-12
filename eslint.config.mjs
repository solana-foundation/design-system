import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
    {
        ignores: [
            '**/.next/**',
            '**/.turbo/**',
            '**/.vercel/**',
            '**/coverage/**',
            '**/dist/**',
            '**/node_modules/**',
            '**/public/r/**',
            '**/storybook-static/**',
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'jsx-a11y': jsxA11y,
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            ...(react.configs.recommended?.rules ?? {}),
            ...(reactHooks.configs.recommended?.rules ?? {}),
            ...(jsxA11y.configs.recommended?.rules ?? {}),
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/triple-slash-reference': 'off',
            'jsx-a11y/no-noninteractive-tabindex': 'off',
            'react-hooks/refs': 'off',
            'react/no-danger': 'off',
            'react/no-unescaped-entities': 'off',
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
        },
    },
    {
        files: ['**/*.stories.@(js|jsx|ts|tsx)'],
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            'react-hooks/rules-of-hooks': 'off',
        },
    },
    {
        files: ['packages/design-system/src/**/*.{ts,tsx}'],
        rules: {
            // Library code should not leak `any` into consumer types.
            '@typescript-eslint/no-explicit-any': 'error',
        },
    },
    eslintConfigPrettier,
];
