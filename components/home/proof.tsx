// Trust slots (docs/MOTION-UX-PLAN.md §5, U1/U3/U4). Server components; each renders nothing until
// real data is in content/ (site.reviews, site.replyTime, site.host, content.testimonials).
import Image from "next/image";
import { Quote } from "lucide-react";
import { Button, SectionHeader } from "@/components/primitives";
import { EnquiryModal } from "@/components/forms/EnquiryModal";
import type { Site, Testimonial } from "@/lib/content";
import { cn } from "@/lib/utils";
import { HOME_COPY } from "./copy";

const T = HOME_COPY;
const MAX_QUOTES = 3;

/** Hero proof line on the photo: "★ 4.8 on Google · 112 reviews · Replies within 30 minutes".
 *  Hidden with neither a rating nor a reply time. */
export function ProofLine({ reviews, replyTime, className }: Pick<Site, "reviews" | "replyTime"> & { className?: string }) {
  const items = [
    reviews && T.proof.rating(reviews.rating),
    reviews && T.proof.reviews(reviews.count),
    replyTime && T.proof.reply(replyTime),
  ].filter((x): x is string => !!x);
  if (!items.length) return null;
  return (
    <ul aria-label={T.proof.label} className={cn("flex flex-wrap justify-center gap-x-3 gap-y-1 text-[0.8125rem] leading-5 font-medium text-white/85", className)}>
      {items.map((t, i) => (
        <li key={t} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden>·</span>}
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Up to three real guest quotes, plus a link to every review on Google when site.reviews is set. */
export function Testimonials({ testimonials, reviews, className }: { testimonials: Testimonial[]; reviews: Site["reviews"]; className?: string }) {
  if (!testimonials.length) return null;
  return (
    <section aria-labelledby="home-testimonials" className={cn("section-y", className)}>
      <div className="container-site">
        <SectionHeader
          id="home-testimonials"
          title={T.testimonials.title}
          link={reviews ? { href: reviews.url, label: T.testimonials.readAll(reviews.count) } : undefined}
        />
        <ul className="grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, MAX_QUOTES).map((t) => (
            <li key={t.name + t.quote.slice(0, 20)}>
              <figure className="flex h-full flex-col gap-4 rounded-card bg-surface p-6 shadow-card">
                <Quote aria-hidden className="size-6 text-brand-strong" />
                <blockquote className="flex-1 type-body text-ink">{t.quote}</blockquote>
                <figcaption className="flex items-center gap-3">
                  {t.image && (
                    <Image src={t.image.src} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
                  )}
                  <span className="flex flex-col">
                    <span className="font-semibold text-ink">{t.name}</span>
                    <span className="type-meta">{T.testimonials.meta(t.stay, t.date)}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** A real face for a local, people-run business. */
export function HostBlock({ host, className }: { host: Site["host"]; className?: string }) {
  if (!host) return null;
  return (
    <section aria-labelledby="host-title" className={cn("section-y", className)}>
      <div className="container-site grid items-center gap-8 md:grid-cols-[320px_1fr] md:gap-12">
        <div className="relative aspect-[4/5] overflow-hidden rounded-card shadow-card">
          <Image src={host.photo.src} alt={host.photo.alt} fill sizes="(min-width: 768px) 320px, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col items-start gap-4">
          <h2 id="host-title" className="type-h2 text-ink">{T.host.title}</h2>
          <p className="flex flex-col">
            <span className="text-lg font-semibold text-ink">{host.name}</span>
            <span className="type-meta">{host.role}</span>
          </p>
          <p className="max-w-prose type-body text-ink-2">{host.bio}</p>
          <EnquiryModal
            variant="contact"
            source="home:host"
            trigger={<Button variant="outline">{T.host.cta}</Button>}
          />
        </div>
      </div>
    </section>
  );
}
