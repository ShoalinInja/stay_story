"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaRef } from "@/lib/content/types";

type CarouselProps = {
  href: string;
  images: MediaRef[];
  label: string;
  dotLabels: string[];
  priority?: boolean;
};

/** Swipeable photo strip with dots. Without JS the first photo shows and the rest stay clipped. */
export function CardCarousel({ href, images, label, dotLabels, priority }: CarouselProps) {
  const [viewportRef, api] = useEmblaCarousel({ loop: images.length > 1 });
  const [index, setIndex] = React.useState(0);
  // Only photos up to one past the furthest slide visited get an <Image>: a grid of 5-photo cards
  // would otherwise fetch every photo up front (they sit inside the native lazy-load distance).
  const [reached, setReached] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const sync = () => {
      const i = api.selectedScrollSnap();
      setIndex(i);
      setReached((r) => Math.max(r, i + 1));
    };
    api.on("select", sync).on("reInit", sync);
    return () => {
      api.off("select", sync).off("reInit", sync);
    };
  }, [api]);

  return (
    <div aria-roledescription="carousel" aria-label={label} className="relative">
      <div ref={viewportRef} className="overflow-hidden rounded-t-card">
        <div className="flex touch-pan-y">
          {images.map((img, i) => (
            // Duplicate of the title link for pointer users; keyboard users reach the stay via the title.
            <Link key={img.src + i} href={href} tabIndex={-1} aria-label={i <= reached ? undefined : img.alt} className="relative aspect-[4/3] min-w-0 shrink-0 grow-0 basis-full bg-surface-2">
              {i <= reached && (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  placeholder={img.blurDataURL ? "blur" : "empty"}
                  blurDataURL={img.blurDataURL}
                  fetchPriority={priority && i === 0 ? "high" : undefined}
                  loading={priority && i === 0 ? "eager" : undefined}
                  className="object-cover"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-0.5">
          {images.map((img, i) => (
            <button
              key={img.src + i}
              type="button"
              aria-label={dotLabels[i]}
              aria-current={i === index ? "true" : undefined}
              onClick={() => api?.scrollTo(i)}
              className="grid size-6 place-items-center"
            >
              <span className={cn("size-1.5 rounded-full bg-white/60 shadow transition-all", i === index && "w-3 bg-white")} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Local-only "save" toggle; nothing is persisted yet. */
export function HeartButton({ label, className }: { label: string; className?: string }) {
  const [saved, setSaved] = React.useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={saved}
      onClick={() => setSaved((s) => !s)}
      className={cn("grid size-11 place-items-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/40", className)}
    >
      <Heart aria-hidden className={cn("size-5", saved && "fill-brand text-brand")} />
    </button>
  );
}
