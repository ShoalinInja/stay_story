"use client";

import * as React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export type ModalProps = {
  /** Element that opens the modal (rendered asChild). Omit when controlled. */
  trigger?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeLabel?: string;
  className?: string;
};

/** Centred dialog. Radix provides focus trap, Esc to close, focus restore and scroll lock. */
export function Modal({
  trigger,
  title,
  description,
  children,
  open,
  defaultOpen,
  onOpenChange,
  closeLabel = "Close",
  className,
}: ModalProps) {
  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-h-[90dvh] overflow-y-auto rounded-card bg-surface p-6 sm:max-w-lg",
          "duration-(--dur-slow) ease-out data-open:zoom-in-[0.97] data-open:slide-in-from-bottom-2 data-closed:duration-(--dur-fast) data-closed:ease-in data-closed:zoom-out-[0.98]",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <DialogPrimitive.Title className="type-h2 text-ink">{title}</DialogPrimitive.Title>
          <DialogClose asChild>
            <Button variant="ghost" size="md" className="-mt-2 -mr-2 size-11 p-0" aria-label={closeLabel}>
              <X aria-hidden className="size-5" />
            </Button>
          </DialogClose>
        </div>
        {description ? (
          <DialogPrimitive.Description className="type-body text-muted-text">{description}</DialogPrimitive.Description>
        ) : (
          <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
}
