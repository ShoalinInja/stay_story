import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type IconBlobProps = {
  icon: LucideIcon;
  size?: "md" | "lg";
  className?: string;
};

const SIZES = { md: "size-16", lg: "size-24" } as const;

/** Decorative: lucide line icon over a soft peach blob. Pair it with a visible text label. */
export function IconBlob({ icon: Icon, size = "md", className }: IconBlobProps) {
  return (
    <span aria-hidden className={cn("relative inline-grid place-items-center", SIZES[size], className)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full fill-brand-tint">
        <path d="M78.6 18.9c10.2 9.2 15.4 23.8 13.4 37.3-2 13.6-11.2 26.1-23.5 32.6-12.4 6.6-27.9 7.2-40.2 1.5C16 84.6 6.9 72.7 5.3 59.3 3.7 45.8 9.7 30.9 20.3 21.3 30.8 11.8 45.9 7.7 58.7 9.4c7.8 1 14.6 4.4 19.9 9.5Z" />
      </svg>
      <Icon className="relative size-1/2 text-ink" strokeWidth={1.5} />
    </span>
  );
}
