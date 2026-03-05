import type { Meta, StoryObj } from '@storybook/react-vite';
import { InlineCode } from './index';

const meta: Meta<typeof InlineCode> = {
    title: 'Primitives/InlineCode',
    component: InlineCode,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <p className="text-body-md text-text-high">
            Use <InlineCode>clusterApiUrl("mainnet-beta")</InlineCode> to connect to the Solana mainnet cluster.
        </p>
    ),
};

export const MultipleInline: Story = {
    name: 'Multiple Inline Codes',
    render: () => (
        <p className="text-body-md text-text-high">
            Import <InlineCode>Connection</InlineCode> and <InlineCode>PublicKey</InlineCode> from{' '}
            <InlineCode>@solana/web3.js</InlineCode> to interact with the Solana blockchain.
        </p>
    ),
};

export const DarkMode: Story = {
    name: 'Dark Mode',
    render: () => (
        <div className="dark">
            <div className="rounded-lg bg-gray-100 p-6">
                <p className="text-body-md text-text-high">
                    Run <InlineCode>solana airdrop 2</InlineCode> to get devnet SOL for testing.
                </p>
            </div>
        </div>
    ),
};

export const MultilineWrapping: Story = {
    name: 'Multiline Wrapping',
    render: () => (
        <div className="max-w-sm">
            <p className="text-body-md text-text-high">
                Configure your validator with{' '}
                <InlineCode>
                    solana-validator --identity ~/validator-keypair.json --vote-account ~/vote-account-keypair.json
                    --ledger ~/validator-ledger
                </InlineCode>{' '}
                to start participating in consensus.
            </p>
        </div>
    ),
};
