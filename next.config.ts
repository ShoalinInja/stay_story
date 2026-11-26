import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { content } from "./content";
import { findPlaceholders } from "./lib/content/placeholders";
import { privacy, terms } from "./content/legal";

export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD && process.env.ALLOW_PLACEHOLDERS !== "true") {
    const legalDrafts = Object.entries({ privacy, terms })
      .filter(([, doc]) => doc.sections.some((s) => s.needsReview))
      .map(([k]) => `legal:${k}`);
    const bad = [...findPlaceholders(content), ...legalDrafts];
    if (bad.length) {
      throw new Error(
        `Placeholder / needsReview content would ship to production (set ALLOW_PLACEHOLDERS=true to override):\n  ${bad.join("\n  ")}`,
      );
    }
  }

  return {
    cacheComponents: true,
    // proxy.ts strips trailing slashes itself, so legacy "/x.php/" hits its 301 in one hop (config redirects run first).
    skipTrailingSlashRedirect: true,
    partialPrefetching: true,
    images: { formats: ["image/avif", "image/webp"] },
    async redirects() {
      return content.redirects; // A1 fills content/redirects.ts
    },
    turbopack: {
      rules: {
        "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
      },
    },
  };
}
