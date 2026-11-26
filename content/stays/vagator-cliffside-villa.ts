// PLACEHOLDER stay (isPlaceholder: true). Illustrative only — see docs/ADD-A-STAY.md.
import type { Stay } from "../../lib/content/types";
import { draft } from "../faq";
import { media } from "../media";

export const vagatorCliffsideVilla: Stay = {
  slug: "vagator-cliffside-villa",
  name: "Vagator Cliffside Villa",
  type: "villa",
  area: "vagator",
  region: "north-goa",
  headline: "A three-bedroom pool villa for slow mornings and Vagator sunsets",
  description:
    "A calm three-bedroom villa with a private pool framed by palms, pretty four-poster bedrooms and an easy indoor-outdoor flow. Close to Vagator's cliffs and cafés, quiet enough to switch off.",
  bedrooms: 3,
  baths: 3,
  maxGuests: 6,
  pricePerNight: 14500,
  priceNote: "Illustrative placeholder price",
  images: ["gallery-16", "gallery-09", "gallery-05"].map(media),
  amenities: ["private-pool", "wifi", "ac", "kitchen", "parking", "housekeeping", "tv"],
  highlights: ["Private pool", "Four-poster bedrooms", "Near Vagator's cliffs"],
  policies: {
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    rules: ["No smoking indoors", "Valid photo ID required for all guests"],
    cancellation: "To be confirmed at the time of booking.",
  },
  location: { lat: 15.6009, lng: 73.7443, nearby: [{ name: "Vagator beach", distance: "5 min drive" }, { name: "Chapora Fort", distance: "10 min drive" }] },
  addOns: [
    { category: "experiences", slug: "yacht-cruises" },
    { category: "concierge", slug: "special-requests" },
    { category: "travel", slug: "bike-rentals" },
  ],
  faqs: [draft("Is the pool private?", "Yes. The pool is for villa guests only.")],
  collections: ["pool-villas", "couples"],
  featured: true,
  isPlaceholder: true,
};
