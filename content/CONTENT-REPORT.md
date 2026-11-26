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
