import Image from "next/image";
import type { ReactNode } from "react";
import type { MediaRef } from "@/lib/content/types";

type Props = { title: string; lead: string; image: MediaRef; children?: ReactNode };

// Images are posters with baked text: framed at natural aspect beside the H1, never under text or cropped.
export function ServiceHero({ title, lead, image, children }: Props) {
  return (
    <section className="bg-cream section-y">
      <div className="container-site grid items-center gap-8 md:grid-cols-[1fr_minmax(0,420px)]">
        <div>
          <h1 className="type-h1 text-ink">{title}</h1>
          <p className="mt-4 max-w-prose type-body text-ink-2">{lead}</p>
          {children}
        </div>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 768px) 420px, 100vw"
          priority
          placeholder={image.blurDataURL ? "blur" : "empty"}
          blurDataURL={image.blurDataURL}
          className="mx-auto h-auto w-full max-w-[420px] rounded-card object-contain shadow-card"
        />
      </div>
    </section>
  );
}
