// PLACEHOLDER stay (isPlaceholder: true). Illustrative only — see docs/ADD-A-STAY.md.
import type { Stay } from "../../lib/content/types";
import { draft } from "../faq";
import { media } from "../media";

export const panjimLongStayResidence: Stay = {
  slug: "panjim-long-stay-residence",
  name: "Panjim Long-Stay Residence",
  type: "long-term",
  area: "panjim",
  region: "north-goa",
  headline: "A move-in ready two-bedroom home for months in Goa's capital",
  description:
    "A furnished two-bedroom home with a functional kitchen, reliable utilities and a quiet work corner, set up for monthly stays. Walkable to cafés and the riverside, with city conveniences close by.",
  bedrooms: 2,
  baths: 2,
  maxGuests: 3,
  pricePerNight: null,
  monthlyRent: 65000,
  priceNote: "Illustrative placeholder rent per month",
  images: ["gallery-07", "gallery-12"].map(media),
  amenities: ["wifi", "ac", "kitchen", "parking", "power-backup", "workspace", "washing-machine", "security"],
  highlights: ["Furnished and move-in ready", "Work corner with reliable Wi-Fi", "Monthly rental"],
  policies: {
    checkIn: "By arrangement",
    checkOut: "By arrangement",
    rules: ["Minimum stay of one month", "Rental agreement and photo ID required"],
    cancellation: "As per the rental agreement.",
  },
  location: { lat: 15.4989, lng: 73.8278, nearby: [{ name: "Fontainhas", distance: "10 min walk" }] },
  addOns: [
    { category: "travel", slug: "bike-rentals" },
    { category: "concierge", slug: "essentials-delivery" },
  ],
  faqs: [draft("What is the minimum stay?", "This home is offered on monthly rentals.")],
  collections: ["workation"],
  featured: false,
  isPlaceholder: true,
};
