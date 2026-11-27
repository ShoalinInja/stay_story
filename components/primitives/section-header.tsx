import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionHeaderProps = {
  title: React.ReactNode;
  /** Used for aria-labelledby on the parent section. */
  id?: string;
  as?: "h1" | "h2";
  description?: React.ReactNode;
  link?: { href: string; label: string };
  /** Slot on the right, e.g. <RailPrev /><RailNext />. */
  actions?: React.ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  id,
  as: Heading = "h2",
  description,
  link,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", Heading === "h2" && "reveal", className)}>
      <div className="min-w-0">
        <Heading id={id} className={cn(Heading === "h1" ? "type-h1" : "type-h2", "text-ink")}>
          {title}
        </Heading>
        {description && <p className="mt-1 type-body text-muted-text">{description}</p>}
      </div>
      {(link || actions) && (
        <div className="flex items-center gap-3">
          {link && (
            <Link
              href={link.href}
              className="inline-flex min-h-6 items-center gap-1 text-sm font-semibold text-brand-strong underline-offset-4 hover:underline"
            >
              {link.label}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          )}
          {actions}
        </div>
      )}
    </div>
  );
}
