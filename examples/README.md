# Design System Examples

This directory contains example applications demonstrating how to use the Solana Design System components.

## Available Examples

### Token List (`token-list/`)

A full-featured example application showcasing the design system components in a realistic token listing interface inspired by the Solana tokens homepage.

**Featured Components:**
- Sortable data table with TanStack Table
- Modal dialogs for transactions
- Transaction success views
- Warning banners
- Stats cards
- Buttons and interactive elements
- Solana logo component

**To run:**
```bash
cd token-list
pnpm dev
```

Opens at http://localhost:3001

## Getting Started

All examples are built with Next.js 15 and use the design system as a workspace dependency.

### Installation

From the root of the design-system repository:

```bash
pnpm install
```

This will install dependencies for both the design system and all examples.

### Running Examples

Navigate to any example directory and run:

```bash
pnpm dev
```

## Structure

Each example includes:
- `package.json` - Dependencies and scripts
- `src/app/` - Next.js app directory with pages and layouts
- `src/app/globals.css` - Tailwind CSS v4 configuration
- `README.md` - Example-specific documentation

## Creating New Examples

To create a new example:

1. Create a new directory in `examples/`
2. Set up a Next.js app structure
3. Add `@solana/design-system` as a workspace dependency:
   ```json
   "dependencies": {
     "@solana/design-system": "workspace:*"
   }
   ```
4. Import components from `@solana/design-system`
5. Add a README documenting the example

## Design System Components

All examples import components from the design system:

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Modal,
  Button,
  Card,
  // ... and more
} from "@solana/design-system";
```

See the [main README](../README.md) for full component documentation.
