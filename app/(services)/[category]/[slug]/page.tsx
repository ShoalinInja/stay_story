import type { Metadata } from "next";
import { getCategory } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Card, Chip, IconBlob, PriceBlock, Rail, RailArrows, RailProgress, RailTrack, SectionHeader } from "@/components/primitives";
import { SERVICES_COPY } from "@/components/services/copy";
import { FaqSection } from "@/components/services/FaqSection";
import { MobileEnquireBar } from "@/components/services/MobileEnquireBar";
import { loadService } from "@/components/services/routing";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceHero } from "@/components/services/ServiceHero";
import { resolveRelated, SERVICE_CATEGORIES } from "@/components/services/whitelist";

export async function generateStaticParams() {
  const categories = await Promise.all(SERVICE_CATEGORIES.map((c) => getCategory(c)));
  return categories.flatMap((c) => c?.items.map((i) => ({ category: c.slug, slug: i.slug })) ?? []);
}

export async function generateMetadata({ params }: PageProps<"/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await params;
  const { seo } = (await loadService(category, slug)).item;
  return { title: { absolute: seo.title }, description: seo.description, keywords: seo.keywords };
}

// params awaited outside Suspense so notFound() sends a real 404 status. Every valid item is
// prerendered, so only unknown (404) URLs block; `instant = false` opts the segment out of the shell check.
export const instant = false;

export default async function ServiceDetail({ params }: PageProps<"/[category]/[slug]">) {
  const p = await params;
  const { category, item } = await loadService(p.category, p.slug);
  const related = resolveRelated(category, item);
  const source = `service-detail:${category.slug}/${item.slug}`;

  return (
    <main className="flex-1 pb-20 lg:pb-0">
      <ServiceHero title={item.title} lead={item.summary} image={item.hero}>
        <PriceBlock
          amount={item.priceFrom}
          prefix={SERVICES_COPY.priceFrom}
          suffix={SERVICES_COPY.priceSuffix}
          onRequestLabel={SERVICES_COPY.priceOnRequest}
          className="mt-6"
        />
      </ServiceHero>

      <div className="container-site section-y grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-12">
          {item.sections.length > 0 && (
            <section aria-labelledby="what-you-get">
              <SectionHeader id="what-you-get" title={SERVICES_COPY.whatYouGet} />
              <ul className="grid gap-6 sm:grid-cols-2">
                {item.sections.map((s) => (
                  <li key={s.heading}>
                    <Card className="h-full p-6">
                      <IconBlob icon={resolveIcon(s.icon)} />
                      <h3 className="mt-4 type-h3 text-ink">{s.heading}</h3>
                      <p className="mt-2 type-body text-ink-2">{s.body}</p>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {item.idealFor.length > 0 && (
            <section aria-labelledby="ideal-for">
              <SectionHeader id="ideal-for" title={SERVICES_COPY.idealFor} />
              <ul className="flex flex-wrap gap-2">
                {item.idealFor.map((who) => (
                  <li key={who}>
                    <Chip asChild>
                      <span>{who}</span>
                    </Chip>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!!item.inclusions?.length && (
            <section aria-labelledby="inclusions">
              <SectionHeader id="inclusions" title={SERVICES_COPY.inclusions} />
              <ul className="list-disc space-y-1 pl-5 type-body text-ink-2">
                {item.inclusions.map((inc) => (
                  <li key={inc}>{inc}</li>
                ))}
              </ul>
            </section>
          )}

          <FaqSection faqs={item.faqs} />
        </div>

        <aside aria-labelledby="enquire" className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <h2 id="enquire" className="type-h2 text-ink">{SERVICES_COPY.enquireTitle}</h2>
            <p className="mt-1 mb-4 type-meta text-muted-text">{SERVICES_COPY.enquireLead}</p>
            <EnquiryForm variant="service" source={source} serviceSlug={item.slug} submitLabel={SERVICES_COPY.enquireCta} />
          </Card>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="bg-cream section-y">
          <Rail label={SERVICES_COPY.related} className="container-site">
            <SectionHeader title={SERVICES_COPY.related} actions={<RailArrows />} />
            <RailTrack>
              {related.map((r) => (
                <ServiceCard key={r.slug} item={r} categorySlug={category.slug} />
              ))}
            </RailTrack>
            <RailProgress />
          </Rail>
        </div>
      )}

      <MobileEnquireBar source={`${source}:mobile-bar`} serviceSlug={item.slug} title={SERVICES_COPY.enquireTitle} />
    </main>
  );
}
