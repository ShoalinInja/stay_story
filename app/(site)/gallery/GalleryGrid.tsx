"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MediaRef } from "@/lib/content/types";
import { Button, Modal } from "@/components/primitives";
import { UI } from "@/components/layout/copy";

/** Responsive photo grid. Each tile links to the full image (no-JS); with JS it opens a modal lightbox. */
export function GalleryGrid({ photos }: { photos: MediaRef[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const n = photos.length;
  const step = (d: number) => setIndex((i) => (i === null ? i : (i + d + n) % n));
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };
  const current = index === null ? null : photos[index];

  return (
    <>
      <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.src}>
            <a
              href={p.src}
              aria-label={UI.gallery.open(p.alt)}
              onClick={(e) => {
                e.preventDefault();
                setIndex(i);
              }}
              className="group relative block aspect-[4/3] overflow-hidden rounded-card bg-cream"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 290px, (min-width: 768px) 33vw, 50vw"
                placeholder={p.blurDataURL ? "blur" : "empty"}
                blurDataURL={p.blurDataURL}
                className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
              />
            </a>
          </li>
        ))}
      </ul>
      <Modal
        open={current !== null}
        onOpenChange={(o) => !o && setIndex(null)}
        title={index === null ? UI.pages.gallery : UI.gallery.count(index + 1, n)}
        className="sm:max-w-4xl"
      >
        {current && (
          <div onKeyDown={onKeyDown} className="flex flex-col gap-4">
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-card bg-ink">
              <Image src={current.src} alt={current.alt} fill sizes="(min-width: 896px) 832px, 100vw" className="object-contain" />
            </div>
            <p className="type-meta">{current.alt}</p>
            <div className="flex justify-between">
              <Button variant="icon-circle" aria-label={UI.gallery.prev} onClick={() => step(-1)}>
                <ChevronLeft aria-hidden />
              </Button>
              <Button variant="icon-circle" aria-label={UI.gallery.next} onClick={() => step(1)}>
                <ChevronRight aria-hidden />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
