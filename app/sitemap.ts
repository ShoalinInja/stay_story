import type { MetadataRoute } from "next";
import { getAreas, getCategories, getCollections, getStays } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo/site";

// Static pages that always exist. /styleguide, /thank-you and /api are deliberately absent.
const STATIC = [
  "/", "/stays", "/stays/villas", "/stays/apartments-hotels", "/stays/long-term-rentals", "/property-sales",
  "/list-your-property", "/about", "/gallery", "/contact", "/privacy", "/terms",
];

// The repository already hides placeholders unless ALLOW_PLACEHOLDERS, so this lists only live routes.
// No lastModified: content ships with the deploy, and new Date() would break prerendering.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stays, categories, areas, collections] = await Promise.all([getStays(), getCategories(), getAreas(), getCollections()]);
  const services = categories.filter((c) => c.key !== "stays"); // stays items are the /stays/* landings above
  const paths = [
    ...STATIC,
    ...services.flatMap((c) => [`/${c.slug}`, ...c.items.map((i) => `/${c.slug}/${i.slug}`)]),
    ...stays.map((s) => `/stays/${s.slug}`),
    ...areas.map((a) => `/areas/${a.key}`),
    ...collections.map((c) => `/collections/${c.key}`),
  ];
  return paths.map((p) => ({ url: absoluteUrl(p) }));
}
