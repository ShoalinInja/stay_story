import type { PriceMode } from "@/components/primitives";
import type { MediaRef, Stay } from "@/lib/content/types";

/** Which price a stay shows: monthly rent for long-term, sale price for for-sale, nightly otherwise. */
export function stayPrice(s: Stay): { amount: number | null; mode: PriceMode } {
  if (s.type === "for-sale") return { amount: s.salePrice ?? null, mode: "sale" };
  if (s.type === "long-term") return { amount: s.monthlyRent ?? null, mode: "monthly" };
  return { amount: s.pricePerNight, mode: "per-night" };
}

/** Date pickers only make sense for short stays (BRIEF §7). */
export function stayMode(s: Stay): "dates" | "move-in" | "site-visit" {
  return s.type === "for-sale" ? "site-visit" : s.type === "long-term" ? "move-in" : "dates";
}

/** Text-free photos first, so overlays (badges, "+N More") never land on a poster with baked-in text. */
export function cleanFirst(images: MediaRef[]): MediaRef[] {
  return [...images.filter((i) => !i.hasBakedText), ...images.filter((i) => i.hasBakedText)];
}
