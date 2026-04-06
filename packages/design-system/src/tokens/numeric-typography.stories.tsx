import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../primitives/table";

/* =============================================================================
   DATA
   ============================================================================= */

const heroStats = [
  { label: "TVL", value: "$4.21B", change: "+3.42%", positive: true },
  { label: "Market cap", value: "$77.6B", change: "+1.87%", positive: true },
  { label: "24h volume", value: "$2.89B", change: "-5.21%", positive: false },
];

const tokens = [
  {
    rank: 1,
    name: "Solana",
    symbol: "SOL",
    price: "$148.32",
    d1: "+2.41%",
    d7: "+12.87%",
    cap: "$77.6B",
    vol: "$2.89B",
    d1Up: true,
    d7Up: true,
  },
  {
    rank: 2,
    name: "Jupiter",
    symbol: "JUP",
    price: "$1.24",
    d1: "+5.63%",
    d7: "+18.42%",
    cap: "$1.67B",
    vol: "$312.4M",
    d1Up: true,
    d7Up: true,
  },
  {
    rank: 3,
    name: "Raydium",
    symbol: "RAY",
    price: "$3.87",
    d1: "-1.29%",
    d7: "+7.14%",
    cap: "$1.12B",
    vol: "$89.7M",
    d1Up: false,
    d7Up: true,
  },
  {
    rank: 4,
    name: "Jito",
    symbol: "JTO",
    price: "$4.51",
    d1: "+0.82%",
    d7: "-3.64%",
    cap: "$542.1M",
    vol: "$67.3M",
    d1Up: true,
    d7Up: false,
  },
  {
    rank: 5,
    name: "Pyth Network",
    symbol: "PYTH",
    price: "$0.412",
    d1: "-2.17%",
    d7: "-8.93%",
    cap: "$1.48B",
    vol: "$156.2M",
    d1Up: false,
    d7Up: false,
  },
];

const typeScale = [
  { cls: "text-display", label: "Display", meta: "36-48px" },
  { cls: "text-title-xl", label: "Title XL", meta: "28-36px" },
  { cls: "text-title-lg", label: "Title LG", meta: "22-28px" },
  { cls: "text-title-md", label: "Title MD", meta: "19-24px" },
  { cls: "text-title-sm", label: "Title SM", meta: "16-19px" },
  { cls: "text-body-lg", label: "Body LG", meta: "16px" },
  { cls: "text-body-md", label: "Body MD", meta: "14px" },
  { cls: "text-body-sm", label: "Body SM", meta: "12px" },
];

/* =============================================================================
   SECTION WRAPPER
   ============================================================================= */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-1 text-headline-lg text-text-extra-high">{title}</h2>
      <p className="mb-5 text-body-md text-text-low">{description}</p>
      {children}
    </section>
  );
}

/* =============================================================================
   SECTIONS
   ============================================================================= */

