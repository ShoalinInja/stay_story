// OWNER: A1 content-migrator. Source: /stay-goa.php, /villas-goa.php, /apartments-hotels-goa.php,
// /long-term-rentals-goa.php, /property-sales-goa.php (raw extract in content/_legacy/).
// These items carry the copy for the /stays/* type landings and /property-sales.
import type { ServiceCategory } from "../../lib/content/types";
import { draft } from "../faq";
import { media } from "../media";

export const stays: ServiceCategory = {
  key: "stays",
  slug: "stays",
  title: "Stays",
  tagline: "Villas, apartments and long-term homes across Goa",
  cover: media("gallery-15"),
  intro:
    "From a weekend in a private pool villa to a few months in a furnished apartment, Stay Story matches you with handpicked, verified stays across North and South Goa, and helps you buy when you are ready to stay for good.",
  whyUs: [
    { title: "Handpicked and verified", body: "Every property is selected and checked for comfort, cleanliness and safety before we recommend it." },
    { title: "Local know-how", body: "We know which neighbourhoods suit beach days, nightlife or quiet work weeks, and match you accordingly." },
    { title: "One team for add-ons", body: "Private chefs, housekeeping, event setups and concierge help can be arranged around your stay." },
  ],
  faqs: [
    draft("What kinds of stays does Stay Story offer?", "Private villas for short stays, furnished apartments and hotels, long-term rentals, and homes for sale across Goa."),
    draft("Can I add services to my villa stay?", "Yes. Private chefs, housekeeping, event setup and concierge assistance can be arranged as add-ons."),
    draft("Do you have options for several weeks or months?", "Yes. Apartments and hotels suit multi-week visits, and long-term rentals cover monthly rentals and extended leases."),
    draft("Are the properties verified?", "Yes. Stay Story selects and verifies each property it recommends for quality, comfort and safety."),
    draft("How do I book a stay?", "Send an enquiry or call us with your dates, group size and preferred area, and we will share suitable options."),
  ],
  seo: {
    title: "Stays in Goa: Villas, Apartments & Long-Term Rentals | Stay Story",
    description: "Handpicked villas, apartments, hotels and long-term rentals across North and South Goa, plus property sales. Enquire with Stay Story.",
    keywords: ["stay in Goa", "villas in Goa", "apartments in Goa", "long-term rentals Goa", "property in Goa"],
  },
  items: [
    {
      slug: "villas",
      category: "stays",
      title: "Luxury Villas (Short Stay)",
      legacyPath: "/villas-goa.php",
      hero: media("gallery-15"),
      summary:
        "Private, fully furnished villas for weekends and short holidays in Goa, with pools, generous living spaces and add-on services, close to the beaches and nightlife.",
      sections: [
        { heading: "Space and privacy", icon: "waves", body: "Private pools, spacious living areas, equipped kitchens and elegant interiors give you the comfort of a home with the polish of a premium stay." },
        { heading: "Close to the action", icon: "map-pin", body: "Many of our villas sit near popular beaches, nightlife and local attractions, so the best of Goa is never far away." },
        { heading: "Made for every group", icon: "users", body: "Large groups get shared spaces and private bedrooms; couples get calm, intimate settings. Choose by location, budget and amenities." },
        { heading: "Easy, flexible booking", icon: "calendar-check", body: "A simple booking process, flexible check-in options and dedicated support keep short stays effortless." },
        { heading: "Add-ons on request", icon: "concierge-bell", body: "Arrange a private chef, housekeeping, an event setup or concierge assistance and tailor the villa to your trip." },
      ],
      idealFor: ["Families", "Groups of friends", "Couples", "Weekend getaways", "Celebrations"],
      faqs: [
        draft("Are your villas suitable for large groups?", "Yes. Group villas combine shared living spaces with private bedrooms."),
        draft("Is check-in flexible?", "Flexible check-in options are available; confirm the timings for your villa when you enquire."),
      ],
      related: ["apartments-hotels", "long-term-rentals", "property-sales"],
      seo: {
        title: "Luxury Private Villas in Goa for Short Stays | Stay Story",
        description: "Short-stay villas in Goa with private pools, spacious interiors and add-ons like private chefs and housekeeping. Enquire with Stay Story.",
        keywords: ["villas in Goa", "private pool villa Goa", "short stay villa Goa", "luxury villa Goa"],
      },
    },
    {
      slug: "apartments-hotels",
      category: "stays",
      title: "Apartments & Hotels",
      legacyPath: "/apartments-hotels-goa.php",
      hero: media("gallery-02"),
      summary:
        "Fully furnished apartments and well-kept hotels across Goa, for a few nights or a few weeks, with the independence of a home or the ease of hotel service.",
      sections: [
        { heading: "Furnished apartments", icon: "building-2", body: "Kitchens, living spaces and modern utilities in every unit, ideal for families, couples and long-stay guests who value privacy and independence." },
        { heading: "Hotels with full service", icon: "bell-ring", body: "Prefer classic hospitality? Choose hotels with housekeeping, room service and front-desk help, from budget-friendly to premium." },
        { heading: "Locations that fit you", icon: "map-pin", body: "Stay close to beaches, nightlife hubs or quiet residential pockets; we match the property to the Goa you want." },
        { heading: "Short or extended stays", icon: "calendar-range", body: "Flexible booking covers a weekend or a multi-week visit, with competitive pricing across accommodation types." },
        { heading: "Verified and well kept", icon: "shield-check", body: "Each property is selected for comfort and cleanliness, and checked by our local team." },
      ],
      idealFor: ["Families", "Couples", "Work trips", "Extended visits", "Budget-conscious travellers"],
      faqs: [
        draft("Do the apartments have kitchens?", "Yes. Apartments are fully furnished with kitchens, living spaces and modern utilities."),
        draft("Can I stay for several weeks?", "Yes. Apartments and hotels can be booked for short or multi-week stays."),
      ],
      related: ["villas", "long-term-rentals", "property-sales"],
      seo: {
        title: "Apartments & Hotels in Goa | Furnished, Flexible Stays | Stay Story",
        description: "Furnished apartments and full-service hotels in prime Goa locations, for short trips or multi-week stays. Enquire with Stay Story.",
        keywords: ["apartments in Goa", "hotels in Goa", "serviced apartment Goa", "furnished apartment Goa"],
      },
    },
    {
      slug: "long-term-rentals",
      category: "stays",
      title: "Long-Term Rentals",
      legacyPath: "/long-term-rentals-goa.php",
      hero: media("gallery-12"),
      summary:
        "Furnished homes, apartments and villas for months-long stays in Goa: move-in ready, work-friendly and matched to your budget, with support throughout your rental.",
      sections: [
        { heading: "Move-in ready homes", icon: "key-round", body: "Furnished apartments, villas and independent homes with functional kitchens, comfortable living areas and reliable utilities, so there is nothing to set up." },
        { heading: "Built for remote work", icon: "laptop", body: "Reliable internet, quiet surroundings and work-friendly setups for digital nomads and professionals, in calm residential areas or lively neighbourhoods." },
        { heading: "Flexible terms", icon: "calendar-range", body: "Monthly rentals or extended leases, tailored to your duration and budget." },
        { heading: "North or South Goa", icon: "map", body: "Choose North Goa's energy or South Goa's calm, with beaches, markets, cafés and essential services close by." },
        { heading: "Transparent agreements", icon: "file-check", body: "Verified properties, clear rental agreements and our support for the length of your stay." },
      ],
      idealFor: ["Digital nomads", "Remote workers", "Families relocating", "Entrepreneurs", "Extended holidays"],
      faqs: [
        draft("What lease lengths are available?", "Monthly rentals and extended leases, tailored to your duration and budget."),
        draft("Are the homes suitable for remote work?", "Many come with reliable internet and work-friendly setups; tell us what you need when you enquire."),
      ],
      related: ["apartments-hotels", "villas", "property-sales"],
      seo: {
        title: "Long-Term Rentals in Goa | Furnished Homes & Apartments | Stay Story",
        description: "Move-in ready furnished homes, apartments and villas in Goa for remote workers, families and extended stays. Monthly and longer leases.",
        keywords: ["long-term rental Goa", "monthly rental Goa", "furnished home Goa", "digital nomad Goa"],
      },
    },
    {
      slug: "property-sales",
      category: "stays",
      title: "Property Sales",
      legacyPath: "/property-sales-goa.php",
      hero: media("gallery-03"),
      summary:
        "Buy a villa, apartment or gated-community home in Goa with end-to-end guidance, from shortlisting and site visits to documentation, using verified, legally compliant listings.",
      sections: [
        { heading: "Homes and investments", icon: "home", body: "Beachfront villas, modern apartments and gated-community homes, for a holiday home, a rental investment or a permanent move." },
        { heading: "Guided start to finish", icon: "route", body: "We support property selection, site visits, documentation and the final transaction, explaining every step along the way." },
        { heading: "Rental income potential", icon: "trending-up", body: "Goa's tourism keeps rental demand strong. We help you find properties with high potential for short-term or long-term letting." },
        { heading: "Prime locations", icon: "map-pin", body: "Beachfront zones, popular tourist hubs and quiet residential neighbourhoods across North and South Goa." },
        { heading: "Verified, compliant listings", icon: "shield-check", body: "Every listing is verified and legally compliant, with clear information and fair pricing." },
      ],
      idealFor: ["Holiday-home buyers", "Investors", "Relocating families", "Rental-income seekers"],
      faqs: [
        draft("Do you help with the paperwork?", "Yes. Support covers property selection, site visits, documentation and the final transaction."),
        draft("Are the listings verified?", "Yes. Stay Story works with verified, legally compliant listings."),
      ],
      related: ["villas", "long-term-rentals", "apartments-hotels"],
      seo: {
        title: "Property for Sale in Goa | Villas, Apartments & Investments | Stay Story",
        description: "Buy villas, apartments and gated-community homes in Goa with verified listings and end-to-end guidance from site visit to documentation.",
        keywords: ["property for sale Goa", "buy villa Goa", "buy apartment Goa", "Goa real estate investment"],
      },
    },
  ],
};
