import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Slider, type SliderProps } from './slider';
import './styles.css';

const meta: Meta<typeof Slider> = {
    title: 'Glass/Slider',
    component: Slider,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Range slider with native input behavior and a glass thumb node.',
            },
        },
    },
    argTypes: {
        defaultValue: {
            control: { type: 'range', min: 0, max: 100, step: 1 },
            description: 'Initial value for uncontrolled usage.',
            table: { category: 'State' },
        },
        disabled: {
            control: 'boolean',
            table: { category: 'State' },
        },
        controlHeight: {
            control: { type: 'range', min: 24, max: 120, step: 1 },
            table: { category: 'Size' },
        },
        label: {
            control: 'text',
            table: { category: 'Content' },
        },
        glassBlur: {
            control: { type: 'range', min: 0, max: 12, step: 0.1 },
            table: { category: 'Glass' },
        },
        glassChroma: {
            control: { type: 'range', min: 0, max: 1, step: 0.01 },
            table: { category: 'Glass' },
        },
        glassDepth: {
            control: { type: 'range', min: 0, max: 32, step: 0.5 },
            table: { category: 'Glass' },
        },
        glassDome: {
            control: { type: 'range', min: 0, max: 70, step: 1 },
            table: { category: 'Glass' },
        },
        glassEdge: {
            control: { type: 'range', min: 0, max: 1, step: 0.01 },
            table: { category: 'Glass' },
        },
        glassGlow: {
            control: { type: 'range', min: 0, max: 1, step: 0.01 },
            table: { category: 'Glass' },
        },
        glassContentLock: {
            control: { type: 'range', min: 0, max: 1, step: 0.01 },
            table: { category: 'Glass' },
        },
        glassLensH: {
            control: { type: 'range', min: 18, max: 180, step: 1 },
            table: { category: 'Size' },
        },
        glassLensW: {
            control: { type: 'range', min: 24, max: 280, step: 1 },
            table: { category: 'Size' },
        },
        glassMapSize: {
            control: 'radio',
            options: [64, 128, 256, 512],
            table: { category: 'Glass' },
        },
        glassMagnification: {
            control: { type: 'range', min: 1, max: 6, step: 0.05 },
            table: { category: 'Glass' },
        },
        glassRadius: {
            control: { type: 'range', min: 0, max: 80, step: 1 },
            table: { category: 'Glass' },
        },
        glassScaleX: {
            control: { type: 'range', min: 0, max: 90, step: 1 },
            table: { category: 'Glass' },
        },
        glassScaleY: {
            control: { type: 'range', min: 0, max: 90, step: 1 },
            table: { category: 'Glass' },
        },
        glassSafariRefresh: {
            control: 'boolean',
            table: { category: 'Glass' },
        },
        glassSplay: {
            control: { type: 'range', min: 0, max: 1, step: 0.01 },
            table: { category: 'Glass' },
        },
        glassTargetMode: {
            control: 'boolean',
            table: { category: 'Glass' },
        },
        glassFullDragFilter: {
            control: 'boolean',
            table: { category: 'Glass' },
        },
        glassDragFrost: {
            control: 'boolean',
            table: { category: 'Glass' },
        },
        glassDebugLogs: {
            control: 'boolean',
            table: { category: 'Glass' },
        },
        max: {
            control: { type: 'number' },
            table: { category: 'Range' },
        },
        min: {
            control: { type: 'number' },
            table: { category: 'Range' },
        },
        showValue: {
            control: 'boolean',
            table: { category: 'Content' },
        },
        sliderWidth: {
            control: { type: 'range', min: 120, max: 640, step: 1 },
            table: { category: 'Size' },
        },
        step: {
            control: { type: 'number' },
            table: { category: 'Range' },
        },
        thumbTone: {
            control: 'radio',
            options: ['clear', 'dark', 'light'],
            table: { category: 'Appearance' },
        },
        trackHeight: {
            control: { type: 'range', min: 2, max: 20, step: 1 },
            table: { category: 'Size' },
        },
        value: {
            table: { disable: true },
        },
        valueFormatter: {
            table: { disable: true },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sliderFrameStyle = {
    width: 'min(320px, calc(100vw - 64px))',
} as const;

const ControlledSliderDemo = ({ defaultValue, ...args }: SliderProps) => {
    const [value, setValue] = useState(defaultValue ?? args.min ?? 0);

    return (
        <div style={sliderFrameStyle}>
            <Slider {...args} defaultValue={defaultValue} onValueChange={setValue} value={value} />
        </div>
    );
};

export const Playground: Story = {
    args: {
        controlHeight: 44,
        defaultValue: 42,
        disabled: false,
        glassBlur: 0,
        glassChroma: 0,
        glassDepth: 3.5,
        glassDome: 0,
        glassEdge: 0,
        glassGlow: 0,
        glassContentLock: 0.86,
        glassLensH: 34,
        glassLensW: 63,
        glassMapSize: 512,
        glassMagnification: 1.4,
        glassRadius: 80,
        glassScaleX: 38,
        glassScaleY: 38,
        glassSafariRefresh: true,
        glassSplay: 0.49,
        glassTargetMode: true,
        glassFullDragFilter: true,
        glassDragFrost: false,
        glassDebugLogs: false,
        label: '',
        max: 100,
        min: 0,
        showValue: false,
        sliderWidth: 244,
        step: 1,
        thumbTone: 'clear',
        trackHeight: 9,
    },
    render: args => (
        <ControlledSliderDemo key={`${args.defaultValue}-${args.min}-${args.max}-${args.step}`} {...args} />
    ),
};

export const States: Story = {
    parameters: { controls: { disable: true } },
    render: () => (
        <div style={{ ...sliderFrameStyle, display: 'grid', gap: 20 }}>
            <Slider defaultValue={24} thumbTone="clear" />
            <Slider defaultValue={64} thumbTone="dark" />
            <Slider defaultValue={84} disabled thumbTone="light" />
        </div>
    ),
};
