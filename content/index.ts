// OWNER: A1 content-migrator. Barrel that assembles every content module into one bundle.
// Phase 0 stub: real values for contact facts only; A1 replaces/extends each field.
import type { ContentBundle } from "../lib/content/types";

export const content: ContentBundle = {
  site: {
    name: "Stay Story",
    tagline: "Villa | Apartment | Hotel | Plot",
    logo: { src: "/media/brand/logo.png", alt: "Stay Story", width: 200, height: 60 },
    phone: "+918160182809",
    whatsapp: null, // unconfirmed with owner
    contactEmail: "kishankumar0520@gmail.com", // TODO owner: swap to hello@staystory.in
    address: {
      line: "Home no 02, Circle, Pernem, Chopdem", locality: "Siolim", region: "Goa",
      postalCode: "403512", country: "IN", lat: 15.631582, lng: 73.755411,
    },
    socials: [],
    nav: [],
    announcement: null,
    stats: null,
    hero: { headline: "Your Trusted Partner for a Complete Goa Experience", slides: [] },
    about: { headline: "", body: "", whyChooseUs: [], closing: "Experience Goa with Confidence." },
    features: [],
    trust: [],
    faqs: [],
    seo: { title: "Stay Story Goa", description: "Stays, travel, experiences and events in Goa." },
  },
  stays: [],
  categories: [],
  areas: [],
  collections: [],
  offers: [],
  testimonials: [],
  media: [],
  redirects: [],
};
