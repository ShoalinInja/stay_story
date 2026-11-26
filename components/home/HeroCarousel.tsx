import Image from "next/image";
import Link from "next/link";
import { Rail, RailNext, RailPrev, RailTrack } from "@/components/primitives";
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
              <Image
                src={s.image.src}
                alt={s.image.alt}
                fill
                sizes="100vw"
                preload={i === 0}
                placeholder={s.image.blurDataURL ? "blur" : "empty"}
                blurDataURL={s.image.blurDataURL}
                className="object-cover"
              />
              <div aria-hidden className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-x-0 bottom-20 flex justify-center md:bottom-24">
                <Link
                  href={s.cta.href}
                  className="inline-flex min-h-11 items-center rounded-full border border-white px-6 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
                >
                  {s.cta.label}
                </Link>
              </div>
            </div>
          ))}
        </RailTrack>
        <RailPrev label={T.prev} className="absolute top-1/2 left-4 z-10 -translate-y-1/2" />
        <RailNext label={T.next} className="absolute top-1/2 right-4 z-10 -translate-y-1/2" />
      </Rail>
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-32 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="max-w-3xl font-display type-h1 text-white">{hero.headline}</h1>
        {hero.sub && <p className="mt-3 max-w-xl type-body text-white/90">{hero.sub}</p>}
      </div>
    </div>
  );
}
