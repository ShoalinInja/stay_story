// OWNER: A1 content-migrator. Source: /experiences-goa.php, /yacht-cruises-goa.php, /shisha-experience-goa.php,
// /workshops-activities-goa.php, /spiritual-wellness-goa.php, /vip-club-access-goa.php.
import type { ServiceCategory } from "../../lib/content/types";
import { draft } from "../faq";
import { media } from "../media";

export const experiences: ServiceCategory = {
  key: "experiences",
  slug: "experiences",
  title: "Experiences",
  tagline: "Yachts, wellness, workshops and nightlife",
  cover: media("experiences-cover"),
  intro:
    "Go beyond the beach. Stay Story curates private yacht charters, at-home shisha lounges, creative workshops, wellness sessions and VIP club access, arranged through trusted local partners.",
  whyUs: [
    { title: "Curated, not generic", body: "Each experience is chosen and shaped around your group, pace and occasion." },
    { title: "A strong local network", body: "Our Goa connections open doors to exclusive access and personalised service." },
    { title: "Safe and well run", body: "Experienced crews, instructors and verified providers, with attention to every detail." },
  ],
  faqs: [
    draft("What experiences can Stay Story arrange?", "Yacht and cruise outings, private shisha setups, workshops and activities, yoga and wellness sessions, and VIP club access."),
    draft("Can experiences be booked for celebrations?", "Yes. Yacht parties, VIP club access and group activities suit birthdays, bachelor parties and other celebrations."),
    draft("Who runs the experiences?", "Stay Story works with experienced crews, instructors and verified local providers."),
    draft("Can I customise an experience?", "Yes. Most experiences can be tailored, from yacht routes to workshop themes and wellness plans."),
  ],
  seo: {
    title: "Experiences in Goa: Yachts, Wellness, Workshops & VIP Nightlife | Stay Story",
    description: "Private yacht charters, sunset cruises, shisha setups, workshops, yoga and wellness, and VIP club access in Goa, curated by Stay Story.",
    keywords: ["things to do in Goa", "Goa experiences", "yacht Goa", "VIP club Goa"],
  },
  items: [
    {
      slug: "yacht-cruises",
      category: "experiences",
      title: "Yacht & Cruises",
      legacyPath: "/yacht-cruises-goa.php",
      hero: media("yacht-cruises-cover"),
      summary:
        "Private yacht charters and sunset cruises along Goa's coast, for quiet evenings or full celebrations, with onboard catering, music and décor arranged on request.",
      sections: [
        { heading: "Private charters", icon: "sailboat", body: "Customise the journey, choose your route and enjoy personalised onboard service, ideal for couples, families and groups." },
        { heading: "Sunset on the Arabian Sea", icon: "sunset", body: "Calm, scenic cruises timed for sunset, perfect for unwinding, photography or an intimate gathering." },
        { heading: "Parties on the water", icon: "party-popper", body: "Birthdays, anniversaries, bachelor parties and private events, with music, catering and entertainment options." },
        { heading: "Onboard comforts", icon: "armchair", body: "Comfortable seating, music systems and safety features, with catering, beverages, decorations and entertainment on request." },
        { heading: "Safe hands", icon: "life-buoy", body: "Experienced crews and verified operators, with vessels that comply with safety standards." },
      ],
      idealFor: ["Couples", "Families", "Birthday parties", "Bachelor parties", "Anniversaries"],
      faqs: [
        draft("Can we choose the route?", "Yes. Private charters let you customise the route and onboard services."),
        draft("Can you arrange food and decorations on board?", "Yes. Catering, beverages, decorations and entertainment can be added on request."),
      ],
      related: ["vip-club-access", "shisha", "workshops-activities"],
      seo: {
        title: "Yacht Charters & Sunset Cruises in Goa | Stay Story",
        description: "Private yacht charters, sunset cruises on the Arabian Sea and yacht parties in Goa, with experienced crews and verified operators.",
        keywords: ["yacht rental Goa", "sunset cruise Goa", "yacht party Goa", "private boat Goa"],
      },
    },
    {
      slug: "shisha",
      category: "experiences",
      title: "Shisha Experience",
      legacyPath: "/shisha-experience-goa.php",
      hero: media("shisha-experience-cover"),
      summary:
        "A lounge-style shisha setup brought to your villa, apartment or private space, with curated flavours, clean equipment and a team that handles setup and service.",
      sections: [
        { heading: "Delivered to your space", icon: "home", body: "A fully managed setup at your villa, apartment or private venue, with no crowded lounge required." },
        { heading: "Curated flavours", icon: "sparkles", body: "A selection of classic and modern flavours, chosen for smooth, consistent sessions." },
        { heading: "Made for gatherings", icon: "users", body: "Adds an easy, social mood to villa parties, birthdays and casual meetups." },
        { heading: "Clean and safe", icon: "shield-check", body: "Thoroughly cleaned equipment, proper handling and disposable accessories on request." },
        { heading: "Hands-free hosting", icon: "hand-platter", body: "Our team sets up and tends the session, so you can simply enjoy the evening." },
      ],
      idealFor: ["Villa parties", "Birthdays", "Relaxed evenings", "Small groups"],
      faqs: [
        draft("Where is the shisha set up?", "At your villa, apartment or another private space."),
        draft("Are disposable accessories available?", "Yes. Disposable accessories can be provided."),
      ],
      related: ["vip-club-access", "yacht-cruises", "workshops-activities"],
      seo: {
        title: "Private Shisha Setup in Goa | Hookah at Your Villa | Stay Story",
        description: "Premium shisha delivered to your villa or private space in Goa, with curated flavours, clean equipment and full setup and service.",
        keywords: ["shisha Goa", "hookah Goa", "hookah at villa Goa"],
      },
    },
    {
      slug: "workshops-activities",
      category: "experiences",
      title: "Workshops & Activities",
      legacyPath: "/workshops-activities-goa.php",
      hero: media("workshops-activities-cover"),
      summary:
        "Art, craft, cultural and group activities that show a different side of Goa, led by experienced instructors and tailored to your interests, from pottery to cooking classes.",
      sections: [
        { heading: "Creative workshops", icon: "palette", body: "Painting, pottery and DIY craft sessions for beginners and enthusiasts, led by experienced instructors." },
        { heading: "Culture and local life", icon: "landmark", body: "Cooking classes, cultural sessions and storytelling that reveal Goa beyond the tourist trail." },
        { heading: "Group and team fun", icon: "users", body: "Interactive games, outdoor experiences and team-building sessions for families, friends and corporate teams." },
        { heading: "Shaped around you", icon: "sliders-horizontal", body: "Creative, educational or recreational: we help you pick the right fit for your group." },
        { heading: "Trusted providers", icon: "shield-check", body: "Experienced professionals and verified providers, with safety and organisation built in." },
      ],
      idealFor: ["Families", "Friends", "Corporate teams", "Curious travellers", "Beginners"],
      faqs: [
        draft("Do I need experience to join a workshop?", "No. Workshops suit beginners as well as enthusiasts."),
        draft("Can you organise team-building?", "Yes. Group activities include team-building sessions for corporate teams."),
      ],
      related: ["wellness", "yacht-cruises", "shisha"],
      seo: {
        title: "Workshops & Activities in Goa | Art, Culture, Team Building | Stay Story",
        description: "Art and craft workshops, cooking classes, cultural sessions and group activities in Goa, led by experienced instructors.",
        keywords: ["workshops Goa", "pottery class Goa", "cooking class Goa", "team building Goa"],
      },
    },
    {
      slug: "wellness",
      category: "experiences",
      title: "Spiritual & Wellness",
      legacyPath: "/spiritual-wellness-goa.php",
      hero: media("spiritual-wellness-cover"),
      summary:
        "Yoga, meditation and holistic therapies in calm Goan settings, as a single session or a multi-day routine, tailored to your level and guided by certified professionals.",
      sections: [
        { heading: "Yoga for every level", icon: "flower-2", body: "Guided sessions in serene settings, tailored to beginners and advanced practitioners alike." },
        { heading: "Meditation and mindfulness", icon: "brain", body: "Structured practices to ease stress, sharpen focus and restore emotional balance." },
        { heading: "Holistic therapies", icon: "leaf", body: "Traditional healing practices and modern treatments for anyone looking to detox and rejuvenate." },
        { heading: "Your own wellness plan", icon: "list-checks", body: "A single session or a multi-day routine, shaped around your goals." },
        { heading: "Calm settings, expert guides", icon: "sun", body: "Carefully chosen locations and certified professionals for safe, effective sessions." },
      ],
      idealFor: ["Solo travellers", "Couples", "Wellness breaks", "Beginners"],
      faqs: [
        draft("I'm new to yoga. Can I join?", "Yes. Sessions are tailored to your level, from beginner to advanced."),
        draft("Can I book a multi-day programme?", "Yes. Choose a single session or a customised multi-day routine."),
      ],
      related: ["workshops-activities", "yacht-cruises", "shisha"],
      seo: {
        title: "Yoga, Meditation & Wellness in Goa | Stay Story",
        description: "Guided yoga, meditation and holistic therapies in calm Goan settings, from single sessions to multi-day wellness routines.",
        keywords: ["yoga Goa", "meditation Goa", "wellness retreat Goa", "holistic healing Goa"],
      },
    },
    {
      slug: "vip-club-access",
      category: "experiences",
      title: "VIP Club Access",
      legacyPath: "/vip-club-access-goa.php",
      hero: media("vip-club-access-cover"),
      summary:
        "Priority entry, reserved tables and access to sought-after events at popular Goa clubs, arranged in advance through our local network for birthdays, bachelor parties and big nights out.",
      sections: [
        { heading: "Skip the queue", icon: "door-open", body: "Fast-track entry to popular clubs, especially valuable on weekends and in peak season." },
        { heading: "Tables and seating", icon: "sofa", body: "Reserved seating and private tables with dedicated space for your group, arranged in advance." },
        { heading: "Events and DJ nights", icon: "music", body: "Access to exclusive events, DJ nights and themed parties across Goa." },
        { heading: "Made for celebrations", icon: "party-popper", body: "Birthdays, bachelor parties and group nights, with personalised arrangements." },
        { heading: "Local help on the night", icon: "phone", body: "Easy booking, reliable coordination and real-time assistance through our venue network." },
      ],
      idealFor: ["Birthdays", "Bachelor parties", "Groups of friends", "Nightlife lovers"],
      faqs: [
        draft("Can you reserve a table?", "Yes. Reserved seating and private tables are arranged in advance."),
        draft("Is priority entry useful on busy nights?", "Yes. Priority entry is especially useful on weekends and in peak season, when venues are crowded."),
      ],
      related: ["yacht-cruises", "shisha", "workshops-activities"],
      seo: {
        title: "VIP Club Access in Goa | Priority Entry & Tables | Stay Story",
        description: "Skip the queue at popular Goa clubs with priority entry, reserved tables and access to exclusive events and DJ nights.",
        keywords: ["VIP club Goa", "club table booking Goa", "Goa nightlife"],
      },
    },
  ],
};
