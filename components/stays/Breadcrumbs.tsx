// Stand-in until A3's components/layout Breadcrumbs lands in this branch; swap the import then.
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href: string };

// Mirrors metadataBase in app/layout.tsx (Lead). JSON-LD needs absolute URLs.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.staystory.in";

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: new URL(c.href, SITE_URL).toString() })),
  };
  return (
    <nav aria-label="Breadcrumb" className="type-meta">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => {
          const last = i === items.length - 1;
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
        // Content-owned strings only; "<" escaped so a name can't close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </nav>
  );
}
