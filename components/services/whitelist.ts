import type { ServiceCategory, ServiceItem } from "@/lib/content/types";

// "stays" is excluded: its items are A5's /stays/* landings and /property-sales.
export const SERVICE_CATEGORIES = ["travel", "experiences", "events", "concierge", "entertainment"] as const;
export type ServiceCategorySlug = (typeof SERVICE_CATEGORIES)[number];

export function isServiceCategory(slug: string): slug is ServiceCategorySlug {
  return (SERVICE_CATEGORIES as readonly string[]).includes(slug);
}

/** `related` slugs resolved within the category; unknown or hidden (placeholder) slugs are skipped. */
export function resolveRelated(category: ServiceCategory, item: ServiceItem): ServiceItem[] {
  return item.related.flatMap((slug) => category.items.find((i) => i.slug === slug && i.slug !== item.slug) ?? []);
}
