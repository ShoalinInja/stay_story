import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { UI } from "./copy";

export type Crumb = { label: string; href: string };
export type BreadcrumbsProps = {
  /** Trail after Home; the last item is the current page. Home is prepended automatically. */
  items: Crumb[];
  className?: string;
};

// ponytail: duplicates the layout's metadataBase fallback; switch to A8's lib/seo base URL when it lands.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.staystory.in";

/** Visible breadcrumb trail plus BreadcrumbList JSON-LD. Server component. */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const trail = [{ label: UI.home, href: "/" }, ...items];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: new URL(c.href, SITE_URL).toString(),
    })),
  };
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
      <script
        type="application/ld+json"
        // Content is our own JSON; escape "<" so it can't close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
      />
    </nav>
  );
}
