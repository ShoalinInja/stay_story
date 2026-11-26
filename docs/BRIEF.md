# StayStory.in → Next.js Rebuild — Brief (spec of record)

> Copied verbatim in substance from the owner's brief on 26 Nov 2026. Stack-version facts that supersede it are in `OWNERSHIP.md`.

## 0. Mission
Rebuild staystory.in (Stay Story Goa) in Next.js. The current site is a PHP template with 30 thin pages, no listings and SEO gaps.
1. **Look and behave like StayVista.com.** Copy its *design language* (layout patterns, type pairing, spacing, card anatomy, interactions). **Never** copy StayVista's logo, photos, copy, brand names ("House of StayVista", "Veo", "Vieda"), icons or illustrations.
2. **Carry over all of StayStory's content and services**, with the copy rewritten tighter and more premium.
3. **Lead machine, not instant booking.** Every Book/Reserve pattern becomes **Enquire / Request Callback / WhatsApp**. No payment gateway in v1.
4. **Keep SEO equity.** Every old `.php` URL 301s to its new route.

## 1. Non-negotiables
- Latest Next.js App Router, TypeScript strict. Tailwind, shadcn/ui, embla-carousel-react, react-day-picker, lucide-react, zod, react-hook-form, and framer-motion used sparingly.
- Server Components by default. Use `"use client"` only for interactive leaves.
- `next/image` everywhere, with explicit `sizes`, AVIF/WebP and blur placeholders.
- Fonts are Playfair Display (display) and Inter (UI/body).
- **No content hardcoded in components.** All copy comes from `/content` through `@/lib/content`.
- Agents edit only their owned folders (see OWNERSHIP.md).
- No fake data in production. Placeholder records carry `isPlaceholder: true`, and the prod build fails unless `ALLOW_PLACEHOLDERS=true`. Never show "0k+ Happy Guests" or `0.0★`.
- WCAG 2.2 AA: contrast, focus rings, keyboard paths for the mega-menu, carousels, date picker and modals.
- Each agent finishes with `pnpm typecheck && pnpm lint && pnpm build` green.

## 2. Design system
### 2.1 Tokens
Implemented in `app/globals.css`. The palette is ink #1E1E1E, ink-2 #394050, muted #6D717F, muted-2 #9FA2AE, line #D2D2D2, line-soft #E5E7EA, cream #FAF7F2, cta #1D1C2B, brand #FB9D5C, brand-strong #AD5419 (use it for orange text), brand-tint #FDE6D3, star #E89B00, footer #1E1E1E/#FAF7F2, success #178045, whatsapp #25D366.
Radius 12 for cards and images, 8 for inputs and chips, full for pills. Card shadow lifts on hover with translateY(-2px).
Type: H1 48/56 Playfair 600 (mobile 32/40) · H2 28/36 Playfair 600 · H3 16/24 Inter 600 · body 15/24 · meta 13/20 muted · price 20/28 Inter 700.
Container is 1200px with `px-4 md:px-6`. Sections use `py-12 md:py-16` and alternate surface and cream. Motion is 200ms ease-out. Carousels never autoplay faster than 5s. Respect `prefers-reduced-motion`.

