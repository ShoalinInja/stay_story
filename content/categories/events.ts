// OWNER: A1 content-migrator. Source: /events-celebrations-goa.php, /party-planning-goa.php, /wedding-services-goa.php,
// /bachelor-party-goa.php, /private-events-goa.php.
import type { ServiceCategory } from "../../lib/content/types";
import { draft } from "../faq";
import { media } from "../media";

export const events: ServiceCategory = {
  key: "events",
  slug: "events",
  title: "Events & Celebrations",
  tagline: "Parties, weddings, bachelor trips and private events",
  cover: media("events-celebrations-cover"),
  intro:
    "Beaches, villas and nightlife make Goa a natural stage. Stay Story plans parties, destination weddings, bachelor and bachelorette trips and private events end to end, with trusted vendors and on-site management.",
  whyUs: [
    { title: "Creative, personal planning", body: "Every event is designed around your vision, style and guests." },
    { title: "Trusted vendors and venues", body: "We work with proven local partners for décor, food, music and more." },
    { title: "End-to-end execution", body: "From first idea to on-site management, one team runs the day." },
  ],
  faqs: [
    draft("What events do you plan in Goa?", "Birthday and themed parties, destination weddings, bachelor and bachelorette celebrations, corporate gatherings and private events."),
    draft("Do you help choose the venue?", "Yes. Options include private villas, beachfront locations and indoor venues, with full setup."),
    draft("Can you arrange entertainment and catering?", "Yes. DJs, live performers, catering and bartenders can be coordinated for your event."),
    draft("Do you manage the event on the day?", "Yes. Our team handles vendor coordination, scheduling and on-site management."),
    draft("Can you help wedding guests with travel and stays?", "Yes. Wedding guest management covers accommodation, transport and scheduling."),
  ],
  seo: {
    title: "Events in Goa: Weddings, Parties & Bachelor Trips | Stay Story",
    description: "Party planning, destination weddings, bachelor and bachelorette celebrations and private events in Goa, planned and managed by Stay Story.",
    keywords: ["event planner Goa", "party planning Goa", "destination wedding Goa", "bachelor party Goa"],
  },
  items: [
    {
      slug: "party-planning",
      category: "events",
      title: "Party Planning",
      legacyPath: "/party-planning-goa.php",
      hero: media("party-planning-cover"),
      summary:
        "Birthdays, anniversaries, themed nights and private gatherings planned from concept to execution, with venue, décor, music, food and bar handled by one team.",
      sections: [
        { heading: "Planned around you", icon: "sparkles", body: "Birthdays, anniversaries, private gatherings and themed events, each designed to reflect your style." },
        { heading: "Venue and setup", icon: "map-pin", body: "Private villas, beachfront spots or indoor venues, with décor, lighting, seating and ambience to match your theme." },
        { heading: "Music and entertainment", icon: "music", body: "DJs, live performers and custom music setups, for a dance party or a relaxed evening." },
        { heading: "Food and drinks", icon: "utensils", body: "Gourmet menus or casual party bites, plus bartenders and mixologists, coordinated by our team." },
        { heading: "Fully managed", icon: "clipboard-check", body: "Logistics, vendor coordination, scheduling and on-site management, so the day runs without last-minute stress." },
      ],
      idealFor: ["Birthdays", "Anniversaries", "Themed parties", "Private gatherings"],
      faqs: [
        draft("What kinds of venues are available?", "Private villas, beachfront locations and indoor venues."),
        draft("Do you handle décor and lighting?", "Yes. Setup covers décor, lighting, seating and ambience."),
      ],
      related: ["private-events", "bachelor-parties", "weddings"],
      seo: {
        title: "Party Planning in Goa | Birthdays & Private Parties | Stay Story",
        description: "Birthday, anniversary and themed party planning in Goa: venue, décor, DJs, catering and bar, managed end to end by Stay Story.",
        keywords: ["party planner Goa", "birthday party Goa", "villa party Goa"],
      },
    },
    {
      slug: "weddings",
      category: "events",
      title: "Wedding Services",
      legacyPath: "/wedding-services-goa.php",
      hero: media("wedding-services-cover"),
      summary:
        "Destination weddings in Goa planned end to end, covering venues, décor and styling, vendor coordination and guest logistics, whether you picture a beach ceremony or a villa celebration.",
      sections: [
        { heading: "End-to-end planning", icon: "clipboard-list", body: "From first concept to final execution, we shape the day around your vision and handle every arrangement." },
        { heading: "Beach, villa or indoors", icon: "map-pin", body: "Beachfront locations, luxury villas and premium indoor venues, with full setup, lighting and seating." },
        { heading: "Décor and styling", icon: "flower", body: "Florals, stage design, custom themes and colour palettes that reflect your style." },
        { heading: "Trusted vendors", icon: "handshake", body: "Caterers, photographers, entertainers and makeup artists from our network, coordinated by one team." },
        { heading: "Guests looked after", icon: "users", body: "Help with guest accommodation, transport and scheduling, from arrival to departure." },
      ],
      idealFor: ["Destination weddings", "Beach ceremonies", "Villa weddings", "Intimate ceremonies"],
      faqs: [
        draft("Do you coordinate the other wedding vendors?", "Yes. We coordinate caterers, photographers, entertainers and makeup artists."),
        draft("Can you help with guest accommodation?", "Yes. Guest management includes accommodation, transport and scheduling."),
      ],
      related: ["private-events", "party-planning", "bachelor-parties"],
      seo: {
        title: "Destination Wedding Planner in Goa | Stay Story",
        description: "Plan a beach or villa wedding in Goa with venue setup, décor and styling, vendor coordination and guest logistics by Stay Story.",
        keywords: ["destination wedding Goa", "wedding planner Goa", "beach wedding Goa"],
      },
    },
    {
      slug: "bachelor-parties",
      category: "events",
      title: "Bachelor Parties",
      legacyPath: "/bachelor-party-goa.php",
      hero: media("bachelor-party-cover"),
      summary:
        "Bachelor and bachelorette weekends built around your group, size and budget, with villa parties, yacht outings, club nights and add-ons like DJs, bartenders and transport.",
      sections: [
        { heading: "Tailored to your crew", icon: "users", body: "Custom plans based on your group's preferences, size and budget, from a high-energy party to a laid-back getaway." },
        { heading: "Private villa parties", icon: "home", body: "Premium villas with décor, music systems, lighting and entertainment for a celebration on your terms." },
        { heading: "Yacht celebrations", icon: "sailboat", body: "Music, drinks and coastal views on a private yacht party." },
        { heading: "Club nights, sorted", icon: "music", body: "VIP entry and table bookings at popular venues, with no queues." },
        { heading: "Add-ons on tap", icon: "plus-circle", body: "DJs, bartenders, catering, transport and adventure activities to round out the trip." },
      ],
      idealFor: ["Bachelor parties", "Bachelorette parties", "Groups of friends"],
      faqs: [
        draft("Can you plan within our budget?", "Yes. Plans are built around your group size, preferences and budget."),
        draft("Can we combine a villa party and a club night?", "Yes. Villa parties, yacht outings and club access can be combined in one plan."),
      ],
      related: ["party-planning", "private-events", "weddings"],
      seo: {
        title: "Bachelor & Bachelorette Parties in Goa | Stay Story",
        description: "Custom bachelor and bachelorette trips in Goa: villa parties, yacht celebrations, VIP club access, DJs, bartenders and transport.",
        keywords: ["bachelor party Goa", "bachelorette Goa", "stag party Goa"],
      },
    },
    {
      slug: "private-events",
      category: "events",
      title: "Private Events",
      legacyPath: "/private-events-goa.php",
      hero: media("private-events-cover"),
      summary:
        "Personal celebrations, corporate gatherings and intimate functions in Goa, with venue, setup, AV, catering and entertainment planned and run by one team.",
      sections: [
        { heading: "Any size, any occasion", icon: "calendar-heart", body: "Small gatherings to large-scale events, designed around your preferences." },
        { heading: "Venue and setup", icon: "map-pin", body: "Private villas, beachfront locations or indoor spaces, with décor, lighting and seating." },
        { heading: "Corporate-ready", icon: "presentation", body: "Meetings and team gatherings with seating, audio-visual equipment, catering and logistics." },
        { heading: "Hospitality and entertainment", icon: "music", body: "DJs, live performers, catering and bartenders coordinated for your guests." },
        { heading: "Managed on the day", icon: "clipboard-check", body: "Vendor management, scheduling and real-time on-site support." },
      ],
      idealFor: ["Corporate gatherings", "Family celebrations", "Team offsites", "Intimate functions"],
      faqs: [
        draft("Do you provide audio-visual equipment?", "Yes. Corporate setups can include audio-visual equipment."),
        draft("Will someone manage the event on the day?", "Yes. Our team provides on-site execution and real-time support."),
      ],
      related: ["party-planning", "weddings", "bachelor-parties"],
      seo: {
        title: "Private & Corporate Events in Goa | Stay Story",
        description: "Private celebrations and corporate events in Goa with venues, setup, AV, catering and entertainment, planned and managed by Stay Story.",
        keywords: ["private event Goa", "corporate event Goa", "event venue Goa"],
      },
    },
  ],
};
