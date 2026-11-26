// Route sweep: every content-driven URL is 200, unknown paths are real 404s, legacy URLs 301 once,
// trailing slashes 308. HTTP only (request fixture), no browser.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { content } from "../content";
import { LEGACY_ROUTES } from "../content/redirects";

const ROOT = path.resolve(__dirname, "..");

/** STATIC_TOP isn't exported (proxy-only), so read it from source; the drift test below keeps it honest. */
function staticTop(): string[] {
  const src = readFileSync(path.join(ROOT, "lib/routing.ts"), "utf8");
  const body = src.match(/STATIC_TOP = new Set\(\[([\s\S]*?)\]\)/)?.[1];
  if (!body) throw new Error("STATIC_TOP not found in lib/routing.ts");
  return [...body.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

/** Top-level static route dirs under app/, flattening (group) folders; skips dynamic, private and api. */
function appStaticDirs(dir = path.join(ROOT, "app")): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    if (!d.isDirectory()) return [];
    if (/^\(.+\)$/.test(d.name)) return appStaticDirs(path.join(dir, d.name));
    if (d.name.startsWith("[") || d.name.startsWith("_") || d.name === "api") return [];
    return [d.name];
  });
}

function contentRoutes(): string[] {
  const c = content;
  return [
    "/",
    ...staticTop().map((s) => `/${s}`),
    ...["villas", "apartments-hotels", "long-term-rentals"].map((t) => `/stays/${t}`),
    ...c.stays.map((s) => `/stays/${s.slug}`),
    ...c.categories.filter((cat) => cat.key !== "stays").flatMap((cat) => [`/${cat.slug}`, ...cat.items.map((i) => `/${cat.slug}/${i.slug}`)]),
    ...c.areas.map((a) => `/areas/${a.key}`),
    ...c.collections.map((x) => `/collections/${x.key}`),
  ];
}

test("STATIC_TOP in lib/routing.ts matches the app/ route dirs", () => {
  expect([...staticTop()].sort()).toEqual([...new Set(appStaticDirs())].sort());
});

for (const route of contentRoutes()) {
  test(`200 ${route}`, async ({ request }) => {
    const res = await request.get(route, { maxRedirects: 0 });
    expect(res.status()).toBe(200);
  });
}

const UNKNOWN = [
  "/nope", "/travel/nope", "/stays/nope", "/areas/nope", "/collections/nope", "/experiences/yacht",
  "/stays/villas/extra", "/a/b/c", "/about/team",
];
for (const route of UNKNOWN) {
  test(`404 ${route}`, async ({ request }) => {
    const res = await request.get(route, { maxRedirects: 0 });
    expect(res.status()).toBe(404);
    expect(await res.text()).toContain("find that page");
  });
}

// D1: unknown *.php paths skip proxy.ts (its matcher excludes anything with an extension) and render the
// not-found UI with a 200 status: a soft 404 on exactly the URL shape old backlinks use.
test.fixme("D1: 404 for unknown legacy-style .php path", async ({ request }) => {
  const res = await request.get("/does-not-exist.php", { maxRedirects: 0 });
  expect(res.status()).toBe(404);
});

test("redirect table has the 34 legacy URLs from the brief", () => {
  expect(Object.keys(LEGACY_ROUTES)).toHaveLength(34);
});

for (const [from, to] of Object.entries(LEGACY_ROUTES)) {
  test(`301 ${from} → ${to} (one hop, with slash and query too)`, async ({ request, baseURL }) => {
    for (const [src, dest] of [[from, to], [`${from}/`, to], [`${from}?utm_source=x`, `${to}?utm_source=x`]]) {
      const res = await request.get(src, { maxRedirects: 0 });
      expect(res.status(), src).toBe(301);
      expect(new URL(res.headers().location, baseURL).href, src).toBe(new URL(dest, baseURL).href);
      const final = await request.get(dest, { maxRedirects: 0 });
      expect(final.status(), `${dest} must not redirect again`).toBe(200);
    }
  });
}

for (const route of ["/stays/", "/about/", "/travel/airport-transfers/", "/stays/casa-siolim/"]) {
  test(`308 ${route} → slashless`, async ({ request, baseURL }) => {
    const res = await request.get(route, { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(new URL(res.headers().location, baseURL).pathname).toBe(route.replace(/\/$/, ""));
  });
}
