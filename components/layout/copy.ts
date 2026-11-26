// UI chrome labels for the site shell. Site has no fields for these yet (Lead request: move to content).
import type { Site } from "@/lib/content/types";

export const UI = {
  skip: "Skip to content",
  menu: "Menu",
  openMenu: "Open menu",
  submenu: (label: string) => `${label} menu`,
  getInTouch: "Get in Touch",
  enquire: "Enquire Now",
  enquireShort: "Enquire",
  call: "Call",
  callUs: (phone: string) => `Call us on ${phone}`,
  whatsapp: "WhatsApp",
  whatsappUs: "Chat with us on WhatsApp",
  home: "Home",
  breadcrumb: "Breadcrumb",
  copyCode: "Copy code",
  codeCopied: "Code copied",
  dismiss: "Dismiss",
  footer: {
    explore: "Explore stays and services",
    tabs: { villas: "Villas", apartments: "Apartments", longTerm: "Long-term", experiences: "Experiences", events: "Events", services: "Services" },
    villasIn: (area: string) => `Villas in ${area}`,
    apartmentsIn: (area: string) => `Apartments in ${area}`,
    longTermIn: (area: string) => `Long-term rentals in ${area}`,
    topAreas: "Top Areas",
    services: "Services",
    about: "About",
    support: "Support",
    contact: "Contact",
    follow: "Follow us",
    rights: (name: string) => `© ${name}. All rights reserved.`,
  },
  pages: {
    about: "About us",
    gallery: "Gallery",
    contact: "Contact us",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
  },
  contact: {
    intro: "Tell us your dates and what you need, and our team will come back with options.",
    address: "Address",
    phone: "Phone",
    email: "Email",
    directions: "Get directions on Google Maps",
    formTitle: "Send an enquiry",
  },
  gallery: {
    intro: "A look at the homes and moments we arrange across Goa.",
    open: (alt: string) => `Open photo: ${alt}`,
    prev: "Previous photo",
    next: "Next photo",
    count: (i: number, n: number) => `Photo ${i} of ${n}`,
  },
  about: { why: "Why choose us" },
  notFound: {
    title: "We couldn't find that page",
    body: "The page may have moved. Search for a stay or pick a category below.",
    categories: "Plan your Goa trip",
    home: "Back to home",
  },
  legalDraft:"Draft for legal review. This text has not yet been approved.",
} as const;

export const telHref = (phone: string) => `tel:${phone}`;
export const waHref = (whatsapp: string) => `https://wa.me/${whatsapp.replace(/\D/g, "")}`;
export const mapsHref = (a: Site["address"]) => `https://www.google.com/maps/search/?api=1&query=${a.lat},${a.lng}`;
/** "+918160182809" → "+91 81601 82809"; other formats pass through. */
export const formatPhone = (phone: string) => phone.replace(/^\+91(\d{5})(\d{5})$/, "+91 $1 $2");
