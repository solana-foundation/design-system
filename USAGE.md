# Usage Guide

A comprehensive guide to using the Solana Design System in your application.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Importing Components](#importing-components)
- [Component Examples](#component-examples)
- [Available Components](#available-components)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Styling and Theming](#styling-and-theming)
- [TypeScript Support](#typescript-support)
- [Best Practices](#best-practices)

## Installation

Install the design system using pnpm:

```bash
pnpm add @solana/design-system
```

**Peer Dependencies:**

The design system requires the following peer dependencies:

```bash
pnpm add react@^19.0.0 react-dom@^19.0.0 tailwindcss@^4.1.18
```

## Setup

### 1. Import CSS

Import the design system's default styles in your root CSS file:

```css
/* app/globals.css or src/index.css */
@import "@solana/design-system/defaults.css";
```

This imports all necessary Tailwind CSS v4 configuration, theme variables, typography, and animations.

### 2. Configure Tailwind (if needed)

If you need to extend the design system's Tailwind configuration, create a `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // Scan design system components for class names
    "./node_modules/@solana/design-system/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Your custom theme extensions
    },
  },
};
```

### 3. TypeScript Configuration (Optional)

For better TypeScript support, add path aliases to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@solana/design-system": ["./node_modules/@solana/design-system/src"]
    }
  }
}
```

## Importing Components

Import components directly from the package:

```tsx
import { Button, Card, Table, Modal } from "@solana/design-system";
```

You can also import specific component parts:

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@solana/design-system";
```

## Component Examples

### Button

Buttons support multiple variants and sizes:

```tsx
import { Button } from "@solana/design-system";

function MyComponent() {
  return (
    <>
      <Button variant="default">Default Button</Button>
      <Button variant="outline">Outline Button</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="solana">Solana Gradient</Button>
      <Button size="sm">Small Button</Button>
      <Button size="lg">Large Button</Button>
    </>
  );
}
```

**Button Variants:**
- `default` - Primary button with dark background
- `outline` - Outlined button with border
- `secondary` - Secondary styled button
- `destructive` - Red button for dangerous actions
- `ghost` - Transparent button with hover effect
- `link` - Text link styled as button
- `solana` - Solana gradient button

**Button Sizes:**
- `sm` - Small button (h-9)
- `default` - Default size (h-10)
- `lg` - Large button (h-11)
- `icon` - Square button for icons (h-10 w-10)

### Card

Simple container component with consistent styling:

```tsx
import { Card } from "@solana/design-system";

function StatsCard() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold">Total Volume</h3>
      <p className="text-2xl">$2.5B</p>
    </Card>
  );
}
```

### Table

Composable table components for data display:

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@solana/design-system";

function TokenTable({ tokens }: { tokens: Token[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.map((token) => (
          <TableRow key={token.id}>
            <TableCell>{token.name}</TableCell>
            <TableCell>${token.price}</TableCell>
            <TableCell>{token.change}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Modal

Dialog component with header and footer sections:

```tsx
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  Button,
} from "@solana/design-system";

function ConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader>
          <ModalTitle>Confirm Action</ModalTitle>
          <ModalDescription>
            Are you sure you want to proceed?
          </ModalDescription>
        </ModalHeader>
        
        <div className="py-4">
          {/* Modal content */}
        </div>
        
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```

### Forms

Input components with labels and validation support:

```tsx
import { Input, Label, Checkbox, Switch, Select } from "@solana/design-system";

function SettingsForm() {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="notifications" />
        <Label htmlFor="notifications">Enable notifications</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch id="dark-mode" />
        <Label htmlFor="dark-mode">Dark mode</Label>
      </div>
    </form>
  );
}
```

### Solana-Specific Components

#### TransactionSuccessView

Display transaction success with signature and explorer link:

```tsx
import { TransactionSuccessView, Modal } from "@solana/design-system";

function TransactionModal({ signature, isOpen, onClose }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <TransactionSuccessView
        title="Transaction Successful"
        message="Your transaction has been confirmed on the blockchain."
        transactionSignature={signature}
        cluster="mainnet-beta" // or "devnet", "testnet"
        onClose={onClose}
      />
    </Modal>
  );
}
```

#### WarningBanner

Display important warnings or notices:

```tsx
import { WarningBanner } from "@solana/design-system";

