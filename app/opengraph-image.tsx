import { ImageResponse } from "next/og";
import { getSite } from "@/lib/content";
import { SITE_NAME } from "@/lib/seo/site";

// Default share card for every page without a photo of its own (lib/seo pageMetadata points here).
// Text only, built-in font, no network or Date: prerendered at build time.
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Hex copies of globals.css tokens (--cream, --ink, --ink-2, --brand-strong): Satori cannot read CSS variables.
const C = { cream: "#faf7f2", ink: "#1e1e1e", ink2: "#394050", brand: "#c2611f" };

export default async function Image() {
  const site = await getSite();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: C.cream }}>
        <div style={{ width: 96, height: 8, background: C.brand, marginBottom: 40 }} />
        <div style={{ fontSize: 88, fontWeight: 700, color: C.ink }}>{site.name}</div>
        <div style={{ fontSize: 40, color: C.ink2, marginTop: 24, maxWidth: 1000 }}>{site.hero.headline}</div>
        <div style={{ fontSize: 30, color: C.brand, marginTop: 40 }}>{site.tagline}</div>
      </div>
    ),
    size,
  );
}
