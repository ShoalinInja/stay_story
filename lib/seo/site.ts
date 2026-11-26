import type { Metadata } from "next";
import type { MediaRef } from "../content/types";

/** Canonical origin, no trailing slash. The one place the site URL is decided. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.staystory.in").replace(/\/+$/, "");
export const SITE_NAME = "Stay Story Goa";

export const absoluteUrl = (path: string): string => new URL(path, `${SITE_URL}/`).toString();

/** Root opengraph-image.tsx, used when a page has no photo of its own. */
const DEFAULT_OG = { url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME };

type PageMeta = {
  title: string;
  description: string;
  /** Route path, e.g. "/stays/villas". Becomes the canonical and og:url. */
  path: string;
  /** true when `title` is already a full SEO title (skips the "%s | Stay Story Goa" template). */
  absoluteTitle?: boolean;
  keywords?: string[];
  image?: MediaRef | null;
};

/**
 * Title, description, canonical, Open Graph and Twitter for one page.
 * Metadata merges shallowly, so openGraph/twitter are always complete here (images included).
 */
export function pageMetadata({ title, description, path, absoluteTitle, keywords, image }: PageMeta): Metadata {
  const ogTitle = absoluteTitle || path === "/" ? title : `${title} | ${SITE_NAME}`;
  const images = [image && !image.hasBakedText ? { url: image.src, width: image.width, height: image.height, alt: image.alt } : DEFAULT_OG];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN", url: path, title: ogTitle, description, images },
    twitter: { card: "summary_large_image", title: ogTitle, description, images },
  };
}
