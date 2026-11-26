// OWNER: A1 content-migrator. Original area intros (60–80 words): geography and character only,
// no distances, venues or inventory claims. No area photos exist yet, so `image` is omitted.
import type { Area, GoaArea, Region } from "../lib/content/types";

const area = (key: GoaArea, name: string, region: Region, intro: string): Area => {
  const where = region === "south-goa" ? "South Goa" : `${name}, North Goa`;
  return {
    key, name, region, intro,
    seo: {
      title: `Villas & Stays in ${where} | Stay Story`,
      description: `Handpicked villas, apartments and long stays in ${where}, plus travel, experiences and events arranged by Stay Story's local team.`,
      keywords: [`villas in ${name}`, `stay in ${name}`, `${name} Goa`],
    },
  };
};

export const areas: Area[] = [
  area("siolim", "Siolim", "north-goa",
    "Siolim is a riverside village in North Goa, where the Chapora river winds past paddy fields, old Portuguese-style homes and quiet chapels. It sits just inland from the beaches of Anjuna, Vagator and Morjim, so you get calm evenings without being far from the coast. Siolim is also Stay Story's home base, which means friendly local help is never far away when you need it."),
  area("anjuna", "Anjuna", "north-goa",
    "Anjuna is one of North Goa's best-known beach villages, with a rocky shoreline, sunset cafés and a long-running weekly flea market. It has drawn free spirits since the hippie era, and its music scene still pulls a crowd. Days here are for beach shacks and market browsing; nights lean lively. Stay a little inland for quieter lanes while keeping the action close by."),
  area("vagator", "Vagator", "north-goa",
    "Vagator is known for dramatic red laterite cliffs that drop onto small, sheltered coves, with the ruins of Chapora Fort watching over the river mouth. It is a favourite for sunset views and a buzzing evening scene, yet its beaches feel more tucked away than Goa's busier strips. Villas here pair easy access to Anjuna and Siolim with a strong sense of place."),
  area("assagao", "Assagao", "north-goa",
    "Assagao is a leafy inland village in North Goa, often called one of the prettiest in the state. Think heritage Portuguese houses, tree-lined lanes, design stores and some of Goa's most talked-about cafés and restaurants. It feels calm, green and residential, yet the beaches of Anjuna and Vagator are within easy reach. Ideal for travellers who prefer charm and good food over beach crowds."),
  area("morjim", "Morjim", "north-goa",
    "Morjim sits on the northern bank of the Chapora river in Pernem, where a wide, quiet beach curves towards the estuary. It is known as a nesting site for olive ridley turtles and draws birdwatchers, kitesurfers and anyone after a slower pace. Beach cafés line the sand without the crush of busier beaches, and the North Goa party belt is just across the river."),
  area("arambol", "Arambol", "north-goa",
    "Arambol, near Goa's northern edge, has a free-spirited, creative energy all its own. Its long beach hosts sunset drum circles, yoga classes and live music, while a freshwater lake hides just beyond the headland. Expect laid-back cafés, market stalls and travellers who come for a week and stay a season. It suits longer stays, wellness breaks and anyone who enjoys a bohemian edge."),
  area("candolim", "Candolim", "north-goa",
    "Candolim is a long stretch of sand on the Bardez coast, running south towards the old Portuguese fort at Aguada. It offers the convenience of nearby Calangute and Baga with a noticeably calmer, more grown-up feel. Good restaurants, easy beach access and a mix of hotels, apartments and villas make it a reliable base for families and couples who want comfort with plenty of options."),
  area("calangute", "Calangute", "north-goa",
    "Calangute is Goa's busiest beach town and the heart of the North Goa holiday scene. Its broad beach is lined with shacks and water-sports operators, and the streets behind are packed with shops, restaurants and markets. It is lively, convenient and endlessly social, a good fit for first-time visitors and groups who want everything within reach, with Baga and Candolim on either side."),
  area("baga", "Baga", "north-goa",
    "Baga sits at the northern end of the Calangute strip, where a small creek meets the sea. By day it is beach shacks, water sports and fresh seafood; after dark, its famous nightlife lanes take over with clubs, bars and live music. It is the place for groups, celebrations and anyone who wants Goa's party energy on the doorstep, with quieter stays a short drive inland."),
  area("panjim", "Panjim", "north-goa",
    "Panjim, or Panaji, is Goa's capital, set on the banks of the Mandovi river. Its Fontainhas quarter is a maze of colourful Portuguese-era houses, bakeries and art galleries, and the riverside promenade comes alive in the evening. Compact, walkable and well connected, it suits business travellers, culture lovers and long-stay guests who want city conveniences with a slower, distinctly Goan rhythm."),
  area("south-goa", "South Goa", "south-goa",
    "South Goa trades crowds for space. Wide, palm-backed beaches stretch along the coast, fishing villages keep their own unhurried pace, and evenings tend to end with a sunset rather than a club night. It is the side of Goa for couples, families and anyone after quiet luxury, long walks on the sand and slow days, with the state's easy-going character at its most relaxed."),
];
