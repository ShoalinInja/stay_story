import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

export type ChipProps = React.ComponentProps<"button"> & {
  /** Toggle state; sets aria-pressed (omit for non-toggle chips/links). */
  selected?: boolean;
  /** Render the child (e.g. next/link) with chip styling. */
  asChild?: boolean;
};

/** Pill chip: filters, "Ideal for" tags, quick links. 36px tall, ≥24px target. */
export function Chip({ selected, asChild = false, className, type, ...props }: ChipProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      type={asChild ? undefined : (type ?? "button")}
      aria-pressed={asChild ? undefined : selected}
      data-selected={selected ? "" : undefined}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-4 text-sm font-medium whitespace-nowrap text-ink-2 transition-colors hover:border-ink hover:text-ink disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
        "data-selected:border-cta data-selected:bg-cta data-selected:text-white",
        className,
      )}
      {...props}
    />
  );
}
