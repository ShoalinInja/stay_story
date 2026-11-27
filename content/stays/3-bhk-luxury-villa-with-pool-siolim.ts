// Real photos from the owner (Nov 2026). Taken from the photos: 3 bedrooms, private plunge pool,
// three storeys with balconies, kitchen, dining, TV lounge. Bathroom count not confirmed, so `baths: 0` hides it.
// Price, guest count, check-in/out, rules and cancellation are shared on enquiry, never shown.
import type { Stay } from "../../lib/content/types";
import { media } from "../media";

const photo = (n: number) => media(`gallery-3-bhk-luxury-villa-with-pool-siolim-${String(n).padStart(2, "0")}`);

export const luxuryVilla3BhkSiolim: Stay = {
  slug: "3-bhk-luxury-villa-with-pool-siolim",
  name: "3 BHK Luxury Villa with Pool",
  type: "villa",
  area: "siolim",
  region: "north-goa",
  headline: "A three-storey villa in Siolim with a private plunge pool and balconies over the trees",
  description: [
    "A white three-storey villa with arched balconies and its own plunge pool, complete with a waterfall spout. Inside, teak and cane furniture, linen curtains and wood floors keep the rooms light and calm.",
    "",
    "There are three bedrooms: a blue four-poster room, a rose-pink cane bed and a sage-green room with glass doors onto a balcony over the trees. A green-tiled kitchen, a dining table with velvet chairs and a separate TV lounge complete the house.",
  ].join("\n"),
  bedrooms: 3,
  baths: 0, // not confirmed; 0 hides the bath count
  maxGuests: 6, // not shown; only used by the "Guests" search filter
  pricePerNight: null,
  images: Array.from({ length: 20 }, (_, i) => photo(i + 1)),
  amenities: ["private-pool", "ac", "kitchen", "tv"],
  highlights: ["Private plunge pool with a waterfall", "Three air-conditioned bedrooms", "Balconies over the trees", "Teak and cane furnished living room"],
  spaces: [
    { name: "Plunge pool", description: "A blue-tiled pool with a waterfall spout, right beside the house.", image: photo(2) },
    { name: "Living room", description: "Teak and cane armchairs, a cream sofa and a rocking chair.", image: photo(1) },
    { name: "Bedrooms", description: "Three bedrooms, each with its own style: blue four-poster, rose-pink cane and sage green.", image: photo(7) },
    { name: "Kitchen", description: "White cabinets, a green herringbone splashback and a window onto the trees.", image: photo(5) },
    { name: "Dining", description: "Purple velvet chairs around the table, on patterned tiles.", image: photo(10) },
    { name: "Balcony", description: "Glass doors open onto a balcony with a wrought-iron railing.", image: photo(12) },
  ],
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
  collections: ["pool-villas"],
  featured: true,
};
