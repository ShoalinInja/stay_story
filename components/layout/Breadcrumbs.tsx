import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { breadcrumbLd } from "@/lib/seo/schema";
import { JsonLd } from "@/lib/seo/JsonLd";
import { UI } from "./copy";

export type Crumb = { label: string; href: string };
export type BreadcrumbsProps = {
  /** Trail after Home; the last item is the current page. Home is prepended automatically. */
  items: Crumb[];
  className?: string;
};

/** Visible breadcrumb trail plus BreadcrumbList JSON-LD. Server component. */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const trail = [{ label: UI.home, href: "/" }, ...items];
  return (
    <nav aria-label={UI.breadcrumb} className={cn("type-meta", className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="text-ink">{c.label}</span>
              ) : (
                <>
                  <Link href={c.href} className="hover:text-ink hover:underline">{c.label}</Link>
                  <ChevronRight aria-hidden className="size-3.5" />
                </>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={breadcrumbLd(trail)} />
    </nav>
  );
}
