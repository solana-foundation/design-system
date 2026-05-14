import type { Meta, StoryObj } from '@storybook/react-vite';

const variants = [
    {
        name: 'shadow-rim',
        className: 'shadow-rim',
        label: 'Rim',
        usage: 'Cards, list items, table cells.',
    },
    {
        name: 'shadow-rim-elevated',
        className: 'shadow-rim-elevated',
        label: 'Rim · Elevated',
        usage: 'Popovers, hover cards, dropdowns.',
    },
    {
        name: 'shadow-rim-overlay',
        className: 'shadow-rim-overlay',
        label: 'Rim · Overlay',
        usage: 'Modal, dialog, command-menu surfaces.',
    },
] as const;

const decisionRules = [
    { ok: true, context: 'Off-white card on gray canvas', why: 'White inset + 4% outer create the lift' },
    { ok: true, context: 'Dark card on darker canvas (dark mode)', why: 'White @ 8% inset reads against dark surface' },
    { ok: false, context: 'Pure white card', why: 'Inset highlight is invisible on white — only outer hairline shows' },
    {
        ok: false,
        context: 'Tinted / branded card',
        why: 'Outer hairline fights the surface tint — use a colored border',
    },
    { ok: false, context: 'Card same value as canvas', why: 'No separation to sharpen' },
    { ok: false, context: 'Card darker than canvas', why: 'Light-source intuition reverses — use a drop shadow' },
];

const tokens = [
    { name: '--rim-highlight', light: 'white @ 100%', dark: 'white @ 8%', role: 'Inset top-edge highlight' },
    { name: '--rim-shadow', light: 'black @ 4%', dark: 'black @ 40%', role: 'Outer 1px hairline' },
    { name: '--rim-drop-soft', light: 'black @ 6%', dark: 'black @ 24%', role: 'Soft drop layer (elevated, overlay)' },
    { name: '--rim-drop-deep', light: 'black @ 12%', dark: 'black @ 50%', role: 'Deep drop layer (overlay)' },
];

function Comparison() {
    return (
        <div className="min-w-[600px] p-8">
            <h2 className="mb-2 font-semibold text-text-extra-high text-xl">Flat border vs. rim</h2>
            <p className="mb-6 text-sm text-text-medium">
                Same content on the same canvas — the rim is sharper and more dimensional.
            </p>
            <div className="rounded-lg bg-gray-100 p-6 dark:bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border-medium bg-gray-50 p-4 dark:bg-gray-100">
                        <div className="font-medium text-text-extra-high text-sm">Flat border</div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 shadow-rim dark:bg-gray-100">
                        <div className="font-medium text-text-extra-high text-sm">Rim shadow</div>
                    </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4">
                    <code className="font-mono text-text-low text-xs">border border-border-medium</code>
                    <code className="font-mono text-text-low text-xs">shadow-rim</code>
                </div>
            </div>
        </div>
    );
}

