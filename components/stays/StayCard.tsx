// CONTRACT STUB (Lead). A5 owns the implementation (BRIEF §2.2 StayCard); keep the props signature stable.
import Image from "next/image";
import Link from "next/link";
import { PriceBlock } from "@/components/primitives";
import type { Stay } from "@/lib/content/types";

export type StayCardProps = {
  stay: Stay;
  /** true for the first above-the-fold card only (LCP). */
  priority?: boolean;
  className?: string;
};

export function StayCard({ stay, priority, className }: StayCardProps) {
  const img = stay.images[0];
  return (
    <Link href={`/stays/${stay.slug}`} className={className}>
      {img && <Image src={img.src} alt={img.alt} width={img.width} height={img.height} priority={priority} sizes="(min-width: 768px) 33vw, 85vw" />}
      <h3 className="type-h3">{stay.name}</h3>
      <PriceBlock amount={stay.pricePerNight} />
    </Link>
  );
}
