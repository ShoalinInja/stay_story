import type { ContentBundle } from "./content/types";

/**
 * Which URLs exist. Used by proxy.ts so unknown paths get a real 404 *status*:
 * with Cache Components the prerendered shell starts the response at 200, so a
 * notFound() inside a page can't change it (Next docs: loading.md "Status codes").
 *
 * ponytail: STATIC_TOP is hand-kept. A new top-level static route must be added here
 * or it 404s — A9's E2E route sweep catches that.
 */
const STATIC_TOP = new Set([
  "about", "gallery", "contact", "privacy", "terms", "thank-you", "stays", "property-sales",
  "areas", "collections", "list-your-property", "styleguide",
]);
const STAY_TYPE_LANDINGS = ["villas", "apartments-hotels", "long-term-rentals"];
// Metadata image routes (opengraph-image, icon …) may hang off any page.
const METADATA_SEGMENT = /^(opengraph-image|twitter-image|icon|apple-icon)(-\w+)?$/;

export type RouteIndex = { categories: Map<string, Set<string>>; nested: Map<string, Set<string>> };

export function buildRouteIndex(c: ContentBundle, allowDraft: boolean): RouteIndex {
  const live = <T extends { isPlaceholder?: boolean }>(xs: T[]) => xs.filter((x) => allowDraft || !x.isPlaceholder);
  const categories = new Map(
    c.categories
      .filter((cat) => cat.key !== "stays") // stays items are served by /stays/* and /property-sales
      .map((cat) => [cat.slug, new Set(live(cat.items).map((i) => i.slug))]),
  );
  const nested = new Map<string, Set<string>>([
    ["stays", new Set([...STAY_TYPE_LANDINGS, ...live(c.stays).map((s) => s.slug)])],
    ["areas", new Set(c.areas.map((a) => a.key))],
    ["collections", new Set(live(c.collections).map((x) => x.key))],
  ]);
  return { categories, nested };
}

export function isKnownPath(pathname: string, idx: RouteIndex): boolean {
  const segs = pathname.split("/").filter(Boolean);
  if (segs.at(-1) && METADATA_SEGMENT.test(segs.at(-1)!)) segs.pop();
  const [first, second, ...rest] = segs;
  if (!first) return true; // "/"
  if (first === "api") return true; // route handlers 404 themselves
  if (rest.length) return false; // no page route is deeper than two segments
  if (!second) return STATIC_TOP.has(first) || idx.categories.has(first);
  return idx.nested.get(first)?.has(second) ?? idx.categories.get(first)?.has(second) ?? false;
}