function Variants() {
    return (
        <div className="min-w-[600px] p-8">
            <h2 className="mb-2 font-semibold text-text-extra-high text-xl">Elevation variants</h2>
            <p className="mb-6 text-sm text-text-medium">
                All three start with the same inset highlight + outer hairline. Elevated and overlay add progressively
                deeper drop layers for surfaces that float.
            </p>
            <div className="rounded-lg bg-gray-100 p-6 dark:bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                    {variants.map(v => (
                        <div className={`rounded-xl bg-gray-50 p-4 dark:bg-gray-100 ${v.className}`} key={v.name}>
                            <div className="font-medium text-text-extra-high text-sm">{v.label}</div>
                            <div className="mt-1 text-text-medium text-xs">{v.usage}</div>
                        </div>
                    ))}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4">
                    {variants.map(v => (
                        <code className="font-mono text-text-low text-xs" key={v.name}>
                            {v.className}
                        </code>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Surfaces() {
    return (
        <div className="min-w-[600px] p-8">
            <h2 className="mb-2 font-semibold text-text-extra-high text-xl">Pure white vs. off-white cards</h2>
            <p className="mb-6 text-sm text-text-medium">
                The white inset highlight needs a card surface that is <em>not</em> pure white to register.
            </p>
            <div className="rounded-lg bg-gray-100 p-6 dark:bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white p-4 shadow-rim dark:bg-gray-50">
                        <div className="font-medium text-text-extra-high text-sm">Pure white</div>
                        <div className="mt-1 text-text-medium text-xs">Only outer hairline registers.</div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 shadow-rim dark:bg-gray-100">
                        <div className="font-medium text-text-extra-high text-sm">Off-white</div>
                        <div className="mt-1 text-text-medium text-xs">Both layers register.</div>
                    </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4">
                    <code className="font-mono text-text-low text-xs">bg-white shadow-rim</code>
                    <code className="font-mono text-text-low text-xs">bg-gray-50 shadow-rim</code>
                </div>
            </div>
        </div>
    );
}

function Guide() {
    return (
        <div className="min-w-[600px] p-8">
            <h2 className="mb-2 font-semibold text-text-extra-high text-xl">Decision guide</h2>
            <p className="mb-6 text-sm text-text-medium">
                When the rim is the right tool — and when to fall back to a border.
            </p>
            <div className="overflow-hidden rounded-lg border border-border-medium">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-50">
                        <tr>
                            <th className="w-16 px-4 py-3 font-medium text-text-extra-high">Rim?</th>
                            <th className="px-4 py-3 font-medium text-text-extra-high">Context</th>
                            <th className="px-4 py-3 font-medium text-text-extra-high">Why</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                        {decisionRules.map(r => (
                            <tr key={r.context}>
                                <td className="px-4 py-3 font-medium">{r.ok ? '✅' : '❌'}</td>
                                <td className="px-4 py-3 text-text-extra-high">{r.context}</td>
                                <td className="px-4 py-3 text-text-medium">{r.why}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Atoms() {
    return (
        <div className="min-w-[600px] p-8">
            <h2 className="mb-2 font-semibold text-text-extra-high text-xl">Atoms</h2>
            <p className="mb-6 text-sm text-text-medium">
                Four atom tokens compose the three rim utilities. Faithful to{' '}
                <a className="underline" href="https://twitter.com/nilseller" rel="noreferrer" target="_blank">
                    @nilseller's
                </a>{' '}
                recipe.
            </p>
            <div className="overflow-hidden rounded-lg border border-border-medium">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 font-medium text-text-extra-high">Token</th>
                            <th className="px-4 py-3 font-medium text-text-extra-high">Light</th>
                            <th className="px-4 py-3 font-medium text-text-extra-high">Dark</th>
                            <th className="px-4 py-3 font-medium text-text-extra-high">Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                        {tokens.map(t => (
                            <tr key={t.name}>
                                <td className="px-4 py-3 font-mono text-text-extra-high">{t.name}</td>
                                <td className="px-4 py-3 text-text-medium">{t.light}</td>
                                <td className="px-4 py-3 text-text-medium">{t.dark}</td>
                                <td className="px-4 py-3 text-text-medium">{t.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function AllSections() {
    return (
        <div className="flex flex-col gap-2">
            <Comparison />
            <Variants />
            <Surfaces />
            <Guide />
            <Atoms />
        </div>
    );
}

const meta: Meta = {
    title: 'Tokens/Rim Shadows',
    component: AllSections,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
    render: () => <AllSections />,
};

export const FlatVsRim: Story = {
    render: () => <Comparison />,
};

export const ElevationVariants: Story = {
    render: () => <Variants />,
};

export const SurfaceTonality: Story = {
    render: () => <Surfaces />,
};

export const DecisionGuide: Story = {
    render: () => <Guide />,
};

export const TokenAtoms: Story = {
    render: () => <Atoms />,
};
