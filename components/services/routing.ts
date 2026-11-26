import { notFound } from "next/navigation";
import { getCategory } from "@/lib/content";
import type { ServiceCategory, ServiceItem } from "@/lib/content/types";
import { isServiceCategory } from "./whitelist";

/** Whitelisted category or notFound(). Checks the whitelist before the repo, since getCategory("stays") resolves. */
export async function loadCategory(slug: string): Promise<ServiceCategory> {
  if (!isServiceCategory(slug)) notFound();
  const category = await getCategory(slug);
  if (!category) notFound();
  return category;
}

export async function loadService(categorySlug: string, slug: string): Promise<{ category: ServiceCategory; item: ServiceItem }> {
  const category = await loadCategory(categorySlug);
  const item = category.items.find((i) => i.slug === slug);
  if (!item) notFound();
  return { category, item };
}
