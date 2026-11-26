# Stay Story Goa — staystory.in

The Next.js rebuild of staystory.in covers villas, stays, travel, experiences, events, concierge and entertainment in Goa. Visitors **enquire**; there is no booking or payment. A lead goes to email, Supabase and a webhook, with WhatsApp and phone as fallbacks.

- **Stack:** Next.js 16 (App Router, Cache Components, Turbopack), React 19, TypeScript strict, Tailwind 4, shadcn/ui (Radix), zod and react-hook-form, Playwright and axe.
- **Content** lives in typed TypeScript files under `content/`. There is no CMS and no database for content.
- **Spec of record:** [`docs/BRIEF.md`](docs/BRIEF.md). Who owns which folder: [`OWNERSHIP.md`](OWNERSHIP.md).

## Quick start

```bash
pnpm install
cp .env.example .env.local   # ALLOW_PLACEHOLDERS=true is already set for local work
pnpm dev                     # http://localhost:3000
```

| Script | What it does |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` / `pnpm start` | Production build and server. The build **fails** if draft content would ship (see below). |
| `pnpm typecheck` | `next typegen && tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm test` | Unit tests (`lib/**`, `components/**`), then content validation (`scripts/validate-content.ts`) |
| `pnpm test:e2e` | Playwright and axe against a prior build: run `ALLOW_PLACEHOLDERS=true pnpm build` first. Uses port 3219; override with `E2E_PORT`. Install the browser once with `npx playwright install chromium`. |
| `pnpm check:redirects [baseUrl]` | Checks that all 34 legacy `.php` URLs answer with a single 301, in three forms: plain, trailing slash and with a query. |

The full gate before any merge is `pnpm typecheck && pnpm lint && pnpm test && pnpm build`.

## Environment variables

Every variable is documented in [`.env.example`](.env.example). In short:

| Variable | Required in production | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical origin, used for metadata, OG images and the sitemap. Default `https://www.staystory.in`. |
| `ALLOW_PLACEHOLDERS` | **no, leave it unset** | `true` lets placeholder stays and unreviewed FAQs build. Local and preview only. |
| `GOOGLE_SITE_VERIFICATION` | no | Search Console token. Empty means the legacy token is used. |
| `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL` | at least one sink | Lead email. The from-address must be on a domain verified in Resend. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | at least one sink | Lead storage in `public.enquiries`. Run `supabase/migrations/0001_enquiries.sql` first. **Server-only key.** |
| `SHEET_WEBHOOK_URL` | optional sink | Sends each lead as a JSON POST, for example to Google Sheets. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | recommended | Rate limit shared across instances: 5 enquiries per 10 minutes per IP. Without it each instance keeps its own in-memory limit. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | optional | Cloudflare Turnstile. Turning it on breaks no-JS form posts. |
| `NEXT_PUBLIC_GTM_ID` | optional | GTM. A successful enquiry pushes a `generate_lead` event. |

`/api/enquiry` returns 200 when **at least one** sink accepts the lead. When none do, it returns 502, and the visitor sees the phone (and WhatsApp, once set) fallback. A no-JS form post is redirected (303) to `/thank-you` or `/enquiry-error`.

## Content

```
content/
  site.ts              brand, contact (phone, WhatsApp, email), nav, hero, home FAQs, SEO
  categories/*.ts      stays, travel, experiences, events, concierge, entertainment, and their service items
  stays/*.ts           one file per stay, registered in stays/index.ts (+ _TEMPLATE.json)
  areas.ts             area landing pages (/areas/<key>)
  collections.ts       curated collections (/collections/<key>)
  redirects.ts         the 34 legacy .php → new route 301s
  legal.ts             privacy policy and terms
  media-manifest.json  every image, with size, blur placeholder and a hasBakedText flag
```

- **Types** are frozen in [`lib/content/types.ts`](lib/content/types.ts). Pages read content only through `lib/content` (server-only).
- **No copy is hardcoded in components.** Page copy lives in `content/`. Small UI labels live in each feature's `components/*/copy.ts`.
- **Images with text baked into the pixels** (the legacy posters, flagged `hasBakedText`) are never cropped or overlaid with text. They are kept out of the home hero, and clean photos always come first in cards and galleries.

### Draft content is blocked in production

Some content is marked `isPlaceholder: true` (sample stays, unconfirmed services) or `needsReview: true` (drafted FAQs created with `draft(q, a)` in `content/faq.ts`, and the legal sections). It is **hidden at runtime and fails `pnpm build`** unless `ALLOW_PLACEHOLDERS=true`. The error lists every offending record. To approve an FAQ, replace `draft("Q", "A")` with `{ q: "Q", a: "A" }`. To approve a legal section, delete its `needsReview` flag.

### Add a stay

Follow [`docs/ADD-A-STAY.md`](docs/ADD-A-STAY.md), written for the owner: photos go in `public/media/stays/<slug>/`, then copy `content/stays/casa-siolim.ts`, register the file in `content/stays/index.ts`, and run `pnpm test`. Delete the placeholder stays once real ones exist.

### Add a service

1. Add an item to the right `content/categories/<category>.ts` `items` array. Copy an existing item: it needs `slug`, `category`, `title`, `hero`, `summary` (40 words max), 4–6 `sections`, `idealFor`, `faqs`, `related` and `seo`. `priceFrom` and `inclusions` are optional. Set `legacyPath: ""`, because a new service has no old `.php` page.
2. The page appears at `/<category>/<slug>`, and the sitemap and route index pick it up automatically.
3. Run `pnpm test` (content validation) and `pnpm build`.

A **new top-level static page** (for example `app/(site)/careers`) must also be added to `STATIC_TOP` in [`lib/routing.ts`](lib/routing.ts), or `proxy.ts` will 404 it. The E2E drift tests catch this.

### How routing works

- **Unknown URLs.** `proxy.ts` gives unknown URLs a real 404 status. Under Cache Components, `notFound()` inside a prerendered page cannot change the 200 status.
- **Trailing slashes.** A trailing slash 308s to the slashless URL.
- **Legacy URLs.** These are 301s from `next.config.ts` (`content/redirects.ts`), which run before the proxy. The result is one hop, even for `/old.php/` with a trailing slash.

## Deploy (Vercel)

1. Import the repo into Vercel. The framework is Next.js and pnpm is detected from `packageManager`, so no build settings need changing.
2. Set the environment variables above for **Production**, and **never** set `ALLOW_PLACEHOLDERS` there. Previews may use `ALLOW_PLACEHOLDERS=true` to show draft content.
3. **Supabase:** create a project, run `supabase/migrations/0001_enquiries.sql` (it enables RLS and revokes all table access from the `anon` and `authenticated` roles, so only the server key can write), and copy the URL and service-role key.
4. **Resend:** verify the sending domain (`staystory.in`: add the SPF, DKIM and DMARC records it gives you), then set `LEAD_FROM_EMAIL` on that domain.
5. **Upstash:** create a Redis database and set the REST URL and token.
6. Deploy. On the preview URL:
   - Send a test enquiry and confirm it arrives at every sink.
   - Run `pnpm check:redirects https://<preview-url>`.
   - Run Lighthouse on `/`, `/stays`, one stay and one service.

