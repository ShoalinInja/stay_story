// OWNER: A1 content-migrator. Source: /artists-entertainment-goa.php, /djs-singers-in-goa.php,
// /dancers-performers-goa.php, /makeup-styling-goa.php, /tattoo-henna-face-art-goa.php.
import type { ServiceCategory } from "../../lib/content/types";
import { draft } from "../faq";
import { media } from "../media";

export const entertainment: ServiceCategory = {
  key: "entertainment",
  slug: "entertainment",
  title: "Artists & Entertainment",
  tagline: "DJs, performers, stylists and event artists",
  cover: media("artists-entertainment-cover"),
  intro:
    "Music, movement and a little artistry turn a gathering into an occasion. Stay Story books DJs and live singers, dancers and performers, makeup and styling artists, and tattoo, henna and face art for events across Goa.",
  whyUs: [
    { title: "Experienced, verified artists", body: "We work with professionals we know deliver, every time." },
    { title: "Tailored to your event", body: "Music, choreography, looks and designs shaped to your theme." },
    { title: "Setup handled", body: "Sound, staging and coordination managed by our team." },
  ],
  faqs: [
    draft("Which artists can you book?", "DJs, live singers, dancers and performers, makeup and styling artists, and tattoo, henna and face art artists."),
    draft("Do DJs and singers come with sound equipment?", "Yes. Professional sound systems are provided, and our team manages setup and testing."),
    draft("Can performances match our theme?", "Yes. Music, choreography, costumes and designs can be customised to your event."),
    draft("What events are the artists suited to?", "Birthdays, bachelor parties, weddings, corporate events and private gatherings."),
  ],
  seo: {
    title: "Artists & Entertainment in Goa: DJs, Dancers, Makeup | Stay Story",
    description: "Book DJs and singers, dancers and performers, makeup and styling, and tattoo, henna and face art for events in Goa with Stay Story.",
    keywords: ["DJ Goa", "event entertainment Goa", "makeup artist Goa", "henna artist Goa"],
  },
  items: [
    {
      slug: "djs-singers",
      category: "entertainment",
      title: "DJs & Singers",
      legacyPath: "/djs-singers-in-goa.php",
      hero: media("djs-singers-cover"),
      summary:
        "DJs who read the room and live singers who set the mood, for parties, weddings and corporate events in Goa, with professional sound handled end to end.",
      sections: [
        { heading: "DJs who read the crowd", icon: "disc-3", body: "Playlists matched to your theme and audience, from high-energy party tracks to relaxed lounge sets, mixed seamlessly." },
        { heading: "Live vocals", icon: "mic", body: "Acoustic sets, Bollywood hits or international music for weddings, intimate gatherings and special celebrations." },
        { heading: "Your sound, your way", icon: "sliders-horizontal", body: "We tailor playlists and performance style to your preferences and your guests." },
        { heading: "Professional sound", icon: "speaker", body: "Sound systems and equipment provided, with setup, testing and operation managed by our team." },
        { heading: "Solo set to full setup", icon: "music", body: "A solo singer for an intimate evening or a full DJ setup for a party." },
      ],
      idealFor: ["Weddings", "Birthdays", "Bachelor parties", "Corporate events", "Private gatherings"],
      faqs: [
        draft("What music do the singers perform?", "Acoustic, Bollywood and international music, tailored to your event."),
        draft("Do you provide sound equipment?", "Yes. Professional sound systems are provided, with setup and operation handled by our team."),
      ],
      related: ["dancers-performers", "makeup-styling", "tattoo-henna"],
      seo: {
        title: "DJs & Live Singers in Goa for Parties & Weddings | Stay Story",
        description: "Hire experienced DJs and live singers in Goa for parties, weddings and corporate events, with professional sound setup handled by our team.",
        keywords: ["DJ in Goa", "live singer Goa", "wedding DJ Goa"],
      },
    },
    {
      slug: "dancers-performers",
      category: "entertainment",
      title: "Dancers & Performers",
      legacyPath: "/dancers-performers-goa.php",
      hero: media("dancers-performers-cover"),
      summary:
        "Dancers and live performers for weddings, parties and corporate events, with contemporary, cultural and themed acts and choreography, costumes and staging tailored to your event.",
      sections: [
        { heading: "Styles for every stage", icon: "drama", body: "Contemporary dance, cultural performances, themed acts and stage shows, traditional or modern." },
        { heading: "Choreographed for you", icon: "sparkles", body: "Choreography, music, costumes and stage setup aligned to your event concept." },
        { heading: "Keeps guests engaged", icon: "users", body: "Live performances bring energy to birthdays, bachelor celebrations, weddings and corporate functions." },
        { heading: "Polished execution", icon: "star", body: "Experienced, trained performers with tight timing and coordination." },
        { heading: "Staging support", icon: "speaker", body: "Help with stage setup, sound arrangements and event coordination." },
      ],
      idealFor: ["Weddings", "Corporate functions", "Birthdays", "Themed parties"],
      faqs: [
        draft("Can performances be customised?", "Yes. Choreography, music, costumes and staging are tailored to your event."),
        draft("Can you help with the stage and sound?", "Yes. We can assist with stage setup, sound arrangements and coordination."),
      ],
      related: ["djs-singers", "makeup-styling", "tattoo-henna"],
      seo: {
        title: "Dancers & Live Performers in Goa for Events | Stay Story",
        description: "Book contemporary, cultural and themed dance acts and live performers in Goa, with custom choreography, costumes and staging.",
        keywords: ["dancers Goa", "event performers Goa", "live entertainment Goa"],
      },
    },
    {
      slug: "makeup-styling",
      category: "entertainment",
      title: "Makeup & Styling",
      legacyPath: "/makeup-styling-goa.php",
      hero: media("makeup-styling-cover"),
      summary:
        "Makeup and hair styling for weddings, parties and shoots, from natural to full glam and bridal to pre-wedding, done on location at your villa, apartment or hotel.",
      sections: [
        { heading: "Every look, done well", icon: "brush", body: "Natural and subtle to glamorous and high-definition, with quality products and professional techniques for long-lasting results." },
        { heading: "Hair and grooming", icon: "scissors", body: "Hair styling, grooming and full-look coordination to complement your outfit and theme." },
        { heading: "Bridal and events", icon: "gem", body: "Bridal makeup, pre-wedding functions and party styling that looks flawless in person and on camera." },
        { heading: "We come to you", icon: "map-pin", body: "Get ready at your villa, apartment or hotel and save time on busy event days." },
        { heading: "Clean and hygienic", icon: "shield-check", body: "Clean tools, premium products and professional hygiene standards." },
      ],
      idealFor: ["Brides", "Wedding parties", "Photoshoots", "Parties"],
      faqs: [
        draft("Do the artists come to our accommodation?", "Yes. Makeup and styling are offered on location at your villa, apartment or hotel."),
        draft("Do you offer bridal makeup?", "Yes, including pre-wedding functions and party styling."),
      ],
      related: ["tattoo-henna", "djs-singers", "dancers-performers"],
      seo: {
        title: "Makeup & Hair Styling in Goa | Bridal & Event | Stay Story",
        description: "Professional makeup and hair styling in Goa for weddings, parties and photoshoots, on location at your villa, apartment or hotel.",
        keywords: ["makeup artist Goa", "bridal makeup Goa", "hair stylist Goa"],
      },
    },
    {
      slug: "tattoo-henna",
      category: "entertainment",
      title: "Tattoo, Henna & Face Art",
      legacyPath: "/tattoo-henna-face-art-goa.php",
      hero: media("tattoo-henna-face-art-cover"),
      summary:
        "Temporary tattoos, traditional and modern henna, and face painting that bring guests into the party, with custom designs in skin-safe materials for all ages.",
      sections: [
        { heading: "Temporary tattoos", icon: "pen-tool", body: "Stylish custom designs with no long-term commitment, ideal for parties and beach events." },
        { heading: "Henna, old and new", icon: "hand", body: "Intricate bridal patterns to simple decorative styles, for weddings, festivals and private events." },
        { heading: "Face art for all ages", icon: "smile", body: "Vibrant designs with skin-friendly products, popular at children's events and fun for everyone." },
        { heading: "Designed to your theme", icon: "palette", body: "Themed, brand-specific or personalised artwork to match your event." },
        { heading: "Safe materials", icon: "shield-check", body: "Experienced artists using high-quality, skin-safe materials, with hygiene as a priority." },
      ],
      idealFor: ["Weddings", "Festivals", "Children's parties", "Beach events", "Brand events"],
      faqs: [
        draft("Are the tattoos permanent?", "No. Tattoo services for events are temporary designs."),
        draft("Are the materials safe for children?", "Artists use skin-safe, skin-friendly materials suitable for guests of all ages."),
      ],
      related: ["makeup-styling", "dancers-performers", "djs-singers"],
      seo: {
        title: "Tattoo, Henna & Face Art in Goa for Events | Stay Story",
        description: "Temporary tattoos, bridal and modern henna, and face painting for weddings, parties and festivals in Goa, with skin-safe materials.",
        keywords: ["henna artist Goa", "mehndi Goa", "face painting Goa", "temporary tattoo Goa"],
      },
    },
  ],
};
