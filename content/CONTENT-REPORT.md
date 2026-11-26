# Content report: staystory.in migration (A1)

Crawled 26 Nov 2026. All 34 legacy URLs returned 200. The raw extract (H1, H3+paragraph blocks, meta, image URLs) is in `content/_legacy/*.json`. Re-run with `pnpm tsx scripts/crawl-legacy.ts`.

> **Count note:** BRIEF §6 says "30 legacy URLs", but the §3.2 table lists **34**: 6 category pages, 24 item pages and 4 other pages. All 34 are crawled and redirected.

## How the copy was restructured

The legacy pages each have an H1 and 6–8 paragraph-wall blocks, usually ending with "Why choose Stay Story" and "Book today". Each page became a `ServiceItem` with:

- a summary of at most 40 words;
- 4–6 sections, each with a heading of at most 6 words and a body of at most 45 words;
- `idealFor` chips;
- 2 drafted FAQs with `needsReview: true`;
- related items and SEO metadata.

The generic "Why choose / Book today" paragraphs were merged into the category `whyUs` and the enquiry CTA instead of being repeated on every page. Every factual claim below appears on the legacy page cited. No prices, packages, inclusions, vehicle models, airports, stats or reviews were added.

`scripts/validate-content.ts` enforces the word limits, FAQ counts, redirects, cross-links, image files and alt text.

## Counts

| | |
|---|---|
| Service items | 26: 24 legacy pages plus 2 placeholder items (babysitters, essentials delivery) |
| Categories | 6, each with intro, 3 `whyUs` entries and 4–5 FAQs |
| Stays | 6, all `isPlaceholder: true` |
| Areas | 11, with original 61–66 word intros |
| Collections | 6 |
| Redirects | 34, all 301 with `{/}?` |
| Images | 85 legacy images plus the logo |
| `needsReview` FAQs | 90 |
| `isPlaceholder` records | 8 (6 stays + 2 service items) |

A production build without `ALLOW_PLACEHOLDERS=true` fails and lists these 98 entries.

---

## Page by page

### Core pages

| Legacy | New | Old claims kept | New structure | Open questions |
|---|---|---|---|---|
| `/index.php` | `/` | H1 "Your Trusted Partner for a Complete Goa Experience"; serves travellers, residents and event planners; the six service lines | `site.hero` (H1 kept, new sub-line), `site.features`, `site.trust`, 6 site FAQs | The legacy counters showed "0k+ Happy Guests" etc., so `stats: null`. Are there real numbers? |
| `/about-us.php` | `/about` | One platform instead of separate vendors; local expertise; well-connected network; verified services; transparent processes; personalised solutions; "booking to execution"; essentials and beverage delivery; closing line "Experience Goa with Confidence." | `site.about` (headline, 3-paragraph body, 5 `whyChooseUs` items, closing) | The About collage reads "With Kishan at the helm". Should the founder appear on the new About page? |
| `/photo-gallery.php` | `/gallery` | 16 photos | `media-manifest.json` ids `gallery-01`…`gallery-16`, with real alt text | Which property is in these photos? They appear to show **one villa**. |
| `/contact-us.php` | `/contact` | Phone, email, address, map | `site.phone`, `site.contactEmail`, `site.address` | Confirm the address order ("Home no 02, Circle, Pernem, Chopdem, Siolim 403512"). Swap the Gmail address for a domain email. Is WhatsApp the same number? |

### Stays (`content/categories/stays.ts`)

These items hold the copy for the `/stays/*` type landings and `/property-sales`.

| Legacy | New | Old claims kept | Open questions |
|---|---|---|---|
| `/stay-goa.php` | `/stays` | Curated stays for every travel style; short getaways, long stays and investment; quality and personalised service | — |
| `/villas-goa.php` | `/stays/villas` | Private pools, spacious living, equipped kitchens, elegant interiors; near beaches and nightlife; groups, families and couples; flexible check-in; add-ons (private chef, housekeeping, event setup, concierge); verified properties | Is housekeeping **daily** (the "Daily Housekeeping" feature tile) or on request? |
| `/apartments-hotels-goa.php` | `/stays/apartments-hotels` | Furnished apartments with kitchens; hotels with housekeeping, room service and front desk; budget to premium; short and multi-week stays; competitive pricing | — |
| `/long-term-rentals-goa.php` | `/stays/long-term-rentals` | Furnished apartments, villas and homes; reliable internet and work-friendly setups; monthly rentals and extended leases; North and South Goa; transparent agreements | — |
| `/property-sales-goa.php` | `/property-sales` | Beachfront villas, apartments and gated communities; selection, site visits, documentation and transaction; rental-income potential; verified, **legally compliant** listings; fair pricing | Please confirm "legally compliant" is a claim you can stand behind for every listing. |

