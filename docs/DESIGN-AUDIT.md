# Stay Story: design audit

**Scope:** the rebuilt staystory.in (production build, placeholder content on). Pages reviewed at 1440 px and 375 px: home, `/stays`, `/stays/casa-siolim`, `/travel/airport-transfers`, `/contact`, header, mega menu, footer and the enquiry form. The design tokens and component classes were also scanned across `app/` and `components/`.
**Date:** 27 Nov 2026
**Goal set by the owner:** the site should look **premium, high quality and trustworthy**, and turn visitors into enquiries by phone, WhatsApp or email.

Severity scale (Nielsen): **4** stops the task · **3** major · **2** minor · **1** cosmetic.

---

## 1. Summary

The structure is sound. Navigation is clear, every page has a way to enquire, the mobile bottom bar (Call · WhatsApp · Enquire) is well judged, and accessibility, SEO and the legacy redirects are solid. What keeps the site from feeling premium is **not layout**. It is three things:

1. **Trust is claimed, not shown.** The hero says "Your Trusted Partner…", but there are no reviews, guest numbers, real faces, response-time promise or social links. Most images are legacy posters, some of which look AI-generated, with text baked into them.
2. **The brand mark undercuts the page.** The logo is a PNG on a black box, sitting on a white header. It reads like a sticker rather than a brand.
3. **Small inconsistencies add up.** There are 5 radius values, 5 shadow styles, 3 card paddings, 6+ overlay opacities and ~70 places that bypass the type scale. Motion is almost absent. No single one is ugly; together they read as "template" rather than "crafted".

**Fixed during this audit**

| Issue | Severity | Fix |
|---|---|---|
| The active footer tab ("Villas") was dark text on the dark footer for visitors whose phone or computer uses dark mode. The UI kit's `dark:` styles fired on OS dark mode, but the site has no dark theme. | 3 | `app/globals.css`: `dark:` now applies only inside a `.dark` class, which the site never sets. |
| On mobile, the hero's prev/next arrows sat on top of the subtitle text | 3 | `components/home/HeroCarousel.tsx`: on small screens the arrows now sit beside the CTA, and are centred again from `md` up. |

---

## 2. First impression (5-second test)

| Question | Desktop | Mobile |
|---|---|---|
| What is this? | Goa stays plus services. Clear from the headline and nav. | Clear |
| What should I do? | "Explore villas" is the only hero CTA. "Enquire Now" is in the header. | "Explore villas", plus the bottom bar |
| Do I trust it? | **Weak.** A generic headline, no proof, and a sticker-like logo. | **Weak** |
| Does it feel premium? | **Partly.** Good photography in the hero and gallery, but the posters and icon tiles below pull it down. | Partly |

---

## 3. Findings by area

### 3.1 Trust and credibility (highest impact)

| # | Finding | Principle | Sev | Recommendation |
|---|---|---|---|---|
| T1 | There is no social proof anywhere: no reviews, ratings, guest count, years in business or press. The stats band and testimonials stay hidden because there is no real data yet (correctly; nothing is invented). | Trust / Social proof | 3 | Collect 5–10 real Google reviews and link the Google Business profile. Show the rating and 3 quotes on home, stays and the stay detail page. Add 3 honest stats (years operating, stays hosted, guests served). |
| T2 | The hero headline asserts trust ("Your Trusted Partner for a Complete Goa Experience") but gives no reason to believe it. | Show, don't tell | 2 | Lead with a concrete promise, for example "Handpicked villas in Siolim and North Goa. One local team for your stay, transfers and celebrations." Put a proof line under the CTA (rating · response time · based in Siolim). |
| T3 | No response-time promise near the forms. People don't know when they'll hear back. | H1 visibility of status | 2 | Under every submit button: "We reply within 30 minutes, 9 am–9 pm" (use whatever is true). Repeat it on `/thank-you`. |
| T4 | There are no faces or team on the site. A local, people-run business is the strongest differentiator against OTAs. | Trust | 2 | Add a "Meet your host" block on About and home: photo, name and one line, plus a photo of the Siolim office or property. |
| T5 | The contact email is a personal Gmail address. | Trust | 2 | Use `hello@staystory.in` once the domain mail is set up. It also lets Resend send from your own domain. |
| T6 | Social profiles are empty, so the footer "Follow" area is blank. | Trust | 1 | Add Instagram at minimum. It is a buying signal for villa guests. |
| T7 | The category tiles in "Plan Your Goa" (Travel, Experiences, Events) and the service page heroes are legacy posters with script titles baked in, and some look AI-generated. Next to real villa photos they look like ads, and it is the same picture twice: the H1 says "Airport Transfers" and the poster beside it says it again. | Aesthetic integrity / H8 | 3 | Replace them with real, text-free photographs (your car, your driver, a real event you ran). Until then, prefer a clean photo from the gallery over a poster. |
| T8 | Placeholder stays are visible in preview builds. (The production build blocks them, which is correct.) | — | — | Owner punch-list item 1. |

