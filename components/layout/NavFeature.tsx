import Image from "next/image";
import Link from "next/link";
import type { NavGroup } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type Feature = NonNullable<NavGroup["feature"]>;

/**
 * Mega-menu feature card. Always framed with the title beneath: most feature images are posters
 * with baked-in text (hasBakedText), so they are shown whole (object-contain) and never overlaid.
 */
export function NavFeature({ feature, onNavigate }: { feature: Feature; onNavigate?: () => void }) {
  const { image, title, href } = feature;
  return (
    <Link href={href} onClick={onNavigate} className="group block rounded-card">
      <span className="relative block aspect-[4/3] overflow-hidden rounded-card bg-cream">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="280px"
          placeholder={image.blurDataURL ? "blur" : "empty"}
          blurDataURL={image.blurDataURL}
          className={cn(
            "media-zoom group-hover:scale-[1.04]",
            image.hasBakedText ? "object-contain" : "object-cover",
          )}
        />
      </span>
      <span className="mt-2 block type-h3 text-ink group-hover:underline">{title}</span>
    </Link>
  );
}
