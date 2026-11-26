import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { copy } from "@/components/stays/copy";
import { loadCollections, loadStays } from "@/components/stays/data";
import { StayGrid, StaysEmpty } from "@/components/stays/StayGrid";

// Await params outside Suspense so unknown slugs get a real 404 status (a streamed notFound() is a 200 + noindex).
// Every real slug is prerendered by generateStaticParams, so only unknown URLs block.
export const instant = false;

export async function generateStaticParams() {
  return (await loadCollections()).map((c) => ({ key: c.key }));
}

async function findCollection(key: string) {
  return (await loadCollections()).find((c) => c.key === key) ?? null;
}

export async function generateMetadata({ params }: PageProps<"/collections/[key]">): Promise<Metadata> {
  const c = await findCollection((await params).key);
  return c ? { title: { absolute: c.seo.title }, description: c.seo.description, alternates: { canonical: `/collections/${c.key}` } } : {};
}

export default async function CollectionPage({ params }: PageProps<"/collections/[key]">) {
  const c = await findCollection((await params).key);
  if (!c) notFound();
  const stays = await loadStays({ collection: c.key });

  return (
    <main id="main" className="container-site section-y flex-1">
      <Breadcrumbs items={[{ label: copy.detail.breadcrumbsStays, href: "/stays" }, { label: c.title, href: `/collections/${c.key}` }]} />
      <header className="mt-6 grid items-center gap-8 md:grid-cols-[1fr_380px]">
        <div>
          <h1 className="type-h1 font-display text-ink">{c.title}</h1>
          <p className="mt-3 type-body text-ink-2">{c.description}</p>
        </div>
        {/* Text sits beside the image, never on it (some media has baked-in text). */}
        <Image
          src={c.image.src}
          alt={c.image.alt}
          width={c.image.width}
          height={c.image.height}
          placeholder={c.image.blurDataURL ? "blur" : "empty"}
          blurDataURL={c.image.blurDataURL}
          sizes="(min-width: 768px) 380px, 100vw"
          priority
          className="aspect-[4/3] w-full rounded-card object-cover"
        />
      </header>
      <div className="mt-10">
        {stays.length > 0 ? (
          <StayGrid stays={stays} />
        ) : (
          <StaysEmpty title={copy.empty.noneInCollection} form={{ variant: "stay", source: `collection:${c.key}` }} />
        )}
      </div>
    </main>
  );
}
