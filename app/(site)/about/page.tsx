import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/site";
import Image from "next/image";
import { CircleCheck } from "lucide-react";
import { getMedia, getSite } from "@/lib/content";
import { Button } from "@/components/primitives";
import { EnquiryModal } from "@/components/forms/EnquiryModal";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { UI } from "@/components/layout/copy";
import { HostBlock } from "@/components/home/proof";

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getSite();
  return pageMetadata({ title: UI.pages.about, description: about.headline, path: "/about" });
}

export default async function AboutPage() {
  const [{ about, host }, collage] = await Promise.all([getSite(), getMedia("about")]);
  const paragraphs = about.body.split(/\n\s*\n/).filter(Boolean);
  return (
    <main id="main">
      <section className="container-site section-y grid items-start gap-10 md:grid-cols-[1fr_400px]">
        <div>
          <Breadcrumbs items={[{ label: UI.pages.about, href: "/about" }]} className="mb-6" />
          <h1 className="type-h1">{about.headline}</h1>
          {paragraphs.map((p) => <p key={p} className="mt-4 type-body text-ink-2">{p}</p>)}
        </div>
        {collage && (
          // The collage has baked-in text: shown whole and framed, never cropped or overlaid.
          <div className="rounded-card bg-cream p-4">
            <Image
              src={collage.src}
              alt={collage.alt}
              width={collage.width}
              height={collage.height}
              sizes="(min-width: 768px) 400px, 100vw"
              placeholder={collage.blurDataURL ? "blur" : "empty"}
              blurDataURL={collage.blurDataURL}
              className="h-auto w-full rounded-card object-contain"
            />
          </div>
        )}
      </section>
      <HostBlock host={host} />
      <section className="bg-cream">
        <div className="container-site section-y">
          <h2 className="type-h2">{UI.about.why}</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {about.whyChooseUs.map((w) => (
              <li key={w} className="flex items-start gap-3 rounded-card bg-surface p-4 shadow-card">
                <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-success" />
                <span className="type-body text-ink">{w}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <p className="type-h2">{about.closing}</p>
            <EnquiryModal variant="contact" source="about" trigger={<Button variant="dark">{UI.enquire}</Button>} />
          </div>
        </div>
      </section>
    </main>
  );
}
