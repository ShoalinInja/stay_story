// OWNER: A1 content-migrator. Re-runnable crawl of the 30 legacy staystory.in pages (BRIEF §3.2).
// Usage: pnpm tsx scripts/crawl-legacy.ts   → writes content/_legacy/<page>.json + _index.json
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ORIGIN = "https://www.staystory.in";
export const LEGACY_PAGES = [
  "index", "about-us", "photo-gallery", "contact-us",
  "stay-goa", "villas-goa", "apartments-hotels-goa", "long-term-rentals-goa", "property-sales-goa",
  "travel-services-goa", "airport-transfers-goa", "chauffeur-services-goa", "self-drive-cars-goa", "bike-rentals-goa",
  "experiences-goa", "yacht-cruises-goa", "shisha-experience-goa", "workshops-activities-goa", "spiritual-wellness-goa", "vip-club-access-goa",
  "events-celebrations-goa", "party-planning-goa", "wedding-services-goa", "bachelor-party-goa", "private-events-goa",
  "dining-concierge-goa", "private-chef-catering-goa", "bartenders-mixologists-goa", "cake-special-requests-goa",
  "artists-entertainment-goa", "djs-singers-in-goa", "dancers-performers-goa", "makeup-styling-goa", "tattoo-henna-face-art-goa",
] as const;

const OUT_DIR = path.join(process.cwd(), "content/_legacy");

// The legacy CMS mixes UTF-8 with stray Windows-1252 bytes (curly quotes, dashes). Decode each byte run leniently.
const CP1252: Record<number, string> = { 0x91: "‘", 0x92: "’", 0x93: "“", 0x94: "”", 0x96: "–", 0x97: "—", 0x85: "…" };
const utf8 = new TextDecoder("utf-8", { fatal: true });
function decodeMixed(buf: Uint8Array): string {
  let out = "";
  for (let i = 0; i < buf.length; ) {
    const b = buf[i];
    if (b < 0x80) { out += String.fromCharCode(b); i++; continue; }
    const len = b >= 0xf0 ? 4 : b >= 0xe0 ? 3 : b >= 0xc0 ? 2 : 0;
    if (len) {
      try { out += utf8.decode(buf.subarray(i, i + len)); i += len; continue; } catch { /* fall through to cp1252 */ }
    }
    out += CP1252[b] ?? String.fromCharCode(b);
    i++;
  }
  return out;
}

const ENTITIES: Record<string, string> = { eacute: "é", egrave: "è", agrave: "à", ccedil: "ç", trade: "™", copy: "©", amp: "&", lt: "<", gt: ">", quot: '"', nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", mdash: "—", ndash: "–", hellip: "…", "#39": "'" };
const unescape = (s: string) =>
  s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e: string) =>
    ENTITIES[e] ?? (e.startsWith("#x") ? String.fromCodePoint(parseInt(e.slice(2), 16)) : e.startsWith("#") ? String.fromCodePoint(Number(e.slice(1))) : m));
const text = (html: string) => unescape(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const meta = (html: string, name: string) =>
  unescape(html.match(new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)`, "i"))?.[1] ?? "").trim();

export interface LegacyBlock { heading: string; level: string; paragraphs: string[] }
export interface LegacyCard { title: string; text: string; href: string; image: string }
export interface LegacyPage {
  legacyPath: string; url: string; status: number; title: string; description: string; keywords: string;
  h1: string; blocks: LegacyBlock[]; cards: LegacyCard[]; images: { src: string; alt: string }[];
}

export function extract(legacyPath: string, url: string, status: number, html: string): LegacyPage {
  const clean = html.replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, "");
  const main = (clean.split(/<\/header>/i)[1] ?? clean).split(/saf_footer_heading|saf_blog_thumb/i)[0];

  const blocks: LegacyBlock[] = [];
  let h1 = "";
  for (const m of main.matchAll(/<(h[1-6]|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const tag = m[1].toLowerCase();
    const t = text(m[2]);
    if (!t) continue;
    if (tag === "h1" && !h1) { h1 = t; continue; }
    if (tag.startsWith("h")) blocks.push({ heading: t, level: tag, paragraphs: [] });
    else (blocks.at(-1) ?? (blocks[blocks.length] = { heading: "", level: "", paragraphs: [] })).paragraphs.push(t);
  }

  const cards: LegacyCard[] = [];
  for (const m of clean.matchAll(/saf_blog_thumb[\s\S]*?href='([^']+)'[\s\S]*?<img src='([^']+)'[\s\S]*?sub_heading'>([\s\S]*?)<\/span>\s*<p>([\s\S]*?)<\/p>/gi)) {
    cards.push({ href: m[1], image: m[2], title: text(m[3]), text: text(m[4]) });
  }

  const images = new Map<string, string>();
  for (const m of clean.matchAll(/<img\b[^>]*>/gi)) {
    const src = m[0].match(/src=["']([^"']+)["']/i)?.[1];
    if (!src || !/assets\/(upload|img\/logo)/i.test(src)) continue;
    const abs = new URL(src, `${ORIGIN}/`).href;
    if (!images.has(abs)) images.set(abs, text(m[0].match(/alt=["']([^"']*)["']/i)?.[1] ?? ""));
  }

  return {
    legacyPath, url, status,
    title: text(clean.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    description: meta(clean, "description"), keywords: meta(clean, "keywords"),
    h1, blocks, cards, images: [...images].map(([src, alt]) => ({ src, alt })),
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const index: { legacyPath: string; status: number; h1: string; blocks: number; images: number }[] = [];
  for (const page of LEGACY_PAGES) {
    const legacyPath = `/${page}.php`;
    const url = `${ORIGIN}${legacyPath}`;
    const res = await fetch(url, { headers: { "user-agent": "staystory-migration/1.0" } });
    const html = decodeMixed(new Uint8Array(await res.arrayBuffer()));
    const data = extract(legacyPath, url, res.status, html);
    await writeFile(path.join(OUT_DIR, `${page}.json`), `${JSON.stringify(data, null, 2)}\n`);
    index.push({ legacyPath, status: res.status, h1: data.h1, blocks: data.blocks.length, images: data.images.length });
    console.log(`${res.status} ${legacyPath} blocks=${data.blocks.length} images=${data.images.length}`);
    if (!res.ok) process.exitCode = 1;
  }
  await writeFile(path.join(OUT_DIR, "_index.json"), `${JSON.stringify(index, null, 2)}\n`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
