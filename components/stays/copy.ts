// UI labels the content layer does not carry. Listed for the Lead in the A5 report;
// move into /content if the owner wants to edit them.
import type { AmenityKey, Stay, StayType } from "@/lib/content/types";

export const TYPE_LABELS: Record<StayType, string> = {
  villa: "Villa",
  apartment: "Apartment",
  hotel: "Hotel",
  "long-term": "Long-term rental",
  "for-sale": "For sale",
};

/** Exhaustive over AmenityKey, so it doubles as the runtime list of valid amenity values. `icon` is a lucide name. */
export const AMENITIES: Record<AmenityKey, { label: string; icon: string }> = {
  "private-pool": { label: "Private pool", icon: "waves" },
  "shared-pool": { label: "Shared pool", icon: "waves" },
  wifi: { label: "Wi-Fi", icon: "wifi" },
  ac: { label: "Air conditioning", icon: "air-vent" },
  kitchen: { label: "Kitchen", icon: "cooking-pot" },
  parking: { label: "Parking", icon: "car" },
  "power-backup": { label: "Power backup", icon: "battery-charging" },
  housekeeping: { label: "Housekeeping", icon: "sparkles" },
  caretaker: { label: "Caretaker", icon: "user-round" },
  "chef-on-request": { label: "Chef on request", icon: "chef-hat" },
  bbq: { label: "Barbecue", icon: "flame" },
  garden: { label: "Garden", icon: "trees" },
  tv: { label: "TV", icon: "tv" },
  "washing-machine": { label: "Washing machine", icon: "washing-machine" },
  workspace: { label: "Workspace", icon: "laptop" },
  "pet-friendly": { label: "Pet friendly", icon: "paw-print" },
  lift: { label: "Lift", icon: "arrow-up-down" },
  security: { label: "Security", icon: "shield-check" },
  "beach-access": { label: "Beach access", icon: "umbrella" },
  gym: { label: "Gym", icon: "dumbbell" },
};

export const BADGE_LABELS: Record<NonNullable<Stay["badges"]>[number], string> = {
  "best-rated": "Best Rated",
  new: "New",
  "pet-friendly": "Pet Friendly",
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export const copy = {
  card: {
    meta: (s: Pick<Stay, "maxGuests" | "bedrooms" | "baths">) =>
      `Up to ${plural(s.maxGuests, "Guest", "Guests")} + ${plural(s.bedrooms, "Room", "Rooms")} + ${plural(s.baths, "Bath", "Baths")}`,
    view: (name: string) => `View ${name}`,
    save: (name: string) => `Save ${name}`,
    photo: (i: number, n: number) => `Show photo ${i} of ${n}`,
    photos: (name: string) => `Photos of ${name}`,
  },
  filters: {
    title: "Filters",
    open: "Filters",
    area: "Area",
    anyArea: "Anywhere in Goa",
    northGoa: "All of North Goa",
    type: "Stay type",
    anyType: "Any type",
    guests: "Guests",
    bedrooms: "Bedrooms",
    anyBedrooms: "Any",
    bedroomsMin: (n: number) => `${n}+`,
    price: "Price per night (₹)",
    minPrice: "Min",
    maxPrice: "Max",
    amenities: "Amenities",
    sort: "Sort by",
    sorts: { featured: "Featured", "price-asc": "Price: low to high", "price-desc": "Price: high to low", guests: "Most guests" },
    apply: "Show stays",
    clear: "Clear all",
    results: (n: number) => plural(n, "stay", "stays"),
  },
  empty: {
    noMatch: "No stays match. Tell us what you need and we'll find it.",
    largeGroup: "We can combine villas for large groups",
    largeGroupBody: (guests: number) => `Tell us about your group of ${guests} and we'll put together villas close to each other.`,
    noneInArea: (name: string) => `No stays listed in ${name} yet. Tell us what you need and we'll find it.`,
    noneInCollection: "No stays in this collection yet. Tell us what you need and we'll find it.",
    noneForSale: "No properties are listed for sale right now. Tell us what you are looking for and we'll share options.",
    noneOfType: "No stays of this type are listed yet. Tell us what you need and we'll find it.",
  },
  detail: {
    breadcrumbsHome: "Home",
    breadcrumbsStays: "Stays",
    tabs: {
      overview: "Overview", highlights: "Highlights", policies: "Policies", spaces: "Spaces", video: "Video tour", reviews: "Reviews",
      amenities: "Amenities", meals: "Meals", location: "Location", experiences: "Experiences", faqs: "FAQs",
    },
    sectionNav: "Sections",
    videoLabel: (name: string) => `Video tour of ${name}`,
    checkIn: "Check-in",
    checkOut: "Check-out",
    houseRules: "House rules",
    cancellation: "Cancellation",
    nearby: "Nearby",
    openMap: "Open in Google Maps",
    reviews: (value: number, count: number, source: string) => `${value.toFixed(1)} out of 5 from ${plural(count, "review", "reviews")} on ${source}`,
    viewPhotos: "View photos",
    morePhotos: (n: number) => `+${n} More`,
    photo: (i: number, n: number) => `Photo ${i} of ${n}`,
    prevPhoto: "Previous photo",
    nextPhoto: "Next photo",
    gallery: "Photo gallery",
    forRooms: (n: number) => `for ${plural(n, "room", "rooms")}`,
    bestPrice: "Select dates for best price",
    enquire: "Enquire Now",
    enquireShort: "Enquire",
    quote: "Get a Quote",
    siteVisit: "Schedule a site visit",
    moveIn: "Ask about move-in",
    connectHost: "Connect with host",
    callback: "Request Callback",
    related: "More stays you may like",
    experiencesIntro: "Add these to your stay",
  },
  sales: {
    buyerTitle: "Looking to buy?",
    ownerTitle: "Selling a property?",
    ownerBody: "Tell us about your property and our team will get in touch.",
    listings: "Properties for sale",
  },
  typeLanding: { listings: "Available stays", idealFor: "Ideal for" },
  area: { heading: (name: string) => `Villas & stays in ${name}` },
  // Owner pitch for /list-your-property. Built only from claims already on the site; owner to review.
  listYourProperty: {
    title: "List your property with Stay Story",
    intro: "Own a villa, apartment or home in Goa? Partner with Stay Story and reach guests looking for verified stays, with a local team behind every booking.",
    benefits: [
      { lead: "Guests who want Goa done right.", body: "Families, groups, couples and long-stay residents come to us for verified, well-kept stays." },
      { lead: "A local team in North Goa.", body: "We are based in Siolim and know the neighbourhoods our guests ask about." },
      { lead: "More than a listing.", body: "Our travel, concierge and events services make your property a complete Goa stay." },
      { lead: "Short stays, long stays or a sale.", body: "Whether you want holiday guests, monthly tenants or a buyer, tell us your plans." },
    ],
    formTitle: "Tell us about your property",
    submit: "Partner with us",
  },
} as const;
