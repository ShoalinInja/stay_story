// PLACEHOLDER stay (isPlaceholder: true). Photos are the real legacy gallery; every other detail is illustrative.
// Replace with a real listing — see docs/ADD-A-STAY.md.
import type { Stay } from "../../lib/content/types";
import { draft } from "../faq";
import { media } from "../media";

export const casaSiolim: Stay = {
  slug: "casa-siolim",
  name: "Casa Siolim",
  type: "villa",
  area: "siolim",
  region: "north-goa",
  headline: "A four-bedroom pool villa among the palms, minutes from the Chapora river",
  description: [
    "Casa Siolim is a light-filled modern villa built around a long lap pool, with four-poster bedrooms, a marble-floored living room and balconies that look out over coconut palms and paddy fields.",
    "",
    "Glass doors open straight onto the pool deck, the open kitchen and dining table seat eight, and every bedroom has its own character, from floral wallpaper to soft pink drapes.",
  ].join("\n"),
  bedrooms: 4,
  baths: 4,
  maxGuests: 10,
  pricePerNight: 18500,
  priceNote: "Illustrative placeholder price",
  images: ["gallery-15", "gallery-14", "gallery-02", "gallery-04", "gallery-10", "gallery-12", "gallery-13", "gallery-03"].map(media),
  amenities: ["private-pool", "wifi", "ac", "kitchen", "parking", "power-backup", "housekeeping", "caretaker", "chef-on-request", "tv", "garden"],
  highlights: ["Lap pool with sun loungers", "Four-poster bedrooms", "Balconies over palms and fields", "Dining for eight"],
  spaces: [
    { name: "Living room", description: "Marble floors, armchairs and glass doors that open onto the pool.", image: media("gallery-02") },
    { name: "Dining and kitchen", description: "A table for eight beside a fully equipped open kitchen.", image: media("gallery-04") },
    { name: "Balcony", description: "Wicker seating looking out over coconut palms.", image: media("gallery-12") },
  ],
  meals: "A private chef can be arranged on request.",
  policies: {
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    rules: ["No loud music after 10 PM", "No smoking indoors", "Valid photo ID required for all guests"],
    cancellation: "To be confirmed at the time of booking.",
  },
  location: { lat: 15.6316, lng: 73.7554, nearby: [{ name: "Siolim village centre", distance: "5 min drive" }, { name: "Vagator beach", distance: "15 min drive" }] },
  addOns: [
    { category: "concierge", slug: "private-chef" },
    { category: "travel", slug: "airport-transfers" },
    { category: "events", slug: "party-planning" },
    { category: "experiences", slug: "yacht-cruises" },
  ],
  faqs: [draft("Can we host a small celebration at the villa?", "Yes. Our events team can arrange décor, music and catering at the villa.")],
  collections: ["pool-villas", "group-stays", "party-villas"],
  featured: true,
  isPlaceholder: true,
};
