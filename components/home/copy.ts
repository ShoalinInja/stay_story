// TEMPORARY (A4): home-page labels that are not in /content yet. Lead will move these into `site`.
// Plain data only: imported by client components too, so no server-only imports here.
import type { GoaArea } from "@/lib/content/types";

export const HOME_COPY = {
  hero: { carouselLabel: "Goa highlights", prev: "Previous slide", next: "Next slide" },
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
  proof: {
    rating: (rating: number) => `★ ${rating.toFixed(1)} on Google`,
    reviews: (count: number) => `${count.toLocaleString("en-IN")} reviews`,
    reply: (t: string) => `Replies ${t}`,
    label: "Why guests trust us",
  },
  testimonials: {
    title: "What Guests Say",
    readAll: (count: number) => `Read all ${count.toLocaleString("en-IN")} reviews on Google`,
    meta: (stay: string | undefined, date: string | undefined) =>
      [stay, date && new Date(`${date}-01T00:00:00Z`).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" })]
        .filter(Boolean)
        .join(" · "),
  },
  host: { title: "Meet Your Host", cta: "Talk to us" },
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
