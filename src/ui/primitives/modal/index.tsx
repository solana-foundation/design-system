"use client";

import { X } from "lucide-react";
import * as React from "react";
import { cn } from "../../utils";

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose?: () => void;
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Custom overlay className */
  overlayClassName?: string;
  /** Whether to close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Whether to close on escape key */
  closeOnEscape?: boolean;
}

/**
 * Simple modal component with backdrop overlay
 */
const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      showCloseButton = true,
      overlayClassName,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Handle escape key
    React.useEffect(() => {
      if (!(isOpen && closeOnEscape && onClose)) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, closeOnEscape, onClose]);

    // Lock body scroll when modal is open
    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = "";
        };
      }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && onClose && e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
          overlayClassName
        )}
        onClick={handleOverlayClick}
      >
        <div
          className={cn(
            "relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg",
            className
          )}
          ref={ref}
          {...props}
        >
          {showCloseButton && onClose && (
            <button
              className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-sand-400 focus:ring-offset-2 disabled:pointer-events-none"
              onClick={onClose}
              type="button"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
          {children}
        </div>
      </div>
    );
  }
);
Modal.displayName = "Modal";

export interface ModalHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      className={cn("mb-4 flex flex-col space-y-1.5", className)}
      ref={ref}
      {...props}
    />
  )
);
ModalHeader.displayName = "ModalHeader";

export interface ModalTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

const ModalTitle = React.forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      className={cn(
        "font-semibold text-lg leading-none tracking-tight",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
ModalTitle.displayName = "ModalTitle";

export interface ModalDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  ModalDescriptionProps
>(({ className, ...props }, ref) => (
  <p className={cn("text-sand-600 text-sm", className)} ref={ref} {...props} />
));
ModalDescription.displayName = "ModalDescription";

export interface ModalFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      className={cn("mt-6 flex justify-end gap-2", className)}
      ref={ref}
      {...props}
    />
  )
);
ModalFooter.displayName = "ModalFooter";

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter };
