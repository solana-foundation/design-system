# Token List Example

This is a demo application showcasing the **Solana Design System** components.

## Features

This example demonstrates:
- **Table component** with sortable columns using TanStack Table
- **Modal component** for transaction dialogs
- **TransactionSuccessView** for displaying successful transactions
- **WarningBanner** for important messages
- **Card** components for stats display
- **Button** components with different variants
- **SolanaLogo** SVG component
- Responsive layout and styling

## Setup

1. Install dependencies from the root of the design-system:
   ```bash
   pnpm install
   ```

2. Run the example (choose one method):

   **From the root directory:**
   ```bash
   pnpm example:token-list
   ```

   **Or from the example directory:**
   ```bash
   cd examples/token-list
   pnpm dev
   ```

3. Open [http://localhost:3001](http://localhost:3001) in your browser

## Structure

- `src/app/page.tsx` - Main page with token table and modal interactions
- `src/app/layout.tsx` - Root layout with global styles
- `src/app/globals.css` - Tailwind CSS v4 configuration with sand color palette

## Components Used

All components are imported from `@solana/design-system`:
- Table (with TableHeader, TableBody, TableRow, TableHead, TableCell)
- Modal (with ModalHeader, ModalTitle, ModalDescription, ModalFooter)
- TransactionSuccessView
- WarningBanner
- Card
- Button
- SolanaLogo

## Mock Data

The token data is mocked to demonstrate the component functionality. In a real application, this would be fetched from an API.
