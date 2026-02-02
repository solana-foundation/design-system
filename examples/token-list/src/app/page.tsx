"use client";

import { useCopyToClipboard } from "@solana/design-system";
import { Check, Copy } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-6 py-24 md:py-32">
      <div className="flex w-full max-w-xl flex-col gap-12">
        <header className="flex flex-col gap-3">
          <div
            className="enter-animate text-body-sm-bold text-text-low"
            style={{ animationDelay: "0ms" }}
          >
            Alpha
          </div>
          <h1
            className="enter-animate text-display text-text-extra-high"
            style={{ animationDelay: "60ms" }}
          >
            Solana Design System
          </h1>
          <p
            className="enter-animate text-body-lg text-text-medium"
            style={{ animationDelay: "120ms" }}
          >
            Components, tokens, and utilities for building Solana interfaces.
          </p>
        </header>

        <section className="enter-animate flex flex-col gap-5" style={{ animationDelay: "220ms" }}>
          <CodeBlock label="Install" code="npm i @solana/design-system" />
          <CodeBlock
            label="Import styles"
            code={`@import "tailwindcss";\n@import "@solana/design-system/styles";`}
          />
          <CodeBlock
            label="Use"
            code={`import { Button } from "@solana/design-system";`}
          />
        </section>
      </div>

      <footer
        className="enter-animate pt-16 text-body-sm text-text-extra-low"
        style={{ animationDelay: "400ms" }}
      >
        <a
          href="https://github.com/solana-foundation"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-border-medium underline-offset-4 transition-colors hover:text-text-medium"
        >
          GitHub
        </a>
      </footer>
    </main>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-body-sm-bold text-text-medium">{label}</span>
      <div className="group relative">
        <pre className="text-body-sm text-text-high overflow-x-auto rounded-lg bg-gray-50 px-4 py-3">
          <code>{code}</code>
        </pre>
        <button
          type="button"
          onClick={() => copy(code)}
          className="absolute right-2.5 top-2.5 rounded p-1 opacity-0 transition-opacity hover:bg-gray-100 group-hover:opacity-100"
          aria-label={copied ? "Copied" : "Copy to clipboard"}
        >
          {copied ? (
            <Check size={14} className="text-text-medium" />
          ) : (
            <Copy size={14} className="text-text-low" />
          )}
        </button>
      </div>
    </div>
  );
}
