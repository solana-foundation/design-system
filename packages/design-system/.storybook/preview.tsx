import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';
import './storybook.css';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        layout: 'centered',
        options: {
            storySort: {
                order: ['Tokens', ['Colors', 'Typography', 'Spacing'], 'Primitives', 'Components', 'Patterns', '*'],
            },
        },
    },
    decorators: [
        withThemeByClassName({
            themes: {
                light: '',
                dark: 'dark',
            },
            defaultTheme: 'light',
        }),
        Story => (
            <div className="grid min-h-[100px] w-full place-items-center bg-background p-8 text-foreground">
                <Story />
            </div>
        ),
    ],
};

export default preview;
