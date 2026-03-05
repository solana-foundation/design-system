import type { ThemeRegistrationRaw } from '@shikijs/core';

/**
 * Custom Shiki theme that maps all token colors to CSS custom properties.
 * Actual colors are defined in globals.css and switch via `data-code-theme` attribute
 * and the `.dark` class.
 *
 * Design principles:
 * - Keywords, storage, attributes, and variable.language get italic (language scaffolding)
 * - User code (functions, variables, strings, constants) stays roman
 * - Operators use keyword color but NO italic (=, +, => stay roman)
 * - Escape chars and regex get their own distinct treatment
 * - Template expressions revert to foreground so interpolated code reads as code
 */
export const cssVariablesTheme: ThemeRegistrationRaw = {
    name: 'css-variables',
    type: 'light',
    colors: {
        'editor.background': 'var(--shiki-background)',
        'editor.foreground': 'var(--shiki-foreground)',
    },
    settings: [
        // Default foreground — must be first entry (no scope) so Shiki uses it as base
        {
            settings: {
                foreground: 'var(--shiki-foreground)',
                background: 'var(--shiki-background)',
            },
        },
        // Keywords + storage — italic (structural scaffolding)
        {
            scope: ['keyword', 'keyword.control', 'storage', 'storage.type', 'storage.modifier'],
            settings: {
                foreground: 'var(--shiki-token-keyword)',
                fontStyle: 'italic',
            },
        },
        // Operators — keyword color but NO italic (=, +, => stay roman)
        {
            scope: ['keyword.operator', 'keyword.operator.assignment'],
            settings: { foreground: 'var(--shiki-token-keyword)' },
        },
        // Strings
        {
            scope: ['string', 'string.quoted', 'string.template'],
            settings: { foreground: 'var(--shiki-token-string)' },
        },
        // Regex — distinct from regular strings
        {
            scope: ['string.regexp'],
            settings: { foreground: 'var(--shiki-token-escape)' },
        },
        // Comments — italic
        {
            scope: ['comment', 'comment.line', 'comment.block', 'punctuation.definition.comment'],
            settings: {
                foreground: 'var(--shiki-token-comment)',
                fontStyle: 'italic',
            },
        },
        // Functions
        {
            scope: ['entity.name.function', 'support.function', 'meta.function-call'],
            settings: { foreground: 'var(--shiki-token-function)' },
        },
        // Constants
        {
            scope: ['constant', 'constant.numeric', 'constant.language', 'support.constant', 'variable.other.constant'],
            settings: { foreground: 'var(--shiki-token-constant)' },
        },
        // Escape characters — distinct from surrounding string
        {
            scope: [
                'constant.character.escape',
                'punctuation.section.embedded',
                'punctuation.definition.template-expression',
            ],
            settings: { foreground: 'var(--shiki-token-escape)' },
        },
        // Template expression contents — revert to foreground
        {
            scope: ['meta.template.expression', 'meta.embedded.line'],
            settings: { foreground: 'var(--shiki-foreground)' },
        },
        // Parameters
        {
            scope: ['variable.parameter', 'meta.parameter'],
            settings: { foreground: 'var(--shiki-token-parameter)' },
        },
        // Punctuation
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
        // Types
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
        // Attribute names — italic (HTML/JSX attributes function like parameters)
        {
            scope: ['entity.other.attribute-name', 'meta.attribute'],
            settings: {
                foreground: 'var(--shiki-token-attribute)',
                fontStyle: 'italic',
            },
        },
        // variable.language — italic (this, self, super)
        {
            scope: ['variable.language'],
            settings: {
                foreground: 'var(--shiki-token-variable-lang)',
                fontStyle: 'italic',
            },
        },
        // General variables — foreground
        {
            scope: ['variable', 'variable.other', 'support.variable'],
            settings: { foreground: 'var(--shiki-foreground)' },
        },
        // Tags and property names
        {
            scope: ['entity.name.tag', 'support.type.property-name'],
            settings: { foreground: 'var(--shiki-token-function)' },
        },
        // Object literal keys
        {
            scope: ['meta.object-literal.key'],
            settings: { foreground: 'var(--shiki-token-parameter)' },
        },
    ],
};
