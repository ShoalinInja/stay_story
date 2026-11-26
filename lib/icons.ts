import { icons, type LucideIcon } from "lucide-react";

// Content stores lucide kebab-case names ("chef-hat"). Server-side use only: the `icons`
// map is the whole set, so don't import this from a "use client" file — resolve on the
// server and pass the component (or render it) down.
// Pre-1.x lucide names used in content → their lucide 1.x names.
const ALIASES: Record<string, string> = {
  home: "house", "plus-circle": "circle-plus", waves: "waves-horizontal",
  music: "eighth-notes", smile: "face-slightly-smiling", "building-2": "building-complex",
};
const pascal = (s: string) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());

export function resolveIcon(name: string | undefined, fallback: LucideIcon = icons.Sparkles): LucideIcon {
  if (!name) return fallback;
  return icons[pascal(ALIASES[name] ?? name) as keyof typeof icons] ?? fallback;
}

export function iconExists(name: string): boolean {
  return pascal(ALIASES[name] ?? name) in icons;
}
