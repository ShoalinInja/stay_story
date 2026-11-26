import type { Metadata } from "next";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { SectionHeader } from "@/components/primitives";
import { SERVICES_COPY } from "@/components/services/copy";
import { FaqSection } from "@/components/services/FaqSection";
import { loadCategory } from "@/components/services/routing";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceHero } from "@/components/services/ServiceHero";
import { SERVICE_CATEGORIES } from "@/components/services/whitelist";

export function generateStaticParams() {
  return SERVICE_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps<"/[category]">): Promise<Metadata> {
  const { seo } = await loadCategory((await params).category);
  return { title: { absolute: seo.title }, description: seo.description, keywords: seo.keywords };
}

// Every valid category is prerendered; only unknown URLs render at request time, so blocking is fine.
// Under Cache Components the first hit on an unknown URL still streams 200 + noindex (later hits 404);
// a hard first-hit 404 needs a proxy.ts check (Lead).
export const instant = false;

export default async function CategoryLanding({ params }: PageProps<"/[category]">) {
  const category = await loadCategory((await params).category);
  const { slug, title, tagline, intro, cover, items, whyUs, faqs } = category;

  return (
    <main className="flex-1">
      <ServiceHero title={title} lead={intro ?? tagline} image={cover}>
        {intro && <p className="mt-2 type-meta text-muted-text">{tagline}</p>}
      </ServiceHero>

      {items.length > 0 && (
        <section aria-labelledby="services" className="container-site section-y">
          <SectionHeader id="services" title={SERVICES_COPY.services} />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <li key={item.slug}>
                <ServiceCard item={item} categorySlug={slug} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {!!whyUs?.length && (
        <section aria-labelledby="why-us" className="bg-cream section-y">
          <div className="container-site">
            <SectionHeader id="why-us" title={SERVICES_COPY.whyUs} />
            <ul className="grid gap-6 md:grid-cols-3">
              {whyUs.map((w) => (
                <li key={w.title} className="rounded-card bg-surface p-6 shadow-card">
                  <h3 className="type-h3 text-ink">{w.title}</h3>
                  <p className="mt-2 type-body text-ink-2">{w.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FaqSection faqs={faqs} className="container-site section-y max-w-3xl" />

      <section aria-labelledby="enquire" className="bg-cream section-y">
        <div className="container-site max-w-xl">
          <SectionHeader id="enquire" title={SERVICES_COPY.enquireTitle} description={SERVICES_COPY.enquireLead} />
          <EnquiryForm variant="service" source={`category:${slug}`} submitLabel={SERVICES_COPY.enquireCta} />
        </div>
      </section>
    </main>
  );
}
