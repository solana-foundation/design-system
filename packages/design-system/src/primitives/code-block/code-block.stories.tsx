import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlockGroup } from "./code-block-group";
import { CodeBlock, CodeBlockProvider } from "./index";

const meta: Meta<typeof CodeBlock> = {
  title: "Primitives/CodeBlock",
  component: CodeBlock,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Syntax-highlighted code block with themes, line numbers, diffs, collapsible sections, and word highlighting. Powered by Shiki.",
      },
    },
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["default", "sand"],
      description: "Theme variant",
      table: {
        category: "Appearance",
        type: { summary: '"default" | "sand"' },
        defaultValue: { summary: "default" },
      },
    },
    mono: {
      control: "boolean",
      description: "Monochrome syntax — grayscale with lightness contrast",
      table: {
        category: "Appearance",
        defaultValue: { summary: "false" },
      },
    },
    borderRadius: {
      control: { type: "range", min: 0, max: 24 },
      description: "Border radius in pixels",
      table: {
        category: "Appearance",
        defaultValue: { summary: "8" },
      },
    },
    hideCopyButton: {
      control: "boolean",
      description: "Hide the copy-to-clipboard button",
      table: {
        category: "Appearance",
        defaultValue: { summary: "false" },
      },
    },
    language: {
      control: "select",
      options: ["typescript", "rust", "python", "bash", "json", "text"],
      description: "Programming language for syntax highlighting",
      table: {
        category: "Content",
        type: { summary: "string" },
        defaultValue: { summary: "text" },
      },
    },
    filename: {
      control: "text",
      description: "Filename displayed in the header bar",
      table: {
        category: "Content",
      },
    },
    showLineNumbers: {
      control: "boolean",
      description: "Show line numbers in the gutter",
      table: {
        category: "Display",
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ---------- Sample code ----------

const tsCode = `import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

async function getBalance(address: string): Promise<number> {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const publicKey = new PublicKey(address);
  const balance = await connection.getBalance(publicKey);
  return balance / 1e9; // Convert lamports to SOL
}

// Fetch and display balance
const address = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg";
const balance = await getBalance(address);
console.log(\`Balance: \${balance} SOL\`);`;

const rustCode = `use solana_sdk::{
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    transaction::Transaction,
};

/// Transfer SOL between two accounts
pub fn transfer_sol(
    from: &Keypair,
    to: &Pubkey,
    lamports: u64,
) -> Result<Transaction, Box<dyn std::error::Error>> {
    let instruction = solana_sdk::system_instruction::transfer(
        &from.pubkey(),
        to,
        lamports,
    );

    let transaction = Transaction::new_with_payer(
        &[instruction],
        Some(&from.pubkey()),
    );

    Ok(transaction)
}`;

const jsonCode = `{
  "name": "@solana/design-system",
  "version": "1.0.0",
  "dependencies": {
    "@solana/web3.js": "^2.0.0",
    "react": "^19.0.0"
  },
  "scripts": {
    "build": "vite build",
    "dev": "vite dev"
  }
}`;

const bashCode = `# Install Solana CLI tools
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# Verify installation
solana --version
solana-keygen --version

# Create a new wallet
solana-keygen new --outfile ~/.config/solana/devnet.json

# Set to devnet
solana config set --url devnet

# Airdrop some SOL for testing
solana airdrop 2`;

const pythonCode = `from solders.keypair import Keypair
from solana.rpc.api import Client

def get_recent_blockhash():
    """Fetch the most recent blockhash from the cluster."""
    client = Client("https://api.mainnet-beta.solana.com")
    response = client.get_latest_blockhash()
    return response.value.blockhash

# Generate a new keypair
keypair = Keypair()
print(f"Public key: {keypair.pubkey()}")`;

const longCode = `import { Connection, PublicKey, clusterApiUrl, Keypair } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createTransferInstruction } from "@solana/spl-token";

// Configuration
const CLUSTER = "mainnet-beta";
const connection = new Connection(clusterApiUrl(CLUSTER));

// Wallet setup
const secretKey = Uint8Array.from([/* your secret key */]);
const payer = Keypair.fromSecretKey(secretKey);
console.log("Payer:", payer.publicKey.toBase58());

// Token mint address (e.g., USDC)
const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

// Get token accounts
async function getTokenBalance(owner: PublicKey): Promise<number> {
  const ata = await getAssociatedTokenAddress(USDC_MINT, owner);
  const account = await connection.getTokenAccountBalance(ata);
  return Number(account.value.uiAmount);
}

// Transfer tokens
async function transferTokens(
  from: Keypair,
  to: PublicKey,
  amount: number
): Promise<string> {
  const fromAta = await getAssociatedTokenAddress(USDC_MINT, from.publicKey);
  const toAta = await getAssociatedTokenAddress(USDC_MINT, to);

  const instruction = createTransferInstruction(
    fromAta,
    toAta,
    from.publicKey,
    amount * 1e6 // USDC has 6 decimals
  );

  const transaction = new Transaction().add(instruction);
  const signature = await connection.sendTransaction(transaction, [from]);

  return signature;
}

// Main
const recipient = new PublicKey("RecipientPubkeyHere...");
const balance = await getTokenBalance(payer.publicKey);
console.log(\`Current USDC balance: \${balance}\`);

if (balance >= 10) {
  const sig = await transferTokens(payer, recipient, 10);
  console.log(\`Transfer complete: \${sig}\`);
} else {
  console.log("Insufficient USDC balance");
}`;

const diffCode = `import { Connection, PublicKey } from "@solana/web3.js";

async function getBalance(address: string): Promise<number> {
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  const publicKey = new PublicKey(address);
  const balance = await connection.getBalance(publicKey);
  return balance / 1e9;
}

async function getStakeAccounts(address: string) {
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  const publicKey = new PublicKey(address);
  const stakeAccounts = await connection.getParsedProgramAccounts(
    new PublicKey("Stake11111111111111111111111111111111111111"),
    { filters: [{ memcmp: { offset: 12, bytes: publicKey.toBase58() } }] }
  );
  return stakeAccounts;
}`;

const shortTs = `import { Connection, PublicKey } from "@solana/web3.js";

async function getBalance(address: string) {
  const conn = new Connection("https://api.mainnet-beta.solana.com");
  const key = new PublicKey(address);
  const balance = await conn.getBalance(key);
  return balance / 1e9; // lamports → SOL
}

// Fetch balance
const sol = await getBalance("vines1vzr...");
console.log(\`Balance: \${sol} SOL\`);`;

// ---------- Code lookup for Playground ----------

const codeByLanguage: Record<string, string> = {
  typescript: tsCode,
  rust: rustCode,
  python: pythonCode,
  bash: bashCode,
  json: jsonCode,
  text: tsCode,
};

// ---------- Stories ----------

export const Playground: Story = {
  args: {
    code: tsCode,
    language: "typescript",
    theme: "default",
    mono: false,
    filename: "",
    showLineNumbers: false,
    borderRadius: 8,
    hideCopyButton: false,
  },
  render: ({ language, ...args }) => (
    <CodeBlock
      {...args}
      code={codeByLanguage[language ?? "typescript"] ?? tsCode}
      language={language}
    />
  ),
};

export const Themes: Story = {
  name: "All 8 Variants",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-3 font-medium text-text-medium text-xs uppercase tracking-wider">
          Default — Light
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2 text-sm text-text-medium">Color</p>
            <CodeBlock code={shortTs} language="typescript" />
          </div>
          <div>
            <p className="mb-2 text-sm text-text-medium">Mono</p>
            <CodeBlock code={shortTs} language="typescript" mono />
          </div>
        </div>
      </div>
      <div>
        <p className="mb-3 font-medium text-text-medium text-xs uppercase tracking-wider">
          Default — Dark
        </p>
        <div className="dark grid grid-cols-2 gap-4 rounded-lg bg-gray-100 p-4">
          <div>
            <p className="mb-2 text-sm text-text-medium">Color</p>
            <CodeBlock code={shortTs} language="typescript" />
          </div>
          <div>
            <p className="mb-2 text-sm text-text-medium">Mono</p>
            <CodeBlock code={shortTs} language="typescript" mono />
          </div>
        </div>
      </div>
      <div>
        <p className="mb-3 font-medium text-text-medium text-xs uppercase tracking-wider">
          Sand — Light
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2 text-sm text-text-medium">Color</p>
            <CodeBlock code={shortTs} language="typescript" theme="sand" />
          </div>
          <div>
            <p className="mb-2 text-sm text-text-medium">Mono</p>
            <CodeBlock code={shortTs} language="typescript" mono theme="sand" />
          </div>
        </div>
      </div>
      <div>
        <p className="mb-3 font-medium text-text-medium text-xs uppercase tracking-wider">
          Sand — Dark
        </p>
        <div className="dark grid grid-cols-2 gap-4 rounded-lg bg-gray-100 p-4">
          <div>
            <p className="mb-2 text-sm text-text-medium">Color</p>
            <CodeBlock code={shortTs} language="typescript" theme="sand" />
          </div>
          <div>
            <p className="mb-2 text-sm text-text-medium">Mono</p>
            <CodeBlock code={shortTs} language="typescript" mono theme="sand" />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const HighlightedLines: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <CodeBlock
      code={tsCode}
      highlightLines={[4, 5, 6]}
      language="typescript"
      showLineNumbers
    />
  ),
};

export const Diff: Story = {
  name: "Diff Mode",
  parameters: { controls: { disable: true } },
  render: () => (
    <CodeBlock
      addedLines={[9, 10, 11, 12, 13, 14, 15, 16]}
      code={diffCode}
      language="typescript"
      removedLines={[4]}
      showLineNumbers
    />
  ),
};

export const InteractiveLines: Story = {
  name: "Interactive Lines",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 font-medium text-text-medium text-xs uppercase tracking-wider">
          Clickable line numbers
        </p>
        <CodeBlock
          code={shortTs}
          language="typescript"
          onLineClick={() => undefined}
        />
      </div>
      <div>
        <p className="mb-2 font-medium text-text-medium text-xs uppercase tracking-wider">
          Line anchors (L1, L2, ...)
        </p>
        <CodeBlock code={shortTs} language="typescript" lineAnchorPrefix="L" />
      </div>
    </div>
  ),
};

