// OWNER: A8 seo-performance. Verifies every legacy .php URL 301s to its new route in one hop.
// Usage: pnpm check:redirects [baseUrl]   (or BASE_URL=…; default http://localhost:3000). Exit 1 on any failure.
import { LEGACY_ROUTES } from "../content/redirects";

const EXPECTED_COUNT = 34; // BRIEF §3.2
const base = (process.argv[2] || process.env.BASE_URL || "http://localhost:3000").replace(/\/+$/, "");

async function check(source: string, destination: string): Promise<string | null> {
  const res = await fetch(base + source, { redirect: "manual" });
  if (res.status !== 301) return `${source} → status ${res.status}, expected 301`;
  const location = res.headers.get("location");
  if (!location) return `${source} → 301 without Location`;
  const target = new URL(location, base + source);
  const [wantPath, wantQuery = ""] = destination.split("?");
  const query = new URL(base + source).search;
  if (target.pathname !== wantPath) return `${source} → ${target.pathname}, expected ${wantPath}`;
  if (query && !target.search.includes(query.slice(1))) return `${source} → dropped query (${target.search || "none"})`;
  if (wantQuery && !target.search.includes(wantQuery)) return `${source} → missing ${wantQuery}`;
  // One hop: the destination itself must answer 200, not redirect again.
  const final = await fetch(target, { redirect: "manual" });
  return final.status === 200 ? null : `${source} → ${target.pathname} answered ${final.status}, expected 200`;
}

async function main() {
  const entries = Object.entries(LEGACY_ROUTES);
  const failures: string[] = [];
  if (entries.length !== EXPECTED_COUNT) failures.push(`expected ${EXPECTED_COUNT} legacy routes, found ${entries.length}`);

  const cases = entries.flatMap(([src, dest]) => [[src, dest], [`${src}/`, dest], [`${src}?utm_source=test`, dest]]);
  const results = await Promise.all(cases.map(([src, dest]) => check(src, dest).catch((e: unknown) => `${src} → ${String(e)}`)));
  failures.push(...results.filter((r): r is string => r !== null));

  if (failures.length) {
    console.error(`✖ ${failures.length} redirect check(s) failed against ${base}:\n  ${failures.join("\n  ")}`);
    process.exit(1);
  }
  console.log(`✔ ${entries.length} legacy URLs × 3 variants (plain, trailing slash, query) 301 in one hop on ${base}`);
}

main();