### 2.2 Component anatomy
| Component | Pattern |
|---|---|
| AnnouncementBar | Thin full-width bar, brand-tint→brand gradient, centred offer text, copy-code icon, dismissible (localStorage in try/catch) |
| Header | White, sticky, ~64px. Logo left, centre nav with chevron mega-menus, right: outlined "Get in Touch" pill (phone) and a dark CTA. Shadow on scroll. **Detail-page variant:** compact search pill (Location · Dates · Guests · round search button) in the centre. |
| MegaMenu | 6 service groups with 3–5 items each. 2-col panel: links left, featured image card right. Mobile: full-screen drawer with accordions. |
| HeroCarousel | Full-bleed slides ~520px desktop, centred Playfair headline over a dark scrim, outlined pill "Explore …" CTA, prev/next, looping |
| SearchBar | White floating card overlapping the hero bottom by ~40px, `rounded-2xl`, 4 segments with tiny labels: Where in Goa (areas + stay types combobox) · Check-in→Check-out (range, 2 months desktop, bottom sheet mobile) · Guests (adults/children/rooms steppers) · dark SEARCH. Routes to `/stays?area=&from=&to=&guests=`. |
| CallbackStrip | Peach rounded bar: "Finding the right Goa stay should be easy. We're here to help!" plus a "Request Callback" link that opens the enquiry modal |
| DestinationPicker | "Pick a Destination" H2, custom outlined line icon per Goa area over a peach blob, horizontal scroll with arrows and a progress bar |
| StayCard | Image carousel (dots, 12px top radius); rating pill top-left (hidden if no rating); heart top-right; dark "Best Rated"/"New" badge bottom-right. Body: name (Inter 600), 📍 area, "Up to 12 Guests + 4 Rooms + 4 Baths", hairline, **₹12,676** bold with "Per night + taxes" muted, arrow-circle button. Null price → "Price on request". |
| TabbedRail | H2 plus an underline tab row (All · North Goa · South Goa · Pool Villas …), arrows top-right, horizontal card rail |
| OfferCard | White card, icon tile, "Valid till" pill, 3-line description, dashed code chip, dark "Copy Code" with toast. Tabs: All / Stay / Experience. |
| CollectionTile | Tall 3:4 image, 12px radius, bottom gradient, Playfair white title bottom-left. Horizontal rail. |
| FeatureGrid | "The StayStory Standard": 8 icon+label, 4×2 (2×4 mobile) |
| TrustBlock | "Your Trusted Goa Partner": 3 columns, soft 3D-style icon, bold title, one-line caption, cream bg |
| Stats | 4 counters, only when real (`stats: null` hides) |
| Testimonials | Portrait cards with name and quote, real reviews only, hidden when empty |
| ListYourProperty | Split: 4 benefit bullets with bold lead-ins, image right, dark "Partner with us" CTA (owner leads) |
| SEOFooterGrid | Dark footer. Tab row (Villas · Apartments · Long-term · Experiences · Events · Services) over a 5-col grid of "Villas in Siolim"… links. Then columns Top Areas · Services · About · Support · Contact, social row and legal row. |
| VillaDetail | Breadcrumbs; "View Brochure" pill; gallery mosaic (1 large + 4 small, "+N More", "View Photos" lightbox); sticky section tabs (Overview · Highlights · Policies · Spaces · Reviews · Amenities · Meals · Location · Experiences · FAQs) with scroll-spy; right sticky enquiry card (price/night, "for N rooms", dates, guests, green "Select dates for best price", full-width dark **Enquire Now**, "Connect with host → Request Callback"). Mobile: bottom bar (price + Enquire). |
| Floating actions | Bottom-left WhatsApp and Call. Mobile sticky bottom bar: Call · WhatsApp · Enquire. |

## 3. Content inventory (staystory.in, 26 Nov 2026)
### 3.1 Brand & contact
- Brand "Stay Story", wordmark "Staystory.in", sub-line "VILLA | APARTMENT | HOTEL | PLOT". Logo at `https://www.staystory.in/assets/img/logo.png`. Export as SVG or trace it if possible.
- Positioning: a one-stop provider of stays, travel, experiences, events, dining/concierge and entertainment in Goa, for tourists, long-stay residents and event planners.
- Current H1 "Your Trusted Partner for a Complete Goa Experience". Section "Stay, Travel and Experience Goa with Ease". Baked hero copy: "Luxury Living for Every Short Escape. Stay private, stay comfortable, stay unforgettable."
- About: brings multiple services into one reliable solution in place of separate vendors for accommodation, travel, events and daily needs, and handles every detail from booking to execution. Closing: "Experience Goa with Confidence."
- Why us: all-in-one · local expertise · verified services · transparent processes · personalised solutions.
- Phone +91-8160182809. WhatsApp is **unconfirmed**, so `whatsapp: null`.
- Email kishankumar0520@gmail.com (personal; keep as `contactEmail` so it can be swapped).
- Address: Home no 02, Circle, Pernem, Chopdem, Siolim, Goa 403512 · 15.631582, 73.755411.
- No socials, so `socials: []`.

