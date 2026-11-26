import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { copy } from "@/components/stays/copy";
import { loadAreas, loadStays } from "@/components/stays/data";
import { StayGrid, StaysEmpty } from "@/components/stays/StayGrid";

// Await params outside Suspense so unknown slugs get a real 404 status (a streamed notFound() is a 200 + noindex).
// Every real slug is prerendered by generateStaticParams, so only unknown URLs block.
export const instant = false;

export async function generateStaticParams() {
  return (await loadAreas()).map((a) => ({ area: a.key }));
}

async function findArea(key: string) {
  return (await loadAreas()).find((a) => a.key === key) ?? null;
}

export async function generateMetadata({ params }: PageProps<"/areas/[area]">): Promise<Metadata> {
  const area = await findArea((await params).area);
  return area ? { title: { absolute: area.seo.title }, description: area.seo.description, keywords: area.seo.keywords, alternates: { canonical: `/areas/${area.key}` } } : {};
}

export default async function AreaPage({ params }: PageProps<"/areas/[area]">) {
  const area = await findArea((await params).area);
  if (!area) notFound();
  const stays = await loadStays({ area: area.key });

  return (
    <main id="main" className="container-site section-y flex-1">
      <Breadcrumbs items={[{ label: copy.detail.breadcrumbsStays, href: "/stays" }, { label: area.name, href: `/areas/${area.key}` }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="type-h1 font-display text-ink">{copy.area.heading(area.name)}</h1>
        <p className="mt-3 type-body text-ink-2">{area.intro}</p>
      </header>
      <div className="mt-10">
        {stays.length > 0 ? (
          <StayGrid stays={stays} />
        ) : (
          <StaysEmpty title={copy.empty.noneInArea(area.name)} form={{ variant: "stay", source: `area:${area.key}` }} />
        )}
      </div>
    </main>
  );
}
