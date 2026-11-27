"use client";

import * as React from "react";
import { X } from "lucide-react";
import {
  Sheet as UiSheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dialog as SheetPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export type SheetProps = {
  trigger?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  side?: "bottom" | "left" | "right";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeLabel?: string;
  /** Sticky footer, e.g. Apply / Clear buttons. */
  footer?: React.ReactNode;
  className?: string;
};

/** Edge panel (mobile filters, date picker, nav drawer). Focus trap, Esc and focus restore via Radix. */
export function Sheet({
  trigger,
  title,
  description,
  children,
  side = "bottom",
  open,
  defaultOpen,
  onOpenChange,
  closeLabel = "Close",
  footer,
  className,
}: SheetProps) {
  return (
    <UiSheet open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side={side}
        showCloseButton={false}
        className={cn(
          "gap-0 bg-surface text-ink duration-(--dur-slow) ease-out data-closed:duration-(--dur-base) data-closed:ease-in",
          side === "bottom" && "max-h-[90dvh] rounded-t-2xl",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line-soft px-4 py-2">
          <SheetPrimitive.Title className="type-h3 text-ink">{title}</SheetPrimitive.Title>
          <SheetClose asChild>
            <Button variant="ghost" className="size-11 p-0" aria-label={closeLabel}>
              <X aria-hidden className="size-5" />
            </Button>
          </SheetClose>
        </div>
        {description ? (
          <SheetPrimitive.Description className="px-4 pt-3 type-meta">{description}</SheetPrimitive.Description>
        ) : (
          <SheetPrimitive.Description className="sr-only">{title}</SheetPrimitive.Description>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
        {footer && <div className="border-t border-line-soft p-4">{footer}</div>}
      </SheetContent>
    </UiSheet>
  );
}
