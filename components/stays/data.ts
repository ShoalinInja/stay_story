"use cache";
// Cached reads for the stays routes. Content ships with each deploy, so "max" is safe;
// when the repo becomes remote (Supabase), add cacheTag()s and revalidate on write.
import { cacheLife } from "next/cache";
import { getAreas, getCategory, getCollections, getService, getStay, getStays } from "@/lib/content";
import type { ServiceItem, ServiceRef, StayFilters } from "@/lib/content/types";

export async function loadStays(f: StayFilters = {}) {
  cacheLife("max");
  return getStays(f);
}

export async function loadStay(slug: string) {
  cacheLife("max");
  return getStay(slug);
}

export async function loadAreas() {
  cacheLife("max");
  return getAreas();
}

export async function loadCollections() {
  cacheLife("max");
  return getCollections();
}

export async function loadStaysCategory() {
  cacheLife("max");
  return getCategory("stays");
}

/** Copy for /stays/villas etc. and /property-sales. */
export async function loadStaysService(slug: string) {
  cacheLife("max");
  return getService("stays", slug);
}

/** A stay's add-ons resolved to service items, dropping refs that don't resolve (e.g. hidden placeholders). */
export async function loadAddOns(refs: ServiceRef[]): Promise<(ServiceItem & { href: string })[]> {
  cacheLife("max");
  const items = await Promise.all(refs.map(async (r) => {
    const item = await getService(r.category, r.slug);
    return item ? { ...item, href: `/${r.category}/${r.slug}` } : null;
  }));
  return items.filter((i) => i !== null);
}
