import type { Metadata } from "next";
import { getMediaList } from "@/lib/content";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { UI } from "@/components/layout/copy";
import { GalleryGrid } from "./GalleryGrid";

export const metadata: Metadata = { title: UI.pages.gallery, description: UI.gallery.intro };

export default async function GalleryPage() {
  const photos = await getMediaList({ idPrefix: "gallery" });
  return (
    <main className="container-site section-y">
      <Breadcrumbs items={[{ label: UI.pages.gallery, href: "/gallery" }]} className="mb-6" />
      <h1 className="type-h1">{UI.pages.gallery}</h1>
      <p className="mt-3 max-w-2xl type-body text-ink-2">{UI.gallery.intro}</p>
      {photos.length > 0 && (
        <GalleryGrid photos={photos.map(({ src, alt, width, height, blurDataURL }) => ({ src, alt, width, height, blurDataURL }))} />
      )}
    </main>
  );
}