function DemoWarning() {
  return (
    <WarningBanner
      title="Using Mock Data"
      message="This is a demo application. Data shown is for demonstration purposes only."
      variant="warning" // or "danger", "info"
    />
  );
}
```

#### SolanaLogo & TokenLogo

SVG logo components:

```tsx
import { SolanaLogo, TokenLogo } from "@solana/design-system";

function Header() {
  return (
    <div className="flex items-center gap-4">
      <SolanaLogo width={40} height={40} />
      <TokenLogo symbol="SOL" width={24} height={24} />
    </div>
  );
}
```

### ExpandableText

Text with expand/collapse functionality:

```tsx
import { ExpandableText } from "@solana/design-system";

function Description() {
  return (
    <ExpandableText
      text="Long description text that should be truncated..."
      maxLength={100}
    />
  );
}
```

## Available Components

### Layout
- `Card` - Container with consistent styling
- `Separator` - Visual divider
- `Sheet` - Slide-out panel
- `Tabs` - Tab navigation
- `ScrollArea` - Scrollable container

### Forms
- `Input` - Text input field
- `Textarea` - Multi-line text input
- `Label` - Form label
- `Checkbox` - Checkbox input
- `RadioGroup` - Radio button group
- `Select` - Dropdown select
- `Switch` - Toggle switch

### Data Display
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` - Table components
- `Badge` - Small status indicator
- `Avatar` - User avatar
- `Skeleton` - Loading placeholder
- `Progress` - Progress bar

### Navigation
- `Breadcrumb` - Breadcrumb navigation
- `DropdownMenu` - Dropdown menu
- `Command` - Command palette

### Feedback
- `Alert` - Alert message
- `Dialog` - Dialog/modal
- `Modal` - Modal dialog (alias)
- `Tooltip` - Hover tooltip
- `Popover` - Popover container
- `Spinner` - Loading spinner

### Solana-Specific
- `TransactionSuccessView` - Transaction success display
- `WarningBanner` - Warning/info banner
- `SolanaLogo` - Solana logo SVG
- `TokenLogo` - Token logo display
- `ExpandableText` - Expandable text component

## Hooks

The design system provides several useful hooks:

```tsx
import {
  useIsMobile,
  useMediaQuery,
  useLocalStorage,
  useLockBodyScroll,
} from "@solana/design-system";

function MyComponent() {
  // Check if viewport is mobile
  const isMobile = useIsMobile();
  
  // Custom media query
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  
  // Persistent state in localStorage
  const [theme, setTheme] = useLocalStorage("theme", "light");
  
  // Lock body scroll (useful for modals)
  useLockBodyScroll(isModalOpen);
  
  return <div>{/* ... */}</div>;
}
```

## Utilities

### cn - Class Name Utility

Merge and deduplicate Tailwind classes:

```tsx
import { cn } from "@solana/design-system";

function MyComponent({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white p-4", // base classes
        className // override classes
      )}
    >
      Content
    </div>
  );
}
```

The `cn` utility uses `clsx` and `tailwind-merge` to intelligently merge class names, resolving conflicts (e.g., `"p-4 p-6"` becomes `"p-6"`).

## Styling and Theming

### Color Palette

The design system uses a "sand" color palette:

```tsx
// Use in className
<div className="bg-sand-100 text-sand-900 border-sand-300">
  Content
</div>
```

**Available Colors:**
- `sand-100` to `sand-1600` - Main scale (light to dark)
- `border-strong`, `border-medium`, `border-low`, `border-extra-low` - Semantic border colors

### Typography

Pre-configured typography classes:

```tsx
// Headings (responsive)
<h1 className="text-h1">Large Heading</h1>
<h2 className="text-h2">Heading 2</h2>
<h3 className="text-title-4">Title 4</h3>

// Body text
<p className="text-body-xl">Extra large body</p>
<p className="text-body-l">Large body</p>
<p className="text-body-md">Medium body</p>

// Navigation
<span className="text-nav-item">Nav Item</span>
```

