// OWNER: A1 content-migrator. Site-wide content. Sources: /index.php, /about-us.php, /contact-us.php, BRIEF §3.1.
import type { NavGroup, Site } from "../lib/content/types";
import { draft } from "./faq";
import { LOGO, media } from "./media";

/** Six mega-menu groups, one per service category, matching the new routes in BRIEF §3.2. */
const nav: NavGroup[] = [
  {
    label: "Stays",
    href: "/stays",
    items: [
      { label: "Villas (Short Stay)", href: "/stays/villas" },
      { label: "Apartments & Hotels", href: "/stays/apartments-hotels" },
      { label: "Long-Term Rentals", href: "/stays/long-term-rentals" },
      { label: "Property Sales", href: "/property-sales" },
      { label: "List Your Property", href: "/list-your-property" },
    ],
    feature: { title: "Private pool villas", href: "/collections/pool-villas", image: media("gallery-14") },
  },
  {
    label: "Travel",
    href: "/travel",
    items: [
      { label: "Airport Transfers", href: "/travel/airport-transfers" },
      { label: "Chauffeur Services", href: "/travel/chauffeur" },
      { label: "Self-Drive Cars", href: "/travel/self-drive-cars" },
      { label: "Bike Rentals", href: "/travel/bike-rentals" },
    ],
    feature: { title: "Airport transfers", href: "/travel/airport-transfers", image: media("airport-transfers-cover") },
  },
  {
    label: "Experiences",
    href: "/experiences",
    items: [
      { label: "Yacht & Cruises", href: "/experiences/yacht-cruises" },
      { label: "Shisha Experience", href: "/experiences/shisha" },
      { label: "Workshops & Activities", href: "/experiences/workshops-activities" },
      { label: "Spiritual & Wellness", href: "/experiences/wellness" },
      { label: "VIP Club Access", href: "/experiences/vip-club-access" },
    ],
    feature: { title: "Sunset yacht cruises", href: "/experiences/yacht-cruises", image: media("yacht-cruises-cover") },
  },
  {
    label: "Events",
    href: "/events",
    items: [
      { label: "Party Planning", href: "/events/party-planning" },
      { label: "Weddings", href: "/events/weddings" },
      { label: "Bachelor Parties", href: "/events/bachelor-parties" },
      { label: "Private Events", href: "/events/private-events" },
    ],
    feature: { title: "Destination weddings", href: "/events/weddings", image: media("wedding-services-cover") },
  },
  {
    label: "Dining & Concierge",
    href: "/concierge",
    items: [
      { label: "Private Chef & Catering", href: "/concierge/private-chef" },
      { label: "Bartenders & Mixologists", href: "/concierge/bartenders" },
      { label: "Cakes & Special Requests", href: "/concierge/special-requests" },
      // Babysitters and essentials delivery are isPlaceholder items (hidden in production), so they are not linked here yet.
    ],
    feature: { title: "A private chef at your villa", href: "/concierge/private-chef", image: media("private-chef-catering-cover") },
  },
  {
    label: "Entertainment",
    href: "/entertainment",
    items: [
      { label: "DJs & Singers", href: "/entertainment/djs-singers" },
      { label: "Dancers & Performers", href: "/entertainment/dancers-performers" },
      { label: "Makeup & Styling", href: "/entertainment/makeup-styling" },
      { label: "Tattoo, Henna & Face Art", href: "/entertainment/tattoo-henna" },
    ],
    feature: { title: "DJs and live singers", href: "/entertainment/djs-singers", image: media("djs-singers-cover") },
  },
];

