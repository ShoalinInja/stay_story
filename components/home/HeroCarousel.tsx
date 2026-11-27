import Image from "next/image";
import Link from "next/link";
import { AfterLoad, Rail, RailNext, RailPrev, RailTrack } from "@/components/primitives";
import type { Site } from "@/lib/content";
import { HOME_COPY } from "./copy";

const AUTOPLAY_MS = 7000;
const T = HOME_COPY.hero;

/** Full-bleed looping hero. Slides must be clean photos (site.hero.slides is curated text-free). */
export function HeroCarousel({ hero }: { hero: Site["hero"] }) {
  const slides = hero.slides.filter((s) => !s.image.hasBakedText);
  return (
    <div className="relative h-[440px] overflow-hidden bg-cta md:h-[520px]">
      <Rail label={T.carouselLabel} options={{ loop: true }} autoplay={AUTOPLAY_MS} className="h-full">
        <RailTrack slideClassName="basis-full pl-0" className="ml-0">
          {slides.map((s, i) => (
            <div key={s.image.src} className="relative h-[440px] md:h-[520px]">
              {i === 0 ? (
                <Image src={s.image.src} alt={s.image.alt} fill sizes="100vw" fetchPriority="high" loading="eager" className="animate-hero-settle object-cover" />
              ) : (
                // Later slides wait for window load so they don't slow the LCP image on mobile.
                <AfterLoad>
                  <Image src={s.image.src} alt={s.image.alt} fill sizes="100vw" className="object-cover" />
                </AfterLoad>
              )}
              <div aria-hidden className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-x-0 bottom-20 flex justify-center md:bottom-24">
                <Link
                  href={s.cta.href}
                  className="inline-flex min-h-11 animate-rise items-center rounded-full border border-white px-6 text-sm font-semibold text-white transition-colors [animation-delay:160ms] hover:bg-white hover:text-ink"
                >
                  {s.cta.label}
                </Link>
              </div>
            </div>
          ))}
        </RailTrack>
        <RailPrev label={T.prev} className="absolute bottom-20 left-4 z-10 md:top-1/2 md:bottom-auto md:-translate-y-1/2" />
        <RailNext label={T.next} className="absolute right-4 bottom-20 z-10 md:top-1/2 md:bottom-auto md:-translate-y-1/2" />
      </Rail>
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-32 flex flex-col items-center justify-center px-4 text-center">
        {/* Staged entrance: headline, then subtitle 80 ms later (transform + opacity only; the LCP is the photo). */}
        <h1 className="max-w-3xl animate-rise font-display type-h1 text-white">{hero.headline}</h1>
        {hero.sub && <p className="mt-3 max-w-xl animate-rise type-body text-white/90 [animation-delay:80ms]">{hero.sub}</p>}
      </div>
    </div>
  );
}
