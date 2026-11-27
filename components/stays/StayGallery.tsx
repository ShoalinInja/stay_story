"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { Button, Modal } from "@/components/primitives";
import { cn } from "@/lib/utils";
import type { MediaRef } from "@/lib/content/types";

type Labels = {
  gallery: string;
  viewPhotos: string;
  /** Pre-rendered "+N More" text (copy functions can't cross the server/client boundary). */
  more: string;
  /** "Photo i of n" for each image. */
  photo: string[];
  prev: string;
  next: string;
};

const MOSAIC_MIN = 5;

/**
 * ≥5 photos: 1 large + 4 small mosaic with "+N More" and a lightbox.
 * <5 photos: single hero with a thumbnail strip (BRIEF §7). Callers pass clean-first images
 * so the "+N More" overlay never sits on a poster with baked-in text.
 */
export function StayGallery({ images, labels }: { images: MediaRef[]; labels: Labels }) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  // Controlled Modal has no trigger, so restore focus to whatever opened it (WCAG 2.4.3).
  const opener = React.useRef<HTMLElement | null>(null);
  const show = (i: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setIndex(i);
    setOpen(true);
  };
  const onOpenChange = (o: boolean) => {
    setOpen(o);
    if (!o) requestAnimationFrame(() => opener.current?.focus());
  };
  if (images.length === 0) return null;

  return (
    <>
      {images.length >= MOSAIC_MIN ? (
        <Mosaic images={images} labels={labels} onOpen={show} />
      ) : (
        <HeroStrip images={images} labels={labels} onOpen={show} />
      )}
      <Lightbox images={images} labels={labels} open={open} onOpenChange={onOpenChange} index={index} setIndex={setIndex} />
    </>
  );
}

function Tile({ img, label, onClick, priority, sizes, className, children }: {
  img: MediaRef; label: string; onClick: () => void; priority?: boolean; sizes: string; className?: string; children?: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className={cn("group relative overflow-hidden bg-surface-2", className)}>
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes={sizes}
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : undefined}
        placeholder={img.blurDataURL ? "blur" : "empty"}
        blurDataURL={img.blurDataURL}
        className="media-zoom group-hover:scale-[1.04] object-cover"
      />
      {children}
    </button>
  );
}

function Mosaic({ images, labels, onOpen }: { images: MediaRef[]; labels: Labels; onOpen: (i: number) => void }) {
  const extra = images.length - MOSAIC_MIN;
  return (
    <div className="relative grid h-[280px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-card md:h-[440px]">
      <Tile img={images[0]} label={labels.photo[0]} onClick={() => onOpen(0)} priority sizes="(min-width: 768px) 600px, 100vw" className="col-span-4 row-span-2 md:col-span-2" />
      {images.slice(1, MOSAIC_MIN).map((img, j) => {
        const i = j + 1;
        const isLast = i === MOSAIC_MIN - 1;
        return (
          <Tile key={img.src + i} img={img} label={isLast && extra > 0 && !img.hasBakedText ? `${labels.photo[i]}, ${labels.more}` : labels.photo[i]} onClick={() => onOpen(i)} sizes="300px" className="hidden md:block">
            {isLast && extra > 0 && !img.hasBakedText && (
              <span className="absolute inset-0 grid place-items-center bg-black/45 text-lg font-semibold text-white">{labels.more}</span>
            )}
          </Tile>
        );
      })}
      <Button variant="pill" size="sm" onClick={() => onOpen(0)} className="absolute right-3 bottom-3 shadow-card">
        <Images aria-hidden />
        {labels.viewPhotos}
      </Button>
    </div>
  );
}

function HeroStrip({ images, labels, onOpen }: { images: MediaRef[]; labels: Labels; onOpen: (i: number) => void }) {
  const [active, setActive] = React.useState(0);
  return (
    <div>
      <div className="relative aspect-[16/9] max-h-[460px] w-full overflow-hidden rounded-card">
        <Tile img={images[active]} label={labels.photo[active]} onClick={() => onOpen(active)} priority sizes="(min-width: 1200px) 1200px, 100vw" className="absolute inset-0 size-full" />
      </div>
      {images.length > 1 && (
        <ul className="mt-2 flex gap-2 overflow-x-auto" aria-label={labels.gallery}>
          {images.map((img, i) => (
            <li key={img.src + i} className="shrink-0">
              <button
                type="button"
                aria-label={labels.photo[i]}
                aria-current={i === active ? "true" : undefined}
                onClick={() => setActive(i)}
                className={cn("relative block h-16 w-24 overflow-hidden rounded-input border-2", i === active ? "border-ink" : "border-transparent")}
              >
                <Image src={img.src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Lightbox({ images, labels, open, onOpenChange, index, setIndex }: {
  images: MediaRef[]; labels: Labels; open: boolean; onOpenChange: (o: boolean) => void; index: number; setIndex: (i: number) => void;
}) {
  const n = images.length;
  const go = (d: number) => setIndex((index + d + n) % n);
  const img = images[index];
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={labels.gallery} description={labels.photo[index]} className="sm:max-w-5xl">
      <div
        className="relative"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(-1);
          if (e.key === "ArrowRight") go(1);
        }}
      >
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-input bg-surface-2">
          <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 960px, 100vw" className="object-contain" />
        </div>
        {n > 1 && (
          <div className="mt-3 flex items-center justify-between">
            <Button variant="icon-circle" aria-label={labels.prev} onClick={() => go(-1)}><ChevronLeft aria-hidden className="size-5" /></Button>
            <p className="type-meta" aria-live="polite">{labels.photo[index]}</p>
            <Button variant="icon-circle" aria-label={labels.next} onClick={() => go(1)}><ChevronRight aria-hidden className="size-5" /></Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