### Travel (`content/categories/travel.ts`)

| Legacy | New | Old claims kept | Open questions |
|---|---|---|---|
| `/travel-services-goa.php` | `/travel` | Transfers, chauffeurs, self-drive cars, bikes; maintained vehicles; professional drivers; transparent pricing | — |
| `/airport-transfers-goa.php` | `/travel/airport-transfers` | Drivers **track flight schedules**; clean fleet for solo travellers, families and groups; trained local drivers; pre-booked with no haggling; **no hidden charges**; support team | Which airport(s) do you serve? **No airport is named anywhere.** Confirm flight tracking. |
| `/chauffeur-services-goa.php` | `/travel/chauffeur` | Luxury and premium cars, sedan to spacious vehicles; hours, full day or several days; **strict safety protocols**; luggage help | Which vehicles? (none named) |
| `/self-drive-cars-goa.php` | `/travel/self-drive-cars` | Hatchbacks to SUVs; daily, weekly and extended plans; minimal documentation; quick handover; regular maintenance | Required documents and deposit? |
| `/bike-rentals-goa.php` | `/travel/bike-rentals` | Scooters and motorbikes; daily, weekly and extended plans; pickup or delivery depending on availability; no hidden charges | Are helmets included? (The poster says so; the page does not.) |

### Experiences (`content/categories/experiences.ts`)

| Legacy | New | Old claims kept | Open questions |
|---|---|---|---|
| `/experiences-goa.php` | `/experiences` | Curated, safe, reliable experiences; strong local network; exclusive access | — |
| `/yacht-cruises-goa.php` | `/experiences/yacht-cruises` | Private charters with custom routes; sunset cruises on the Arabian Sea; parties for birthdays, anniversaries and bachelor groups; seating, music and safety features; catering and décor on request; experienced crews; **verified operators**; **vessels comply with safety standards** | Departure point(s), capacity and duration? |
| `/shisha-experience-goa.php` | `/experiences/shisha` | Setup at villa, apartment or private space; curated flavours; cleaned equipment; disposable accessories; team sets up and maintains | Is there an age policy (18+/21+) we should state? |
| `/workshops-activities-goa.php` | `/experiences/workshops-activities` | Painting, pottery and DIY crafts; cooking classes, cultural sessions, storytelling; team-building; experienced instructors; verified providers | — |
| `/spiritual-wellness-goa.php` | `/experiences/wellness` | Yoga for all levels; meditation and mindfulness; holistic therapies; single or multi-day plans; **certified professionals** | Please confirm the "certified" claim (which certification?). |
| `/vip-club-access-goa.php` | `/experiences/vip-club-access` | Priority entry; reserved tables; exclusive events and DJ nights; birthdays and bachelor groups; real-time help | — |

### Events (`content/categories/events.ts`)

| Legacy | New | Old claims kept | Open questions |
|---|---|---|---|
| `/events-celebrations-goa.php` | `/events` | Parties, weddings, bachelor **and bachelorette** experiences, private events; trusted vendors and venues | — |
| `/party-planning-goa.php` | `/events/party-planning` | Birthdays, anniversaries, themed events; villas, beachfront and indoor venues; décor, lighting, seating; DJs and performers; catering and bartenders; on-site management | — |
| `/wedding-services-goa.php` | `/events/weddings` | End-to-end planning; beachfront, villa and indoor venues; florals, stage and themes; vendor network (caterers, photographers, entertainers, MUAs); guest accommodation, transport and scheduling | — |
| `/bachelor-party-goa.php` | `/events/bachelor-parties` | Packages built around group size and budget; villa parties with décor and music; yacht parties; VIP club entry and tables; DJs, bartenders, catering, transport, adventure activities | The poster mentions "Casino fun", which the page does not. Offer it? |
| `/private-events-goa.php` | `/events/private-events` | Personal, corporate and intimate events; AV equipment; catering and entertainment; vendor management and on-site support | — |

