import type { ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Chip } from "@/components/primitives";
import { resolveIcon } from "@/lib/icons";
import type { StayType } from "@/lib/content/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { copy } from "./copy";
import { loadStays, loadStaysService } from "./data";
import { StayGrid, StaysEmpty } from "./StayGrid";

/** Grid of stays of the given types, or the enquiry empty state. */
export async function TypeListing({ types, empty, source, stayMode }: { types: StayType[]; empty: string; source: string; stayMode?: "dates" | "move-in" | "site-visit" }) {
  const stays = (await Promise.all(types.map((type) => loadStays({ type })))).flat();
  return stays.length > 0
    ? <StayGrid stays={stays} />
    : <StaysEmpty title={empty} form={{ variant: "stay", source, stayMode }} />;
}

export async function typeLandingMetadata(slug: string, path: string): Promise<Metadata> {
  const item = await loadStaysService(slug);
  return item ? { title: { absolute: item.seo.title }, description: item.seo.description, keywords: item.seo.keywords, alternates: { canonical: path } } : {};
}

type Props = {
  slug: string;
  path: string;
  /** Rendered between the copy and the FAQs: the grid, or its empty state. */
  listing: ReactNode;
  listingTitle?: string;
  /** Extra block after the FAQs (property-sales owner/buyer forms). */
  after?: ReactNode;
};

/** SEO landing for /stays/villas, /stays/apartments-hotels, /stays/long-term-rentals and /property-sales. */
export async function TypeLanding({ slug, path, listing, listingTitle = copy.typeLanding.listings, after }: Props) {
  const item = await loadStaysService(slug);
  if (!item) notFound();

  return (
    <main id="main" className="flex-1">
      <section className="container-site pt-6 pb-12 md:pb-16">
        <Breadcrumbs items={[{ label: copy.detail.breadcrumbsStays, href: "/stays" }, { label: item.title, href: path }]} />
        <div className="mt-6 grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="type-h1 font-display text-ink">{item.title}</h1>
            <p className="mt-4 type-body text-ink-2">{item.summary}</p>
            {item.idealFor.length > 0 && (
              <div className="mt-6">
                <h2 className="type-h3 text-ink">{copy.typeLanding.idealFor}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {item.idealFor.map((x) => <li key={x}><Chip asChild><span>{x}</span></Chip></li>)}
                </ul>
              </div>
            )}
          </div>
          {/* Image only, text sits beside it, so baked-text posters are safe too. */}
          <Image
            src={item.hero.src}
            alt={item.hero.alt}
            width={item.hero.width}
            height={item.hero.height}
            placeholder={item.hero.blurDataURL ? "blur" : "empty"}
            blurDataURL={item.hero.blurDataURL}
            sizes="(min-width: 768px) 600px, 100vw"
            priority
            className="aspect-[4/3] w-full rounded-card object-cover"
          />
        </div>
      </section>

      {item.sections.length > 0 && (
        <section className="bg-cream section-y">
          <ul className="container-site grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {item.sections.map((s) => {
              const Icon = resolveIcon(s.icon);
              return (
                <li key={s.heading} className="rounded-card bg-surface p-6 shadow-card">
                  <Icon aria-hidden className="size-6 text-brand-strong" />
                  <h2 className="mt-3 type-h3 text-ink">{s.heading}</h2>
                  <p className="mt-1 type-body text-ink-2">{s.body}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="container-site section-y">
        <h2 className="type-h2 font-display text-ink">{listingTitle}</h2>
        <div className="mt-6">{listing}</div>
      </section>

      {item.faqs.length > 0 && (
        <section className="container-site pb-12 md:pb-16">
          <Accordion type="single" collapsible>
            {item.faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}
      {after}
    </main>
  );
}

