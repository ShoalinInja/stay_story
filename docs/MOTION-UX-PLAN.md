# Stay Story: motion and UX plan

The companion to [`DESIGN-AUDIT.md`](DESIGN-AUDIT.md). It covers how the site should move, and the UX changes that make it feel premium and trustworthy.

## 1. What the site is and who it serves

- **Business:** a Siolim-based local team that arranges Goa **stays** (villas, apartments, long-term rentals, villas for sale) and the **services around a trip**: airport transfers and car rental, yachts and experiences, weddings and events, private chefs and concierge, artists and entertainment.
- **Model:** enquiry only. There is no booking or payment. Every page exists to start a conversation by form, WhatsApp or phone. Leads arrive by email (Resend) and in the WhatsApp hand-off.
- **Visitors:** couples and families planning a holiday (mobile, browsing over days), groups planning a celebration (comparing options, need reassurance), and owners listing a property.
- **Their questions, in order:** *Is this real? Is it nice? Can these people handle my trip? How fast will they reply?*

Every motion and UX decision below answers one of those four questions. Motion is there to make the site feel **calm, crafted and responsive**, never flashy. Premium hospitality brands move slowly and precisely.

---

## 2. Motion principles

1. **Quiet confidence.** Short distances (8–16 px), soft easing, no bounce or spin.
2. **Motion explains.** Things enter from where they come from: a sheet from its edge, a menu from its trigger.
3. **Fast feedback, slow atmosphere.** A press reacts in ≤100 ms. Content reveals take 400–600 ms.
4. **Only `transform` and `opacity`.** Never animate width, height, top or box-shadow directly. Fade a pseudo-element's opacity instead.
5. **Reduced motion is a first-class mode.** Under `prefers-reduced-motion`, keep fades and remove movement and auto-play.
6. **CSS first. No new dependency.** Tailwind 4 plus `tw-animate-css` (already installed) and a small `IntersectionObserver` cover everything here. The View Transitions API covers page changes.

## 3. Motion tokens

Add these to `app/globals.css` next to the other tokens. They give one source of truth instead of `duration-100`, `duration-200` and `transition-all`.

