// Pure parsing of /stays query strings into StayFilters. No server-only imports, so it is testable with tsx.
import type { AmenityKey, GoaArea, Region, Stay, StayFilters, StayType } from "@/lib/content/types";

export type RawParams = Record<string, string | string[] | undefined>;

export const STAY_TYPES: readonly StayType[] = ["villa", "apartment", "hotel", "long-term", "for-sale"];
export const REGIONS: readonly Region[] = ["north-goa", "south-goa"];
export const SORTS: readonly NonNullable<StayFilters["sort"]>[] = ["featured", "price-asc", "price-desc", "guests"];
export const MAX_GUESTS_PARAM = 99;

export type ParsedStayParams = {
  filters: StayFilters;
  /** Check-in/check-out from the home search, passed through to the enquiry form. ISO YYYY-MM-DD or undefined. */
  from?: string;
  to?: string;
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
const all = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);
const oneOf = <T extends string>(v: string | undefined, list: readonly T[]) => (list as readonly string[]).includes(v ?? "") ? (v as T) : undefined;

function int(v: string | undefined, min: number, max: number): number | undefined {
  if (!v || !/^\d+$/.test(v)) return undefined;
  return Math.min(Number(v), max) >= min ? Math.min(Number(v), max) : undefined;
}

const nonEmpty = <T,>(xs: T[]) => (xs.length ? xs : undefined);
const isoDate = (v: string | undefined) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined);

/**
 * `area` may hold an area key or a stay type (older shared links mix the two),
 * so it may be an area key, a stay type or a region. An explicit `type` param wins over a type in `area`.
 */
export function parseStayParams(sp: RawParams, areaKeys: readonly GoaArea[], amenityKeys: readonly AmenityKey[]): ParsedStayParams {
  const where = first(sp.area);
  const filters: StayFilters = {
    area: oneOf(where, areaKeys),
    region: oneOf(where, REGIONS),
    type: oneOf(first(sp.type), STAY_TYPES) ?? oneOf(where, STAY_TYPES),
    guests: int(first(sp.guests), 1, MAX_GUESTS_PARAM),
    bedrooms: int(first(sp.bedrooms), 1, 20),
    minPrice: int(first(sp.minPrice), 0, 10_000_000),
    maxPrice: int(first(sp.maxPrice), 0, 10_000_000),
    amenities: nonEmpty(all(sp.amenities).filter((a): a is AmenityKey => (amenityKeys as readonly string[]).includes(a))),
    sort: oneOf(first(sp.sort), SORTS),
  };
  const clean = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined)) as StayFilters;
  return { filters: clean, from: isoDate(first(sp.from)), to: isoDate(first(sp.to)) };
}

/** The value the FilterBar's "Area" select should show for the current filters. */
export const whereValue = (f: StayFilters) => f.area ?? f.region ?? "";

/** True when the requested group is larger than any stay can hold, so the "combine villas" state applies. */
export const exceedsCapacity = (guests: number | undefined, stays: Pick<Stay, "maxGuests">[]) =>
  !!guests && stays.length > 0 && guests > Math.max(...stays.map((s) => s.maxGuests));
