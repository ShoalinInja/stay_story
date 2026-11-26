import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { EnquiryModal } from "@/components/forms/EnquiryModal";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, PriceBlock, RailArrows, Rail, RailTrack, RatingPill,
} from "@/components/primitives";
import { resolveIcon } from "@/lib/icons";
import type { Area, ServiceItem, Stay } from "@/lib/content/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AMENITIES, TYPE_LABELS, copy } from "./copy";
import { cleanFirst, stayMode, stayPrice } from "./price";
import { SectionTabs, type SectionLink } from "./SectionTabs";
import { StayCard } from "./StayCard";
import { StayGallery } from "./StayGallery";

type Props = { stay: Stay; area: Area | undefined; addOns: (ServiceItem & { href: string })[]; related: Stay[] };

const t = copy.detail;

/** Description is markdown; v1 renders paragraphs only. ponytail: add a markdown renderer if content starts using lists/links. */
const paragraphs = (md: string) => md.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-32 border-b border-line-soft py-8 last:border-b-0">
      <h2 id={`${id}-h`} className="type-h2 font-display text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function StayDetail({ stay, area, addOns, related }: Props) {
  const images = cleanFirst(stay.images);
  const price = stayPrice(stay);
  const mode = stayMode(stay);
  const ctaLabel = price.amount == null ? t.quote : mode === "site-visit" ? t.siteVisit : mode === "move-in" ? t.moveIn : t.enquire;
  const areaLabel = area?.name ?? stay.area;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${stay.location.lat},${stay.location.lng}`;

  const show = {
    overview: true,
    highlights: stay.highlights.length > 0,
    policies: true,
    spaces: !!stay.spaces?.length,
    reviews: !!stay.rating && stay.rating.value > 0,
    amenities: stay.amenities.length > 0,
    meals: !!stay.meals,
    location: true,
    experiences: addOns.length > 0,
    faqs: stay.faqs.length > 0,
  };
  const sections: SectionLink[] = (Object.keys(show) as (keyof typeof show)[]).filter((k) => show[k]).map((k) => ({ id: k, label: t.tabs[k] }));

  return (
    <main id="main" className="flex-1 pb-24 lg:pb-0">
      <div className="container-site pt-6">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbsStays, href: "/stays" },
            ...(area ? [{ label: area.name, href: `/areas/${area.key}` }] : []),
            { label: stay.name, href: `/stays/${stay.slug}` },
          ]}
        />
        <header className="mt-4">
          <h1 className="type-h1 font-display text-ink">{stay.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 type-meta">
            <span className="flex items-center gap-1"><MapPin aria-hidden className="size-4" />{areaLabel}</span>
            <span>{TYPE_LABELS[stay.type]}</span>
            {show.reviews && <RatingPill value={stay.rating?.value} count={stay.rating?.count} />}
          </p>
        </header>
        <div className="mt-6">
          <StayGallery
            images={images}
            labels={{
              gallery: copy.card.photos(stay.name),
              viewPhotos: t.viewPhotos,
              more: t.morePhotos(images.length - 5),
              photo: images.map((_, i) => t.photo(i + 1, images.length)),
              prev: t.prevPhoto,
              next: t.nextPhoto,
            }}
          />
        </div>
      </div>

      <div className="container-site mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <SectionTabs sections={sections} label={t.sectionNav} />

          <Section id="overview" title={t.tabs.overview}>
            <p className="type-h3 text-ink">{stay.headline}</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 type-body text-ink-2">
              <li className="flex items-center gap-2"><Users aria-hidden className="size-4" />{copy.card.meta(stay)}</li>
            </ul>
            <div className="mt-4 space-y-3 type-body text-ink-2">
              {paragraphs(stay.description).map((p) => <p key={p}>{p}</p>)}
            </div>
          </Section>

          {show.highlights && (
            <Section id="highlights" title={t.tabs.highlights}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {stay.highlights.map((h) => (
                  <li key={h} className="rounded-card bg-cream px-4 py-3 type-body text-ink">{h}</li>
                ))}
              </ul>
            </Section>
          )}

          <Section id="policies" title={t.tabs.policies}>
            <dl className="grid grid-cols-2 gap-4 type-body">
              <div><dt className="type-meta">{t.checkIn}</dt><dd className="font-semibold text-ink">{stay.policies.checkIn}</dd></div>
              <div><dt className="type-meta">{t.checkOut}</dt><dd className="font-semibold text-ink">{stay.policies.checkOut}</dd></div>
            </dl>
            {stay.policies.rules.length > 0 && (
              <>
                <h3 className="mt-6 type-h3 text-ink">{t.houseRules}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 type-body text-ink-2">
                  {stay.policies.rules.map((r) => <li key={r}>{r}</li>)}
                </ul>
              </>
            )}
            <h3 className="mt-6 type-h3 text-ink">{t.cancellation}</h3>
            <p className="mt-2 type-body text-ink-2">{stay.policies.cancellation}</p>
          </Section>

          {show.spaces && (
            <Section id="spaces" title={t.tabs.spaces}>
              <ul className="grid gap-6 sm:grid-cols-2">
                {stay.spaces?.map((s) => (
                  <li key={s.name}>
                    {s.image && (
                      <Image src={s.image.src} alt={s.image.alt} width={s.image.width} height={s.image.height} sizes="(min-width: 640px) 380px, 100vw" className="aspect-[4/3] w-full rounded-card object-cover" />
                    )}
                    <h3 className="mt-3 type-h3 text-ink">{s.name}</h3>
                    <p className="mt-1 type-body text-ink-2">{s.description}</p>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {show.reviews && stay.rating && (
            <Section id="reviews" title={t.tabs.reviews}>
              <p className="flex items-center gap-3 type-body text-ink-2">
                <RatingPill value={stay.rating.value} count={stay.rating.count} />
                {t.reviews(stay.rating.value, stay.rating.count, stay.rating.source)}
              </p>
            </Section>
          )}

          {show.amenities && (
            <Section id="amenities" title={t.tabs.amenities}>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {stay.amenities.map((a) => {
                  const Icon = resolveIcon(AMENITIES[a].icon);
                  return (
                    <li key={a} className="flex items-center gap-2 type-body text-ink">
                      <Icon aria-hidden className="size-5 text-ink-2" />
                      {AMENITIES[a].label}
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}

          {show.meals && (
            <Section id="meals" title={t.tabs.meals}>
              <p className="type-body text-ink-2">{stay.meals}</p>
            </Section>
          )}

          <Section id="location" title={t.tabs.location}>
            <p className="flex items-center gap-1 type-body text-ink"><MapPin aria-hidden className="size-4" />{areaLabel}</p>
            {area?.intro && <p className="mt-2 type-body text-ink-2">{area.intro}</p>}
            {stay.location.nearby.length > 0 && (
              <>
                <h3 className="mt-6 type-h3 text-ink">{t.nearby}</h3>
                <ul className="mt-2 divide-y divide-line-soft">
                  {stay.location.nearby.map((n) => (
                    <li key={n.name} className="flex justify-between gap-4 py-2 type-body">
                      <span className="text-ink">{n.name}</span>
                      <span className="text-muted-text">{n.distance}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <Button asChild variant="outline" className="mt-4">
              <a href={mapUrl} target="_blank" rel="noopener noreferrer">{t.openMap}</a>
            </Button>
          </Section>

          {show.experiences && (
            <Section id="experiences" title={t.tabs.experiences}>
              <p className="type-meta">{t.experiencesIntro}</p>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {addOns.map((x) => (
                  <li key={x.href} className="flex gap-4 rounded-card border border-line-soft p-3">
                    <Image src={x.hero.src} alt="" width={96} height={96} sizes="96px" className="size-24 shrink-0 rounded-input object-cover" />
                    <div className="min-w-0">
                      <h3 className="type-h3 text-ink"><Link href={x.href} className="hover:underline">{x.title}</Link></h3>
                      <p className="mt-1 line-clamp-3 type-meta">{x.summary}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {show.faqs && (
            <Section id="faqs" title={t.tabs.faqs}>
              <Accordion type="single" collapsible>
                {stay.faqs.map((f) => (
                  <AccordionItem key={f.q} value={f.q}>
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Section>
          )}
        </div>

        <aside id="enquire" className="scroll-mt-24 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-card bg-surface p-5 shadow-card-hover">
            <PriceBlock amount={price.amount} mode={price.mode} />
            {price.mode === "per-night" && price.amount != null && <p className="type-meta">{t.forRooms(stay.bedrooms)}</p>}
            {mode === "dates" && price.amount != null && <p className="mt-2 text-sm font-semibold text-success">{t.bestPrice}</p>}
            <EnquiryForm
              variant="stay"
              source={`stay-detail:${stay.slug}`}
              staySlug={stay.slug}
              stayMode={mode}
              defaults={{ rooms: stay.bedrooms }}
              submitLabel={ctaLabel}
              className="mt-4"
            />
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-line-soft pt-4 type-meta">
              <span>{t.connectHost}</span>
              <EnquiryModal
                variant="callback"
                source={`stay-detail-callback:${stay.slug}`}
                staySlug={stay.slug}
                trigger={<Button variant="ghost" size="sm" className="text-brand-strong">{t.callback}</Button>}
              />
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="container-site section-y">
          <Rail label={t.related}>
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="type-h2 font-display text-ink">{t.related}</h2>
              <RailArrows />
            </div>
            <RailTrack>
              {related.map((s) => <StayCard key={s.slug} stay={s} />)}
            </RailTrack>
          </Rail>
        </section>
      )}

      {/* Mobile bottom bar: price + jump to the enquiry card (an anchor, so it works without JS). */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line-soft bg-surface px-4 py-3 shadow-card-hover lg:hidden">
        <PriceBlock amount={price.amount} mode={price.mode} />
        <Button asChild>
          <a href="#enquire">{price.amount == null ? t.quote : t.enquireShort}</a>
        </Button>
      </div>
    </main>
  );
}