function HeroStats() {
  return (
    <Section
      description="Proportional figures for static display — tighter, more natural."
      title="Hero Stats"
    >
      <div className="grid grid-cols-3 gap-8 rounded-xl border border-border-medium p-8">
        {heroStats.map((stat) => (
          <div key={stat.label}>
            <p className="mb-2 text-body-sm text-text-low">{stat.label}</p>
            <p className="text-display text-text-extra-high">{stat.value}</p>
            <p
              className={`mt-2 text-body-md ${stat.positive ? "text-number-positive" : "text-number-negative"}`}
            >
              {stat.change}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ColorTokens() {
  return (
    <Section
      description="Semantic tokens aliasing status-success-text and status-error-text."
      title="Value Colors"
    >
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: "Positive", value: "+12.34%", cls: "text-number-positive" },
          { label: "Negative", value: "-5.67%", cls: "text-number-negative" },
          { label: "Neutral", value: "0.00%", cls: "text-number-neutral" },
        ].map((t) => (
          <div
            className="rounded-xl border border-border-medium p-6 text-center"
            key={t.label}
          >
            <p className="mb-3 text-headline-md text-text-medium">{t.label}</p>
            <p className={`text-title-xl tabular-nums ${t.cls}`}>{t.value}</p>
            <code className="mt-3 inline-block rounded bg-gray-100 px-2 py-1 text-body-sm text-text-low dark:bg-gray-1200">
              .{t.cls}
            </code>
          </div>
        ))}
      </div>
    </Section>
  );
}

function TabularComparison() {
  const nums = ["$1,111.11", "$8,888.88", "$1,234.56", "$9,876.54"];
  return (
    <Section
      description="Proportional digits have variable widths. Tabular digits align in columns."
      title="Tabular vs Proportional"
    >
      <div className="grid grid-cols-2 gap-8">
        {[false, true].map((tabular) => (
          <div
            className="rounded-xl border border-border-medium p-6"
            key={String(tabular)}
          >
            <p className="mb-4 text-headline-md text-text-medium">
              {tabular ? "Tabular" : "Proportional (default)"}
              {tabular && (
                <code className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-body-sm dark:bg-gray-1200">
                  .tabular-nums
                </code>
              )}
            </p>
            <div className="space-y-1">
              {nums.map((n) => (
                <p
                  className={`text-right text-text-extra-high text-title-lg ${tabular ? "tabular-nums" : ""}`}
                  key={n}
                >
                  {n}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function TokenTable() {
  return (
    <Section
      description="Table columns always use tabular-nums for vertical scan alignment."
      title="Token Price Table"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead align="right">#</TableHead>
            <TableHead>Token</TableHead>
            <TableHead align="right">Price</TableHead>
            <TableHead align="right">24h</TableHead>
            <TableHead align="right">7d</TableHead>
            <TableHead align="right">Market Cap</TableHead>
            <TableHead align="right">Volume</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((t) => (
            <TableRow key={t.symbol}>
              <TableCell align="right" className="text-text-low" numeric>
                {t.rank}
              </TableCell>
              <TableCell className="font-medium">
                {t.name} <span className="text-text-low">{t.symbol}</span>
              </TableCell>
              <TableCell align="right" numeric>
                {t.price}
              </TableCell>
              <TableCell
                align="right"
                className={
                  t.d1Up ? "text-number-positive" : "text-number-negative"
                }
                numeric
              >
                {t.d1}
              </TableCell>
              <TableCell
                align="right"
                className={
                  t.d7Up ? "text-number-positive" : "text-number-negative"
                }
                numeric
              >
                {t.d7}
              </TableCell>
              <TableCell align="right" numeric>
                {t.cap}
              </TableCell>
              <TableCell align="right" numeric>
                {t.vol}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}

function LiveCounter() {
  const [count, setCount] = useState(4201);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 50) - 10);
    }, 100);
    return () => clearInterval(id);
  }, []);

  const formatted = count.toLocaleString();

  return (
    <Section
      description="Monospaced for animation, proportional for static."
      title="Live Counter"
    >
      <div className="grid grid-cols-2 gap-8">
        <div className="rounded-xl border border-border-medium p-8">
          <p className="mb-2 text-headline-md text-text-medium">
            Proportional (static)
          </p>
          <p className="mb-1 text-body-sm text-text-low">TPS</p>
          <p className="inline-block text-display text-text-extra-high">
            {formatted}
          </p>
        </div>
        <div className="rounded-xl border border-border-medium p-8">
          <p className="mb-2 text-headline-md text-text-medium">
            Tabular (live)
          </p>
          <p className="mb-1 text-body-sm text-text-low">TPS</p>
          <p className="num-width-lg inline-block text-display text-text-extra-high tabular-nums tracking-tighter">
            {formatted}
          </p>
        </div>
      </div>
    </Section>
  );
}

function NumberScale() {
  return (
    <Section
      description="Same number across the type scale with tabular figures."
      title="Number Scale"
    >
      <div className="rounded-xl border border-border-medium p-6">
        {typeScale.map((t, i) => (
          <div
            className={`flex items-baseline gap-6 py-3 ${i < typeScale.length - 1 ? "border-border-extra-light border-b" : ""}`}
            key={t.cls}
          >
            <div className="w-36 shrink-0">
              <code className="rounded border border-border-medium px-2 py-1 font-mono text-text-medium text-xs">
                .{t.cls}
              </code>
            </div>
            <span className={`${t.cls} text-text-extra-high tabular-nums`}>
              $1,234,567.89
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* =============================================================================
   OVERVIEW
   ============================================================================= */

function Overview() {
  return (
    <div className="max-w-5xl space-y-14 p-8">
      <div>
        <h1 className="mb-2 text-display text-text-extra-high">
          Numeric Typography
        </h1>
        <p className="max-w-2xl text-body-lg text-text-medium">
          CSS utilities for rendering numbers in financial and data-dense
          interfaces. Built on Inter Variable's OpenType features.
        </p>
      </div>
      <HeroStats />
      <ColorTokens />
      <TabularComparison />
      <TokenTable />
      <LiveCounter />
      <NumberScale />
    </div>
  );
}

/* =============================================================================
   META
   ============================================================================= */

const meta: Meta = {
  title: "Tokens/Numeric Typography",
  component: Overview,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSections: Story = {
  render: () => <Overview />,
};

export const PriceTable: Story = {
  name: "Token Price Table",
  render: () => (
    <div className="max-w-5xl p-8">
      <TokenTable />
    </div>
  ),
};

export const Counter: Story = {
  name: "Live Counter",
  render: () => (
    <div className="max-w-5xl p-8">
      <LiveCounter />
    </div>
  ),
};
