"use client";

import {
  Button,
  Card,
  Modal,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  SolanaLogo,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TransactionSuccessView,
  WarningBanner,
} from "@solana/design-system";
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

interface Token {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

const mockTokens: Token[] = [
  {
    name: "Solana",
    symbol: "SOL",
    price: 142.5,
    change24h: 5.2,
    volume24h: 3_500_000_000,
    marketCap: 67_000_000_000,
  },
  {
    name: "Jupiter",
    symbol: "JUP",
    price: 0.85,
    change24h: -2.3,
    volume24h: 125_000_000,
    marketCap: 850_000_000,
  },
  {
    name: "Bonk",
    symbol: "BONK",
    price: 0.000_025,
    change24h: 8.5,
    volume24h: 95_000_000,
    marketCap: 175_000_000,
  },
  {
    name: "Pyth Network",
    symbol: "PYTH",
    price: 0.45,
    change24h: 3.1,
    volume24h: 48_000_000,
    marketCap: 450_000_000,
  },
  {
    name: "Jito",
    symbol: "JTO",
    price: 2.35,
    change24h: -1.8,
    volume24h: 62_000_000,
    marketCap: 235_000_000,
  },
  {
    name: "Raydium",
    symbol: "RAY",
    price: 3.42,
    change24h: 4.5,
    volume24h: 87_000_000,
    marketCap: 342_000_000,
  },
  {
    name: "Orca",
    symbol: "ORCA",
    price: 1.23,
    change24h: -0.8,
    volume24h: 23_000_000,
    marketCap: 123_000_000,
  },
];

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

const columnHelper = createColumnHelper<Token>();

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
  columnHelper.accessor("volume24h", {
    header: "24h Volume",
    cell: (info) => (
      <span className="font-berkeley-mono text-sm">
        {formatVolume(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("marketCap", {
    header: "Market Cap",
    cell: (info) => (
      <span className="font-berkeley-mono text-sm">
        {formatVolume(info.getValue())}
      </span>
    ),
  }),
];

function StatsCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-6">
      <p className="text-sand-600 text-sm">{label}</p>
      <p className="mt-2 font-semibold text-2xl text-sand-900">{value}</p>
    </Card>
  );
}

export default function Home() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [showModal, setShowModal] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const table = useReactTable({
    data: mockTokens,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  const totalVolume = mockTokens.reduce(
    (acc, token) => acc + token.volume24h,
    0
  );
  const totalMarketCap = mockTokens.reduce(
    (acc, token) => acc + token.marketCap,
    0
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-sand-100 via-white to-white">
      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <div className="mb-8 flex justify-center">
          <SolanaLogo height={80} width={80} />
        </div>
        <h1 className="mb-4 font-semibold text-5xl text-sand-900 leading-tight tracking-tight">
          Tokens on Solana
        </h1>
        <p className="text-lg text-sand-600">
          Explore the ecosystem of tokens built on Solana
        </p>
      </section>

      {/* Warning Banner */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <WarningBanner
          message="This is a demo application showcasing the design system components. Data shown is for demonstration purposes only."
          title="Using Mock Data"
          variant="danger"
        />
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Total Volume (24h)"
            value={formatVolume(totalVolume)}
          />
          <StatsCard label="Market Cap" value={formatVolume(totalMarketCap)} />
          <StatsCard
            label="Total Tokens"
            value={mockTokens.length.toString()}
          />
          <StatsCard label="Network" value="Devnet" />
        </div>
      </section>

      {/* Action Button */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <Button onClick={() => setShowModal(true)}>Simulate Transaction</Button>
      </section>

      {/* Token Table */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="overflow-hidden rounded-lg border border-sand-200 bg-white shadow-sm">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Transaction Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalHeader>
          <ModalTitle>Confirm Transaction</ModalTitle>
          <ModalDescription>
            Simulate a token swap transaction on the Solana devnet.
          </ModalDescription>
        </ModalHeader>
        <div className="py-4">
          <WarningBanner
            message="This will not execute a real transaction. It's just a demonstration."
            title="Simulation Only"
            variant="warning"
          />
        </div>
        <ModalFooter>
          <Button onClick={() => setShowModal(false)} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowModal(false);
              setTimeout(() => setShowSuccess(true), 300);
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={showSuccess} onClose={() => setShowSuccess(false)}>
        <TransactionSuccessView
          cluster="devnet"
          message="Your simulated transaction has been completed."
          onClose={() => setShowSuccess(false)}
          title="Transaction Successful"
          transactionSignature="5J8H5sTvEhnGcB7Nqy5vZE1vxqrJ8jTYqgHVc9dK4fNnN5Qp8wZxGtLp3d2kM9uS4rW7xYzV6nT5mP8qR3aK1bC"
        />
      </Modal>
    </main>
  );
}
