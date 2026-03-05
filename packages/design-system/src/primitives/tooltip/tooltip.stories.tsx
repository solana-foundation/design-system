import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip, TooltipProvider } from './index';

const meta: Meta<typeof Tooltip> = {
    title: 'Primitives/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Tooltip with skip-delay grouping, fade + scale animation, arrow, and consistent dark/light theming. Built on Base UI Tooltip.',
            },
        },
    },
    argTypes: {
        content: {
            control: 'text',
            description: 'Content displayed inside the tooltip popup.',
            table: { category: 'Content' },
        },
        side: {
            control: 'radio',
            options: ['top', 'bottom', 'left', 'right'],
            description: 'Which side of the trigger to show the tooltip.',
            table: {
                category: 'Positioning',
                type: { summary: '"top" | "bottom" | "left" | "right"' },
                defaultValue: { summary: 'top' },
            },
        },
        align: {
            control: 'radio',
            options: ['start', 'center', 'end'],
            description: 'Alignment along the side axis.',
            table: {
                category: 'Positioning',
                type: { summary: '"start" | "center" | "end"' },
                defaultValue: { summary: 'center' },
            },
        },
        sideOffset: {
            control: { type: 'number', min: 0, max: 24 },
            description: 'Offset from the trigger in pixels.',
            table: {
                category: 'Positioning',
                type: { summary: 'number' },
                defaultValue: { summary: '8' },
            },
        },
        arrow: {
            control: 'boolean',
            description: 'Show an arrow pointing at the trigger.',
            table: {
                category: 'Appearance',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' },
            },
        },
        delay: {
            control: { type: 'number', min: 0, max: 2000, step: 50 },
            description: 'Delay in ms before showing the tooltip.',
            table: {
                category: 'Behavior',
                type: { summary: 'number' },
                defaultValue: { summary: '0' },
            },
        },
        closeDelay: {
            control: { type: 'number', min: 0, max: 2000, step: 50 },
            description: 'Delay in ms before hiding the tooltip.',
            table: {
                category: 'Behavior',
                type: { summary: 'number' },
                defaultValue: { summary: '150' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

const triggerButton =
    'rounded-lg bg-[var(--button-secondary-bg)] px-4 py-2 font-medium text-[14px] text-text-high transition-colors hover:bg-[var(--button-secondary-bg-hover)]';

// =============================================================================
// 1. PLAYGROUND
// =============================================================================

export const Playground: Story = {
    args: {
        content: 'This is a tooltip',
        side: 'top',
        align: 'center',
        sideOffset: 8,
        arrow: true,
        delay: 0,
        closeDelay: 150,
    },
    render: args => (
        <div className="flex min-h-[200px] items-center justify-center">
            <Tooltip {...args}>
                <button className={triggerButton} type="button">
                    Hover me
                </button>
            </Tooltip>
        </div>
    ),
};

// =============================================================================
// 2. SKIP DELAY
// =============================================================================

export const SkipDelay: Story = {
    parameters: { controls: { disable: true } },
    render: () => (
        <div className="flex flex-col items-center gap-6">
            <p className="max-w-sm text-center text-sm text-text-medium">
                Hover between buttons — second tooltip opens instantly.
            </p>
            <TooltipProvider>
                <div className="flex items-center gap-3">
                    {(['Bold', 'Italic', 'Underline', 'Strikethrough'] as const).map(label => (
                        <Tooltip content={label} key={label}>
                            <button className={triggerButton} type="button">
                                {label.charAt(0)}
                            </button>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>
        </div>
    ),
};

// =============================================================================
// 3. OVERVIEW
// =============================================================================

export const Overview: Story = {
    parameters: { controls: { disable: true } },
    render: () => (
        <div className="flex w-[720px] flex-col gap-10 p-8">
            {/* Sides */}
            <section className="flex flex-col gap-4">
                <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">Sides</h4>
                <div className="flex items-center justify-center gap-8 rounded-xl border border-border-medium p-10">
                    {(['top', 'bottom', 'left', 'right'] as const).map(side => (
                        <Tooltip content={`Tooltip on ${side}`} key={side} side={side}>
                            <button className={triggerButton} type="button">
                                {side}
                            </button>
                        </Tooltip>
                    ))}
                </div>
            </section>

            {/* Without Arrow */}
            <section className="flex flex-col gap-4">
                <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">Without Arrow</h4>
                <div className="flex items-center justify-center gap-8 rounded-xl border border-border-medium p-10">
                    <Tooltip arrow={false} content="No arrow tooltip">
                        <button className={triggerButton} type="button">
                            No arrow
                        </button>
                    </Tooltip>
                    <Tooltip arrow content="With arrow tooltip">
                        <button className={triggerButton} type="button">
                            With arrow
                        </button>
                    </Tooltip>
                </div>
            </section>

            {/* Rich Content */}
            <section className="flex flex-col gap-4">
                <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">Rich Content</h4>
                <div className="flex items-center justify-center gap-8 rounded-xl border border-border-medium p-10">
                    <Tooltip
                        content={
                            <div className="flex flex-col gap-0.5">
                                <span className="font-medium">Keyboard shortcut</span>
                                <span className="opacity-72">Press Cmd+K to search</span>
                            </div>
                        }
                    >
                        <button className={triggerButton} type="button">
                            Rich content
                        </button>
                    </Tooltip>
                </div>
            </section>

            {/* Max Width */}
            <section className="flex flex-col gap-4">
                <h4 className="font-medium text-text-low text-xs uppercase tracking-wide">Max Width</h4>
                <div className="flex items-center justify-center gap-8 rounded-xl border border-border-medium p-10">
                    <Tooltip content="This is a tooltip with a much longer content string that demonstrates the max-width constraint of 320px. The text wraps nicely with text-pretty for balanced line breaks.">
                        <button className={triggerButton} type="button">
                            Long tooltip
                        </button>
                    </Tooltip>
                </div>
            </section>
        </div>
    ),
};