### 3.2 IA + redirects (each row 301s)
| Category (old) | New | Items old `.php` → new |
|---|---|---|
| Stay `/stay-goa.php` | `/stays` | `villas-goa`→`/stays/villas` · `apartments-hotels-goa`→`/stays/apartments-hotels` · `long-term-rentals-goa`→`/stays/long-term-rentals` · `property-sales-goa`→`/property-sales` |
| Travel `/travel-services-goa.php` | `/travel` | `airport-transfers-goa`→`/travel/airport-transfers` · `chauffeur-services-goa`→`/travel/chauffeur` · `self-drive-cars-goa`→`/travel/self-drive-cars` · `bike-rentals-goa`→`/travel/bike-rentals` |
| Experiences `/experiences-goa.php` | `/experiences` | `yacht-cruises-goa`→`/experiences/yacht-cruises` · `shisha-experience-goa`→`/experiences/shisha` · `workshops-activities-goa`→`/experiences/workshops-activities` · `spiritual-wellness-goa`→`/experiences/wellness` · `vip-club-access-goa`→`/experiences/vip-club-access` |
| Events `/events-celebrations-goa.php` | `/events` | `party-planning-goa`→`/events/party-planning` · `wedding-services-goa`→`/events/weddings` · `bachelor-party-goa`→`/events/bachelor-parties` · `private-events-goa`→`/events/private-events` |
| Dining & Concierge `/dining-concierge-goa.php` | `/concierge` | `private-chef-catering-goa`→`/concierge/private-chef` · `bartenders-mixologists-goa`→`/concierge/bartenders` · `cake-special-requests-goa`→`/concierge/special-requests`, plus items for babysitters and essentials/beverage delivery (mentioned on About) |
| Artists & Entertainment `/artists-entertainment-goa.php` | `/entertainment` | `djs-singers-in-goa`→`/entertainment/djs-singers` · `dancers-performers-goa`→`/entertainment/dancers-performers` · `makeup-styling-goa`→`/entertainment/makeup-styling` · `tattoo-henna-face-art-goa`→`/entertainment/tattoo-henna` |
| Other | | `/about-us.php`→`/about` · `/photo-gallery.php`→`/gallery` · `/contact-us.php`→`/contact` · `/index.php`→`/` |

### 3.3 Page copy pattern
Every service page has an H1, 6–8 H3 blocks with one paragraph each (intro, features, audience, quality/safety, "Why choose Stay Story for X", "Book your X today"), meta title and description, and related cards. **No prices, packages, inclusions, FAQs, vehicle types or listings.** Scrape every page and **restructure** it into `ServiceItem`. Don't paste the paragraph walls.
Captured examples:
- Villas: private pools, spacious living areas, equipped kitchens, elegant interiors; near beaches and nightlife; for families, friends and couples; flexible check-in; add-ons (private chef, housekeeping, event setup, concierge).
- Yacht: private charters with custom routes, sunset cruises on the Arabian Sea, yacht parties (birthdays, anniversaries, bachelor), onboard sound/seating/catering/decor, experienced crew and verified operators.
- Property sales: beachfront villas, apartments and gated communities; end-to-end support from site visits to documentation; rental-income angle; North and South Goa; verified, legally compliant listings.
- Airport transfers: flight tracking, a clean fleet for solo travellers, families and groups, trained local drivers, pre-booked with no haggling, transparent pricing.

### 3.4 Media
- 7 hero banners `/assets/upload/image/banner/{2800241775316876,1103571775316870,2328461775316862,295081775316857,1284321775316851,8664261775316846,4405971775316841}.jpg`. Flag any with baked text (`hasBakedText: true`) and never use those as text-free hero backgrounds.
- 6 category covers `/assets/upload/tourpackage/type/cover/*.png`.
- 16 gallery images `/assets/upload/image/photogallery/*.jpeg`. Write real alt text after viewing each one.
- Scrape every page for more `assets/upload/**` images, download them to `/public/media/legacy/`, convert with sharp to WebP/AVIF, and log them in `content/media-manifest.json` (src, width, height, blurDataURL, alt, usedOn[]).