### Fonts

The design system uses custom fonts:

```tsx
// Font families
<div className="font-diatype">ABC Diatype (headings)</div>
<div className="font-inter">Inter (body text)</div>
<div className="font-berkeley-mono">Berkeley Mono (code, numbers)</div>

// Font weights
<div className="font-diatype-regular">Regular</div>
<div className="font-diatype-medium">Medium</div>
<div className="font-diatype-bold">Bold</div>
```

### Custom Border Styles

Special dashed border utilities:

```tsx
<div className="border-l-dashed-wide">Left dashed border</div>
<div className="border-r-dashed-wide">Right dashed border</div>
<div className="border-lr-dashed-wide">Left & right dashed borders</div>
<div className="border-horizontal-dashed-wide">Top & bottom dashed</div>
<div className="border-all-dashed-medium">All sides dashed</div>
```

## TypeScript Support

All components are fully typed with TypeScript. Component props extend standard HTML element props:

```tsx
import type { ButtonProps } from "@solana/design-system";

// Button extends React.ButtonHTMLAttributes<HTMLButtonElement>
const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

Components use `React.forwardRef` for ref forwarding:

```tsx
function MyComponent() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  return <Button ref={buttonRef}>Click me</Button>;
}
```

## Best Practices

### 1. Import Only What You Need

```tsx
// Good - tree-shakeable
import { Button, Card } from "@solana/design-system";

// Avoid - imports everything
import * as DS from "@solana/design-system";
```

### 2. Use Semantic HTML

Components render semantic HTML elements. Use appropriate components for accessibility:

```tsx
// Good
<Button type="submit">Submit Form</Button>

// Avoid creating custom buttons from divs
<div onClick={handleClick}>Click me</div>
```

### 3. Compose Components

Build complex UIs by composing primitive components:

```tsx
function TokenCard({ token }: Props) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <TokenLogo symbol={token.symbol} />
        <div>
          <h3 className="font-semibold">{token.name}</h3>
          <p className="text-sand-600">{token.symbol}</p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Price</span>
          <span className="font-berkeley-mono">${token.price}</span>
        </div>
        <div className="flex justify-between">
          <span>24h Change</span>
          <span className={token.change > 0 ? "text-green-600" : "text-red-600"}>
            {token.change}%
          </span>
        </div>
      </div>
    </Card>
  );
}
```

### 4. Use the cn Utility for Conditional Styles

```tsx
import { cn } from "@solana/design-system";

function StatusBadge({ status }: { status: "active" | "inactive" }) {
  return (
    <Badge
      className={cn(
        "text-xs",
        status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
      )}
    >
      {status}
    </Badge>
  );
}
```

### 5. Leverage TypeScript for Props

```tsx
import type { ButtonProps } from "@solana/design-system";

interface ActionButtonProps extends ButtonProps {
  isLoading?: boolean;
}

function ActionButton({ isLoading, children, ...props }: ActionButtonProps) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? <Spinner /> : children}
    </Button>
  );
}
```

### 6. Follow Accessibility Guidelines

- Always provide `alt` text for images
- Use proper heading hierarchy
- Include `Label` components for form inputs
- Use semantic color names (not just "red" or "green")
- Test keyboard navigation

```tsx
// Good - accessible form
<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
    aria-describedby="email-help"
  />
  <p id="email-help" className="text-sand-600 text-sm">
    We'll never share your email.
  </p>
</div>
```

## Examples

See the [`examples/`](./examples) directory for complete example applications:

- **Token List** - Full-featured token listing interface with sortable tables, modals, and stats

To run examples:

```bash
# From the root directory
pnpm example:token-list

# Or navigate to the example
cd examples/token-list
pnpm dev
```

## Additional Resources

- **Storybook**: Run `pnpm storybook` to view all components interactively
- **Source Code**: Browse `src/ui/primitives/` for component implementations
- **README**: See [README.md](./README.md) for development setup

## Support

For issues or questions:
- Check the [Storybook documentation](http://localhost:6006) (run `pnpm storybook`)
- Review [example applications](./examples)
- Browse component source code in `src/ui/primitives/`