### Dining & Concierge (`content/categories/concierge.ts`)

| Legacy | New | Old claims kept | Open questions |
|---|---|---|---|
| `/dining-concierge-goa.php` | `/concierge` | Private chefs and catering; bartenders; **babysitters** (experienced, trustworthy); cakes and special requests; reservations and last-minute requests | — |
| `/private-chef-catering-goa.php` | `/concierge/private-chef` | Chefs at villa or apartment; breakfast to multi-course dinners; Goan, Indian and international menus; dietary needs; full-service catering; fresh ingredients and hygiene | — |
| `/bartenders-mixologists-goa.php` | `/concierge/bartenders` | Signature and classic cocktails; setup, equipment, glassware and staff; custom drinks menus | Who supplies the alcohol, and are there licence requirements to mention? |
| `/cake-special-requests-goa.php` | `/concierge/special-requests` | Custom cakes via skilled bakers; romantic room décor and surprise setups; gifts and flowers; on-time delivery | — |
| *(dining page paragraph)* | `/concierge/babysitters` | Experienced, trustworthy caregivers | **Placeholder.** Confirm vetting, children's ages, hours and areas, or drop the service. Not linked in the nav until confirmed. |
| *(About page sentence)* | `/concierge/essentials-delivery` | Delivery of essentials, beverages and daily needs | **Placeholder.** What exactly is delivered and where? Is alcohol included (licensing)? Not linked in the nav until confirmed. |

### Artists & Entertainment (`content/categories/entertainment.ts`)

| Legacy | New | Old claims kept | Open questions |
|---|---|---|---|
| `/artists-entertainment-goa.php` | `/entertainment` | DJs, singers, dancers, makeup, tattoo/henna/face art; experienced and verified artists | — |
| `/djs-singers-in-goa.php` | `/entertainment/djs-singers` | Crowd-reading DJs; acoustic, Bollywood and international singers; custom playlists; sound systems with setup, testing and operation | — |
| `/dancers-performers-goa.php` | `/entertainment/dancers-performers` | Contemporary, cultural, themed and stage shows; choreography, costumes and staging; stage and sound help | The poster shows fire shows and belly dancers. Offer them? |
| `/makeup-styling-goa.php` | `/entertainment/makeup-styling` | Natural to HD makeup; hair styling and grooming; bridal and pre-wedding; on location at villa, apartment or hotel; hygiene standards | — |
| `/tattoo-henna-face-art-goa.php` | `/entertainment/tattoo-henna` | Temporary tattoos; traditional and modern henna; face art for all ages; skin-safe materials | — |

---

## Images (`content/media-manifest.json`, alt text in `content/media-meta.json`)

I viewed all 85 legacy images and wrote alt text for each.

- **Only the 16 gallery photos are clean.** Every one of the 69 banners and covers has text baked in: headlines, "I provide…" copy, the phone number and icon strips. All 69 are flagged `hasBakedText: true`.
- The hero slides, collection tiles and the Stays cover/item heroes therefore use gallery photos. Other service heroes, category covers and mega-menu features use the matching cover poster, because no clean alternative exists. **These must not have headings overlaid** (see Lead requests).
- The covers and banners look AI-generated, and several show claims that are **not on the pages**: "24/7 pickup & support", "24/7 guest support", "Helmets included", "Insured vehicles", "Casino fun", "Room/villa babysitting", "Healthy cuisine", "Fire shows", and a property spec ("3 Bedroom · 2 Living Room · 2 Bathroom"). None of these were used in the copy.
- The gallery appears to be a single villa, and the 6 placeholder stays reuse those photos. **Real photography per property is the top content need.**
- WebP files are capped at 1920 px wide for banners, 1600 px for gallery images and 1200 px for covers, at quality 78. The total is 7.8 MB, with a 16 px blur placeholder for each image. Originals are in `public/media/legacy/_raw/`, which is gitignored.
- The logo is saved as `public/media/brand/logo.png` plus `logo.webp` (383×149). It is a raster PNG; an SVG trace was not attempted. **Request an SVG from the designer.**
- `usedOn` records where each image appeared on the **legacy** site, mapped to the matching new route. It does not record where the new content uses the image.

