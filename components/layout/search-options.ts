import type { Area } from "@/lib/content/types";
import type { SearchOption } from "@/components/home/SearchBar";

const regionLabel = (r: string) => r.replace(/(^|-)([a-z])/g, (_, sep: string, c: string) => (sep ? " " : "") + c.toUpperCase());

/** "Where in Goa" options for SearchBar, grouped by region. Built on the server from getAreas(). */
export function areaSearchOptions(areas: Area[]): SearchOption[] {
  return areas.map((a) => ({ value: a.key, label: a.name, group: regionLabel(a.region) }));
}