### 3.2 Brand and visual identity

| # | Finding | Principle | Sev | Recommendation |
|---|---|---|---|---|
| B1 | The logo is a raster PNG with a black rectangle background on a white header. On retina screens it is soft, and the box breaks the clean header. | Aesthetic-usability | 3 | Commission or extract an SVG wordmark on a transparent background: a dark version for the header and a light one for the footer. |
| B2 | The brand name is written three ways: "Stay Story" (copy), "StayStory" ("The StayStory Standard") and "Staystory.in" (logo). | H4 consistency | 2 | Pick one and use it everywhere. "Stay Story" matches the site title and schema. |
| B3 | The area tiles under "Pick a Destination" use generic line icons (a plant, a shopping bag, a castle). They don't evoke the places and look like a template. | Similarity / Recognition | 2 | Use small circular photos of each area (beach, fort, market). If there are none, a numbered text chip is quieter than an unrelated icon. |
| B4 | Colour is used well (cream, ink, a single brand orange), but the orange appears in only a few links. Primary buttons are ink-black. | Von Restorff | 1 | That is fine and premium. Keep the orange for one accent per view (the price, "View all", the active state), and don't add more colours. |

### 3.3 Layout and hierarchy

| # | Finding | Principle | Sev | Recommendation |
|---|---|---|---|---|
| L1 | Since the search bar was removed, the cream "Finding the right Goa stay…" strip sits directly under the hero and reads as an orphan. | Common region / Rhythm | 2 | Either let it overlap the hero bottom by ~40 px as a floating card (`-mt-10 relative z-10 shadow-card`), or merge it into the hero as a secondary CTA ("Request a callback"). |
| L2 | Most sections share the same rhythm: a heading top-left, then a rail or grid, on alternating cream and white. Nothing breaks the pattern, so the page feels long. | Serial position / Rhythm | 2 | Break the rhythm once or twice: a full-bleed photo band with one quote (a review), or a 2-column editorial block for "List your property". |
| L3 | The floating WhatsApp and call buttons (bottom-left, desktop) overlap the filter sidebar on `/stays` and the content edge elsewhere. | Fitts / Clutter | 2 | On desktop, keep one floating WhatsApp button bottom-right with a label on hover. The header already has "Get in Touch". |
| L4 | `type-h2` has no larger step at `md` (28 px everywhere), and `type-h3` is Inter at 16 px. On desktop the section titles are small relative to the 48 px H1, so the hierarchy jumps. | Visual hierarchy | 2 | `type-h2`: 1.75rem → 2.25rem at `md`. `type-h3`: 1.125rem/600. |

### 3.4 Interaction and forms

| # | Finding | Principle | Sev | Recommendation |
|---|---|---|---|---|
| F1 | The submit button is disabled (50% opacity) until the form is valid. People see a grey button and don't know why, so it looks broken, especially in the stay sidebar. | H1, H9 | 3 | Keep it enabled. On click, validate, focus the first invalid field and show the inline error. The form already renders field errors. |
| F2 | The stay detail form asks for 9 fields (name, phone, email, check-in, check-out, adults, children, message). | Hick / Tesler | 2 | Required: name, phone and dates. Collapse adults, children and message under "Add details". Pre-fill the dates from the URL if they are present. |
| F3 | After success, the WhatsApp hand-off is the right move. The success state is plain text. | Peak-end rule | 1 | Show a check-mark animation, the response-time promise (T3) and a "Save our number" `tel:` link. |
| F4 | The mobile bottom bar (Call · WhatsApp · Enquire) is excellent. Keep it. | Fitts | — | — |