## DNS cutover checklist

Before:
- [ ] The production build passes **without** `ALLOW_PLACEHOLDERS`. That requires the owner punch-list items below that block the build.
- [ ] A test lead reaches email, Supabase and the sheet from the Vercel production deployment (`*.vercel.app`).
- [ ] `pnpm check:redirects https://<prod>.vercel.app` passes.
- [ ] Lower the DNS TTL on `staystory.in` and `www` to 300 s at least 24 h ahead.
- [ ] Note the existing MX, TXT (SPF, Google verification) and any mail records, and **keep them**. Only the web records change.

Cutover:
- [ ] In Vercel → Domains, add `www.staystory.in` (primary) and `staystory.in` (redirect to www).
- [ ] At the registrar, point the apex `A` record and the `www` `CNAME` at the values Vercel shows on the Domains page.
- [ ] Wait for Vercel to issue TLS on both hosts.

After:
- [ ] Check that `http://`, the apex and `www` all reach `https://www.staystory.in` in one or two hops.
- [ ] Spot-check old URLs: `https://www.staystory.in/villas-goa.php` should 301 to its new page.
- [ ] In Search Console, confirm the property still verifies, then submit `https://www.staystory.in/sitemap.xml`.
- [ ] Watch Search Console's coverage and 404 reports for two weeks. Add any legacy URL that shows up to `content/redirects.ts`.
- [ ] Keep the old host's files for 30 days in case a rollback is needed (repoint DNS).
- [ ] Raise the TTL back.

## Owner punch-list

The full list, with what blocks the production build, is in [`docs/OWNER-PUNCHLIST.md`](docs/OWNER-PUNCHLIST.md).

## Reports

- [`content/CONTENT-REPORT.md`](content/CONTENT-REPORT.md): how the legacy content was migrated and rewritten, page by page.
- [`QA-REPORT.md`](QA-REPORT.md): E2E and axe results, defects and fixes, Lighthouse.
- [`docs/ADD-A-STAY.md`](docs/ADD-A-STAY.md): the owner's guide to adding a stay.