### 3.5 Gaps: handle them, don't invent
- No listings exist. Seed 6 stays with `isPlaceholder: true`, plus `content/stays/_TEMPLATE.json` and `docs/ADD-A-STAY.md`.
- No stats, so `stats: null`. No testimonials or ratings, so hide those blocks. No offers, so hide the rail.
- No FAQs. Draft 4–6 per category **only from existing page claims**, with `needsReview: true`.

## 4. Data contracts
`lib/content/types.ts` (frozen). The repository is `lib/content/index.ts`.

## 5. Routes
```
/                                Home
/stays                           Listing: filters (area, type, guests, bedrooms, price, amenities), sort
/stays/villas | apartments-hotels | long-term-rentals     Type landing (SEO copy + filtered grid)
/stays/[slug]                    Stay detail
/property-sales                  Sales landing + grid + owner/buyer enquiry
/[category]                      travel | experiences | events | concierge | entertainment
/[category]/[slug]               Service detail
/collections/[key]               pool-villas | group-stays | couples | workation | pet-friendly | party-villas
/areas/[area]                    "Villas in Siolim" etc.
/about /gallery /contact /list-your-property /privacy /terms /thank-you
/api/enquiry                     POST
sitemap.xml robots.txt opengraph-image
```

## 6. Agents (phase gates are hard: the previous phase's outputs exist and `pnpm build` passes)
- **A1 content-migrator:** crawl all 34 legacy URLs. Rewrite each into `ServiceItem` (summary ≤40 words, 4–6 sections with heading ≤6 words and body ≤45 words, `idealFor`, FAQs `needsReview`). Preserve every factual claim and **invent no prices, vehicles, airports or certifications**. Download, optimise and manifest the images. Produce `content/site.ts`, `content/areas.ts` (11 areas, original 60–80 word intro each), 6 placeholder stays, `content/collections.ts`, `content/redirects.ts`, and `content/CONTENT-REPORT.md`.
- **A2 design-system:** primitives: Button (dark, outline, pill, ghost, icon-circle), Chip/Tabs (underline), Badge, RatingPill, PriceBlock, SectionHeader (Playfair H2 + link + arrow slot), Rail (Embla wrapper with arrows, progress bar and keyboard support), Card, Input/Combobox, GuestStepper, DateRangePicker (2-month desktop, bottom-sheet mobile), Sheet/Modal, Toast, Accordion, IconBlob. Plus a `/styleguide` page showing every state.
- **A3 shell-navigation:** AnnouncementBar, Header (+ detail variant), MegaMenu and mobile drawer, Footer with SEOFooterGrid, FloatingActions, MobileBottomBar, Breadcrumbs (JSON-LD).
- **A4 home:** Hero+Search → CallbackStrip → DestinationPicker → Featured Stays TabbedRail → Offers (auto-hide) → "Plan Your Goa" (6 categories as CollectionTiles) → "Choose a Stay Collection" → FeatureGrid (Private Pool · Private Chef · Airport Pickup · Daily Housekeeping · Event Setup · Yacht Add-ons · 24×7 Local Support · Verified Properties) → TrustBlock (All-in-One Goa · Local Experts · Verified & Transparent) → Stats (auto-hide) → Gallery mosaic (8 imgs → /gallery) → ListYourProperty → FAQ → Enquiry CTA band.
- **A5 stays:** StayCard, StayGrid, FilterBar (URL-synced, sidebar desktop and sheet mobile), empty state → enquiry, VillaDetail, lightbox, scroll-spy tabs, sticky EnquiryCard, related stays and add-on rail. `generateStaticParams`.
- **A6 services:** CategoryLanding (hero, item grid, why-us, FAQ, enquiry) and ServiceDetail (hero + summary, "What you get" cards, Ideal-for chips, Inclusions, "Price from"/"Price on request", FAQ, sticky enquiry prefilled with `serviceSlug`, related rail). Validate the category against a whitelist, otherwise `notFound()`.
- **A7 leads-backend:** EnquiryForm variants (stay, service, callback with name + phone only, property-owner, contact) using RHF + a shared zod schema. Indian phone validation (+91 / 10 digits); check-out after check-in and not in the past; guests ≥1. `POST /api/enquiry`: server zod check, honeypot silent drop, 5 per 10 min per IP rate limit (Upstash if `UPSTASH_*`, else in-memory with a warning), UTM/referrer capture. Pluggable sinks that fail independently: Resend → `LEAD_TO_EMAIL`, optional Supabase `enquiries` insert (service role, server-only, migration SQL), optional Google Sheet webhook. Return 200 if ≥1 sink succeeds, else 502 with the Call/WhatsApp fallback. Success: thank-you plus a prefilled `wa.me` link (only when `site.whatsapp`). Fire `generate_lead` when `NEXT_PUBLIC_GTM_ID` is set. **Works without JS** (form posts, then redirects to `/thank-you`).
- **A8 seo-performance:** `generateMetadata` everywhere, canonicals, JSON-LD (TravelAgency+LocalBusiness, LodgingBusiness/VacationRental, Service, FAQPage, BreadcrumbList), dynamic OG, `scripts/check-redirects.ts`, Lighthouse mobile ≥90×4 on `/`, `/stays`, one stay and one service.
- **A9 qa:** Playwright at 375/768/1280: keyboard nav and mega-menu, search → listing, stay enquiry (mocked sinks), service enquiry, callback modal, WhatsApp encoding, 404, every redirect, no placeholders in prod, axe with zero serious/critical issues, styleguide snapshots. Writes `QA-REPORT.md`.

