import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadAddOns, loadAreas, loadStay, loadStays } from "@/components/stays/data";
import { StayDetail } from "@/components/stays/StayDetail";

// Cache Components requires ≥1 param. In production there may be no live stays yet,
// so fall back to a sentinel that resolves to notFound().
const NONE = "__none__";
const RELATED_MAX = 6;

// Await params outside Suspense so unknown slugs get a real 404 status (a streamed notFound() is a 200 + noindex).
// Every real slug is prerendered by generateStaticParams, so only unknown URLs block.
export const instant = false;

export async function generateStaticParams() {
  const stays = await loadStays();
  return stays.length ? stays.map((s) => ({ slug: s.slug })) : [{ slug: NONE }];
}

export async function generateMetadata({ params }: PageProps<"/stays/[slug]">): Promise<Metadata> {
  const stay = await loadStay((await params).slug);
  if (!stay) return {};
  const cover = stay.images.find((i) => !i.hasBakedText);
  return {
    title: stay.seo?.title ? { absolute: stay.seo.title } : stay.name,
    description: stay.seo?.description ?? stay.headline,
    alternates: { canonical: `/stays/${stay.slug}` },
    openGraph: cover ? { images: [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt }] } : undefined,
  };
}

export default async function StayPage({ params }: PageProps<"/stays/[slug]">) {
  const { slug } = await params;
  const stay = await loadStay(slug);
  if (!stay) notFound();

  const [areas, all, addOns] = await Promise.all([loadAreas(), loadStays(), loadAddOns(stay.addOns)]);
  const others = all.filter((s) => s.slug !== stay.slug);
  // Same region first, then the rest.
  const related = [...others.filter((s) => s.region === stay.region), ...others.filter((s) => s.region !== stay.region)].slice(0, RELATED_MAX);

  return <StayDetail stay={stay} area={areas.find((a) => a.key === stay.area)} addOns={addOns} related={related} />;
}
