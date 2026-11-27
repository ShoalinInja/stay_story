# How to add a stay to staystory.in

This guide is for the Stay Story team. It walks you through putting a new villa, apartment, long-term home or property for sale on the website. Allow about 30 minutes per stay once you have the photos.

If you would rather not edit files, fill in `content/stays/_TEMPLATE.json` with your details, attach the photos, and send both to your developer.

---

## 1. Gather what you need

| You need | Notes |
|---|---|
| **Photos** | 5 or more. With fewer than 5, the page shows one large photo instead of a gallery mosaic. Use landscape shots at least 1600 px wide, with **no text, logos or phone numbers on the image**. |
| **Basics** | Bedrooms, bathrooms, maximum guests, area of Goa. |
| **Price** | Optional and **never shown on the site**: every stay shows "Rates on enquiry", and the price is shared when a guest enquires. Guest count is also not shown; `maxGuests` only powers the "Guests" search filter. |
| **Location** | Latitude and longitude. In Google Maps, right-click the property, then click the numbers at the top of the menu to copy them. |
| **House rules** | Check-in and check-out times, rules, and your cancellation policy. |

## 2. Add the photos

1. Choose a short web name (the **slug**) for the stay, such as `3-bhk-luxury-villa-with-pool-siolim`. Use lowercase letters, numbers and hyphens only. This becomes the page address: `staystory.in/stays/3-bhk-luxury-villa-with-pool-siolim`.
2. Create a folder `public/media/stays/<slug>/` and put the photos in it, named `01.jpg`, `02.jpg` and so on. `01` is the main photo.
3. Write down each photo's width and height in pixels. On a Mac, select the file and press ⌘I; on Windows, right-click it and open **Properties → Details**.

## 3. Create the stay file

1. In `content/stays/`, copy `3-bhk-luxury-villa-with-pool-siolim.ts` and rename the copy to `<slug>.ts`.
2. Open it and change every value. `_TEMPLATE.json` shows the same fields with example values.
3. For each photo, replace the `media(...)` list with entries like this:
   ```ts
   images: [
     { src: "/media/stays/my-new-villa/01.jpg", alt: "Pool and sun loungers at dusk", width: 1600, height: 1067 },
   ],
   ```
   The `alt` text describes what the photo shows, for visitors using screen readers. Keep it specific, for example "Four-poster bed facing the balcony", not "bedroom".
4. If the file has a line `isPlaceholder: true,`, **delete it**. Until you do, the stay never appears on the live site.
5. Rename the variable on the `export const` line (for example `export const luxuryVilla3BhkSiolim`) to match your stay.

## 4. Switch it on

Open `content/stays/index.ts` and add two lines, one import and one entry in the list:

```ts
import { myNewVilla } from "./my-new-villa";
// …
export const stays: Stay[] = [
  myNewVilla,
  // …existing stays
];
```

To remove a stay, delete its two lines here and delete its file.

## 5. Check before you publish

Run these in the project folder:

```bash
pnpm tsx scripts/validate-content.ts   # checks links, photos and required fields
pnpm build                             # fails if any placeholder content is still live
```

If `pnpm build` prints a list starting with `Placeholder / needsReview content would ship`, it shows exactly which lines still need attention.

---

## Field reference

| Field | What to enter |
|---|---|
| `type` | `villa`, `apartment`, `hotel`, `long-term` or `for-sale` |
| `area` | `siolim`, `anjuna`, `vagator`, `assagao`, `morjim`, `arambol`, `candolim`, `calangute`, `baga`, `panjim` or `south-goa` |
| `region` | `north-goa` or `south-goa` |
| `headline` | One line under 15 words that sells the stay |
| `description` | 2 or 3 short paragraphs. Put a blank line between paragraphs. |
| `pricePerNight` | Optional, never shown on the site. A number with no ₹ sign or commas, such as `15000`, or `null` |
| `monthlyRent` / `salePrice` | Only for `long-term` and `for-sale` stays |
| `amenities` | Choose from: `private-pool`, `shared-pool`, `wifi`, `ac`, `kitchen`, `parking`, `power-backup`, `housekeeping`, `caretaker`, `chef-on-request`, `bbq`, `garden`, `tv`, `washing-machine`, `workspace`, `pet-friendly`, `lift`, `security`, `beach-access`, `gym` |
| `highlights` | 3 or 4 short selling points |
| `collections` | Any of: `pool-villas`, `group-stays`, `couples`, `workation`, `pet-friendly`, `party-villas` |
| `addOns` | Services to suggest on the page, e.g. `{ category: "concierge", slug: "private-chef" }`. Valid slugs are listed in `content/categories/*.ts`. |
| `badges` | Optional: `new`, `best-rated`, `pet-friendly` |
| `rating` | **Leave this out** unless you have real reviews, e.g. `{ value: 4.8, count: 32, source: "google" }`. Never invent a rating. |
| `featured` | `true` to show the stay in the home page rails |
| `faqs` | Questions and answers about this stay. The sample files write them as `draft("Question?", "Answer.")`, which keeps them hidden on the live site. Once an answer is checked, rewrite it as `{ q: "Question?", a: "Answer." }`. |

## Good to know

- **Placeholders are hidden in production.** A stay with `isPlaceholder: true` only shows in preview builds.
- **Prices and ratings must be real.** The site hides empty blocks automatically, so leaving something out is always better than guessing.
- **Photos with text baked in** (banners with headlines or phone numbers) look broken under the site's own headings. Use clean photos only.
