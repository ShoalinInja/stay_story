// Simple static home sections (server components). Each hides itself when its data is empty.
import Image from "next/image";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  IconBlob,
  SectionHeader,
} from "@/components/primitives";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { EnquiryModal } from "@/components/forms/EnquiryModal";
import type { Faq, MediaRef, Site } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { HOME_COPY as T } from "./copy";

type Bg = { className?: string };

export function CallbackStrip({ className }: Bg) {
  return (
    <section aria-label={T.callback.cta} className={cn("pt-8 pb-4 md:pt-10", className)}>
      <div className="container-site">
        <div className="flex flex-col items-start justify-between gap-3 rounded-card bg-brand-tint px-5 py-4 sm:flex-row sm:items-center">
          <p className="flex items-center gap-3 type-body font-medium text-ink">
            <PhoneCall aria-hidden className="size-5 shrink-0" />
            {T.callback.text}
          </p>
          <EnquiryModal
            variant="callback"
            source="home:callback-strip"
            trigger={
              <Button variant="ghost" className="px-0 font-semibold text-ink underline underline-offset-4 hover:bg-transparent">
                {T.callback.cta}
              </Button>
            }
          />
        </div>
      </div>
    </section>
  );
}

export function FeatureGrid({ features, className }: { features: Site["features"] } & Bg) {
  if (!features.length) return null;
  return (
    <section aria-labelledby="home-features" className={cn("section-y", className)}>
      <div className="container-site">
        <SectionHeader id="home-features" title={T.features.title} />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {features.map((f) => (
            <li key={f.label} className="flex flex-col items-center gap-3 text-center">
              <IconBlob icon={resolveIcon(f.icon)} />
              <span className="type-h3 text-ink">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function TrustBlock({ trust, className }: { trust: Site["trust"] } & Bg) {
  if (!trust.length) return null;
  return (
    <section aria-labelledby="home-trust" className={cn("section-y", className)}>
      <div className="container-site">
        <SectionHeader id="home-trust" title={T.trust.title} className="justify-center text-center" />
        <ul className="grid gap-8 md:grid-cols-3">
          {trust.map((t) => (
            <li key={t.title} className="flex flex-col items-center gap-3 text-center">
              <IconBlob icon={resolveIcon(t.icon)} size="lg" />
              <h3 className="type-h3 text-ink">{t.title}</h3>
              <p className="max-w-xs type-body text-muted-text">{t.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Hidden while site.stats is null (no real figures yet). */
export function Stats({ stats, className }: { stats: Site["stats"] } & Bg) {
  if (!stats?.length) return null;
  return (
    <section aria-labelledby="home-stats" className={cn("section-y", className)}>
      <div className="container-site">
        <h2 id="home-stats" className="sr-only">{T.stats.title}</h2>
        <dl className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-1">
              <dt className="type-meta">{s.label}</dt>
              <dd className="font-display text-4xl font-semibold text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function GalleryMosaic({ images, className }: { images: MediaRef[] } & Bg) {
  if (!images.length) return null;
  return (
    <section aria-labelledby="home-gallery" className={cn("section-y", className)}>
      <div className="container-site">
        <SectionHeader id="home-gallery" title={T.gallery.title} link={T.gallery.link} />
        <ul className="grid auto-rows-[140px] grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4">
          {images.slice(0, 8).map((img, i) => (
            <li
              key={img.src}
              className={cn(
                "relative overflow-hidden rounded-card",
                i === 0 && "col-span-2 row-span-2",
                i === 7 && "md:col-span-2",
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ListYourProperty({ image, className }: { image: MediaRef | null } & Bg) {
  const L = T.listYourProperty;
  return (
    <section aria-labelledby="home-lyp" className={cn("section-y", className)}>
      <div className="container-site grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <h2 id="home-lyp" className="type-h2 text-ink">{L.title}</h2>
          <p className="mt-2 type-body text-muted-text">{L.intro}</p>
          <ul className="mt-6 flex flex-col gap-3">
            {L.benefits.map((b) => (
              <li key={b.lead} className="type-body text-ink-2">
                <strong className="font-semibold text-ink">{b.lead}:</strong> {b.text}
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-8">
            <Link href={L.cta.href}>{L.cta.label}</Link>
          </Button>
        </div>
        {image && !image.hasBakedText && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-card">
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}

export function HomeFaq({ faqs, className }: { faqs: Faq[] } & Bg) {
  if (!faqs.length) return null;
  return (
    <section aria-labelledby="home-faq" className={cn("section-y", className)}>
      <div className="container-site max-w-3xl">
        <SectionHeader id="home-faq" title={T.faq.title} />
        <Accordion type="single" collapsible>
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function EnquiryBand({ className }: Bg) {
  return (
    <section aria-labelledby="home-enquiry" className={cn("section-y", className)}>
      <div className="container-site">
       <div className="grid items-center gap-8 rounded-card bg-cta p-6 text-white md:grid-cols-2 md:p-10">
        <div>
          <h2 id="home-enquiry" className="font-display type-h2 text-white">{T.enquiry.title}</h2>
          <p className="mt-2 type-body text-white/85">{T.enquiry.body}</p>
        </div>
        <div className="rounded-card bg-surface p-5 text-ink">
          <EnquiryForm variant="contact" source="home:cta-band" />
        </div>
       </div>
      </div>
    </section>
  );
}
