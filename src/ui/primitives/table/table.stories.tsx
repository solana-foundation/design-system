import type { Meta, StoryObj } from "@storybook/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./index";

const meta: Meta<typeof Table> = {
  component: Table,
  title: "Primitives/Table",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Table>;

// Simple static table
export const Basic: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV004</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$450.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV005</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$550.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// Data for sortable table
interface Token {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
}

const tokenData: Token[] = [
  {
    name: "Solana",
    symbol: "SOL",
    price: 142.5,
    change24h: 5.2,
    volume: 3_500_000_000,
  },
  {
    name: "Jupiter",
    symbol: "JUP",
    price: 0.85,
    change24h: -2.3,
    volume: 125_000_000,
  },
  {
    name: "Bonk",
    symbol: "BONK",
    price: 0.000_025,
    change24h: 8.5,
    volume: 95_000_000,
  },
  {
    name: "Pyth Network",
    symbol: "PYTH",
    price: 0.45,
    change24h: 3.1,
    volume: 48_000_000,
  },
  {
    name: "Jito",
    symbol: "JTO",
    price: 2.35,
    change24h: -1.8,
    volume: 62_000_000,
  },
];

const columnHelper = createColumnHelper<Token>();

function formatPrice(price: number): string {
  if (price === 0) return "$0.00";
  if (price < 0.000_01) return `$${price.toExponential(2)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatVolume(volume: number): string {
  if (volume >= 1_000_000_000)
    return `$${(volume / 1_000_000_000).toFixed(2)}B`;
  if (volume >= 1_000_000) return `$${(volume / 1_000_000).toFixed(2)}M`;
  if (volume >= 1000) return `$${(volume / 1000).toFixed(2)}K`;
  return `$${volume.toFixed(2)}`;
}

function formatPercent(percent: number): string {
  const formatted = Math.abs(percent).toFixed(2);
  return `${percent >= 0 ? "+" : "-"}${formatted}%`;
}

const columns = [
  columnHelper.accessor("name", {
    header: "Token",
    cell: (info) => {
      const token = info.row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-sand-900">{token.name}</span>
          <span className="text-sand-500 text-xs">{token.symbol}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => (
      <span className="font-berkeley-mono text-sm">
        {formatPrice(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("change24h", {
    header: "24h Change",
    cell: (info) => {
      const value = info.getValue();
      return (
        <span
          className={`text-sm ${value >= 0 ? "text-green-600" : "text-red-600"}`}
        >
          {formatPercent(value)}
        </span>
      );
    },
  }),
  columnHelper.accessor("volume", {
    header: "24h Volume",
    cell: (info) => (
      <span className="font-berkeley-mono text-sm">
        {formatVolume(info.getValue())}
      </span>
    ),
  }),
];

function SortableTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: tokenData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <div className="rounded-lg border border-sand-200">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sortDirection = header.column.getIsSorted();

                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <button
                        className={`inline-flex items-center gap-1 ${
                          canSort
                            ? "cursor-pointer select-none hover:text-sand-1500"
                            : ""
                        }`}
                        disabled={!canSort}
                        onClick={header.column.getToggleSortingHandler()}
                        type="button"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {canSort && (
                          <span className="text-sand-400">
                            {sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : sortDirection === "desc" ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronsUpDown className="h-3.5 w-3.5" />
                            )}
                          </span>
                        )}
                      </button>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export const Sortable: Story = {
  render: () => <SortableTable />,
};

export const WithBorder: Story = {
  render: () => (
    <div className="rounded-lg border border-sand-200 p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
            <TableCell>Admin</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell>jane@example.com</TableCell>
            <TableCell>User</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bob Johnson</TableCell>
            <TableCell>bob@example.com</TableCell>
            <TableCell>Editor</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Column 1</TableHead>
          <TableHead>Column 2</TableHead>
          <TableHead>Column 3</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="h-24 text-center" colSpan={3}>
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-sand-600">No data available</p>
              <p className="text-sand-400 text-xs">
                Try adjusting your filters or search criteria
              </p>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
