# Owner punch-list: before staystory.in goes live

This is what the Stay Story team needs to supply, confirm or decide. Items marked **🔒 blocks launch** make the production build fail until they are resolved: draft content is never allowed to ship. Running `pnpm build` without `ALLOW_PLACEHOLDERS` prints the exact list.

## 🔒 Content that blocks the production build (98 items, plus legal)

| # | What | Where | How to resolve |
|---|---|---|---|
| 1 | **6 placeholder stays** (sample villas, apartments, a long-term rental and a for-sale villa, with no real listings behind them): casa-siolim, vagator-cliffside-villa, assagao-garden-house, south-goa-beach-apartment, panjim-long-stay-residence, morjim-riverside-villa-for-sale | `content/stays/` | Add real stays (`docs/ADD-A-STAY.md`), then delete these files and remove them from `content/stays/index.ts`. |
| 2 | **2 unconfirmed services**: Babysitters and Essentials delivery. They are not clearly offered on the old site. | `content/categories/concierge.ts` | Confirm each one (remove `isPlaceholder`) or delete it. |
| 3 | **90 FAQs drafted from old-site claims**: home page 6; category pages 28 (stays 5, travel 5, events 5, concierge 5, experiences 4, entertainment 4); 2 on each of the 24 confirmed service and stay-type pages (48); 1 on each placeholder stay and service (8) | `content/site.ts`, `content/categories/*.ts`, `content/stays/*.ts` (`draft(...)`) | Read each one. Approve by changing `draft("Q", "A")` to `{ q: "Q", a: "A" }`, or delete it. |
| 4 | **Privacy policy (7 sections) and Terms (8 sections)**: plain-language drafts, **not legal advice** | `content/legal.ts` | Have them reviewed. Then delete each `needsReview: true`. |

## Business details to supply

| # | What | Why |
|---|---|---|
| 5 | **WhatsApp number** | Every WhatsApp button, the floating action button and the enquiry fallback stay hidden until `site.whatsapp` is set. |
| 6 | **Domain email** (for example `hello@staystory.in`) | The site currently shows the old personal Gmail address (`site.contactEmail`). The lead "from" address also needs a verified domain in Resend. |
| 7 | **Social profile URLs** (Instagram, Facebook and so on) | `site.socials` is empty, so the footer shows no social links. |
| 8 | **Real stats and guest reviews**, if you have them | The stats band and testimonials stay hidden until real data exists. Nothing is invented. |
| 9 | **SVG logo** | Only a PNG exists. An SVG is sharper and lighter. |
| 10 | **Real stay photos**: 5+ landscape photos per stay, at least 1600 px wide, with no text, logos or phone numbers in the image | The old site's photos are mostly posters with baked-in text, so they can't be used in cards, the hero or galleries. |

## Claims to confirm or remove

| # | Claim | Where it appears |
|---|---|---|
| 11 | "24×7 Local Support" and "Daily Housekeeping" | Home features. The old pages never state these in text. |
| 12 | Pet-Friendly Stays collection | There is no pet policy on the old site. Confirm, or the collection should stay empty. |
| 13 | Certified wellness professionals; legally compliant listings; vessel safety compliance and verified operators; flight tracking; "no hidden charges"; strict safety protocols | Service pages and FAQs |
| 14 | Airports served, vehicle types, any "price from" figures | Travel pages currently show "Price on request". |
| 15 | Age policies for shisha and VIP club access; alcohol supply for bartending and delivery | Experiences and Concierge |

## Accounts and keys to set up (no code changes)

| # | What | Notes |
|---|---|---|
| 16 | **At least one lead destination**: Resend (email), Supabase (database) or a sheet webhook | **Without one, the production site cannot receive enquiries.** Every submission shows the phone fallback. See the README under Deploy. |
| 17 | **Upstash Redis** | Spam limit shared across servers. Without it, each server keeps its own limit. |
| 18 | **Vercel project and DNS access** | For the cutover checklist in the README |

## Decisions

| # | Decision | Context |
|---|---|---|
| 19 | **Personal data in logs** | When every sink fails, or none is configured, the server log keeps the full lead (name, phone, email) so it isn't lost. Decide whether that is acceptable, and how long Vercel log retention should be. |
| 20 | **Rate limit behind a non-Vercel proxy** (QA D8) | The limiter keys on the client's `X-Forwarded-For`, which is safe on Vercel because Vercel sets that header. If hosting moves, key it on the platform's real client IP. |
| 21 | **Lighthouse performance target** | Accessibility, best practices and SEO all score 100. Performance scores 83–89 under Lighthouse's simulated throttling and 99 under real throttling. Reaching 90 under simulation needs the date picker, modal and form validation loaded on demand. Re-measure on the Vercel preview first. |
| 22 | **Turnstile CAPTCHA** | Optional. Turning it on blocks no-JS form submissions. |

## Known limits (no action needed unless you disagree)

- Without JavaScript, `/stays` shows every stay. Filtering through the URL (for example from the home search bar) needs JavaScript.
- When a filtered link such as `/stays?area=…` is opened directly, the full list is briefly part of the page before the filtered results replace it in the same response. Changing a filter on the page swaps the results without that flash.
- `/areas` and `/collections` have no index pages, only the individual area and collection pages.
