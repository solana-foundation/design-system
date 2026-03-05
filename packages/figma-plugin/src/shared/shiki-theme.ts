/**
 * Shiki CSS variables theme — identical to the web component's theme definition.
 * Used by both the web component and the Figma plugin's UI for tokenization.
 * The CSS variable references are resolved to hex via themes.ts before sending to Figma.
 */

import type { ThemeRegistrationRaw } from '@shikijs/core';

export const cssVariablesTheme: ThemeRegistrationRaw = {
    name: 'css-variables',
    type: 'light',
    colors: {
        'editor.background': 'var(--shiki-background)',
        'editor.foreground': 'var(--shiki-foreground)',
    },
    settings: [
        {
            settings: {
                foreground: 'var(--shiki-foreground)',
                background: 'var(--shiki-background)',
            },
        },
        {
            scope: ['keyword', 'keyword.control', 'storage', 'storage.type', 'storage.modifier'],
            settings: {
                foreground: 'var(--shiki-token-keyword)',
                fontStyle: 'italic',
            },
        },
        {
            scope: ['keyword.operator', 'keyword.operator.assignment'],
            settings: { foreground: 'var(--shiki-token-keyword)' },
        },
        {
            scope: ['string', 'string.quoted', 'string.template'],
            settings: { foreground: 'var(--shiki-token-string)' },
        },
        {
            scope: ['string.regexp'],
            settings: { foreground: 'var(--shiki-token-escape)' },
        },
        {
            scope: ['comment', 'comment.line', 'comment.block', 'punctuation.definition.comment'],
            settings: {
                foreground: 'var(--shiki-token-comment)',
                fontStyle: 'italic',
            },
        },
        {
            scope: ['entity.name.function', 'support.function', 'meta.function-call'],
            settings: { foreground: 'var(--shiki-token-function)' },
        },
        {
            scope: ['constant', 'constant.numeric', 'constant.language', 'support.constant', 'variable.other.constant'],
            settings: { foreground: 'var(--shiki-token-constant)' },
        },
        {
            scope: [
                'constant.character.escape',
                'punctuation.section.embedded',
                'punctuation.definition.template-expression',
            ],
            settings: { foreground: 'var(--shiki-token-escape)' },
        },
        {
            scope: ['meta.template.expression', 'meta.embedded.line'],
            settings: { foreground: 'var(--shiki-foreground)' },
        },
        {
            scope: ['variable.parameter', 'meta.parameter'],
            settings: { foreground: 'var(--shiki-token-parameter)' },
        },
        {
            scope: [
                'punctuation',
                'meta.brace',
                'meta.delimiter',
                'punctuation.definition.tag',
                'punctuation.separator',
                'punctuation.terminator',
            ],
            settings: { foreground: 'var(--shiki-token-punctuation)' },
        },
        {
            scope: [
                'entity.name.type',
                'support.type',
                'support.class',
                'entity.other.inherited-class',
                'meta.type.annotation',
            ],
            settings: { foreground: 'var(--shiki-token-type)' },
        },
        {
            scope: ['entity.other.attribute-name', 'meta.attribute'],
            settings: {
                foreground: 'var(--shiki-token-attribute)',
                fontStyle: 'italic',
            },
        },
        {
            scope: ['variable.language'],
            settings: {
                foreground: 'var(--shiki-token-variable-lang)',
                fontStyle: 'italic',
            },
        },
        {
            scope: ['variable', 'variable.other', 'support.variable'],
            settings: { foreground: 'var(--shiki-foreground)' },
        },
        {
            scope: ['entity.name.tag', 'support.type.property-name'],
            settings: { foreground: 'var(--shiki-token-function)' },
        },
        {
            scope: ['meta.object-literal.key'],
            settings: { foreground: 'var(--shiki-token-parameter)' },
        },
    ],
};
