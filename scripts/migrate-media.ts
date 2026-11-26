// OWNER: A1 content-migrator. Downloads every legacy image found by crawl-legacy.ts, converts to WebP,
// and writes content/media-manifest.json (MediaEntry[]).
// Usage: pnpm tsx scripts/migrate-media.ts [--previews <dir>]
//   Alt text / hasBakedText live in content/media-meta.json (hand-edited, merged on every run, never overwritten).
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { LEGACY_ROUTES } from "../content/redirects";
import type { MediaEntry } from "../lib/content/types";

const ROOT = process.cwd();
const LEGACY_JSON = path.join(ROOT, "content/_legacy");
const RAW_DIR = path.join(ROOT, "public/media/legacy/_raw");
const OUT_DIR = path.join(ROOT, "public/media/legacy");
const BRAND_DIR = path.join(ROOT, "public/media/brand");
const META_FILE = path.join(ROOT, "content/media-meta.json");
const MANIFEST = path.join(ROOT, "content/media-manifest.json");

const MAX_WIDTH = { banner: 1920, cover: 1200, gallery: 1600, other: 1600 } as const;
const WEBP_QUALITY = 78;
const BLUR_WIDTH = 16;

interface MetaEntry { alt: string; hasBakedText?: boolean; note?: string }
interface Found { url: string; id: string; kind: keyof typeof MAX_WIDTH; pages: Set<string> }

const pageSlug = (legacyPath: string) => legacyPath.replace(/^\//, "").replace(/(-in)?-goa\.php$|\.php$/, "");

/** Stable, human-readable id per legacy image. Service pages list [logo, banner, cover, related cards…]. */
export function idFor(url: string, legacyPath: string, indexOnPage: number, galleryOrder: string[]): { id: string; kind: Found["kind"] } {
  const file = url.split("/").pop() ?? "";
  if (url.includes("/image/banner/")) return { id: `home-banner-${file.replace(/\.\w+$/, "")}`, kind: "banner" };
  if (url.includes("/image/photogallery/")) {
    const n = galleryOrder.indexOf(url) + 1;
    return { id: `gallery-${String(n).padStart(2, "0")}`, kind: "gallery" };
  }
  if (url.endsWith("/about.png")) return { id: "about", kind: "other" };
  if (url.endsWith("/frunt-banner.png")) return { id: "home-front-banner", kind: "banner" };
  const isBanner = url.includes("/banner/");
  // A page's own banner is image #1, its own cover image #2; cards on other pages reuse those covers.
  if (indexOnPage === 1 || indexOnPage === 2) return { id: `${pageSlug(legacyPath)}-${isBanner ? "banner" : "cover"}`, kind: isBanner ? "banner" : "cover" };
  return { id: "", kind: isBanner ? "banner" : "cover" }; // resolved via the owning page
}

async function collect(): Promise<Found[]> {
  const files = (await readdir(LEGACY_JSON)).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
  const pages = await Promise.all(files.map(async (f) => JSON.parse(await readFile(path.join(LEGACY_JSON, f), "utf8"))));
  const galleryOrder: string[] = (pages.find((p) => p.legacyPath === "/photo-gallery.php")?.images ?? [])
    .map((i: { src: string }) => i.src).filter((s: string) => s.includes("/photogallery/"));

  const byUrl = new Map<string, Found>();
  for (const p of pages) {
    p.images.forEach((img: { src: string }, i: number) => {
      if (img.src.endsWith("/assets/img/logo.png")) return;
      const { id, kind } = idFor(img.src, p.legacyPath, i, galleryOrder);
      const f = byUrl.get(img.src) ?? { url: img.src, id: "", kind, pages: new Set<string>() };
      if (id && !f.id) f.id = id;
      f.pages.add(p.legacyPath);
      byUrl.set(img.src, f);
    });
  }
  const orphans = [...byUrl.values()].filter((f) => !f.id);
  if (orphans.length) throw new Error(`Images with no owning page: ${orphans.map((o) => o.url).join(", ")}`);
  return [...byUrl.values()].sort((a, b) => a.id.localeCompare(b.id));
}

async function download(url: string, dest: string): Promise<void> {
  if (existsSync(dest)) return;
  const res = await fetch(url, { headers: { "user-agent": "staystory-migration/1.0" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await writeFile(dest, new Uint8Array(await res.arrayBuffer()));
}

async function main() {
  const previewIdx = process.argv.indexOf("--previews");
  const previewDir = previewIdx > 0 ? process.argv[previewIdx + 1] : null;
  await Promise.all([RAW_DIR, OUT_DIR, BRAND_DIR, ...(previewDir ? [previewDir] : [])].map((d) => mkdir(d, { recursive: true })));

  const meta: Record<string, MetaEntry> = existsSync(META_FILE) ? JSON.parse(await readFile(META_FILE, "utf8")) : {};
  const found = await collect();
  const manifest: MediaEntry[] = [];

  for (const f of found) {
    const raw = path.join(RAW_DIR, `${f.id}${path.extname(new URL(f.url).pathname)}`);
    await download(f.url, raw);
    const img = sharp(raw).rotate().resize({ width: MAX_WIDTH[f.kind], withoutEnlargement: true });
    const info = await img.clone().webp({ quality: WEBP_QUALITY }).toFile(path.join(OUT_DIR, `${f.id}.webp`));
    const blur = await sharp(raw).resize({ width: BLUR_WIDTH }).webp({ quality: 40 }).toBuffer();
    if (previewDir) await sharp(raw).resize({ width: 600 }).jpeg({ quality: 70 }).toFile(path.join(previewDir, `${f.id}.jpg`));

    const m = meta[f.id];
    if (!m) console.warn(`missing alt text in media-meta.json: ${f.id}`);
    meta[f.id] = m ?? { alt: "" };
    manifest.push({
      id: f.id,
      src: `/media/legacy/${f.id}.webp`,
      alt: meta[f.id].alt,
      width: info.width,
      height: info.height,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
      usedOn: [...f.pages].map((p) => LEGACY_ROUTES[p] ?? p).sort(),
      ...(meta[f.id].hasBakedText ? { hasBakedText: true } : {}),
    });
  }

  // Brand logo: keep the PNG (transparent) plus a WebP copy.
  const logoRaw = path.join(RAW_DIR, "logo.png");
  await download(`https://www.staystory.in/assets/img/logo.png`, logoRaw);
  await sharp(logoRaw).png().toFile(path.join(BRAND_DIR, "logo.png"));
  const logo = await sharp(logoRaw).webp({ quality: 90 }).toFile(path.join(BRAND_DIR, "logo.webp"));
  console.log(`logo ${logo.width}x${logo.height}`);

  await writeFile(META_FILE, `${JSON.stringify(meta, null, 2)}\n`);
  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`${manifest.length} images → ${path.relative(ROOT, OUT_DIR)}; manifest written`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
