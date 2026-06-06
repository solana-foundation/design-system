import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch, type SwitchProps } from './switch';
import './styles.css';

const meta: Meta<typeof Switch> = {
    title: 'Glass/Switch',
    component: Switch,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Native checkbox switch with a glass thumb node by default.',
            },
        },
    },
    argTypes: {
        checked: {
            table: { disable: true },
        },
        active: {
            control: 'boolean',
            table: { category: 'State' },
        },
        controlHeight: {
            control: { type: 'range', min: 24, max: 96, step: 1 },
            table: { category: 'Size' },
        },
        defaultChecked: {
            control: 'boolean',
            table: { category: 'State' },
        },
        disabled: {
            control: 'boolean',
            table: { category: 'State' },
        },
        glassBlur: {
            control: { type: 'range', min: 0, max: 12, step: 0.1 },
            table: { category: 'Glass' },
        },
        glassChroma: {
            control: { type: 'range', min: 0, max: 1, step: 0.01 },
            table: { category: 'Glass' },
        },
        glassContentLock: {
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
        glassLensH: {
            control: { type: 'range', min: 18, max: 120, step: 1 },
            table: { category: 'Size' },
        },
        glassLensW: {
            control: { type: 'range', min: 18, max: 160, step: 1 },
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
        glassSafariRefresh: {
            control: 'boolean',
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
        glassSplay: {
            control: { type: 'range', min: 0, max: 1, step: 0.01 },
            table: { category: 'Glass' },
        },
        label: {
            control: 'text',
            table: { category: 'Content' },
        },
        onCheckedChange: {
            table: { disable: true },
        },
        switchWidth: {
            control: { type: 'range', min: 44, max: 220, step: 1 },
            table: { category: 'Size' },
        },
        thumbTone: {
            control: 'radio',
            options: ['clear', 'dark', 'light'],
            table: { category: 'Appearance' },
        },
        trackHeight: {
            control: { type: 'range', min: 12, max: 80, step: 1 },
            table: { category: 'Size' },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ControlledSwitchDemo = ({ defaultChecked, ...args }: SwitchProps) => {
    const [checked, setChecked] = useState(defaultChecked ?? false);

    return <Switch {...args} checked={checked} defaultChecked={defaultChecked} onCheckedChange={setChecked} />;
};

export const Playground: Story = {
    args: {
        controlHeight: 52,
        active: false,
        defaultChecked: true,
        disabled: false,
        glassBlur: 0,
        glassChroma: 0,
        glassContentLock: 0.55,
        glassDepth: 3.5,
        glassDome: 0,
        glassEdge: 0,
        glassGlow: 0,
        glassLensH: 34,
        glassLensW: 64,
        glassMapSize: 512,
        glassMagnification: 1,
        glassRadius: 80,
        glassSafariRefresh: true,
        glassScaleX: 50,
        glassScaleY: 58,
        glassSplay: 0.49,
        label: 'Enabled',
        switchWidth: 116,
        thumbTone: 'clear',
        trackHeight: 42,
    },
    render: args => <ControlledSwitchDemo key={`${args.defaultChecked}`} {...args} />,
};

export const States: Story = {
    parameters: { controls: { disable: true } },
    render: () => (
        <div style={{ display: 'grid', gap: 18 }}>
            <Switch label="Off" />
            <Switch active label="Off active" />
            <Switch active defaultChecked label="On active" />
            <Switch defaultChecked label="On" />
            <Switch defaultChecked disabled label="Disabled" />
        </div>
    ),
};
