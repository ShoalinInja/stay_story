import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

// Server-safe: no hooks. Focus ring comes from the global :focus-visible outline in globals.css.
export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 font-semibold whitespace-nowrap select-none transition-[background-color,color,border-color,box-shadow,transform] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        dark: "rounded-input bg-cta text-white hover:bg-ink-2",
        outline: "rounded-input border border-ink bg-surface text-ink hover:bg-surface-2",
        pill: "rounded-full border border-ink bg-surface text-ink hover:bg-ink hover:text-white",
        ghost: "rounded-input text-ink hover:bg-surface-2",
        "icon-circle":
          "rounded-full border border-line bg-surface text-ink shadow-card hover:border-ink hover:bg-surface-2",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    compoundVariants: [
      { variant: "icon-circle", size: "sm", className: "size-9 p-0" },
      { variant: "icon-circle", size: "md", className: "size-11 p-0" },
      { variant: "icon-circle", size: "lg", className: "size-12 p-0" },
    ],
    defaultVariants: { variant: "dark", size: "md" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the single child (e.g. next/link) with button styling. */
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
