# Ownership & Conventions

Contracts frozen at Phase 0. An agent edits **only** its owned paths. Anything else → ask the Lead.
Spec of record: [`docs/BRIEF.md`](docs/BRIEF.md).

| Agent | Phase | Owns |
|---|---|---|
| **Lead** | 0, 4 | `lib/content/types.ts`, `lib/content/index.ts`, `lib/content/placeholders.ts`, `app/globals.css`, `app/layout.tsx` `<html>`/fonts/metadata, `next.config.ts`, `package.json`, `OWNERSHIP.md`, `README.md`, `.claude/**` |
| **A1 content-migrator** | 1 | `content/**`, `public/media/**`, `scripts/**` (except `scripts/check-redirects.ts`), `docs/ADD-A-STAY.md` |
| **A2 design-system** | 1 | `components/ui/**`, `components/primitives/**`, `app/(dev)/styleguide/**`, `hooks/**` |
| **A3 shell-navigation** | 2 | `components/layout/**`, `app/layout.tsx` `<body>` contents, `app/not-found.tsx`, `app/(site)/**` static pages (`about`, `gallery`, `contact`, `privacy`, `terms`, `thank-you`) |
| **A4 home** | 2 | `app/page.tsx`, `components/home/**` |
| **A5 stays** | 2 | `app/stays/**`, `app/property-sales/**`, `app/areas/**`, `app/collections/**`, `app/list-your-property/**`, `components/stays/**` |
| **A6 services** | 2 | `app/(services)/[category]/**`, `components/services/**` |
| **A7 leads-backend** | 2 | `app/api/enquiry/**`, `components/forms/**`, `lib/leads/**`, `.env.example`, `supabase/**` |
| **A8 seo-performance** | 3 | `app/sitemap.ts`, `app/robots.ts`, `**/opengraph-image.tsx`, `lib/seo/**`, `scripts/check-redirects.ts` |
| **A9 qa** | 3 | `tests/**`, `playwright.config.ts`, `QA-REPORT.md` |

## Stack facts (verified Phase 0, 26 Nov 2026)

- **Next.js 16.4.6**, React 19.3, Tailwind 4.3 (CSS-first, no `tailwind.config`), shadcn/ui (`radix-nova` style; `cn` from `@/lib/utils`), zod 4, react-day-picker 10, lucide-react 1.x, framer-motion 14.
- **Read `node_modules/next/dist/docs/` before using any Next API.** This version differs from training data.
- **Cache Components is ON** (`cacheComponents: true`). So:
  - `export const revalidate` / `dynamic` / `fetchCache` **error**. Use `"use cache"` + `cacheLife()` instead.
  - `searchParams`, `cookies()`, `headers()` are request-time: read them inside a component wrapped in `<Suspense>`.
  - `new Date()` / `Math.random()` during prerender fail the build; move them to client components or after `connection()`.
  - Guide: `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`.
- Root layout uses the global `LayoutProps<"/">` / `PageProps<"/route">` helper types.

## Design tokens (`app/globals.css`)

Utilities: `bg-ink text-ink-2 text-muted-text text-muted-2 border-line border-line-soft bg-cream bg-surface bg-surface-2 bg-cta bg-brand text-brand-strong bg-brand-tint text-star bg-footer-bg text-footer-text text-success bg-whatsapp`.
Type: `text-h1 text-h2 text-h3 text-body text-meta text-price`, plus `font-display` (Playfair) and `font-sans` (Inter).
Layout: `container-site` (1200px), `section-y`. Radius: `rounded-card` (12), `rounded-input` (8), `rounded-full`. Shadow: `shadow-card`, `shadow-card-hover`.
**Orange text or links must use `text-brand-strong`.** `--brand` on white fails AA.

## Content rules

- UI reads content **only** through `@/lib/content` (`getStays`, `getStay`, `getCategories`, `getCategory`, `getService`, `getSite`, `getAreas`, `getCollections`, `getOffers`, `getTestimonials`, `getMedia`, `getLegacyRedirects`). Never import `@/content` from components.
- The repository already hides `isPlaceholder` records and `needsReview` FAQs in production. UI must still **hide blocks when data is empty or null** (stats, offers, testimonials, ratings, socials, WhatsApp).
- `pnpm build` throws if placeholder or needsReview content exists and `ALLOW_PLACEHOLDERS !== "true"`. `.env.local` sets it to true for local work; production on Vercel does not.

## Done gate for every agent

`pnpm typecheck && pnpm lint && pnpm build` green before reporting. Touch nothing outside your owned paths, and list any shared-file requests in your report.
