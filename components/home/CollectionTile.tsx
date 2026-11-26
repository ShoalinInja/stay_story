import Image from "next/image";
import Link from "next/link";
import type { MediaRef } from "@/lib/content";
import { cn } from "@/lib/utils";

export type CollectionTileProps = {
  href: string;
  title: string;
  image: MediaRef;
  /** "overlay": 3:4 photo, gradient, title on image. "below": square, uncropped, title under it (required for posters). */
  layout?: "overlay" | "below";
  className?: string;
};

export function CollectionTile({ href, title, image, layout = "overlay", className }: CollectionTileProps) {
  // Posters carry text in their pixels: never overlay or crop them.
  if (layout === "below" || image.hasBakedText) {
    return (
      <Link href={href} className={cn("group block", className)}>
        <span className="relative block aspect-square overflow-hidden rounded-card bg-cream shadow-card transition-shadow group-hover:shadow-card-hover">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 280px, 60vw"
            className={image.hasBakedText ? "object-contain" : "object-cover"}
          />
        </span>
        <span className="mt-3 block font-display text-lg font-semibold text-ink group-hover:underline">{title}</span>
      </Link>
    );
  }
  return (
    <Link href={href} className={cn("group relative block aspect-[3/4] overflow-hidden rounded-card shadow-card", className)}>
      <Image
        src={image.src}
        alt=""
        fill
        sizes="(min-width: 1024px) 280px, 60vw"
        className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
      />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent" />
      <span className="absolute inset-x-4 bottom-4 font-display text-xl font-semibold text-white">{title}</span>
    </Link>
  );
}
