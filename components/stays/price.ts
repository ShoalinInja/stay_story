import type { MediaRef, Stay } from "@/lib/content/types";

/** Date pickers only make sense for short stays (BRIEF §7). */
export function stayMode(s: Stay): "dates" | "move-in" | "site-visit" {
  return s.type === "for-sale" ? "site-visit" : s.type === "long-term" ? "move-in" : "dates";
}

/** Text-free photos first, so overlays (badges, "+N More") never land on a poster with baked-in text. */
export function cleanFirst(images: MediaRef[]): MediaRef[] {
  return [...images.filter((i) => !i.hasBakedText), ...images.filter((i) => i.hasBakedText)];
}
