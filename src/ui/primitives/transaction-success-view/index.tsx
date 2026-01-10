import { CheckCircle, ExternalLink } from "lucide-react";
import * as React from "react";
import { cn } from "../../utils";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";

export interface TransactionSuccessViewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Title of the success message */
  title: string;
  /** Descriptive message */
  message: string;
  /** Optional transaction signature to display */
  transactionSignature?: string;
  /** Callback when close button is clicked */
  onClose: () => void;
  /** Optional callback when continue button is clicked */
  onContinue?: () => void;
  /** Label for the continue button */
  continueLabel?: string;
  /** Solana cluster for explorer link */
  cluster?: "mainnet-beta" | "devnet" | "testnet";
}

/**
 * Transaction success view component for displaying successful transaction results
 */
const TransactionSuccessView = React.forwardRef<
  HTMLDivElement,
  TransactionSuccessViewProps
>(
  (
    {
      title,
      message,
      transactionSignature,
      onClose,
      onContinue,
      continueLabel = "Continue",
      cluster = "devnet",
      className,
      ...props
    },
    ref
  ) => {
    const explorerUrl = transactionSignature
      ? `https://explorer.solana.com/tx/${transactionSignature}${cluster !== "mainnet-beta" ? `?cluster=${cluster}` : ""}`
      : undefined;

    return (
      <div className={cn("space-y-4", className)} ref={ref} {...props}>
        <div className="text-green-600">
          <CheckCircle className="mx-auto mb-3 h-12 w-12" />
          <p className="text-center font-medium">{title}</p>
          <p className="mt-1 text-center text-sand-600 text-sm">{message}</p>
        </div>

        {transactionSignature && (
          <div>
            <Label className="mb-2 block" htmlFor="transaction-signature">
              Transaction Signature
            </Label>
            <div className="flex space-x-2">
              <Input
                className="flex-1 bg-sand-50 font-mono text-sand-600 text-xs"
                id="transaction-signature"
                readOnly
                type="text"
                value={transactionSignature}
              />
              {explorerUrl && (
                <Button
                  onClick={() => {
                    window.open(explorerUrl, "_blank", "noopener,noreferrer");
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          {onContinue && (
            <Button onClick={onContinue} variant="outline">
              {continueLabel}
            </Button>
          )}
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }
);
TransactionSuccessView.displayName = "TransactionSuccessView";

export { TransactionSuccessView };
