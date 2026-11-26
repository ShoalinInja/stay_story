// OWNER: A1 content-migrator. Source: /dining-concierge-goa.php, /private-chef-catering-goa.php,
// /bartenders-mixologists-goa.php, /cake-special-requests-goa.php, /about-us.php.
// Babysitters and essentials delivery have no legacy page of their own (one paragraph / one sentence),
// so they stay isPlaceholder until the owner confirms the details.
import type { ServiceCategory } from "../../lib/content/types";
import { draft } from "../faq";
import { media } from "../media";

export const concierge: ServiceCategory = {
  key: "concierge",
  slug: "concierge",
  title: "Dining & Concierge",
  tagline: "Private chefs, bartenders, celebrations and everyday help",
  cover: media("dining-concierge-cover"),
  intro:
    "Restaurant-quality meals at your villa, a bar that runs itself, a cake that arrives on cue, a trusted babysitter for the evening. Stay Story's concierge team handles the details so your stay feels effortless.",
  whyUs: [
    { title: "Personal by default", body: "Menus, drinks and arrangements are tailored to you, never off the shelf." },
    { title: "A network of professionals", body: "Chefs, bartenders, bakers and caregivers we know and trust." },
    { title: "One call away", body: "From reservations to last-minute requests, our team handles it." },
  ],
  faqs: [
    draft("What does the concierge service cover?", "Private chefs and catering, bartenders, custom cakes and special requests, babysitters, reservations and last-minute arrangements."),
    draft("Can a private chef cook at my villa?", "Yes. Chefs prepare fresh meals at your villa, apartment or private space."),
    draft("Can menus suit dietary requirements?", "Yes. Menus are designed around your taste, dietary requirements and occasion."),
    draft("Can you handle last-minute requests?", "Yes. Our concierge team handles reservations, arrangements and last-minute requests."),
    draft("Do you deliver essentials and beverages?", "Delivery of essentials, beverages and daily needs is offered; contact us for current availability."),
  ],
  seo: {
    title: "Dining & Concierge in Goa: Private Chefs, Bartenders & More | Stay Story",
    description: "Private chefs and catering, bartenders and mixologists, custom cakes, babysitters and personal concierge help for your Goa stay.",
    keywords: ["private chef Goa", "concierge Goa", "catering Goa", "bartender Goa"],
  },
  items: [
    {
      slug: "private-chef",
      category: "concierge",
      title: "Private Chef & Catering",
      legacyPath: "/private-chef-catering-goa.php",
      hero: media("private-chef-catering-cover"),
      summary:
        "Private chefs who cook fresh, personalised menus in your villa or apartment, from breakfast spreads to multi-course dinners, plus full-service catering for parties, weddings and corporate events.",
      sections: [
        { heading: "A chef at your stay", icon: "chef-hat", body: "Experienced chefs prepare fresh meals in your villa, apartment or private space, from breakfast setups to multi-course dinners." },
        { heading: "Menus made for you", icon: "notebook-pen", body: "Goan, Indian or international, designed around your taste, dietary needs and occasion." },
        { heading: "Catering for events", icon: "utensils", body: "Full-service catering for private parties, weddings and corporate gatherings, from preparation and presentation to service and cleanup." },
        { heading: "Quality on every plate", icon: "sparkles", body: "Fresh ingredients, high hygiene standards and professional presentation." },
        { heading: "Daily meals or one night", icon: "calendar", body: "Book a chef for your whole stay or for a single celebration." },
      ],
      idealFor: ["Villa stays", "Family gatherings", "Birthdays and anniversaries", "Weddings", "Corporate events"],
      faqs: [
        draft("What cuisines can the chef cook?", "Traditional Goan, Indian and international dishes, tailored to your menu."),
        draft("Do you cater large events?", "Yes. Full-service catering covers private parties, weddings and corporate gatherings."),
      ],
      related: ["bartenders", "special-requests"],
      seo: {
        title: "Private Chef & Catering in Goa | Stay Story",
        description: "Book a private chef for your Goa villa or full-service catering for events. Goan, Indian and international menus made for you.",
        keywords: ["private chef Goa", "villa chef Goa", "catering Goa"],
      },
    },
    {
      slug: "bartenders",
      category: "concierge",
      title: "Bartenders & Mixologists",
      legacyPath: "/bartenders-mixologists-goa.php",
      hero: media("bartenders-mixologists-cover"),
      summary:
        "Professional bartenders and mixologists for parties, weddings and corporate events, with a complete bar setup, glassware and staff, and a drinks menu designed around your guests.",
      sections: [
        { heading: "Signature cocktails", icon: "martini", body: "Classics and signature creations, crafted with quality ingredients and an eye for presentation." },
        { heading: "Full bar setup", icon: "wine", body: "Setup, equipment, glassware and service staff, managed from preparation to the end of the night." },
        { heading: "A menu for your event", icon: "notebook-pen", body: "Custom drink menus shaped by your theme, event type and guest profile." },
        { heading: "Any occasion", icon: "party-popper", body: "Birthdays, bachelor parties, weddings and corporate gatherings." },
        { heading: "Experienced staff", icon: "user-check", body: "Trained professionals who keep service efficient, clean and lively." },
      ],
      idealFor: ["Villa parties", "Weddings", "Bachelor parties", "Corporate events"],
      faqs: [
        draft("Do you bring glassware and equipment?", "Yes. Bar services include setup, equipment, glassware and service staff."),
        draft("Can the drinks menu be customised?", "Yes. Menus are tailored to your preferences, event type and guests."),
      ],
      related: ["private-chef", "special-requests"],
      seo: {
        title: "Bartenders & Mixologists in Goa for Events | Stay Story",
        description: "Hire professional bartenders and mixologists in Goa with a complete bar setup and custom cocktail menu for parties, weddings and events.",
        keywords: ["bartender Goa", "mixologist Goa", "bar setup Goa"],
      },
    },
    {
      slug: "special-requests",
      category: "concierge",
      title: "Cakes & Special Requests",
      legacyPath: "/cake-special-requests-goa.php",
      hero: media("cake-special-requests-cover"),
      summary:
        "Custom cakes, surprise setups, flowers and gifts for birthdays, anniversaries and proposals in Goa, designed to your theme and delivered on time.",
      sections: [
        { heading: "Cakes made to order", icon: "cake", body: "Custom-designed cakes, from classic flavours to premium designs, made with skilled bakers." },
        { heading: "Surprise setups", icon: "gift", body: "Romantic room décor, themed party arrangements and surprise setups for life's milestones." },
        { heading: "Flowers and gifts", icon: "flower", body: "Gift arrangements, flower deliveries and custom setups that bring your idea to life." },
        { heading: "On time, as planned", icon: "clock", body: "Cakes and arrangements are delivered on schedule and set up exactly as planned." },
        { heading: "Pairs with your event", icon: "puzzle", body: "Combine with event planning, catering and entertainment for a complete celebration." },
      ],
      idealFor: ["Birthdays", "Anniversaries", "Proposals", "Surprise celebrations"],
      faqs: [
        draft("Can you set up a surprise at our villa?", "Yes. Room decorations and surprise setups can be arranged at your stay."),
        draft("Do you deliver flowers?", "Yes. Flower deliveries and gift arrangements are available."),
      ],
      related: ["private-chef", "bartenders"],
      seo: {
        title: "Custom Cakes & Surprise Setups in Goa | Stay Story",
        description: "Custom cakes, surprise room decorations, flowers and gifts for birthdays, anniversaries and proposals in Goa, delivered on time.",
        keywords: ["custom cake Goa", "surprise setup Goa", "birthday decoration Goa"],
      },
    },
    {
      slug: "babysitters",
      category: "concierge",
      title: "Babysitters",
      legacyPath: "/dining-concierge-goa.php",
      hero: media("dining-concierge-cover"),
      isPlaceholder: true,
      summary:
        "Experienced, trustworthy caregivers who look after your children at your stay while you enjoy an outing or an event.",
      sections: [
        { heading: "Peace of mind", icon: "heart-handshake", body: "We connect you with experienced and trustworthy caregivers, so children are cared for safely and comfortably." },
        { heading: "Made for family trips", icon: "baby", body: "Enjoy a dinner out, an event or an experience while the little ones stay settled." },
        { heading: "Pairs with your plans", icon: "puzzle", body: "Combine with a private chef, an event or an experience for a smoother family stay." },
        { heading: "How to arrange it", icon: "phone", body: "Share your dates, timings and children's ages when you enquire, and we will confirm availability." },
      ],
      idealFor: ["Families with young children", "Parents attending events"],
      faqs: [draft("Are the babysitters experienced?", "Stay Story connects you with experienced, trustworthy caregivers.")],
      related: ["private-chef", "special-requests"],
      seo: {
        title: "Babysitters in Goa for Holidaymakers | Stay Story",
        description: "Experienced, trustworthy babysitters for families staying in Goa, arranged by Stay Story's concierge team.",
        keywords: ["babysitter Goa", "nanny Goa"],
      },
    },
    {
      slug: "essentials-delivery",
      category: "concierge",
      title: "Essentials & Beverage Delivery",
      legacyPath: "/about-us.php",
      hero: media("dining-concierge-banner"),
      isPlaceholder: true,
      summary:
        "Delivery of essentials, beverages and other daily needs to your stay, so you can skip the shop run and spend your time enjoying Goa.",
      sections: [
        { heading: "Daily needs, delivered", icon: "shopping-bag", body: "Essentials, beverages and other everyday items brought to your villa or apartment." },
        { heading: "More time for Goa", icon: "sun", body: "Skip the shop run and spend your time on the beach, not in the aisles." },
        { heading: "Part of one service", icon: "puzzle", body: "Add deliveries alongside your stay, chef or event bookings with the same team." },
        { heading: "How to arrange it", icon: "phone", body: "Tell us what you need and where you are staying, and we will confirm availability." },
      ],
      idealFor: ["Villa stays", "Long-term renters", "Party hosts"],
      faqs: [draft("What can be delivered?", "Essentials, beverages and other daily needs; contact us for what is currently available.")],
      related: ["bartenders", "private-chef"],
      seo: {
        title: "Essentials & Beverage Delivery in Goa | Stay Story",
        description: "Essentials, beverages and daily needs delivered to your villa or apartment in Goa by Stay Story.",
        keywords: ["grocery delivery Goa", "villa essentials Goa"],
      },
    },
  ],
};
