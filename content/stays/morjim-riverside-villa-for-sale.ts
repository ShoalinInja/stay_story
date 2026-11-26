// PLACEHOLDER listing (isPlaceholder: true). Illustrative only — see docs/ADD-A-STAY.md.
import type { Stay } from "../../lib/content/types";
import { draft } from "../faq";
import { media } from "../media";

export const morjimRiversideVillaForSale: Stay = {
  slug: "morjim-riverside-villa-for-sale",
  name: "Morjim Riverside Villa (For Sale)",
  type: "for-sale",
  area: "morjim",
  region: "north-goa",
  headline: "A three-bedroom pool villa near the Chapora river, available to buy",
  description:
    "A modern three-bedroom villa with a private pool and landscaped garden, suited to a holiday home or a rental investment. Site visits, documentation and the final transaction are supported end to end.",
  bedrooms: 3,
  baths: 3,
  maxGuests: 6,
  pricePerNight: null,
  salePrice: 32500000,
  priceNote: "Illustrative placeholder sale price",
  images: ["gallery-14", "gallery-02", "gallery-10"].map(media),
  amenities: ["private-pool", "parking", "garden", "kitchen", "power-backup", "security"],
  highlights: ["Private pool", "Holiday-home or rental investment", "Guided purchase process"],
  policies: {
    checkIn: "Site visits by appointment",
    checkOut: "Site visits by appointment",
    rules: ["Verified, legally compliant listing"],
    cancellation: "Not applicable.",
  },
  location: { lat: 15.6305, lng: 73.7353, nearby: [{ name: "Morjim beach", distance: "10 min drive" }] },
  addOns: [],
  faqs: [draft("Can I visit the property?", "Yes. Site visits are arranged by appointment.")],
  collections: [],
  featured: false,
  isPlaceholder: true,
};