export const site: Site = {
  name: "Stay Story",
  tagline: "Villas | Apartments | Yachts",
  logo: LOGO,
  phone: "+918828191510",
  whatsapp: "+918828191510", // set to null to hide all WhatsApp UI if this number is not on WhatsApp
  contactEmail: "staystory11@gmail.com",
  address: {
    line: "Ayan Hotels & Resorts, next to Aquarius, Marna",
    locality: "Siolim",
    region: "Goa",
    postalCode: "403517",
    country: "IN",
  },
  socials: [],
  nav,
  announcement: null,
  stats: null, // the legacy counters showed "0k+"; no real figures exist
  // Trust slots: fill with real data only (docs/OWNER-PUNCHLIST.md item 8). null hides each one.
  reviews: null, // e.g. { rating: 4.8, count: 112, url: "https://g.page/r/…/review" }
  replyTime: null, // e.g. "within 30 minutes, 9 am–9 pm"
  host: null, // e.g. { name: "…", role: "Founder, Stay Story", bio: "…", photo: media("host-…") }
  hero: {
    headline: "Your Trusted Partner for a Complete Goa Experience",
    sub: "Stays, travel, experiences and celebrations, arranged by one local team.",
    // Text-free gallery photos only: every legacy banner has copy baked into the image.
    slides: [
      { image: media("gallery-15"), cta: { label: "Explore villas", href: "/stays/villas" } },
      { image: media("gallery-03"), cta: { label: "Explore pool villas", href: "/collections/pool-villas" } },
      { image: media("gallery-02"), cta: { label: "Explore all stays", href: "/stays" } },
      { image: media("gallery-12"), cta: { label: "Explore long-term rentals", href: "/stays/long-term-rentals" } },
      { image: media("gallery-14"), cta: { label: "Explore celebrations", href: "/events" } },
    ],
  },
  about: {
    headline: "One team for every part of your Goa story",
    body: [
      "Stay Story brings stays, travel and lifestyle services in Goa together under one roof. Instead of juggling separate vendors for accommodation, transport, events and daily needs, you deal with one local team that handles every detail, from booking to execution.",
      "",
      "We offer short-stay villas, apartments, hotels, long-term rentals and property sales; airport transfers, chauffeurs, self-drive cars and bikes; yacht cruises, wellness, workshops and VIP nightlife; party, wedding, bachelor and private-event planning; private chefs, bartenders, babysitters and special requests; DJs, performers and makeup artists; and delivery of essentials and beverages.",
      "",
      "Whether you are here for a short holiday, a long stay or a special occasion, our local expertise and well-connected network give you access to some of the best properties, services and experiences across Goa.",
    ].join("\n"),
    whyChooseUs: [
      "All-in-one service, one point of contact",
      "Local expertise and a well-connected network",
      "Verified services you can rely on",
      "Transparent processes from booking to execution",
      "Personalised solutions for every request",
    ],
    closing: "Experience Goa with Confidence.",
  },
  // "The StayStory Standard" (BRIEF §6 A4). Icons are lucide-react names.
  features: [
    { icon: "waves", label: "Private Pool" },
    { icon: "chef-hat", label: "Private Chef" },
    { icon: "plane-landing", label: "Airport Pickup" },
    { icon: "sparkles", label: "Daily Housekeeping" },
    { icon: "party-popper", label: "Event Setup" },
    { icon: "sailboat", label: "Yacht Add-ons" },
    { icon: "headset", label: "24×7 Local Support" },
    { icon: "shield-check", label: "Verified Properties" },
  ],
  trust: [
    { icon: "layers", title: "All-in-One Goa", caption: "Stays, travel, experiences, events and concierge from a single trusted team." },
    { icon: "map-pinned", title: "Local Experts", caption: "A Siolim-based team with a well-connected network across Goa." },
    { icon: "badge-check", title: "Verified & Transparent", caption: "Verified properties and services, with clear processes from start to finish." },
  ],
  faqs: [
    draft("What does Stay Story do?", "We are a one-stop Goa partner for stays, travel, experiences, events, dining and concierge, and entertainment, serving holidaymakers, long-stay residents and event planners."),
    draft("Can you arrange everything for one trip?", "Yes. Accommodation, travel, experiences, events and daily needs can all be handled by one team, so you do not need separate vendors."),
    draft("Which parts of Goa do you cover?", "We arrange stays and services across North and South Goa, from our base in Siolim."),
    draft("Are your properties and services verified?", "Yes. We work with verified properties and trusted professionals, with transparent processes from booking to execution."),
    draft("Do you help with long stays and buying property?", "Yes. We offer long-term rentals and guide buyers through property purchases, from site visits to documentation."),
    draft("How do I make an enquiry?", "Call us or send an enquiry with your dates and requirements, and we will come back with suitable options."),
  ],
  seo: {
    title: "Stay Story Goa | Villas, Travel, Experiences & Events",
    description: "Villas, apartments and long stays in Goa, plus airport transfers, yacht cruises, event planning, private chefs and entertainment from one local team.",
    keywords: ["Goa villas", "stay in Goa", "Goa travel services", "Goa event planning", "Stay Story"],
    ogImage: "/media/legacy/gallery-15.webp",
  },
};
