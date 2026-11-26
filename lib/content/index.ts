import "server-only";
import { content } from "@/content";
import { placeholdersAllowed } from "./placeholders";
import type {
  Area, Collection, ContentBundle, Faq, LegacyRedirect, MediaEntry, Offer,
  ServiceCategory, ServiceItem, Site, Stay, StayFilters, Testimonial,
} from "./types";

export type * from "./types";

/**
 * Typed content repository. v1 is file-backed (/content). A later SupabaseContentRepo
 * implements the same functions; UI imports only from "@/lib/content".
 * Async on purpose so the backing store can become remote without touching callers.
 */

const showDraft = placeholdersAllowed();
const reviewed = (faqs: Faq[] = []) => (showDraft ? faqs : faqs.filter((f) => !f.needsReview));
const live = <T extends { isPlaceholder?: boolean }>(xs: T[]) => (showDraft ? xs : xs.filter((x) => !x.isPlaceholder));

function visibleStay(s: Stay): Stay { return { ...s, faqs: reviewed(s.faqs) } }
function visibleItem(i: ServiceItem): ServiceItem { return { ...i, faqs: reviewed(i.faqs) } }
function visibleCategory(c: ServiceCategory): ServiceCategory {
  return { ...c, faqs: reviewed(c.faqs), items: live(c.items).map(visibleItem) };
}

function matches(s: Stay, f: StayFilters): boolean {
  return (
    (!f.area || s.area === f.area) &&
    (!f.region || s.region === f.region) &&
    (!f.type || s.type === f.type) &&
    (!f.guests || s.maxGuests >= f.guests) &&
    (!f.bedrooms || s.bedrooms >= f.bedrooms) &&
    (f.minPrice == null || (s.pricePerNight ?? Infinity) >= f.minPrice) &&
    (f.maxPrice == null || (s.pricePerNight ?? -Infinity) <= f.maxPrice) &&
    (!f.amenities?.length || f.amenities.every((a) => s.amenities.includes(a))) &&
    (!f.collection || s.collections.includes(f.collection)) &&
    (f.featured == null || s.featured === f.featured)
  );
}

const SORTS: Record<NonNullable<StayFilters["sort"]>, (a: Stay, b: Stay) => number> = {
  featured: (a, b) => Number(b.featured) - Number(a.featured),
  "price-asc": (a, b) => (a.pricePerNight ?? Infinity) - (b.pricePerNight ?? Infinity),
  "price-desc": (a, b) => (b.pricePerNight ?? -Infinity) - (a.pricePerNight ?? -Infinity),
  guests: (a, b) => b.maxGuests - a.maxGuests,
};

export function filterStays(all: Stay[], f: StayFilters = {}): Stay[] {
  return all.filter((s) => matches(s, f)).toSorted(SORTS[f.sort ?? "featured"]);
}

export async function getStays(f: StayFilters = {}): Promise<Stay[]> {
  return filterStays(live(content.stays), f).map(visibleStay);
}
export async function getStay(slug: string): Promise<Stay | null> {
  const s = live(content.stays).find((x) => x.slug === slug);
  return s ? visibleStay(s) : null;
}
export async function getCategories(): Promise<ServiceCategory[]> {
  return content.categories.map(visibleCategory);
}
export async function getCategory(slug: string): Promise<ServiceCategory | null> {
  const c = content.categories.find((x) => x.slug === slug);
  return c ? visibleCategory(c) : null;
}
export async function getService(category: string, slug: string): Promise<ServiceItem | null> {
  const c = await getCategory(category);
  return c?.items.find((i) => i.slug === slug) ?? null;
}
export async function getSite(): Promise<Site> {
  return { ...content.site, faqs: reviewed(content.site.faqs) };
}
export async function getAreas(): Promise<Area[]> { return content.areas }
export async function getCollections(): Promise<Collection[]> { return content.collections }
export async function getOffers(): Promise<Offer[]> { return content.offers }
export async function getTestimonials(): Promise<Testimonial[]> { return content.testimonials }
export async function getMedia(id: string): Promise<MediaEntry | null> {
  return content.media.find((m) => m.id === id) ?? null;
}
export function getLegacyRedirects(): LegacyRedirect[] { return content.redirects }

export type { ContentBundle };
