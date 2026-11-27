// A5 implementation of the Lead's StayCard contract (BRIEF §2.2). StayCardProps is frozen: A4 renders it.
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Badge, Card, RatingPill } from "@/components/primitives";
import { cn } from "@/lib/utils";
import type { Stay } from "@/lib/content/types";
import { BADGE_LABELS, copy } from "./copy";
import { cleanFirst } from "./price";
import { CardCarousel, HeartButton } from "./StayCardParts";

export type StayCardProps = {
  stay: Stay;
  /** true for the first above-the-fold card only (LCP). */
  priority?: boolean;
  /** Morph the cover into the detail hero on click. Off for related-stay cards on a detail page,
   *  or every related stay would also pair with its own card on the next detail page. */
  morph?: boolean;
  className?: string;
};

const MAX_CARD_PHOTOS = 5;

/** Area key → display name ("south-goa" → "South Goa"); avoids a content lookup per card. */
const areaName = (key: string) => key.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

export function StayCard({ stay, priority, morph = true, className }: StayCardProps) {
  const href = `/stays/${stay.slug}`;
  const images = cleanFirst(stay.images).slice(0, MAX_CARD_PHOTOS);
  // Text overlays (rating, badge) only when the cover photo is text-free.
  const overlayOk = images.length > 0 && !images[0].hasBakedText;
  const badge = stay.badges?.[0];

  return (
    <Card asChild interactive className={cn("flex h-full flex-col", className)}>
      <article>
        <div className="relative">
          {images.length > 0 ? (
            <CardCarousel
              href={href}
              slug={morph ? stay.slug : undefined}
              images={images}
              label={copy.card.photos(stay.name)}
              dotLabels={images.map((_, i) => copy.card.photo(i + 1, images.length))}
              priority={priority}
            />
          ) : (
            <div className="aspect-[4/3] rounded-t-card bg-surface-2" />
          )}
          {overlayOk && stay.rating && (
            <RatingPill value={stay.rating.value} count={stay.rating.count} className="absolute top-3 left-3" />
          )}
          <HeartButton label={copy.card.save(stay.name)} className="absolute top-2 right-2" />
          {overlayOk && badge && <Badge className="absolute right-3 bottom-3">{BADGE_LABELS[badge]}</Badge>}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          <h3 className="type-h3 text-ink">
            <Link href={href} className="hover:underline">{stay.name}</Link>
          </h3>
          <p className="flex items-center gap-1 type-meta">
            <MapPin aria-hidden className="size-3.5" />
            {areaName(stay.area)}
          </p>
          <p className="type-meta">{copy.card.meta(stay)}</p>
          <div className="mt-auto flex items-end justify-between gap-3 border-t border-line-soft pt-3">
            <p className="text-sm font-semibold text-ink">{copy.card.onEnquiry}</p>
            <Link
              href={href}
              tabIndex={-1}
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
            >
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </article>
    </Card>
  );
}