## 7. Edge cases
| Scenario | Behaviour |
|---|---|
| <5 images | Single hero + thumbnail strip instead of the mosaic |
| `pricePerNight` null | "Price on request", no "+ taxes", CTA "Get a Quote" |
| Long-term / for-sale | Show `monthlyRent`/`salePrice`. No date pickers; use "Preferred move-in month" / "Schedule a site visit" |
| Check-out ≤ check-in or past dates | Inline error, submit disabled |
| Guests > every capacity | Empty state "We can combine villas for large groups" → enquiry |
| Legacy URL with query or trailing slash | Still 301s |
| Unknown `/[category]/[slug]` | Branded 404 with search and the 6 category links |
| JS disabled | Nav, listing and enquiry still work |
| Email sink down | Lead lands in another sink; no user error while one succeeded |
| Spam | Honeypot + rate limit; optional Turnstile behind an env flag |
| WhatsApp unconfirmed | `site.whatsapp` null hides the WhatsApp UI |
| Baked-text banners | `hasBakedText: true`; hero uses only clean images, falling back to gallery photos |
| Placeholders in prod | Build fails with the list unless `ALLOW_PLACEHOLDERS=true` |
| Mega-menu on touch | Tap opens, second tap navigates; never hover-only |
| Carousel a11y | Labelled prev/next, `aria-roledescription="carousel"`, no focus traps, pause on hover/focus |

## 8. Definition of done
- [ ] All 34 legacy URLs 301 (script passes)
- [ ] Every page is built from `/content`
- [ ] `/styleguide` matches the tokens; StayVista-like with zero StayVista assets or copy
- [ ] Enquiry works on ≥1 sink, with the WhatsApp handoff and a GA4 event
- [ ] Lighthouse mobile ≥90×4 on the 4 templates; axe has no serious/critical issues
- [ ] `pnpm typecheck && pnpm lint && pnpm build && pnpm test` green
- [ ] README, `docs/ADD-A-STAY.md`, `CONTENT-REPORT.md`, `QA-REPORT.md`
- [ ] Owner punch-list: real villas and photos, WhatsApp, domain email, socials, stats, reviews, reviewed FAQs, Resend/Supabase keys
