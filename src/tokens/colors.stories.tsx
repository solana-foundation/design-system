import type { Meta, StoryObj } from "@storybook/react";

const graySteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400];

const textTokens = [
  { name: "text-extra-high", desc: "Headings, important text", opacity: "100%" },
  { name: "text-high", desc: "Primary body text", opacity: "88%" },
  { name: "text-medium", desc: "Secondary text", opacity: "72%" },
  { name: "text-low", desc: "Muted text, captions", opacity: "56%" },
  { name: "text-extra-low", desc: "Placeholders, disabled", opacity: "44%" },
];

const borderTokens = [
  { name: "border-strongest", desc: "Strong emphasis borders", opacity: "100%" },
  { name: "border-strong", desc: "Prominent borders", opacity: "48%" },
  { name: "border-medium", desc: "Default borders", opacity: "20%" },
  { name: "border-light", desc: "Subtle borders", opacity: "12%" },
  { name: "border-extra-light", desc: "Very subtle borders", opacity: "4%" },
];

function GrayScale() {
  return (
    <div className="p-8 bg-gray-50 min-w-[500px]">
      <h2 className="text-xl font-semibold mb-6 text-text-extra-high">Gray Scale</h2>
      <div className="grid grid-cols-1 gap-2">
        {graySteps.map((step) => (
          <div key={step} className="flex items-center gap-4">
            <div
              className="w-16 h-10 rounded border border-border-medium"
              style={{ backgroundColor: `var(--gray-${step})` }}
            />
            <code className="text-sm text-text-high font-mono w-24">gray-{step}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextEmphasis() {
  return (
    <div className="p-8 bg-gray-50 min-w-[550px]">
      <h2 className="text-xl font-semibold mb-2 text-text-extra-high">Text Emphasis</h2>
      <p className="text-sm text-text-medium mb-6">
        gray-1400 + transparency (light) · white + transparency (dark)
      </p>
      <div className="grid grid-cols-1 gap-4">
        {textTokens.map((token) => (
          <div key={token.name} className="flex items-center gap-4">
            <div
              className="w-24 h-12 rounded border border-border-light flex items-center justify-center bg-gray-100"
              style={{ color: `var(--${token.name})` }}
            >
              <span className="text-2xl font-semibold">Aa</span>
            </div>
            <div>
              <code className="text-sm text-text-high font-mono">{token.name}</code>
              <span className="text-sm text-text-medium ml-2">({token.opacity})</span>
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
    <div className="p-8 bg-gray-50 min-w-[550px]">
      <h2 className="text-xl font-semibold mb-2 text-text-extra-high">Border Scale</h2>
      <p className="text-sm text-text-medium mb-6">
        gray-1300 + transparency (light) · white + transparency (dark)
      </p>
      <div className="grid grid-cols-1 gap-4">
        {borderTokens.map((token) => (
          <div key={token.name} className="flex items-center gap-4">
            <div
              className="w-24 h-12 rounded bg-gray-100"
              style={{ border: `2px solid var(--${token.name})` }}
            />
            <div>
              <code className="text-sm text-text-high font-mono">{token.name}</code>
              <span className="text-sm text-text-medium ml-2">({token.opacity})</span>
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
    <div className="p-8 bg-gray-50 min-w-[400px]">
      <h2 className="text-xl font-semibold mb-6 text-text-extra-high">Base Colors</h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded border border-border-medium bg-black" />
          <div>
            <code className="text-sm text-text-high font-mono">black</code>
            <div className="text-sm text-text-low">#000000</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded border border-border-medium bg-white" />
          <div>
            <code className="text-sm text-text-high font-mono">white</code>
            <div className="text-sm text-text-low">#FFFFFF</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AllColors() {
  return (
    <div className="flex gap-8 flex-wrap">
      <GrayScale />
      <div className="flex flex-col gap-8">
        <BaseColors />
        <TextEmphasis />
        <BorderScale />
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
