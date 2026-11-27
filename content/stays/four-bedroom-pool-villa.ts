// PLACEHOLDER until the owner confirms the facts (isPlaceholder: true keeps it off the live site).
// Photos and video are the real shoot of this villa (Google Photos album + walkthrough video, Nov 2026).
// Taken from the photos: 4 bedrooms, 4 bathrooms, private pool, garden, covered patio, dining for eight.
// TO CONFIRM before going live: villa name and slug, area + map pin, check-in/out times,
// house rules, cancellation policy. Then delete `isPlaceholder: true`.
// Price and guest count are never shown on the site (shared on enquiry).
import type { Stay } from "../../lib/content/types";
import { media } from "../media";

const photo = (n: number) => media(`gallery-four-bedroom-pool-villa-${String(n).padStart(2, "0")}`);
const DIR = "/media/stays/four-bedroom-pool-villa";

export const fourBedroomPoolVilla: Stay = {
  slug: "four-bedroom-pool-villa",
  name: "Four-Bedroom Pool Villa",
  type: "villa",
  area: "siolim", // TO CONFIRM
  region: "north-goa", // TO CONFIRM
  headline: "A white two-storey villa with a private pool, lawn and four en-suite bedrooms",
  description: [
    "A bright two-storey villa set around a private pool and lawn, framed by palms. The open-plan living room, dining table for eight and breakfast bar with its leaf mural all look out to the garden.",
    "",
    "Upstairs, four bedrooms each have their own bathroom, one with a bathtub. A long balcony looks over the treetops, and a covered patio with wicker sofas sits beside the pool.",
  ].join("\n"),
  bedrooms: 4,
  baths: 4,
  maxGuests: 8, // not shown; only used by the "Guests" search filter
  pricePerNight: null,
  images: Array.from({ length: 24 }, (_, i) => photo(i + 1)),
  amenities: ["private-pool", "ac", "kitchen", "tv", "garden"],
  highlights: ["Private pool and lawn", "Four bedrooms, each with its own bathroom", "Covered patio beside the pool", "Dining for eight"],
  spaces: [
    { name: "Pool and garden", description: "A long blue-tiled pool with a lawn, palms and a pergola terrace.", image: photo(5) },
    { name: "Living and dining", description: "Open-plan living room with a TV wall, a table for eight and a breakfast bar.", image: photo(2) },
    { name: "Bedrooms", description: "Four bedrooms with their own bathrooms; one opens onto the balcony.", image: photo(3) },
    { name: "Covered patio", description: "Wicker sofas in the shade, a few steps from the pool.", image: photo(6) },
    { name: "Balcony", description: "A long upstairs balcony with wicker chairs, looking over the trees.", image: photo(7) },
    { name: "Kitchen", description: "A fitted kitchen with a hob, microwave and toaster.", image: photo(14) },
  ],
  video: { src: `${DIR}/tour.mp4`, poster: `${DIR}/tour-poster.webp`, width: 720, height: 1280 },
  policies: {
    checkIn: "To be confirmed",
    checkOut: "To be confirmed",
    rules: [],
    cancellation: "To be confirmed at the time of booking.",
  },
  location: { lat: 15.6316, lng: 73.7554, nearby: [] }, // TO CONFIRM: map pin
  addOns: [
    { category: "concierge", slug: "private-chef" },
    { category: "travel", slug: "airport-transfers" },
    { category: "events", slug: "party-planning" },
  ],
  faqs: [],
  collections: ["pool-villas", "group-stays"],
  featured: true,
  isPlaceholder: true,
};
