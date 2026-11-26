"use client";

import * as React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
        className={cn("max-h-[90dvh] overflow-y-auto rounded-card bg-surface p-6 sm:max-w-lg", className)}
      >
        <div className="flex items-start justify-between gap-4">
          <DialogTitle className="type-h2 text-ink">{title}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="md" className="-mt-2 -mr-2 size-11 p-0" aria-label={closeLabel}>
              <X aria-hidden className="size-5" />
            </Button>
          </DialogClose>
        </div>
        {description ? (
          <DialogDescription className="type-body text-muted-text">{description}</DialogDescription>
        ) : (
          <DialogDescription className="sr-only">{title}</DialogDescription>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
}