## Redirects

`content/redirects.ts` has 34 rows, all `statusCode: 301`, with sources written as `/x.php{/}?`. They are **validated structurally only**; no runtime 301 has been observed yet. A8 should confirm that `/villas-goa.php/` (with the trailing slash, and with a query string) reaches `/stays/villas` in **one** 301, with no framework trailing-slash redirect firing first.

## Lead requests

1. **Baked-text images in `hero`, `cover` and `feature.image`.** These fields use baked-text posters that are only 500×500 or 400×400:
   - 20 service-item `hero` images (every non-stays item);
   - 5 category `cover` images (all except Stays);
   - 5 `site.nav[].feature.image` (all except Stays).

   `MediaRef` has no `hasBakedText`, so A3, A4 and A6 cannot tell these apart and may overlay titles on them. Ask: add `hasBakedText?: boolean` to `MediaRef` (A1 will populate it from the manifest), or have UI agents render these fields as framed card images with no text overlay. Fallback if neither: A1 swaps them to gallery ids. That would put villa interiors on non-stay pages, which is misleading, so it is not done by default.
2. **Wire `scripts/validate-content.ts` into `pnpm test`.** The `test` glob only covers `lib/**`. Suggested: `"test": "tsx --test 'lib/**/*.test.ts' && tsx scripts/validate-content.ts"`.
3. **Update BRIEF §6 from 30 to 34 legacy URLs**, so `scripts/check-redirects.ts` (A8) expects 34.
4. **Add a repository helper for listing media by prefix**, e.g. `getMediaList(prefix)`. Without it, `/gallery` and the home gallery mosaic cannot list `gallery-*` images; the repository only exposes `getMedia(id)`.
5. **Fix the fresh-checkout typecheck.** `pnpm typecheck` fails until a build has generated `LayoutProps`, so `typecheck && lint && build` breaks on a clean clone. Consider `next typegen` before `tsc`.
6. **Exclude `stays` from A6's service whitelist.** `getCategories()` now returns `stays` with 4 items. A5 reads the type-landing copy with `getService("stays", "villas" | "apartments-hotels" | "long-term-rentals" | "property-sales")`.
7. **Carry the legacy `google-site-verification` meta tag over (A8)** so Search Console keeps working. The tag is in the `<head>` of every live legacy page.
8. **Resolve icon names.** `icon` strings in `sections`, `features` and `trust` are lucide-react kebab-case names (e.g. `chef-hat`, `plane-landing`), and nothing maps them to components yet.
9. **Add a placeholder flag to `Collection`.** It has none, so the pet-friendly collection ships live even though the copy is now conditional.

## New structure per service item

Generated from `content/`. Each item also has `idealFor`, `related` and `seo`.

