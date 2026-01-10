import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "../button";
import {
  Modal,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "./index";

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: "Primitives/Modal",
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
    },
    showCloseButton: {
      control: "boolean",
    },
    closeOnOverlayClick: {
      control: "boolean",
    },
    closeOnEscape: {
      control: "boolean",
    },
  },
};
export default meta;
type Story = StoryObj<typeof Modal>;

function ModalDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader>
          <ModalTitle>Modal Title</ModalTitle>
          <ModalDescription>
            This is a simple modal component with a title and description.
          </ModalDescription>
        </ModalHeader>
        <div className="py-4">
          <p className="text-sand-700 text-sm">
            This is the modal content. You can put any content here.
          </p>
        </div>
        <ModalFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Confirm</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export const Default: Story = {
  render: () => <ModalDemo />,
};

function ConfirmationModalDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="destructive">
        Delete Item
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader>
          <ModalTitle>Are you sure?</ModalTitle>
          <ModalDescription>
            This action cannot be undone. This will permanently delete your
            item.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)} variant="destructive">
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export const Confirmation: Story = {
  render: () => <ConfirmationModalDemo />,
};

function FormModalDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add User</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader>
          <ModalTitle>Add New User</ModalTitle>
          <ModalDescription>
            Fill in the details to create a new user account.
          </ModalDescription>
        </ModalHeader>
        <div className="space-y-4 py-4">
          <div>
            <label
              className="mb-2 block font-medium text-sand-900 text-sm"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="w-full rounded-md border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sand-400"
              id="name"
              placeholder="John Doe"
              type="text"
            />
          </div>
          <div>
            <label
              className="mb-2 block font-medium text-sand-900 text-sm"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full rounded-md border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sand-400"
              id="email"
              placeholder="john@example.com"
              type="email"
            />
          </div>
        </div>
        <ModalFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Create User</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export const WithForm: Story = {
  render: () => <FormModalDemo />,
};

function NoCloseButtonDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showCloseButton={false}
      >
        <ModalHeader>
          <ModalTitle>No Close Button</ModalTitle>
          <ModalDescription>
            This modal doesn't have a close button. Use the buttons below to
            close.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>OK</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export const NoCloseButton: Story = {
  render: () => <NoCloseButtonDemo />,
};

function CustomSizeDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Large Modal</Button>
      <Modal
        className="max-w-2xl"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ModalHeader>
          <ModalTitle>Large Modal</ModalTitle>
          <ModalDescription>
            This modal has a custom max-width of 2xl.
          </ModalDescription>
        </ModalHeader>
        <div className="py-4">
          <p className="text-sand-700 text-sm">
            You can customize the modal size by passing a className prop with
            different max-width values.
          </p>
        </div>
        <ModalFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export const CustomSize: Story = {
  render: () => <CustomSizeDemo />,
};

function NoOverlayCloseDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        closeOnEscape={false}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ModalHeader>
          <ModalTitle>Persistent Modal</ModalTitle>
          <ModalDescription>
            This modal won't close when clicking outside or pressing Escape.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export const PersistentModal: Story = {
  render: () => <NoOverlayCloseDemo />,
};
