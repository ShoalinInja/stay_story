import { test } from "node:test";
import assert from "node:assert/strict";
import { findPlaceholders } from "./placeholders";
import type { ContentBundle, Stay } from "./types";

const stay = (over: Partial<Stay>): Stay => ({
  slug: "s", name: "S", type: "villa", area: "siolim", region: "north-goa", headline: "", description: "",
  bedrooms: 3, baths: 3, maxGuests: 6, pricePerNight: 10000, images: [], amenities: [], highlights: [],
  policies: { checkIn: "", checkOut: "", rules: [], cancellation: "" },
  location: { lat: 0, lng: 0, nearby: [] }, addOns: [], faqs: [], collections: [], featured: false, ...over,
});

const bundle = (stays: Stay[]): ContentBundle => ({
  site: { faqs: [{ q: "q", a: "a", needsReview: true }] } as unknown as ContentBundle["site"],
  stays, categories: [], areas: [], collections: [], offers: [], testimonials: [], media: [], redirects: [],
});

test("findPlaceholders lists placeholder stays and unreviewed FAQs", () => {
  const out = findPlaceholders(bundle([stay({ slug: "a", isPlaceholder: true }), stay({ slug: "b" })]));
  assert.deepEqual(out, ["stay:a", "site:faq[0]"]);
});
