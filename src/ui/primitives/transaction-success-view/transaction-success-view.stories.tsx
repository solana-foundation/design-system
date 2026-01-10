import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "../button";
import { Modal } from "../modal";
import { TransactionSuccessView } from "./index";

const meta: Meta<typeof TransactionSuccessView> = {
  component: TransactionSuccessView,
  title: "Primitives/Transaction Success View",
  tags: ["autodocs"],
  argTypes: {
    cluster: {
      control: "select",
      options: ["mainnet-beta", "devnet", "testnet"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof TransactionSuccessView>;

export const Default: Story = {
  args: {
    title: "Transaction Successful",
    message: "Your transaction has been confirmed on the blockchain.",
    transactionSignature:
      "5J8H5sTvEhnGcB7Nqy5vZE1vxqrJ8jTYqgHVc9dK4fNnN5Qp8wZxGtLp3d2kM9uS4rW7xYzV6nT5mP8qR3aK1bC",
    onClose: () => console.log("Close clicked"),
    cluster: "devnet",
  },
};

export const WithContinue: Story = {
  args: {
    title: "Token Transfer Complete",
    message: "Your tokens have been successfully transferred.",
    transactionSignature:
      "3KpX7qYvXzB4mN5dR8eW2tY1sP9qLkJ6fH4aG7nM2bV8cT5rX4wQ1zY3xS2vU6nM7pL8oK9jH5gF4dC3bA2w",
    onClose: () => console.log("Close clicked"),
    onContinue: () => console.log("Continue clicked"),
    continueLabel: "View Wallet",
    cluster: "devnet",
  },
};

export const NoSignature: Story = {
  args: {
    title: "Action Completed",
    message: "Your action was processed successfully.",
    onClose: () => console.log("Close clicked"),
  },
};

export const MainnetCluster: Story = {
  args: {
    title: "Swap Successful",
    message: "Your tokens have been swapped successfully.",
    transactionSignature:
      "4nWqM8dP7eS2kJ9fX3bR5gH1vL6tY8cN2aZ4wQ7xV5mT9pU3rK8jD6sE2hA1nB7oC5mL4yX3gW2fT9vP1kR",
    onClose: () => console.log("Close clicked"),
    cluster: "mainnet-beta",
  },
};

function InModalDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Complete Transaction</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <TransactionSuccessView
          cluster="devnet"
          message="Your transaction has been confirmed on the blockchain."
          onClose={() => setIsOpen(false)}
          title="Transaction Successful"
          transactionSignature="5J8H5sTvEhnGcB7Nqy5vZE1vxqrJ8jTYqgHVc9dK4fNnN5Qp8wZxGtLp3d2kM9uS4rW7xYzV6nT5mP8qR3aK1bC"
        />
      </Modal>
    </>
  );
}

export const InModal: Story = {
  render: () => <InModalDemo />,
};

function WithContinueInModalDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Send Transaction</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <TransactionSuccessView
          cluster="devnet"
          continueLabel="Send Another"
          message="Your payment has been successfully sent."
          onClose={() => setIsOpen(false)}
          onContinue={() => {
            setIsOpen(false);
            console.log("Continue to next step");
          }}
          title="Payment Sent"
          transactionSignature="2mR9kL5pN7eX4dS8fW3bH6gT1vY8cJ2aQ4zX9mV5nU7pK8jD3sE6hA1rB2oL4yC5mT3gW9fP1vR"
        />
      </Modal>
    </>
  );
}

export const WithContinueInModal: Story = {
  render: () => <WithContinueInModalDemo />,
};
