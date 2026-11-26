// PLACEHOLDER stay (isPlaceholder: true). Illustrative only — see docs/ADD-A-STAY.md.
import type { Stay } from "../../lib/content/types";
import { draft } from "../faq";
import { media } from "../media";

export const assagaoGardenHouse: Stay = {
  slug: "assagao-garden-house",
  name: "Assagao Garden House",
  type: "villa",
  area: "assagao",
  region: "north-goa",
  headline: "A five-bedroom house with a pool and room for the whole group",
  description:
    "A generous five-bedroom home in leafy Assagao, with a plunge pool and loungers, a reading nook, an upstairs lounge and bright bedrooms. Built for big groups, celebrations and long lunches.",
  bedrooms: 5,
  baths: 5,
  maxGuests: 12,
  pricePerNight: 24000,
  priceNote: "Illustrative placeholder price",
  images: ["gallery-03", "gallery-11", "gallery-08", "gallery-07", "gallery-06"].map(media),
  amenities: ["private-pool", "wifi", "ac", "kitchen", "parking", "power-backup", "housekeeping", "caretaker", "chef-on-request", "bbq", "garden", "pet-friendly"],
  highlights: ["Plunge pool with loungers", "Five bedrooms", "Reading nook and upstairs lounge"],
  policies: {
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    rules: ["Events by prior arrangement only", "No smoking indoors", "Valid photo ID required for all guests"],
    cancellation: "To be confirmed at the time of booking.",
  },
  location: { lat: 15.5967, lng: 73.7712, nearby: [{ name: "Assagao village", distance: "5 min drive" }, { name: "Anjuna beach", distance: "15 min drive" }] },
  addOns: [
    { category: "concierge", slug: "private-chef" },
    { category: "events", slug: "bachelor-parties" },
    { category: "entertainment", slug: "djs-singers" },
  ],
  faqs: [draft("Can we bring our dog?", "This home is listed as pet-friendly; share your pet's details when you enquire.")],
  collections: ["group-stays", "party-villas", "pet-friendly", "pool-villas"],
  badges: ["pet-friendly"],
  featured: true,
  isPlaceholder: true,
};
