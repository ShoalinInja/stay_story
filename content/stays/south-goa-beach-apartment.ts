// PLACEHOLDER stay (isPlaceholder: true). Illustrative only — see docs/ADD-A-STAY.md.
import type { Stay } from "../../lib/content/types";
import { draft } from "../faq";
import { media } from "../media";

export const southGoaBeachApartment: Stay = {
  slug: "south-goa-beach-apartment",
  name: "South Goa Beach Apartment",
  type: "apartment",
  area: "south-goa",
  region: "south-goa",
  headline: "A furnished two-bedroom apartment for quiet South Goa days",
  description:
    "A fully furnished two-bedroom apartment with a kitchen, living space and modern utilities, a short walk from a quiet South Goa beach. Good for couples, small families and work-from-Goa weeks.",
  bedrooms: 2,
  baths: 2,
  maxGuests: 4,
  pricePerNight: 6500,
  priceNote: "Illustrative placeholder price",
  images: ["gallery-01", "gallery-13"].map(media),
  amenities: ["shared-pool", "wifi", "ac", "kitchen", "parking", "lift", "security", "workspace", "washing-machine"],
  highlights: ["Fully furnished", "Work-friendly setup", "Near the beach"],
  policies: {
    checkIn: "1:00 PM",
    checkOut: "11:00 AM",
    rules: ["No parties", "No smoking indoors", "Valid photo ID required for all guests"],
    cancellation: "To be confirmed at the time of booking.",
  },
  location: { lat: 15.2632, lng: 73.9256, nearby: [{ name: "Beach", distance: "10 min walk" }] },
  addOns: [
    { category: "travel", slug: "self-drive-cars" },
    { category: "experiences", slug: "wellness" },
  ],
  faqs: [draft("Is the apartment suitable for remote work?", "Yes. It has reliable Wi-Fi and a work-friendly setup.")],
  collections: ["couples", "workation"],
  featured: false,
  isPlaceholder: true,
};
