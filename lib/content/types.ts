// FROZEN CONTRACT — owned by Lead. Agents request changes; never edit directly.

export type StayType = "villa" | "apartment" | "hotel" | "long-term" | "for-sale";
export type GoaArea =
  | "siolim" | "anjuna" | "vagator" | "assagao" | "morjim" | "arambol"
  | "candolim" | "calangute" | "baga" | "panjim" | "south-goa";
export type Region = "north-goa" | "south-goa";

export type CategoryKey = "stays" | "travel" | "experiences" | "events" | "concierge" | "entertainment";
export type CollectionKey = "pool-villas" | "group-stays" | "couples" | "workation" | "pet-friendly" | "party-villas";
export type AmenityKey =
  | "private-pool" | "shared-pool" | "wifi" | "ac" | "kitchen" | "parking" | "power-backup"
  | "housekeeping" | "caretaker" | "chef-on-request" | "bbq" | "garden" | "tv" | "washing-machine"
  | "workspace" | "pet-friendly" | "lift" | "security" | "beach-access" | "gym";

export interface MediaRef { src: string; alt: string; width: number; height: number; blurDataURL?: string; hasBakedText?: boolean }  // hasBakedText: poster with text in the pixels — never overlay text or crop it as a background

/** Cross-link to a service item, e.g. { category: "experiences", slug: "yacht-cruises" } */
export interface ServiceRef { category: Exclude<CategoryKey, "stays">; slug: string }

export interface Faq { q: string; a: string; needsReview?: boolean }
export interface Seo { title: string; description: string; keywords?: string[]; ogImage?: string }

export interface Stay {
  slug: string; name: string; type: StayType; area: GoaArea; region: Region;
  headline: string; description: string;              // description is markdown
  bedrooms: number; baths: number; maxGuests: number;
  pricePerNight: number | null; priceNote?: string;    // null → "Price on request"
  monthlyRent?: number | null; salePrice?: number | null;
  images: MediaRef[];                                  // ≥5 → mosaic, else single-hero layout
  amenities: AmenityKey[]; highlights: string[];
  spaces?: { name: string; description: string; image?: MediaRef }[];
  meals?: string;
  policies: { checkIn: string; checkOut: string; rules: string[]; cancellation: string };
  location: { lat: number; lng: number; nearby: { name: string; distance: string }[] };
  addOns: ServiceRef[];
  faqs: Faq[]; collections: CollectionKey[]; badges?: ("best-rated" | "new" | "pet-friendly")[];
  rating?: { value: number; count: number; source: "google" | "airbnb" | "manual" };
  featured: boolean; isPlaceholder?: boolean; seo?: Seo;
}

export interface ServiceCategory {
  key: CategoryKey; slug: string; title: string; tagline: string; cover: MediaRef;
  items: ServiceItem[]; seo: Seo;
  intro?: string; whyUs?: { title: string; body: string }[]; faqs?: Faq[];
}

export interface ServiceItem {
  slug: string; category: CategoryKey; title: string; legacyPath: string;   // e.g. "/yacht-cruises-goa.php"
  hero: MediaRef; summary: string;
  sections: { heading: string; body: string; icon?: string }[];
  idealFor: string[]; inclusions?: string[]; priceFrom?: number | null;
  faqs: Faq[]; related: string[]; seo: Seo; isPlaceholder?: boolean;
}

export interface Enquiry {
  type: "stay" | "service" | "callback" | "property-owner" | "general";
  name: string; phone: string; email?: string; message?: string;
  staySlug?: string; serviceSlug?: string; checkIn?: string; checkOut?: string; // ISO YYYY-MM-DD
  adults?: number; children?: number; rooms?: number; budget?: string;
  source: string; utm?: Record<string, string>; website?: string /* honeypot */;
}

// ---- Site-level content (added by Lead to cover Sections 2–3) ----

export interface NavLink { label: string; href: string }
export interface NavGroup { label: string; href: string; items: NavLink[]; feature?: { title: string; href: string; image: MediaRef } }

export interface Site {
  name: string; tagline: string; logo: MediaRef;
  phone: string;                 // E.164, e.g. "+918160182809"
  whatsapp: string | null;       // null hides all WhatsApp UI
  contactEmail: string;
  address: { line: string; locality: string; region: string; postalCode: string; country: "IN" };
  socials: { platform: string; url: string }[];  // [] hides icons
  nav: NavGroup[];
  announcement: { text: string; code?: string; href?: string } | null;
  stats: { label: string; value: string }[] | null;  // null hides Stats block
  hero: { headline: string; sub?: string; slides: { image: MediaRef; cta: NavLink }[] };
  about: { headline: string; body: string; whyChooseUs: string[]; closing: string };
  features: { icon: string; label: string }[];         // "The StayStory Standard"
  trust: { icon: string; title: string; caption: string }[];
  faqs: Faq[];
  seo: Seo;
}

export interface Area { key: GoaArea; name: string; region: Region; intro: string; image?: MediaRef; seo: Seo }
export interface Collection { key: CollectionKey; title: string; description: string; image: MediaRef; seo: Seo; isPlaceholder?: boolean }

export interface Offer {
  id: string; kind: "stay" | "experience"; title: string; description: string;
  code: string; validTill: string; icon?: MediaRef;
}
export interface Testimonial { name: string; quote: string; image?: MediaRef; source: "google" | "manual"; date?: string }

export interface MediaEntry extends MediaRef { id: string; usedOn: string[] }
export interface LegacyRedirect { source: string; destination: string; statusCode: 301 }  // brief demands 301, not Next's default 308

export interface StayFilters {
  area?: GoaArea; region?: Region; type?: StayType; guests?: number; bedrooms?: number;
  minPrice?: number; maxPrice?: number; amenities?: AmenityKey[]; collection?: CollectionKey; featured?: boolean;
  sort?: "featured" | "price-asc" | "price-desc" | "guests";
}

/** Shape of the /content barrel (content/index.ts). A1 fills it. */
export interface ContentBundle {
  site: Site; stays: Stay[]; categories: ServiceCategory[]; areas: Area[];
  collections: Collection[]; offers: Offer[]; testimonials: Testimonial[];
  media: MediaEntry[]; redirects: LegacyRedirect[];
}