```css
:root {
  --dur-instant: 100ms;  /* press, toggle */
  --dur-fast: 180ms;     /* hover, colour, small UI */
  --dur-base: 280ms;     /* menus, popovers, accordion */
  --dur-slow: 480ms;     /* sheets, modals, reveals */
  --dur-hero: 900ms;     /* hero image settle (once) */

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);    /* enter: quick start, soft landing */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1); /* move or swap on screen */
  --ease-in: cubic-bezier(0.55, 0, 1, 0.45);     /* exit: leave quickly */
}

@theme inline {
  --ease-premium: var(--ease-out);
  --default-transition-duration: var(--dur-fast);
  --default-transition-timing-function: var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

The reduced-motion block makes everything effectively instant. The reveal utility in §4.4 also skips its translate, so content never sits hidden.

**Cleanup at the same time:** replace the 4 `transition-all` uses (`components/ui/tabs.tsx`, `ui/button.tsx`, `ui/accordion.tsx`, `stays/StayCardParts.tsx`) with explicit lists such as `transition-[color,background-color,transform,opacity]`.

---

## 4. Component motion specs

### 4.1 Header and mega menu
| Element | Motion |
|---|---|
| Sticky header on scroll | Past 80 px, add `shadow-card` and a white background with `backdrop-blur`. Transition opacity on a pseudo-element, `--dur-base`. Don't animate the height. |
| Mega menu open | Panel fades in and moves from `translateY(-6px)` to 0, `--dur-base` `--ease-out`. Close: fade only, `--dur-fast` `--ease-in`. Radix sets `data-state`, so this is CSS only: `data-[state=open]:animate-in fade-in-0 slide-in-from-top-1`. |
| Nav link hover | An underline scales from left (`scaleX` 0 → 1, `origin-left`), `--dur-fast`. |
| Mobile nav sheet | Slides from the right, `--dur-slow` `--ease-out`. The overlay fades to `black/40`. Stagger the links by 30 ms (max 8). |

### 4.2 Hero carousel
- **On load:** the first slide image settles from `scale(1.04)` to `scale(1)` over `--dur-hero` (a single "Ken Burns" settle, not a loop). Then the headline fades and rises 12 px (`--dur-slow`), then the subtitle 80 ms later, then the CTA 160 ms later.
- **Slide change:** crossfade (opacity), `--dur-slow`. No sliding of full-bleed photos: sliding large images feels cheap and costs paint time.
- **Auto-advance:** optional, every 7 s. Pause on hover, on focus and when the tab is hidden. **Off under reduced motion.**
- **Arrows:** fade in on hover (desktop). Always visible on touch.

```css
@keyframes hero-settle { from { transform: scale(1.04); } to { transform: none; } }
.hero-img { animation: hero-settle var(--dur-hero) var(--ease-out) both; }
```

### 4.3 Cards (stays, categories, collections)
| State | Motion |
|---|---|
| Hover (pointer devices only, `@media (hover:hover)`) | The image scales to 1.04 inside its clip, `--dur-slow` `--ease-out`. The card lifts `translateY(-2px)` while the `shadow-card-hover` layer fades in (an opacity pseudo-element). |
| Press | `scale(0.99)`, `--dur-instant`. |
| Wishlist heart | On toggle, `scale(1)` → `1.2` → `1` over 250 ms, with the fill colour crossfading. |
| Image carousel dots | The active dot widens with `scaleX`, not `width`. |

Today the cards use `group-hover:scale-[1.02]` at `duration-200`. Raise that to 1.04 and `--dur-slow` for a richer, slower feel.

### 4.4 Scroll reveals (sections)
Section headings and the first row of a grid fade in and rise 16 px when they enter the viewport. **Once only**, threshold 15%, stagger 60 ms per item (max 6), `--dur-slow` `--ease-out`.

The approach: CSS does the animation, and a 20-line client component sets `data-revealed`.

```tsx
// components/primitives/reveal.tsx
"use client";
import { useEffect, useRef } from "react";

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.dataset.revealed = ""; io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}
```

```css
/* Only hide when JS has loaded (html.js is set by an inline script), so no-JS and crawlers see everything. */
.js .reveal:not([data-revealed]) { opacity: 0; transform: translateY(16px); }
.reveal { transition: opacity var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out); }
@media (prefers-reduced-motion: reduce) { .js .reveal:not([data-revealed]) { transform: none; } }
```

Rules: never wrap the hero, the H1 or anything above the fold (this protects LCP), and never wrap forms.

### 4.5 Rails (horizontal scrollers)
- `scroll-behavior: smooth` on the track for the arrow buttons, and `scroll-snap-type: x mandatory` (already present).
- Arrow buttons: disabled state fades to 40% opacity, `--dur-fast`.
- Progress bar: animate `transform: scaleX(progress)`, not width.

### 4.6 Gallery and lightbox
- Open: the clicked thumbnail scales into place using the **View Transitions API** (`document.startViewTransition`, with `view-transition-name` on the thumbnail and the lightbox image). Fallback: fade plus `scale(0.96 → 1)`, `--dur-slow`.
- Swipe between images: follow the finger (transform), snap with `--ease-out` over 280 ms.
- Close: reverse, `--dur-base`.

### 4.7 Modal (enquiry) and sheets
| | Enter | Exit |
|---|---|---|
| Overlay | Fade 0 → 40%, `--dur-base` | `--dur-fast` |
| Desktop modal | Fade plus `scale(0.97 → 1)` and `translateY(8px → 0)`, `--dur-slow` `--ease-out` | Fade plus `scale(0.98)`, `--dur-fast` `--ease-in` |
| Mobile sheet | From the bottom, `--dur-slow` `--ease-out` | To the bottom, `--dur-base` `--ease-in` |

Radix already exposes `data-state`, so these are class changes in `components/primitives/modal.tsx` and `sheet.tsx` using the `tw-animate-css` utilities, with `duration-[var(--dur-slow)]`. Focus moves to the first field after the enter animation (Radix handles it).

### 4.8 Accordion (FAQs, policies)
- Content height: use `grid-template-rows: 0fr → 1fr` (smooth, no JS measuring), `--dur-base` `--ease-in-out`.
- Chevron rotates 180°, `--dur-base`.

### 4.9 Forms: the moment that matters most
| State | Motion and UX |
|---|---|
| Focus | The border colour moves to ink and a 3 px brand ring fades in, `--dur-fast`. |
| Inline error | The message fades in and drops 4 px. The field border turns red. **No shaking.** |
| Submit pressed | The button keeps its width. The label crossfades to a spinner and "Sending…". |
| Success | The form crossfades to the success panel (`--dur-slow`). A check mark draws in (SVG `stroke-dashoffset`, 500 ms). Then the response-time promise and the WhatsApp button appear. |
| Failure | The alert slides down 8 px and fades in. The Call and WhatsApp buttons get focus. |

**UX change (audit F1):** keep the submit button **enabled**. On an invalid submit, focus the first invalid field and show its error. Today's disabled button at 50% opacity looks broken.

### 4.10 Toasts
Enter from the bottom-centre on mobile and bottom-right on desktop: `translateY(8px)` plus fade, `--dur-base`. Auto-dismiss at 5 s, paused on hover.

### 4.11 Page transitions
Use the browser-native cross-document **View Transitions**. Add one CSS rule; no JS and no router changes:

```css
@view-transition { navigation: auto; }
::view-transition-old(root), ::view-transition-new(root) { animation-duration: var(--dur-base); }
```

This gives a soft crossfade between pages in Chrome, Edge and Safari 18+, and does nothing elsewhere. Give the stay card image and the stay detail hero the same `view-transition-name: stay-<slug>` so the photo "flies" into the detail page. That is the single most premium-feeling effect available.

### 4.12 Floating actions and the mobile bottom bar
- Bottom bar: slides up 100% → 0 once the page has scrolled past the hero, `--dur-base`. It is always present on stay detail pages.
- Desktop: **one** floating WhatsApp button (audit L3). A label slides out on hover ("Chat with us"), `--dur-base`.

---

## 5. UX improvements for trust and a premium feel

Ordered by impact on enquiries.

| # | Change | Where | Why |
|---|---|---|---|
| U1 | **Proof bar** under the hero CTA: "★ 4.9 on Google · Replies in 30 min · Based in Siolim since 20XX" (real values only) | Home hero, stay detail sidebar | Answers "is this real?" in the first second. |
| U2 | **Response-time promise** under every submit and on `/thank-you` | `components/forms/copy.ts` → `FORM_COPY.sent` | It is the top anxiety for enquiry-only sites. |
| U3 | **Reviews block**: 3 real quotes with first name, month and stay name, plus a link to Google | Home (after "Featured Stays"), stay detail | Social proof at the point of decision. |
| U4 | **Meet your host**: one photo, name and two lines | Home, About, contact | People trust people. It is the main difference from OTAs. |
| U5 | **Real, text-free photography** replacing the posters | Category tiles, service heroes | Posters read as ads. Photos read as proof. |
| U6 | **Shorter stay form**: name, phone and dates first, with "Add details" expanding the rest | `EnquiryFormClient` | Fewer fields means more enquiries (Hick, Tesler). |
| U7 | **WhatsApp pre-fill with context**: "Hi, I'm interested in Casa Siolim, 12–15 Dec, 4 adults" | WhatsApp links on stay and service pages | Removes typing and starts a qualified chat. Most Indian guests prefer WhatsApp. |
| U8 | **SVG logo** and one brand spelling | Header, footer, copy | A crisp mark signals quality. |
| U9 | **Price anchors**: "from ₹X" or "Quoted in 15 min" instead of "Price on request" | Travel and service pages | "On request" reads as "expensive or hiding". |
| U10 | **Sticky mobile CTA on stay pages** (price plus Enquire, already present). Add the dates the person picked. | Stay detail | Keeps the decision in context. |

---

## 6. Implementation order

**Status (27 Nov 2026):** phases 1–4 are done. What was built differs from the plan above in these places:
- **Stay photo morph** uses React's `<ViewTransition>` (`StayPhoto` in `components/stays/StayCardParts.tsx`), because Next route changes are client-side, so the CSS-only `view-transition-name` in §4.11 never fires on link clicks. Only cards that link *to* a detail page carry the name: related-stay cards on a detail page use `morph={false}`, or each would also fly to its twin on the next page. A click before the page has hydrated is a normal page load with no morph.
- **Lightbox** keeps the modal's fade-and-scale entrance (phase 2), and each photo now fades in when you step through. A thumbnail-to-lightbox morph was left out: it fights Radix's portal and focus handling for little gain.
- **Scroll reveal** uses CSS scroll-driven animation (`@utility reveal` in `globals.css`, `animation-timeline: view()`) instead of the `IntersectionObserver` component in §4.4. It needs no JS, no `html.js` class and no hydration. Browsers without support, no-JS visitors and reduced-motion users simply see the content. It is applied to every `h2` `SectionHeader`.
- **Hero slide change** still slides. A true crossfade needs `embla-carousel-fade`, a new dependency. The load-time image settle and the staged text are in.
- **Transition lists must name `translate` and `scale`** as well as `transform`. Tailwind 4 writes `scale-*`, `translate-*` and `rotate-*` to those separate CSS properties, so a list with only `transform` makes them jump. `media-zoom` and every `transition-[…]` list follow this rule.


| Phase | Work | Effort | Files |
|---|---|---|---|
| **1. Foundation** | Motion tokens, the reduced-motion block, removing `transition-all`, the view-transition rule | ~2 h | `app/globals.css`, `components/ui/*`, `StayCardParts.tsx` |
| **2. Feedback** | Form states (enabled submit, focus, error, success check mark), button press, modal and sheet timing | ~4 h | `components/forms/*`, `primitives/modal.tsx`, `primitives/sheet.tsx`, `primitives/button.tsx` |
| **3. Atmosphere** | Hero settle and crossfade, card hover, `Reveal` on section headers, accordion grid-rows | ~4 h | `home/HeroCarousel.tsx`, `stays/StayCard*`, `primitives/reveal.tsx` (new), `primitives/accordion.tsx` |
| **4. Signature** | Shared-element view transition from a stay card to the detail page, gallery lightbox transition | ~3 h | `StayCardParts.tsx`, stay detail hero, gallery |
| **5. Trust UX** | U1–U4, U7 and U9, once real data exists (reviews, host photo, response time) | Content first, then ~4 h | `content/site.ts`, `components/home/*`, `components/forms/copy.ts` |

**Checks for every phase**
- `pnpm test:e2e` passes (axe included). Reveal must never leave content at `opacity: 0` for no-JS or crawlers.
- A Lighthouse run on `/` and a stay shows no LCP regression. Never animate the LCP image's opacity.
- macOS "Reduce motion" on: no movement, content visible.
- Test on a mid-range Android phone: animations stay at 60 fps (transform and opacity only).

## 7. What not to do

- No parallax on photos, no auto-playing video hero, no cursor followers, no scroll-jacking. Each one reads as "template" and hurts performance.
- No new animation library (Framer Motion or GSAP) for this scope. CSS and View Transitions cover it at 0 KB.
- No animated counters on stats unless the numbers are real.
