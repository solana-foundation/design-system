import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const spacingScale = [
  { token: 1, px: 4, rem: "0.25rem" },
  { token: 2, px: 8, rem: "0.5rem" },
  { token: 3, px: 12, rem: "0.75rem" },
  { token: 4, px: 16, rem: "1rem" },
  { token: 6, px: 24, rem: "1.5rem" },
  { token: 8, px: 32, rem: "2rem" },
  { token: 12, px: 48, rem: "3rem" },
  { token: 16, px: 64, rem: "4rem" },
] as const;

type SpacingToken = (typeof spacingScale)[number]["token"];

const gapClasses: Record<SpacingToken, string> = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
  12: "gap-12",
  16: "gap-16",
};

const paddingClasses: Record<SpacingToken, string> = {
  1: "p-1",
  2: "p-2",
  3: "p-3",
  4: "p-4",
  6: "p-6",
  8: "p-8",
  12: "p-12",
  16: "p-16",
};

function SpacingScaleTable() {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
        Spacing Scale
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use Tailwind's built-in spacing utilities. The scale uses a 4px base
        unit.
      </p>
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="border border-border-medium dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                Token
              </th>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                Tailwind Class
              </th>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                Pixels
              </th>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                Rem
              </th>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                Preview
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {spacingScale.map(({ token, px, rem }) => (
              <tr key={token}>
                <td className="px-4 py-3 font-mono text-gray-900 dark:text-gray-100">
                  {token}
                </td>
                <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">
                  gap-{token}, p-{token}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {px}px
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {rem}
                </td>
                <td className="px-4 py-3">
                  <div
                    className="h-4 rounded bg-primary"
                    style={{ width: `${px}px` }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GapPlayground() {
  const [selectedGap, setSelectedGap] = useState<SpacingToken>(4);

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
        Gap Playground
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Adjust the gap between flex items using Tailwind's gap utilities.
      </p>

      <div className="flex flex-wrap gap-2">
        {spacingScale.map(({ token }) => (
          <button
            className={`rounded-md px-3 py-1.5 font-medium text-sm transition-colors ${
              selectedGap === token
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            key={token}
            onClick={() => setSelectedGap(token)}
            type="button"
          >
            {token}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-3 font-mono text-gray-600 text-sm dark:text-gray-400">
          className="{gapClasses[selectedGap]}"
        </p>
        <div className={`flex ${gapClasses[selectedGap]}`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-md bg-primary font-medium text-sm text-white"
              key={i}
            >
              {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PaddingPlayground() {
  const [selectedPadding, setSelectedPadding] = useState<SpacingToken>(4);

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
        Padding Playground
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Adjust the padding inside a container using Tailwind's padding
        utilities.
      </p>

      <div className="flex flex-wrap gap-2">
        {spacingScale.map(({ token }) => (
          <button
            className={`rounded-md px-3 py-1.5 font-medium text-sm transition-colors ${
              selectedPadding === token
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            key={token}
            onClick={() => setSelectedPadding(token)}
            type="button"
          >
            {token}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-3 font-mono text-gray-600 text-sm dark:text-gray-400">
          className="{paddingClasses[selectedPadding]}"
        </p>
        <div className="inline-block rounded-md border-2 border-primary/50 border-dashed bg-primary/10">
          <div
            className={`rounded bg-primary font-medium text-sm text-white ${paddingClasses[selectedPadding]}`}
          >
            Content with padding
          </div>
        </div>
      </div>
    </div>
  );
}

function SpacingDocs() {
  return (
    <div className="space-y-12 p-6">
      <div>
        <h1 className="font-bold text-2xl text-gray-900 dark:text-gray-100">
          Spacing
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Consistent spacing creates visual rhythm and hierarchy. Use these
          values for margins, padding, and gaps.
        </p>
      </div>

      <SpacingScaleTable />
      <GapPlayground />
      <PaddingPlayground />

      <div className="space-y-4">
        <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
          Usage Guidelines
        </h2>
        <div className="space-y-3 text-gray-600 dark:text-gray-400">
          <p>
            <strong className="text-gray-900 dark:text-gray-100">
              Small (1-2):
            </strong>{" "}
            Tight spacing for inline elements, icons next to text, compact UI.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-gray-100">
              Medium (3-4):
            </strong>{" "}
            Standard spacing for form fields, list items, card content.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-gray-100">
              Large (6-8):
            </strong>{" "}
            Section spacing, card padding, breathing room between groups.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-gray-100">
              Extra Large (12-16):
            </strong>{" "}
            Page sections, major layout divisions, hero spacing.
          </p>
        </div>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Tokens/Spacing",
  component: SpacingDocs,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
