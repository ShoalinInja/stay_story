// OWNER: A1 content-migrator. Stay collections. Images are the legacy gallery photos (the only text-free imagery).
// "Pet-friendly" has no legacy source; it is listed as an owner question in CONTENT-REPORT.md.
import type { Collection } from "../lib/content/types";
import { media } from "./media";

export const collections: Collection[] = [
  {
    key: "pool-villas",
    title: "Pool Villas",
    description: "Private villas with their own pool, for lazy afternoons, sunset swims and evenings you never need to leave home for.",
    image: media("gallery-14"),
    seo: { title: "Private Pool Villas in Goa | Stay Story", description: "Handpicked Goa villas with private pools, spacious living areas and add-on services like private chefs and housekeeping." },
  },
  {
    key: "group-stays",
    title: "Group Stays",
    description: "Spacious villas and homes with room for everyone: shared living and dining spaces, private bedrooms, and a private chef on request to keep the whole group fed.",
    image: media("gallery-04"),
    seo: { title: "Group Villas & Large Stays in Goa | Stay Story", description: "Villas for families and groups in Goa, with shared spaces, private bedrooms and add-ons from chefs to event setups." },
  },
  {
    key: "couples",
    title: "Couples' Escapes",
    description: "Peaceful, intimate stays for two: close enough to Goa's beaches and dining, quiet enough to switch off completely.",
    image: media("gallery-10"),
    seo: { title: "Romantic Villas & Stays for Couples in Goa | Stay Story", description: "Calm, private stays for couples in Goa, with sunset cruises, private dining and surprise setups available on request." },
  },
  {
    key: "workation",
    title: "Workations",
    description: "Homes with reliable internet, quiet corners and work-friendly setups, so you can log on in the morning and still catch the sunset.",
    image: media("gallery-12"),
    seo: { title: "Workation Stays in Goa for Remote Workers | Stay Story", description: "Furnished Goa homes with reliable internet and work-friendly setups, for remote workers and digital nomads on short or long stays." },
  },
  {
    key: "pet-friendly",
    title: "Pet-Friendly Stays",
    description: "Stays that welcome the whole family, four-legged members included. Tell us about your pet when you enquire and we will confirm the house rules.",
    image: media("gallery-16"),
    seo: { title: "Pet-Friendly Villas in Goa | Stay Story", description: "Goa stays that welcome pets. Share your pet's details when you enquire and Stay Story will confirm suitable options." },
  },
  {
    key: "party-villas",
    title: "Party Villas",
    description: "Villas made for celebrations, with space to host, music on, and our events team on call for décor, DJs, bartenders and catering.",
    image: media("gallery-03"),
    seo: { title: "Party Villas in Goa for Celebrations | Stay Story", description: "Villas in Goa for birthdays, bachelor parties and celebrations, with décor, DJs, bartenders and catering arranged by Stay Story." },
  },
];
