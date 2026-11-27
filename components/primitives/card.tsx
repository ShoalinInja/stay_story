import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

export type CardProps = React.ComponentProps<"div"> & {
  /** Lift on hover (shadow-card-hover + translateY(-2px)). */
  interactive?: boolean;
  /** Render as the child element, e.g. <article> or a link. */
  asChild?: boolean;
};

export function Card({ interactive = false, asChild = false, className, ...props }: CardProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="card"
      className={cn(
        "overflow-hidden rounded-card bg-surface text-ink shadow-card",
        interactive &&
          "group/card transition-[box-shadow,transform,translate,scale] duration-(--dur-slow) hover:shadow-card-hover focus-within:shadow-card-hover motion-safe:hover:-translate-y-0.5",
        className,
      )}
      {...props}
    />
  );
}
