// Real shoot of this villa (owner's Google Photos album + walkthrough video, Nov 2026).
// Taken from the photos: 4 bedrooms, 4 bathrooms, private pool, garden, covered patio, dining for eight.
// Price, guest count, check-in/out, rules and cancellation are shared on enquiry, never shown.
// Area confirmed by the owner: Siolim. Map pin is the village centre until the exact pin is sent.
import type { Stay } from "../../lib/content/types";
import { media } from "../media";

export const photo4Bhk = (n: number) => media(`gallery-four-bedroom-pool-villa-${String(n).padStart(2, "0")}`);
const DIR = "/media/stays/four-bedroom-pool-villa";
const photo = photo4Bhk;

export const luxuryVilla4Bhk: Stay = {
  slug: "4-bhk-luxury-villa-with-pool",
  name: "4 BHK Luxury Villa with Pool",
  type: "villa",
  area: "siolim",
  region: "north-goa",
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
    checkIn: "Shared on enquiry",
    checkOut: "Shared on enquiry",
    rules: [],
    cancellation: "Shared on enquiry.",
  },
  location: { lat: 15.6316, lng: 73.7554, nearby: [] }, // Siolim village centre; replace with the villa pin
  addOns: [
    { category: "concierge", slug: "private-chef" },
    { category: "travel", slug: "airport-transfers" },
    { category: "events", slug: "party-planning" },
  ],
  faqs: [],
  collections: ["pool-villas", "group-stays"],
  featured: true,
};
