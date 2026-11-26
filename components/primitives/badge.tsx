import * as React from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  dark: "bg-cta text-white",
  "brand-tint": "bg-brand-tint text-ink", // brand-strong on brand-tint is only ~3.5:1, so ink text
} as const;

export type BadgeProps = React.ComponentProps<"span"> & { variant?: keyof typeof VARIANTS };

export function Badge({ variant = "dark", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold [&_svg]:size-3.5",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
