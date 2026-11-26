// TEMPORARY (A4): home-page labels that are not in /content yet. Lead will move these into `site`.
// Plain data only — imported by the client SearchBar too, so no server-only imports here.
import type { GoaArea, StayType } from "@/lib/content/types";

export const HOME_COPY = {
  hero: { carouselLabel: "Goa highlights", prev: "Previous slide", next: "Next slide" },
  search: {
    where: "Where in Goa",
    wherePlaceholder: "Anywhere in Goa",
    areasGroup: "Areas",
    typesGroup: "Stay types",
    checkIn: "Check-in",
    checkOut: "Check-out",
    datesTitle: "Select dates",
    datesError: "Choose a check-out date after check-in",
    guests: "Guests",
    submit: "Search",
    formLabel: "Search stays",
  },
  callback: { text: "Finding the right Goa stay should be easy. We're here to help!", cta: "Request Callback" },
  destinations: { title: "Pick a Destination", carouselLabel: "Goa destinations" },
  featured: {
    title: "Featured Stays",
    link: { href: "/stays", label: "View all stays" },
    tabs: { all: "All", north: "North Goa", south: "South Goa", pool: "Pool Villas" },
  },
  offers: {
    title: "Offers for You",
    tabs: { all: "All", stay: "Stay", experience: "Experience" },
    validTill: "Valid till",
    copy: "Copy Code",
    copied: "Code copied",
    copyFailed: "Couldn't copy — the code is",
  },
  plan: { title: "Plan Your Goa", carouselLabel: "Goa services" },
  collections: { title: "Choose a Stay Collection", carouselLabel: "Stay collections" },
  features: { title: "The StayStory Standard" },
  trust: { title: "Your Trusted Goa Partner" },
  stats: { title: "Stay Story in Numbers" },
  gallery: { title: "Moments from Goa", link: { href: "/gallery", label: "View gallery" } },
  listYourProperty: {
    title: "List Your Property with Stay Story",
    intro: "Own a villa or apartment in Goa? Our local team can help you host with confidence.",
    benefits: [
      { lead: "Local team", text: "guest communication and on-ground support from Siolim." },
      { lead: "More enquiries", text: "your home in front of travellers planning a Goa stay." },
      { lead: "Add-on services", text: "chefs, transfers and events that make stays memorable." },
      { lead: "Transparent process", text: "clear terms from listing to payout." },
    ],
    cta: { href: "/list-your-property", label: "Partner with us" },
    imageId: "gallery-13",
  },
  faq: { title: "Frequently Asked Questions" },
  enquiry: {
    title: "Plan your Goa trip with us",
    body: "Tell us what you need and our local team will come back with options.",
  },
} as const;

/** "Where in Goa" stay types (for-sale is not a stay search). */
export const STAY_TYPE_LABELS: Partial<Record<StayType, string>> = {
  villa: "Villas",
  apartment: "Apartments",
  hotel: "Hotels",
  "long-term": "Long-term rentals",
};

/** Lucide icon per area for the DestinationPicker (Area has no icon field yet). */
export const AREA_ICONS: Record<GoaArea, string> = {
  siolim: "sprout",
  anjuna: "shopping-bag",
  vagator: "castle",
  assagao: "coffee",
  morjim: "turtle",
  arambol: "drum",
  candolim: "umbrella",
  calangute: "sun",
  baga: "eighth-notes",
  panjim: "landmark",
  "south-goa": "tree-palm",
};
