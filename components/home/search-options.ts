import "server-only";
import { getAreas } from "@/lib/content";
import { HOME_COPY, STAY_TYPE_LABELS } from "./copy";
import type { SearchOption } from "./SearchBar";

/** "Where in Goa" options (areas, then stay types). Server-only; A3 can call it for the compact header bar too. */
export async function getSearchOptions(): Promise<SearchOption[]> {
  const { areasGroup, typesGroup } = HOME_COPY.search;
  const areas = (await getAreas()).map((a) => ({ value: a.key, label: a.name, group: areasGroup }));
  const types = Object.entries(STAY_TYPE_LABELS).map(([value, label]) => ({ value, label, group: typesGroup }));
  return [...areas, ...types];
}
