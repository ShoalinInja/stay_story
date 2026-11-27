import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/primitives";
import type { ServiceItem } from "@/lib/content/types";

type Props = { item: ServiceItem; categorySlug: string; headingLevel?: "h2" | "h3" };

// Heroes are square posters with baked text: show the whole image, no overlay, no crop.
export function ServiceCard({ item, categorySlug, headingLevel: Heading = "h3" }: Props) {
  return (
    <Card interactive asChild className="reveal h-full">
      <article className="relative flex flex-col">
        <Image
          src={item.hero.src}
          alt={item.hero.alt}
          width={item.hero.width}
          height={item.hero.height}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
          placeholder={item.hero.blurDataURL ? "blur" : "empty"}
          blurDataURL={item.hero.blurDataURL}
          className="media-zoom aspect-square w-full bg-cream object-contain group-hover/card:scale-[1.04]"
        />
        <div className="flex flex-1 flex-col gap-2 p-4">
          <Heading className="type-h3 text-ink">
            <Link href={`/${categorySlug}/${item.slug}`} className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ring">
              {item.title}
            </Link>
          </Heading>
          <p className="type-meta line-clamp-3 text-muted-text">{item.summary}</p>
          <ArrowRight aria-hidden className="mt-auto size-5 self-end text-ink" />
        </div>
      </article>
    </Card>
  );
}
