# Owner punch-list: before staystory.in goes live

This is what the Stay Story team needs to supply, confirm or decide. Items marked **🔒 blocks launch** make the production build fail until they are resolved: draft content is never allowed to ship. Running `pnpm build` without `ALLOW_PLACEHOLDERS` prints the exact list.

## 🔒 Content that blocks the production build (86 items, plus legal)

| # | What | Where | How to resolve |
|---|---|---|---|
| 1 | **Stays: done, not blocking.** The sample stays are gone; the site lists 3 real villas: 4 BHK Luxury Villa with Pool, 4 BHK Premium Villa with Pool (same shoot, photos reordered) and 3 BHK Luxury Villa with Pool (Siolim). All three are in Siolim. Still to send (optional): each villa's exact map pin; the pages point to Siolim village centre for now. | `content/stays/` | Send the Google Maps pins; set `location` in each file. |
| 2 | **2 unconfirmed services**: Babysitters and Essentials delivery. They are not clearly offered on the old site. | `content/categories/concierge.ts` | Confirm each one (remove `isPlaceholder`) or delete it. |
| 3 | **84 FAQs drafted from old-site claims**: home page 6; category pages 28 (stays 5, travel 5, events 5, concierge 5, experiences 4, entertainment 4); 2 on each of the 24 confirmed service and stay-type pages (48); 1 on each placeholder service (2) | `content/site.ts`, `content/categories/*.ts`, `content/stays/*.ts` (`draft(...)`) | Read each one. Approve by changing `draft("Q", "A")` to `{ q: "Q", a: "A" }`, or delete it. |
| 4 | **Privacy policy (7 sections) and Terms (8 sections)**: plain-language drafts, **not legal advice** | `content/legal.ts` | Have them reviewed. Then delete each `needsReview: true`. |

## Business details to supply

| # | What | Why |
|---|---|---|
| 5 | **WhatsApp number**: confirm +91 88281 91510 is on WhatsApp | It is set as `site.whatsapp`, so every WhatsApp button and the post-enquiry hand-off use it. If the number isn't on WhatsApp, set `whatsapp: null` in `content/site.ts` to hide them. |
| 6 | **Domain email** (for example `hello@staystory.in`) | The site shows a personal Gmail address (`site.contactEmail`). A domain address looks more trustworthy, and verifying the domain in Resend lets leads be sent from it. |
| 7 | **Social profile URLs** (Instagram, Facebook and so on) | `site.socials` is empty, so the footer shows no social links. |
| 8 | **Trust content**: real data only. Each slot is built and stays hidden until you fill it. | The content check rejects data that doesn't look real. See *Trust content* below. |
| 9 | **SVG logo** | Only a PNG exists. An SVG is sharper and lighter. |
| 10 | **Real stay photos** (done for all 3 villas; needed for each new stay you add): 5+ landscape photos per stay, at least 1600 px wide, with no text, logos or phone numbers in the image | The old site's photos are mostly posters with baked-in text, so they can't be used in cards, the hero or galleries. |

### Trust content: where each piece goes

| What you supply | Put it in | Shows up as |
|---|---|---|
| Google rating, review count and your Google reviews link | `content/site.ts` → `reviews: { rating: 4.8, count: 112, url: "https://…" }` | "★ 4.8 on Google · 112 reviews" under the hero headline, and "Read all 112 reviews on Google" above the guest quotes |
| How fast you really reply | `content/site.ts` → `replyTime: "within 30 minutes, 9 am–9 pm"` | "Replies within …" in the hero, and "We usually reply …" under every enquiry button, after sending, and on the thank-you page |
| 3+ real guest reviews (first name, words, month, stay) | `content/index.ts` → `testimonials: [{ name: "Priya S.", quote: "…", source: "google", date: "2026-10", stay: "Casa Siolim" }]` | "What Guests Say" on the home page (first 3) |
| Host or founder: name, role, 2–3 lines, a real photo | Photo in `public/media/`, registered in `content/media-manifest.json`; then `content/site.ts` → `host: { name, role, bio, photo: media("host-photo") }` | "Meet Your Host" on the home and About pages |
| Real numbers (years, stays hosted, guests) | `content/site.ts` → `stats: [{ label: "Guests hosted", value: "2,400+" }]` | The numbers band on the home page |

Copy reviews word for word and only with the guest's permission (Google reviews are public, but ask anyway). Never round a rating up.

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
| 16 | **Resend API key** (free): sign up with the Gmail that should receive leads, then set `RESEND_API_KEY` and `LEAD_TO_EMAIL` in Vercel. A sheet webhook is optional. | **Without it, the production site cannot email you enquiries.** Visitors still get the WhatsApp hand-off and phone fallback. See the README under Deploy. |
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

- Without JavaScript, `/stays` shows every stay. Filtering through the URL (for example from a footer link such as `/stays?type=apartment`) needs JavaScript.
- When a filtered link such as `/stays?area=…` is opened directly, the full list is briefly part of the page before the filtered results replace it in the same response. Changing a filter on the page swaps the results without that flash.
- `/areas` and `/collections` have no index pages, only the individual area and collection pages.