export const WordHighlight: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <CodeBlock
      code={tsCode}
      highlightWords={[
        { text: "Connection" },
        { text: "PublicKey" },
        { text: "getBalance" },
      ]}
      language="typescript"
    />
  ),
};

export const Collapsible: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 font-medium text-text-medium text-xs uppercase tracking-wider">
          maxLines=10 (expand/collapse)
        </p>
        <CodeBlock code={longCode} language="typescript" maxLines={10} />
      </div>
      <div>
        <p className="mb-2 font-medium text-text-medium text-xs uppercase tracking-wider">
          maxHeight=200 (scrollable)
        </p>
        <CodeBlock code={longCode} language="typescript" maxHeight={200} />
      </div>
    </div>
  ),
};

export const LanguageSwitcher: Story = {
  name: "Language Switcher",
  parameters: { controls: { disable: true } },
  render: () => (
    <CodeBlockGroup
      items={[
        { label: "TypeScript", language: "typescript", code: tsCode },
        { label: "Rust", language: "rust", code: rustCode },
        { label: "Python", language: "python", code: pythonCode },
        { label: "Bash", language: "bash", code: bashCode },
      ]}
    />
  ),
};

export const ThemeProvider: Story = {
  name: "Theme Provider",
  parameters: { controls: { disable: true } },
  render: () => (
    <CodeBlockProvider theme="sand">
      <div className="flex flex-col gap-4">
        <CodeBlock
          code={tsCode}
          filename="via-provider.ts"
          language="typescript"
        />
        <CodeBlock code={bashCode} language="bash" />
        <CodeBlock
          code={tsCode}
          filename="override-to-default.ts"
          language="typescript"
          theme="default"
        />
      </div>
    </CodeBlockProvider>
  ),
};
