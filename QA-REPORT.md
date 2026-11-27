# QA Report (A9)

Run on 26 Nov 2026 against `main @ 8ba68a2` + this branch. Production build (`ALLOW_PLACEHOLDERS=true pnpm build`), served by `pnpm start` on port 3219 through Playwright `webServer`. Chromium 1280×800 by default; 375×812 where noted. No lead sinks configured, so `POST /api/enquiry` answers 502 for real leads, which is the fallback path under test.

```bash
ALLOW_PLACEHOLDERS=true pnpm build
pnpm test:e2e            # E2E_PORT=xxxx to change the port
```

## Result

**Lead re-run after fixes (see `git log`): 164 tests, 164 passed, 0 fixme, 0 failed.** The original A9 run was 165 tests: 156 passed and 9 fixme. The two axe fixme tests were merged back into the main sweep once D5–D7 were fixed. `pnpm typecheck` (needs `ALLOW_PLACEHOLDERS=true` in a worktree without `.env.local`), `pnpm lint` and `pnpm test` are green.

| Area | Spec | Tests | Result |
|---|---|---|---|
| Every `app/` static page is in STATIC_TOP (drift guard) | `e2e/routes.spec.ts` | 1 | pass |
| Every STATIC_TOP entry has an `app/` page (reverse drift guard) | routes | 1 | pass (D9 fixed) |
| Every route returns 200 **and** renders a real `<h1>`, not the not-found page (home, 10 static pages, 3 stay types, 6 stays, 5 categories + 26 items, 11 areas, 6 collections) | routes | 64 | pass |
| `/areas` and `/collections` index paths return 404 | routes | 1 | pass (D9 fixed) |
| Unknown paths return 404 with the branded page (9 shapes) | routes | 9 | pass |
| Unknown `*.php` path returns 404 | routes | 1 | pass (D1 fixed) |
| 34 legacy URLs: one-hop 301, also with a trailing slash and a query string; destination is 200 | routes | 35 | pass |
| Trailing slash returns 308 to the slashless URL | routes | 4 | pass |
| axe WCAG 2.2 AA, 9 templates × 375 / 1280, zero serious or critical | `e2e/a11y.spec.ts` | 18 | pass (the D5–D7 rules are excluded on every page until those defects are fixed) |
| axe `color-contrast`, `label-content-name-mismatch` | a11y | 2 | folded into the sweep (D5–D7 fixed) |
| ~~Search bar → filtered grid~~ (search bar removed at the owner's request; `/stays` filters are still covered) | — | — | removed |
| Filter bar changes the URL and the results | flows | 1 | pass |
| Stay gallery lightbox opens and closes on Escape | flows | 1 | pass |
| Lightbox returns focus to its opener | flows | 1 | pass (D2 fixed) |
| Enquiry validation: `aria-invalid`, linked error description, submit disabled | flows | 1 | pass |
| Enquiry with no sinks: 502 leads to an inline alert with "Call us" (tel:), no WhatsApp, no page errors | flows | 1 | pass |
| No-JS form POST answers 303 and lands on a rendered page | flows | 1 | pass |
| No-JS failed POST lands on static `/enquiry-error` with a call link | flows | 1 | pass (D4 fixed) |
| No-JS `/stays` listing and filters | flows | 1 | pass (D3 fixed; see known limit) |
| No-JS stay detail and service item: H1 and enquiry form visible | flows | 1 | pass |
| Honeypot: 200 `{ok:true}`, dropped before delivery | flows | 1 | pass |
| Enquiry modal: focus trap (Tab ×15, Shift+Tab), Escape, focus return | flows | 1 | pass |
| Mobile menu sheet at 375: Enter opens it, accordion works, Escape closes it, focus returns | flows | 1 | pass |
| Skip link is the first tab stop, visible, and the next Tab lands in `#main` | flows | 1 | pass |
| No WhatsApp UI while `site.whatsapp` is null (4 templates) | flows | 4 | pass |
| No positive `tabindex` (5 templates) | `e2e/keyboard.spec.ts` | 5 | pass |
| Visible focus indicator on the first 40 tab stops (5 templates; outline or box-shadow on the element or its `::after`) | keyboard | 5 | pass (native date inputs excluded, see D10) |
| Native date input shows a focus ring | keyboard | 1 | pass (D10 fixed) |

## Defects

**Status after the Lead fixes:** D1–D7, D9 and D10 are fixed and their tests are now active. D8 is open and has moved to the owner punch-list.
- **D3 fix:** the Suspense fallback is the prerendered unfiltered listing. **Known limit:** without JS, filtered URLs (`/stays?type=…`, and the home search bar's native GET) still show every stay.
- **D4 fix:** failed no-JS posts now 303 to a static `/enquiry-error` page. The `?enquiry=error` banner has been removed.
- **D5 and D6 fix:** `--brand-strong` changed to #AD5419 and `--success` to #178045.
- **D2 fix:** the gallery restores focus to the element that opened it.
- **D7 fix:** the "+N More" tile's accessible name now includes its visible text.
- **D9 fix:** `areas` and `collections` removed from STATIC_TOP.
- **D1 fix:** the proxy matcher now runs on `.php` paths.
- **D10 fix:** `inputClass` gets a `focus-within` outline.

Ranked by severity. A9 filed each one with a `test.fixme` named after its ID. For every fixed defect, `.fixme` has been removed and the test passes.

### D3 · High · FIXED · `/stays` listing and filters are invisible without JavaScript
- **Where:** `app/stays/page.tsx:24-26` (the `<Suspense>` around `<Listing>`).
- **Repro:** Disable JS and open `/stays?type=long-term`. Only the skeleton shows: no cards and no filter form. The real markup is in the HTML, inside `<div hidden id="S:1">`.
- **Cause:** With Cache Components, request-time content (here `searchParams`) streams into a hidden `<div>`, and an inline `$RC(...)` script swaps it in. Without JS that script never runs. BRIEF §7 says "JS disabled: Nav, listing and enquiry still work".
- **Suggested fix:** Make the Suspense **fallback** a working, static listing: the unfiltered `StayGrid` plus the `FilterBar` GET form, with no skeleton. Client navigation still streams the filtered version. Alternatively, `/stays` could read no `searchParams` on the server at all and filter in a client component, but that loses no-JS filtering. Lowest-effort stopgap (Lead call): `<noscript><style>{"div[hidden][id^='S:']{display:block!important}"}</style></noscript>` in the root layout. The content then shows at the end of `<body>`, after the footer, so the stopgap is weak.

### D4 · High · FIXED · No-JS enquiry failure gives the visitor no feedback
- **Where:** `lib/leads/handle.ts:92-100` (`reply`) redirects to `?enquiry=error`, and `components/layout/EnquiryErrorBanner.tsx:15` reads it with `useSearchParams` inside Suspense (`EnquiryErrorNotice.tsx:9`).
- **Repro:** Disable JS, submit the `/contact` form while every sink is failing (or none is configured in production). You get a 303 back to `/contact?enquiry=error`, and the page looks exactly like before. The lead is lost and the visitor believes it was sent.
- **Cause:** The server HTML for `/contact?enquiry=error` contains no `role="alert"` at all. `useSearchParams()` in a client component inside Suspense bails out to client-only rendering, so the banner only exists once JS runs. The effect is the same as D3: without JS there is no feedback.
- **Suggested fix:** On failure, redirect no-JS posts to a static route that needs no request data, for example `/thank-you/error` or `/enquiry-failed`: a prerendered page with the call fallback (`site.phone`, and WhatsApp when it is set). Keep `?enquiry=error` for the JS banner if you like.

### D1 · Medium · FIXED · Unknown `.php` URLs are soft 404s (200 status)
- **Where:** `proxy.ts:23`. The matcher `/((?!_next/|.*\\.[\\w]+$).*)` skips every path that has an extension.
- **Repro:** `curl -I /does-not-exist.php` returns **200** with the not-found UI. The 34 known `.php` URLs are fine because next.config redirects run before the proxy.
- **Impact:** Old or mistyped backlinks in the `*.php` shape get a 200, which search engines index as soft 404s.
- **Suggested fix (untested; check it against `node_modules/next/dist/docs` and the D1 fixme test):** Stop excluding `.php` in the existing regex, so the lookahead skips every extension except `.php`: `matcher: ["/((?!_next/|.*\\.(?!php$)\\w+$).*)"]`. `isKnownPath` already returns false for these paths, so they rewrite to the 404. The 34 known URLs still 301 first, because config redirects run before the proxy.

### D9 · Medium · FIXED · `/areas` and `/collections` are soft 404s (200 status)
- **Where:** `lib/routing.ts:11-14`. `STATIC_TOP` whitelists `"areas"` and `"collections"`, but `app/areas/` and `app/collections/` contain only `[area]`/`[key]`. They have no `page.tsx`.
- **Repro:** `curl -I /areas` and `curl -I /collections` both return **200**, with no `<h1>` in the HTML; the not-found UI is rendered on the client.
- **Suggested fix:** Remove `"areas"` and `"collections"` from `STATIC_TOP`. The `nested` map already admits `/areas/<key>` and `/collections/<key>`. If index pages are wanted later, add them and put the entries back. The reverse drift test (fixme D9) guards this.

### D2 · Medium · FIXED · Stay lightbox drops focus to `<body>` on close (WCAG 2.4.3)
- **Where:** `components/stays/StayGallery.tsx:44` and `:128`. `Lightbox` is a controlled `Modal` with no `trigger`, so Radix has nothing to restore focus to.
- **Repro:** On `/stays/casa-siolim`, Tab to "View photos", press Enter, then Escape. `document.activeElement` is `<body>`, so keyboard and screen-reader users are thrown to the top of the page. The same happens from any mosaic tile.
- **Suggested fix:** Remember the opener in `show()` (`openerRef.current = document.activeElement as HTMLElement`), and restore it when the modal closes: `onOpenChange={(o) => { setOpen(o); if (!o) requestAnimationFrame(() => openerRef.current?.focus()); }}`. The cleaner route is for A2 to add an `onCloseAutoFocus` passthrough to `components/primitives/modal.tsx`.

### D5 · Medium · FIXED · `--brand-strong` #C2611F fails AA for text (4.18:1 on white, 3.91:1 on cream)
- **Where:** `app/globals.css:20`. OWNERSHIP.md says to use this token for orange text, but at body sizes it does not reach 4.5:1.
- **Hits (axe, serious):** `components/primitives/section-header.tsx:40` (every SectionHeader link, e.g. "View all" and the gallery link on `/`), `app/(site)/contact/page.tsx:30` (maps link), `app/not-found.tsx:13,31`, `components/stays/StayDetail.tsx:250` (Request Callback ghost button), `app/thank-you/page.tsx:38`.
- **Suggested patch (one line, Lead):** `--brand-strong: #ad5419;` gives 5.17:1 on white and 4.84:1 on cream. It is also used as `--ring`, and focus rings get darker, which is fine.

### D6 · Medium · FIXED · `--success` #1F9D55 fails AA for text (3.49:1)
- **Where:** `app/globals.css:25`; the visible hit is `components/stays/StayDetail.tsx:234` ("Select dates for best price", 14px).
- **Suggested patch (one line, Lead):** `--success: #178045;` gives 4.99:1 on white and 4.67:1 on cream. The icon-only uses stay above 3:1.

### D7 · Low · FIXED · Gallery "+N More" tile: visible text missing from its accessible name (WCAG 2.5.3)
- **Where:** `components/stays/StayGallery.tsx:53` and `:80`. The tile is `aria-label="Photo 5 of 8"` but shows "+3 More".
- **Suggested patch (one line, A5):** pass `label={isLast && extra > 0 ? \`${labels.photo[i]}, ${labels.more}\` : labels.photo[i]}` to that tile.

### D8 · Low · OPEN (owner punch-list) · The rate-limit key trusts the client's `X-Forwarded-For`
- **Where:** `lib/leads/handle.ts:28` (`clientIp`). The E2E suite proves it: each test sends its own `x-forwarded-for` and gets a fresh 5-per-10-minute budget.
- **Impact:** On Vercel the platform overwrites the header, so the impact is low there. On any other host, or a direct origin hit, a bot can rotate the header to bypass the limiter.
- **Suggested fix:** On Vercel, prefer `x-real-ip` (set by the platform) or `@vercel/functions` `ipAddress(request)`. Elsewhere, take the right-most untrusted hop, not the first.

### D10 · Low · FIXED · Native date inputs have no focus ring (WCAG 2.4.7)
- **Where:** `components/primitives/input.tsx:14` (`inputClass`), used by `type="date"` and `type="month"` fields (service "Preferred date", site visit, move-in month, no-JS dates).
- **Repro:** On `/travel/airport-transfers`, Tab into "Preferred date (optional)". The only cue is Chrome's pale blue highlight on the `dd` segment; there is no outline on the field. `:focus-visible` doesn't match because focus sits on an inner shadow segment.
- **Suggested patch (one line, A2):** add `focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring` to `inputClass`.

### Informational (no action)
- After a client-side navigation, Next 16 keeps the previous route mounted with `display:none`, so the DOM briefly holds two `<main id="main">`. The visible one is first, and the skip link still lands correctly (checked after a forward and a back navigation). Tests scope to `main:visible`.
- `MobileBottomBar` (Call · Enquire) is also in a streamed Suspense segment (`BottomBarGate`), so it does not show without JS. Phones without JS still have the header phone link, so this is minor and shares the D3 cause.
- `/travel/airport-transfers/opengraph-image` returns 404 today. A8's OG routes haven't landed; the proxy already allows metadata segments.

## Coverage gaps

- Chromium only. No WebKit or Firefox runs, and no 768px tablet pass. BRIEF §6 asks for 375/768/1280; the suite covers 375 and 1280.
- Successful delivery isn't exercised end to end: with no sinks the API returns 502. The `/thank-you` + WhatsApp handoff and the `generate_lead` dataLayer push are covered by `lib/leads/*.test.ts` only. To add it, run the server with `SHEET_WEBHOOK_URL` pointing at a local stub.
- Not tested: the mega-menu keyboard paths (open with Enter/ArrowDown, Escape), the date-picker keyboard path, carousel controls and their pause on hover/focus, the copy-code toast, the stay-enquiry and service-enquiry form variants (only the contact variant is driven), the property-owner form, the large-group empty state, and `/styleguide` visual snapshots.
- The "no placeholders in prod" build gate isn't exercised here: E2E needs `ALLOW_PLACEHOLDERS=true` because every stay is a placeholder.
- axe can't judge focus order meaning, reading order, motion, or the content of alt text.

## Manual checks still needed

- VoiceOver on macOS Safari and iOS Safari for these: the enquiry modal (announced title, focus trap, return), inline validation (errors are linked via `aria-describedby` but are not a live region, so check they are read on blur), the success `role="status"`, the error `role="alert"`, the mobile menu accordion, and the combobox in "Where in Goa".
- Safari: `input[type=date]` and `type=month` rendering and focus visibility (see D10), the sticky header, bottom-sheet scroll locking, and `100dvh` sheets on iOS.
- TalkBack on Android Chrome for the bottom bar and the sheets.
- 200% zoom and 320px reflow (WCAG 1.4.10) on the stay detail and the filters sheet.
- `prefers-reduced-motion`: hero and rails don't animate, and nothing autoplays faster than 5 s.
- Real no-JS walkthrough after D3/D4 are fixed, across nav → listing → detail → enquiry.

## Lead requests

- Done: `package.json` (Lead-owned) now has `"test:e2e": "playwright test"` and devDeps `@playwright/test`, `@axe-core/playwright`, as instructed in the A9 task.
- Playwright artifacts go to `.next/e2e-results/`, which is already git-ignored, so `.gitignore` needs no change.
- ~~`.claude/agents/qa.md` says A9 owns `tests/**`, but the task and this branch use `e2e/**`.~~ Done: `OWNERSHIP.md` and `qa.md` now say `e2e/**`.
- CI: run `ALLOW_PLACEHOLDERS=true pnpm build && npx playwright install --with-deps chromium && pnpm test:e2e`.

## Lighthouse (Lead, mobile, lighthouse@12, local `next start`)

| Template | Perf (simulated) | Perf (devtools throttling) | A11y | BP | SEO |
|---|---|---|---|---|---|
| `/` | 83 | 99 (LCP 1.7 s) | 100 | 100 | 100 |
| `/stays` | 87 | – | 100 | 100 | 100 |
| `/stays/casa-siolim` | 88 | – | 100 | 100 | 100 |
| `/travel/airport-transfers` | 89 | 99 (LCP 1.6 s) | 100 | 100 | 100 |

**The definition-of-done target of ≥90 is not met under Lighthouse's default simulated throttling.** Under applied (devtools) throttling the pages score 99. The simulated model counts every script byte requested before LCP: about 295 KB shared across all templates, the largest pieces being the 88 KB UI kit chunk (Radix dialog and popover, sonner, react-day-picker, floating-ui) and 51 KB of zod for client-side form validation. Fixes already applied: a 1 KB ₹ font subset replacing the 85 KB Inter latin-ext file; offscreen hero slides and card photos deferred; `fetchPriority` on LCP images. Next step if the target is enforced: lazy-load the date picker, enquiry modal and toaster with `next/dynamic` on first open, and validate on the client without zod. Re-measure on the Vercel preview, since a localhost TTFB is not representative.
