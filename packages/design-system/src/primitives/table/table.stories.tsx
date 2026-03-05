import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '../badge';
import { Button } from '../button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableCellCopyable,
    TableHead,
    TableHeader,
    TableRow,
} from './index';

/**
 * # Table
 *
 * Composable table primitives with premium spacing, hover transitions,
 * and support for monospace, tabular-nums, and copyable columns.
 *
 * ## Quick Reference
 * - **Row height**: 44px, **Header height**: 40px
 * - **Cell padding**: 16px horizontal, 12px vertical
 * - **Header**: 14px medium weight, muted color (same size as body)
 * - **Hover**: Subtle 150ms ease-out background transition
 * - **Mono**: Berkeley Mono at 14px for API keys / hashes
 * - **Numeric**: tabular-nums for aligned numbers
 * - **Copyable**: Copy icon appears on hover, supports `truncate` for long values
 */
const meta: Meta<typeof Table> = {
    title: 'Primitives/Table',
    component: Table,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Compositional table primitives. No data-driven API — compose Table, TableHeader, TableBody, TableRow, TableHead, and TableCell freely.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Playground: Story = {
    render: () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead align="right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>Alice Johnson</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell align="right" numeric>
                        $2,500.00
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Bob Smith</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>Editor</TableCell>
                    <TableCell align="right" numeric>
                        $1,200.00
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Carol Davis</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell>Viewer</TableCell>
                    <TableCell align="right" numeric>
                        $850.00
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
};

const apiKeys = [
    {
        name: 'Production Backend',
        prefix: 'sk_live_a1b2c3d4',
        role: 'Full access',
        env: 'Mainnet' as const,
        status: 'Active' as const,
        lastUsed: '2h ago',
        expires: 'Dec 31, 2026',
        created: 'Jan 15, 2025',
    },
    {
        name: 'CI Pipeline',
        prefix: 'sk_live_e5f6g7h8',
        role: 'Read-only',
        env: 'Mainnet' as const,
        status: 'Active' as const,
        lastUsed: '5m ago',
        expires: 'Mar 01, 2027',
        created: 'Jun 03, 2025',
    },
    {
        name: 'Staging App',
        prefix: 'sk_dev_i9j0k1l2',
        role: 'Full access',
        env: 'Devnet' as const,
        status: 'Expiring' as const,
        lastUsed: '3d ago',
        expires: 'Apr 15, 2026',
        created: 'Sep 22, 2025',
    },
    {
        name: 'Legacy Integration',
        prefix: 'sk_live_m3n4o5p6',
        role: 'Read-only',
        env: 'Mainnet' as const,
        status: 'Revoked' as const,
        lastUsed: '30d ago',
        expires: 'Expired',
        created: 'Mar 08, 2024',
    },
];

const statusVariant: Record<string, 'success' | 'warning' | 'danger'> = {
    Active: 'success',
    Expiring: 'warning',
    Revoked: 'danger',
};

const envVariant: Record<string, 'warning' | 'info'> = {
    Mainnet: 'warning',
    Devnet: 'info',
};
export const APIKeysOverview: Story = {
    name: 'API Keys Overview',
    render: () => (
        <div className="w-full max-w-[1200px] space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-text-extra-high text-title-sm">API Keys</h2>
                    <p className="mt-1 text-body-sm text-text-low">Manage your API keys for programmatic access.</p>
                </div>
                <Button size="sm" variant="primary">
                    Create key
                </Button>
            </div>

            <Table aria-label="API Keys">
                <TableHeader>
                    <TableRow>
                        <TableHead pinned="left">Name</TableHead>
                        <TableHead>Key prefix</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Env</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last used</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead align="right" pinned="right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {apiKeys.map(key => (
                        <TableRow key={key.prefix}>
                            <TableCell className="font-[var(--font-weight-medium)]" pinned="left">
                                {key.name}
                            </TableCell>
                            <TableCellCopyable mono truncate={120} value={key.prefix}>
                                {key.prefix}
                            </TableCellCopyable>
                            <TableCell className="text-text-medium">{key.role}</TableCell>
                            <TableCell>
                                <Badge variant={envVariant[key.env]}>{key.env}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge dot variant={statusVariant[key.status]}>
                                    {key.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-text-medium">{key.lastUsed}</TableCell>
                            <TableCell className="text-text-medium">{key.expires}</TableCell>
                            <TableCell className="text-text-medium">{key.created}</TableCell>
                            <TableCell align="right" pinned="right">
                                <Button
                                    aria-label="More actions"
                                    iconLeft={<MoreHorizontal />}
                                    iconOnly
                                    size="sm"
                                    variant="secondary"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    ),
};

export const WithCaption: Story = {
    name: 'With Caption',
    render: () => (
        <Table>
            <TableCaption>Recent transactions for your account.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Signature</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead align="right">Amount (SOL)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>Transfer</TableCell>
                    <TableCellCopyable mono value="5Uj2xK9mP3nQr7sT8kPq">
                        5Uj2...8kPq
                    </TableCellCopyable>
                    <TableCell numeric>245,891,023</TableCell>
                    <TableCell align="right" numeric>
                        1.500
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Stake</TableCell>
                    <TableCellCopyable mono value="3Rk9vH4wJ6cYb1xZ2mNx">
                        3Rk9...2mNx
                    </TableCellCopyable>
                    <TableCell numeric>245,891,019</TableCell>
                    <TableCell align="right" numeric>
                        100.000
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Transfer</TableCell>
                    <TableCellCopyable mono value="9Wp4eL8qK2dFg5hR7jLs">
                        9Wp4...7jLs
                    </TableCellCopyable>
                    <TableCell numeric>245,890,998</TableCell>
                    <TableCell align="right" numeric>
                        0.250
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
};
