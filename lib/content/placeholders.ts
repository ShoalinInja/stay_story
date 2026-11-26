import type { ContentBundle } from "./types";

/** Lists every placeholder / unreviewed record so the production build can refuse to ship them. */
export function findPlaceholders(c: ContentBundle): string[] {
  const out: string[] = [];
  for (const s of c.stays) {
    if (s.isPlaceholder) out.push(`stay:${s.slug}`);
    s.faqs.forEach((f, i) => f.needsReview && out.push(`stay:${s.slug}:faq[${i}]`));
  }
  for (const cat of c.categories) {
    cat.faqs?.forEach((f, i) => f.needsReview && out.push(`category:${cat.key}:faq[${i}]`));
    for (const it of cat.items) {
      if (it.isPlaceholder) out.push(`service:${cat.key}/${it.slug}`);
      it.faqs.forEach((f, i) => f.needsReview && out.push(`service:${cat.key}/${it.slug}:faq[${i}]`));
    }
  }
  c.site.faqs.forEach((f, i) => f.needsReview && out.push(`site:faq[${i}]`));
  return out;
}

export const placeholdersAllowed = (): boolean =>
  process.env.ALLOW_PLACEHOLDERS === "true" || process.env.NODE_ENV !== "production";
