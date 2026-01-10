# Solana Design System

A comprehensive design system for building Solana applications with React and Tailwind CSS v4.

## Features

- **30+ Primitive Components** - Built with Radix UI for accessibility
- **Tailwind CSS v4** - Modern styling with CSS @theme
- **TypeScript** - Full type safety
- **Storybook** - Interactive component documentation
- **Example Applications** - Real-world usage examples

## Installation

```bash
pnpm install
```

## Components

All components are located in `src/ui/primitives/` and follow a primitives-first approach inspired by Figma's Simple Design System.

### Core Components

- **Layout**: Card, Separator, Sheet, Tabs
- **Forms**: Input, Textarea, Label, Checkbox, Radio Group, Select, Switch
- **Data Display**: Table, Badge, Avatar, Skeleton, Progress
- **Navigation**: Breadcrumb, Dropdown Menu, Command
- **Feedback**: Alert, Dialog, Modal, Tooltip, Popover, Spinner
- **Solana-Specific**: TransactionSuccessView, WarningBanner, SolanaLogo, TokenLogo, ExpandableText

### Using Components

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  Button,
  Modal,
  Card,
} from "@solana/design-system";

function MyComponent() {
  return (
    <Card>
      <Table>
        {/* Table content */}
      </Table>
    </Card>
  );
}
```

## Development

### Storybook

View and interact with all components:

```bash
pnpm storybook
```

Opens at http://localhost:6006

### Build Storybook

```bash
pnpm storybook:build
```

### Linting & Formatting

This project uses Biome for linting and formatting:

```bash
# Check for issues
pnpm lint

# Fix issues automatically
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## Examples

See the [`examples/`](./examples) directory for complete example applications:

- **Token List** - A full-featured token listing interface with sortable tables, modals, and stats

### Running Examples

From the root directory:

```bash
# Run the token list example
pnpm example:token-list
```

Or navigate to the example directory:

```bash
cd examples/token-list
pnpm dev
```

## Color Palette

The design system uses a "sand" color palette:

- `sand-50` to `sand-900` - Main scale
- `sand-1000` - Near black
- `sand-1500` - Pure black

## Typography

- **ABC Diatype** - Primary font family
- **Berkeley Mono** - Monospace for code and numbers

## Project Structure

```
design-system/
├── src/
│   ├── ui/
│   │   ├── primitives/     # All UI components
│   │   ├── hooks/          # Shared hooks
│   │   └── utils/          # Utility functions
│   ├── globals.css         # Tailwind config
│   └── index.ts            # Main export
├── .storybook/             # Storybook configuration
├── examples/               # Example applications
│   └── token-list/         # Token list example
└── package.json
```

## Adding New Components

Use the shadcn CLI to generate a new component:

```bash
pnpm generate:component
```

This will prompt you to select a component from the shadcn library, which will be added to `src/ui/primitives/`.

## Contributing

1. Components should follow the primitive approach - they cannot be reduced further
2. All components must use `React.forwardRef` for ref forwarding
3. Components should be exported from `src/ui/primitives/index.ts`
4. Each component should have a Storybook story in its directory
5. Use TypeScript for all components
6. Follow the existing code style (enforced by Biome)

## License

ISC
