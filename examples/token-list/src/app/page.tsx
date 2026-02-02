"use client";

import { Button, Spinner } from "@solana/design-system";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-display text-text-extra-high">
        Solana Design System
      </h1>
      <p className="text-body-lg text-text-medium">
        Testing the npm package distribution.
      </p>

      <div className="flex gap-4">
        <Button>Primary Button</Button>
        <Button variant="secondary">Secondary</Button>
        <Button size="sm">Small</Button>
        <Button loading>Loading</Button>
      </div>

      <div className="flex items-center gap-4">
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border-medium bg-gray-50 p-4">
          <p className="text-body-md-bold text-text-high">border-medium</p>
          <p className="text-body-sm text-text-low">Token test</p>
        </div>
        <div className="rounded-lg border border-border-strong bg-gray-50 p-4">
          <p className="text-body-md-bold text-text-high">border-strong</p>
          <p className="text-body-sm text-text-low">Token test</p>
        </div>
        <div className="rounded-lg border border-border-strongest bg-gray-50 p-4">
          <p className="text-body-md-bold text-text-high">border-strongest</p>
          <p className="text-body-sm text-text-low">Token test</p>
        </div>
      </div>
    </main>
  );
}