### 3.5 Content and microcopy

| # | Finding | Sev | Recommendation |
|---|---|---|---|
| C1 | "Price on request" on travel pages gives no anchor. | 2 | Add "from ₹X" where you can, or "Quoted in 15 minutes on WhatsApp". |
| C2 | Claims to confirm or remove: 24×7 support, daily housekeeping, pet-friendly, certified professionals. These are listed in the owner punch-list. An unconfirmed claim damages trust more than a missing one. | 3 | Confirm or delete them before launch. |
| C3 | The stay detail page says "Select dates for best price" in green. That implies dynamic pricing, but this is enquiry only. | 1 | "Add your dates and we'll confirm the price". |

---

## 4. Visual system inconsistencies (code scan)

| Token family | Defined | Drift found | Fix |
|---|---|---|---|
| Type scale | `type-h1/h2/h3/body/meta/price` | `text-sm` ×51, `text-xs` ×9, `text-base` ×5, `text-lg` ×2, `text-xl` ×1, `text-4xl` ×1. `font-display` added 20× on elements whose `type-h*` already sets it. | Replace with `type-body` / `type-meta`. Delete the redundant `font-display`. |
| Radius | `rounded-card`, `rounded-input`, `rounded-full` | `rounded-lg` ×8, `rounded` ×4, `rounded-md` ×2, `rounded-xl` ×1 | Map each one to `card` (surfaces) or `input` (controls). |
| Shadow | `shadow-card`, `shadow-card-hover` | raw `shadow` ×9, plus `shadow-sm`, `shadow-md` and `shadow-lg`. The stay sidebar uses `shadow-card-hover` as its resting state. | Two tokens only: resting and raised. Sticky panels use resting. |
| Card treatment | — | Some cards have a border and a shadow (the contact form, 404 cards), others a shadow only (About, whyUs, property sales). Padding is p-4, p-5 or p-6. | One `Surface` recipe: `rounded-card bg-white shadow-card p-6`, with a border only on cream backgrounds. |
| Image overlays | — | `bg-black/45`, `/40`, `/25`, `/10`, `from-black/75`. White text at `/80`, `/85`, `/90`. | Two scrims: `--scrim-hero` (45%) and `--scrim-card` (a gradient to 70%). One secondary white text: `/85`. |
| Buttons | 10 variants in use | `icon-circle`, `outline`, `dark`, `ghost`, `pill`, `line`, `brand-tint`… | Keep 4: primary (ink), secondary (outline), link, icon. |
| Motion | none | `duration-100`, `duration-200`, `transition-all` ×4 (anti-pattern), `motion-safe` ×2 | See `docs/MOTION-UX-PLAN.md`. |

The only raw hex values are in the styleguide, which is good.

---

## 5. Premium-feel gap analysis

| Premium signal | Today | Target |
|---|---|---|
| Real, consistent photography | Mixed: good villa photos next to text posters | Text-free photos only, one colour grade |
| Brand mark | PNG sticker | SVG wordmark |
| Proof | None | A rating, reviews, a host face, a response time |
| Typographic contrast | Playfair H1 is good; H2/H3 are small | A stronger H2 step, more white space around headings |
| Calm motion | None | Subtle reveals, image hover, smooth sheet and modal (see the motion plan) |
| Restraint | Too many floating buttons and icon tiles | One floating action, photo tiles |
| Consistency | Many near-duplicate tokens | Tokens only |

---

## 6. Prioritised fix list

**Before launch (P0)**
1. Real photos instead of the posters on the home category tiles and service heroes (T7).
2. An SVG logo (B1).
3. Reviews or rating, plus a response-time promise (T1, T3).
4. Keep the submit button enabled with inline errors (F1).
5. Confirm or remove the unverified claims (C2).

**Next sprint (P1)**
6. Token cleanup: type, radius, shadow, overlays (section 4). Mostly search and replace.
7. A larger `type-h2` step, and `type-h3` at 18 px (L4).
8. A single floating WhatsApp button on desktop (L3).
9. Move the callback strip into a floating card or into the hero (L1).
10. One brand name everywhere (B2).
11. The motion plan, phases 1–2.

**Later (P2)**
12. Area photo chips (B3), editorial breaks (L2), a "Meet your host" block (T4), "from ₹" anchors (C1).