| Item | Summary words | Sections (headings) | FAQs |
|---|---|---|---|
| `stays/villas` | 25 | Space and privacy · Close to the action · Made for every group · Easy, flexible booking · Add-ons on request | 2 |
| `stays/apartments-hotels` | 28 | Furnished apartments · Hotels with full service · Locations that fit you · Short or extended stays · Verified and well kept | 2 |
| `stays/long-term-rentals` | 23 | Move-in ready homes · Built for remote work · Flexible terms · North or South Goa · Transparent agreements | 2 |
| `stays/property-sales` | 24 | Homes and investments · Guided start to finish · Rental income potential · Prime locations · Verified, compliant listings | 2 |
| `travel/airport-transfers` | 24 | Timed to your flight · Vehicles for every group · Drivers who know Goa · No haggling · Clear pricing, real support | 2 |
| `travel/chauffeur` | 26 | Professional chauffeurs · Premium vehicle options · Business, leisure, events · Your schedule, your plan · Safety first | 2 |
| `travel/self-drive-cars` | 22 | Cars for every trip · Go where you like · Flexible plans · Quick, simple handover · Safe and reliable | 2 |
| `travel/bike-rentals` | 23 | Scooters and motorbikes · Made for Goa's lanes · Budget-friendly plans · Pickup or delivery · Ride with confidence | 2 |
| `experiences/yacht-cruises` | 24 | Private charters · Sunset on the Arabian Sea · Parties on the water · Onboard comforts · Safe hands | 2 |
| `experiences/shisha` | 25 | Delivered to your space · Curated flavours · Made for gatherings · Clean and safe · Hands-free hosting | 2 |
| `experiences/workshops-activities` | 27 | Creative workshops · Culture and local life · Group and team fun · Shaped around you · Trusted providers | 2 |
| `experiences/wellness` | 26 | Yoga for every level · Meditation and mindfulness · Holistic therapies · Your own wellness plan · Calm settings, expert guides | 2 |
| `experiences/vip-club-access` | 28 | Skip the queue · Tables and seating · Events and DJ nights · Made for celebrations · Local help on the night | 2 |
| `events/party-planning` | 23 | Planned around you · Venue and setup · Music and entertainment · Food and drinks · Fully managed | 2 |
| `events/weddings` | 28 | End-to-end planning · Beach, villa or indoors · Décor and styling · Trusted vendors · Guests looked after | 2 |
| `events/bachelor-parties` | 25 | Tailored to your crew · Private villa parties · Yacht celebrations · Club nights, sorted · Add-ons on tap | 2 |
| `events/private-events` | 22 | Any size, any occasion · Venue and setup · Corporate-ready · Hospitality and entertainment · Managed on the day | 2 |
| `concierge/private-chef` | 27 | A chef at your stay · Menus made for you · Catering for events · Quality on every plate · Daily meals or one night | 2 |
| `concierge/bartenders` | 26 | Signature cocktails · Full bar setup · A menu for your event · Any occasion · Experienced staff | 2 |
| `concierge/special-requests` | 22 | Cakes made to order · Surprise setups · Flowers and gifts · On time, as planned · Pairs with your event | 2 |
| `concierge/babysitters` *(placeholder)* | 19 | Peace of mind · Made for family trips · Pairs with your plans · How to arrange it | 1 |
| `concierge/essentials-delivery` *(placeholder)* | 24 | Daily needs, delivered · More time for Goa · Part of one service · How to arrange it | 1 |
| `entertainment/djs-singers` | 27 | DJs who read the crowd · Live vocals · Your sound, your way · Professional sound · Solo set to full setup | 2 |
| `entertainment/dancers-performers` | 25 | Styles for every stage · Choreographed for you · Keeps guests engaged · Polished execution · Staging support | 2 |
| `entertainment/makeup-styling` | 27 | Every look, done well · Hair and grooming · Bridal and events · We come to you · Clean and hygienic | 2 |
| `entertainment/tattoo-henna` | 24 | Temporary tattoos · Henna, old and new · Face art for all ages · Designed to your theme · Safe materials | 2 |



## Claims the brief requires but the legacy pages don't support

| Where | Text | Status |
|---|---|---|
| `site.features` | "24×7 Local Support" | Required by BRIEF §6 A4. It appears only on poster images, not in page copy. **Owner to confirm.** |
| `site.features` | "Daily Housekeeping" | The pages say "housekeeping" (villa add-on, hotel service) but never "daily". **Owner to confirm.** |
| `collections` | "Pet-Friendly Stays" | Required by the type contract. No pet policy exists on the legacy site. **Owner to confirm, or the collection should stay empty.** |
| `areas` | 11 area intros | Original general-knowledge copy about each area. It makes no claims about Stay Story inventory. |

## Owner punch-list

1. Real villas and photos (5+ clean photos each), then delete the 6 placeholder stays (`docs/ADD-A-STAY.md`).
2. WhatsApp number, domain email and social profile URLs.
3. Real stats and reviews, if any (otherwise those blocks stay hidden).
4. Review all 90 FAQs and remove `needsReview` from each one you approve.
5. Confirm or remove: babysitters, essentials and beverage delivery, 24×7 support, daily housekeeping, pet-friendly stays.
6. Verify the strong claims: certified wellness professionals; legally compliant listings; vessel safety compliance and verified operators; flight tracking; "no hidden charges"; strict safety protocols.
7. Airports served, vehicle types and any "price from" figures. The site currently shows "Price on request".
8. Age policies for shisha and VIP club access, and alcohol supply for bartending and delivery.
9. An SVG logo.
