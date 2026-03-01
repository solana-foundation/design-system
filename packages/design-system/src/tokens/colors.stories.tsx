import type { Meta, StoryObj } from "@storybook/react-vite";

const graySteps = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400,
];

const textTokens = [
  {
    name: "text-extra-high",
    desc: "Headings, important text",
    opacity: "100%",
  },
  { name: "text-high", desc: "Primary body text", opacity: "88%" },
  { name: "text-medium", desc: "Secondary text", opacity: "72%" },
  { name: "text-low", desc: "Muted text, captions", opacity: "58%" },
  { name: "text-extra-low", desc: "Placeholders, disabled", opacity: "44%" },
];

const borderTokens = [
  {
    name: "border-strongest",
    desc: "Strong emphasis borders",
    opacity: "100%",
  },
  { name: "border-strong", desc: "Prominent borders", opacity: "48%" },
  { name: "border-medium", desc: "Default borders", opacity: "20%" },
  { name: "border-light", desc: "Subtle borders", opacity: "12%" },
  { name: "border-extra-light", desc: "Very subtle borders", opacity: "4%" },
];

function GrayScale() {
  return (
    <div className="min-w-[500px] p-8">
      <h2 className="mb-6 font-semibold text-text-extra-high text-xl">
        Gray Scale
      </h2>
      <div className="grid grid-cols-1 gap-2">
        {graySteps.map((step) => (
          <div className="flex items-center gap-4" key={step}>
            <div
              className="h-10 w-16 rounded border border-border-medium"
              style={{ backgroundColor: `var(--gray-${step})` }}
            />
            <code className="w-24 font-mono text-sm text-text-high">
              gray-{step}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextEmphasis() {
  return (
    <div className="min-w-[550px] p-8">
      <h2 className="mb-2 font-semibold text-text-extra-high text-xl">
        Text Emphasis
      </h2>
      <p className="mb-6 text-sm text-text-medium">
        gray-1400 + transparency (light) · white + transparency (dark)
      </p>
      <div className="grid grid-cols-1 gap-4">
        {textTokens.map((token) => (
          <div className="flex items-center gap-4" key={token.name}>
            <div
              className="flex h-12 w-24 items-center justify-center rounded border border-border-medium"
              style={{ color: `var(--${token.name})` }}
            >
              <span className="font-semibold text-2xl">Aa</span>
            </div>
            <div>
              <code className="font-mono text-sm text-text-high">
                {token.name}
              </code>
              <span className="ml-2 text-sm text-text-medium">
                ({token.opacity})
              </span>
              <div className="text-sm text-text-low">{token.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BorderScale() {
  return (
    <div className="min-w-[550px] p-8">
      <h2 className="mb-2 font-semibold text-text-extra-high text-xl">
        Border Scale
      </h2>
      <p className="mb-6 text-sm text-text-medium">
        gray-1300 + transparency (light) · white + transparency (dark)
      </p>
      <div className="grid grid-cols-1 gap-4">
        {borderTokens.map((token) => (
          <div className="flex items-center gap-4" key={token.name}>
            <div
              className="h-12 w-24 rounded border border-border-medium"
              style={{ border: `2px solid var(--${token.name})` }}
            />
            <div>
              <code className="font-mono text-sm text-text-high">
                {token.name}
              </code>
              <span className="ml-2 text-sm text-text-medium">
                ({token.opacity})
              </span>
              <div className="text-sm text-text-low">{token.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BaseColors() {
  return (
    <div className="min-w-[400px] p-8">
      <h2 className="mb-6 font-semibold text-text-extra-high text-xl">
        Base Colors
      </h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded border border-border-medium bg-black" />
          <div>
            <code className="font-mono text-sm text-text-high">black</code>
            <div className="text-sm text-text-low">#000000</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded border border-border-medium bg-white" />
          <div>
            <code className="font-mono text-sm text-text-high">white</code>
            <div className="text-sm text-text-low">#FFFFFF</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const statusTokens = [
  { name: "error", label: "Error" },
  { name: "success", label: "Success" },
  { name: "warning", label: "Warning" },
  { name: "info", label: "Info" },
];

function StatusColors() {
  return (
    <div className="min-w-[550px] p-8">
      <h2 className="mb-2 font-semibold text-text-extra-high text-xl">
        Status Colors
      </h2>
      <p className="mb-6 text-sm text-text-medium">
        bg + border + text tokens for badges and alerts
      </p>
      <div className="grid grid-cols-1 gap-4">
        {statusTokens.map((status) => (
          <div className="flex items-center gap-4" key={status.name}>
            <div
              className="flex h-8 items-center rounded-full px-3 font-medium text-sm"
              style={{
                backgroundColor: `var(--status-${status.name}-bg)`,
                border: `1.5px solid var(--status-${status.name}-border)`,
                color: `var(--status-${status.name}-text)`,
              }}
            >
              {status.label}
            </div>
            <div className="flex gap-3">
              <code className="font-mono text-text-medium text-xs">
                status-{status.name}-bg
              </code>
              <code className="font-mono text-text-medium text-xs">
                status-{status.name}-border
              </code>
              <code className="font-mono text-text-medium text-xs">
                status-{status.name}-text
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AllColors() {
  return (
    <div className="flex flex-wrap gap-8">
      <GrayScale />
      <div className="flex flex-col gap-8">
        <BaseColors />
        <TextEmphasis />
        <BorderScale />
        <StatusColors />
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Tokens/Colors",
  component: AllColors,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => <AllColors />,
};

export const GrayPalette: Story = {
  render: () => <GrayScale />,
};

export const TextScale: Story = {
  render: () => <TextEmphasis />,
};

export const Borders: Story = {
  render: () => <BorderScale />,
};

export const Base: Story = {
  render: () => <BaseColors />,
};

export const Status: Story = {
  render: () => <StatusColors />,
};
