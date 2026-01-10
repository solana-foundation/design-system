import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ExpandableText } from "./index";

const meta: Meta<typeof ExpandableText> = {
  component: ExpandableText,
  title: "Primitives/Expandable Text",
  tags: ["autodocs"],
  argTypes: {
    maxLines: {
      control: { type: "number", min: 1, max: 20 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ExpandableText>;

const shortText = `
<p>This is a short text that will not be truncated.</p>
`;

const longText = `
<p>Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today. Solana is all about speed and scalability, with sub-second transaction times and incredibly low fees.</p>
<p>The network is powered by a unique combination of Proof of History (PoH) and Proof of Stake (PoS) consensus mechanisms. This innovative approach allows Solana to process thousands of transactions per second without sacrificing security or decentralization.</p>
<p><strong>Key features include:</strong></p>
<ul>
  <li>Sub-second finality for instant transactions</li>
  <li>Fees less than $0.01 per transaction</li>
  <li>Energy efficient consensus mechanism</li>
  <li>Built for global scale with composable apps</li>
</ul>
<p>Developers can build on Solana using Rust, C, and C++ programming languages. The ecosystem includes <a href="#">thousands of projects</a> ranging from DeFi and NFTs to gaming and social media.</p>
`;

const veryLongText = `
<p>Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today.</p>
<p>The network is powered by a unique combination of Proof of History (PoH) and Proof of Stake (PoS) consensus mechanisms.</p>
<p><strong>Technical Architecture:</strong></p>
<ul>
  <li>Proof of History (PoH) - A cryptographic clock that enables nodes to agree on time</li>
  <li>Tower BFT - A PoH-optimized version of PBFT consensus</li>
  <li>Turbine - A block propagation protocol</li>
  <li>Gulf Stream - Mempool-less transaction forwarding</li>
  <li>Sealevel - Parallel smart contracts runtime</li>
  <li>Pipelining - Transaction processing unit</li>
  <li>Cloudbreak - Horizontally-Scaled Accounts Database</li>
  <li>Archivers - Distributed ledger storage</li>
</ul>
<p><em>Performance Metrics:</em></p>
<ol>
  <li>Block time: ~400ms</li>
  <li>Transaction throughput: 65,000 TPS theoretical</li>
  <li>Average transaction cost: $0.00025</li>
  <li>Number of validators: 1,900+</li>
</ol>
<p>The Solana ecosystem continues to grow with innovative projects across DeFi, NFTs, gaming, and more. Visit the <a href="#">official documentation</a> to learn more about building on Solana.</p>
`;

export const Short: Story = {
  args: {
    text: shortText,
    maxLines: 3,
  },
};

export const Long: Story = {
  args: {
    text: longText,
    maxLines: 5,
  },
};

export const VeryLong: Story = {
  args: {
    text: veryLongText,
    maxLines: 7,
  },
};

export const CustomMaxLines: Story = {
  args: {
    text: longText,
    maxLines: 3,
  },
};

export const WithCustomStyling: Story = {
  args: {
    text: longText,
    maxLines: 5,
    className: "text-base text-gray-700",
  },
};
