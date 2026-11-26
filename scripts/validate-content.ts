// OWNER: A1 content-migrator. Checks /content against the BRIEF §6 A1 rules that typecheck can't see.
// Usage: pnpm tsx scripts/validate-content.ts   (exit 1 with a list of problems)
import { existsSync } from "node:fs";
import path from "node:path";
import { content } from "../content";
import { LEGACY_ROUTES } from "../content/redirects";

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const errors: string[] = [];
const check = (ok: boolean, msg: string) => { if (!ok) errors.push(msg); };

// Service items: copy limits, FAQ flags, cross-links and redirect agreement.
const itemRoute = (category: string, slug: string) =>
  category !== "stays" ? `/${category}/${slug}` : slug === "property-sales" ? "/property-sales" : `/stays/${slug}`;

for (const cat of content.categories) {
  const n = cat.faqs?.length ?? 0;
  check(n >= 4 && n <= 6, `category ${cat.key}: ${n} FAQs (want 4–6)`);
  check(!!cat.faqs?.every((f) => f.needsReview), `category ${cat.key}: every drafted FAQ needs needsReview`);
  const slugs = new Set(cat.items.map((i) => i.slug));
  for (const it of cat.items) {
    const id = `${cat.key}/${it.slug}`;
    check(it.category === cat.key, `${id}: category mismatch`);
    check(words(it.summary) <= 40, `${id}: summary ${words(it.summary)} words (max 40)`);
    check(it.sections.length >= 4 && it.sections.length <= 6, `${id}: ${it.sections.length} sections (want 4–6)`);
    for (const s of it.sections) {
      check(words(s.heading) <= 6, `${id}: heading "${s.heading}" over 6 words`);
      check(words(s.body) <= 45, `${id}: section "${s.heading}" body ${words(s.body)} words (max 45)`);
    }
    check(it.idealFor.length > 0, `${id}: empty idealFor`);
    check(it.faqs.length > 0 && it.faqs.every((f) => f.needsReview), `${id}: FAQs missing or not flagged needsReview`);
    check(it.priceFrom == null && !it.inclusions, `${id}: legacy site has no prices or inclusions`);
    for (const r of it.related) check(slugs.has(r) && r !== it.slug, `${id}: related "${r}" does not resolve`);
    check(it.legacyPath in LEGACY_ROUTES, `${id}: legacyPath ${it.legacyPath} has no redirect`);
    if (!it.isPlaceholder) {
      check(LEGACY_ROUTES[it.legacyPath] === itemRoute(cat.key, it.slug), `${id}: redirect goes to ${LEGACY_ROUTES[it.legacyPath]}, route is ${itemRoute(cat.key, it.slug)}`);
    }
  }
}

// Stays, areas, collections.
const serviceSlugs = new Set(content.categories.flatMap((c) => c.items.map((i) => `${c.key}/${i.slug}`)));
for (const s of content.stays) {
  check(!!s.isPlaceholder || s.images.length > 0, `stay ${s.slug}: no images`);
  for (const a of s.addOns) check(serviceSlugs.has(`${a.category}/${a.slug}`), `stay ${s.slug}: add-on ${a.category}/${a.slug} does not resolve`);
}
check(content.areas.length === 11 && new Set(content.areas.map((a) => a.key)).size === 11, "want 11 unique areas");
for (const a of content.areas) check(words(a.intro) >= 60 && words(a.intro) <= 80, `area ${a.key}: intro ${words(a.intro)} words (want 60–80)`);
check(content.collections.length === 6, "want 6 collections");

// Site rules from BRIEF §3.5.
check(content.site.stats === null, "site.stats must stay null until real figures exist");
check(content.offers.length === 0 && content.testimonials.length === 0, "offers/testimonials must stay empty");
check(content.site.features.length === 8 && content.site.trust.length === 3, "want 8 features and 3 trust items");
check(content.site.nav.length === 6, "want 6 nav groups");
// Placeholder items are hidden in production, so linking them from the nav would ship 404s.
const placeholderRoutes = new Set(content.categories.flatMap((c) => c.items.filter((i) => i.isPlaceholder).map((i) => itemRoute(c.key, i.slug))));
for (const g of content.site.nav) for (const l of [g, ...g.items]) check(!placeholderRoutes.has(l.href), `nav links placeholder route ${l.href}`);
check(content.site.hero.slides.every((sl) => content.media.find((m) => m.src === sl.image.src && !m.hasBakedText)), "hero slides must use text-free images");

// Redirects: all 34 legacy URLs, 301, one hop with optional trailing slash.
check(content.redirects.length === 34, `want 34 redirects, got ${content.redirects.length}`);
check(content.redirects.every((r) => r.statusCode === 301 && r.source.endsWith(".php{/}?")), "redirects must be 301 with {/}? sources");
check(new Set(content.redirects.map((r) => r.source)).size === content.redirects.length, "duplicate redirect sources");

// Every image path exists on disk; no mojibake or raw entities leaked from the crawl.
const walk = (v: unknown, at: string): void => {
  if (typeof v === "string") {
    check(!/�|&[a-z]+;|&#\d+;/i.test(v), `${at}: encoding artefact in "${v.slice(0, 40)}"`);
  } else if (Array.isArray(v)) {
    v.forEach((x, i) => walk(x, `${at}[${i}]`));
  } else if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o.src === "string" && o.src.startsWith("/")) check(existsSync(path.join("public", o.src)), `${at}: missing file public${o.src}`);
    if (typeof o.src === "string" && "alt" in o) check(typeof o.alt === "string" && o.alt.length > 0, `${at}: empty alt`);
    for (const [k, x] of Object.entries(o)) if (k !== "blurDataURL") walk(x, `${at}.${k}`);
  }
};
walk(content, "content");

const real = errors;
if (real.length) {
  console.error(`✗ ${real.length} content problem(s):\n  ${real.join("\n  ")}`);
  process.exit(1);
}
console.log(`✓ content valid: ${content.categories.reduce((n, c) => n + c.items.length, 0)} service items, ${content.stays.length} stays, ${content.areas.length} areas, ${content.redirects.length} redirects, ${content.media.length} media`);
