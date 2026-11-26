// CONTRACT STUB (Lead). A4 owns the implementation (BRIEF §2.2 SearchBar); A3 renders variant="compact"
// in the detail-page header. Keep the props signature stable. Works without JS: GET /stays?area=&from=&to=&guests=
export type SearchOption = { value: string; label: string; group?: string };

export type SearchBarProps = {
  variant?: "hero" | "compact";
  /** Areas + stay types for "Where in Goa" — build on the server from getAreas()/StayType. */
  options: SearchOption[];
  defaults?: { area?: string; from?: string; to?: string; guests?: number };
  className?: string;
};

export function SearchBar({ options, defaults, className }: SearchBarProps) {
  return (
    <form method="get" action="/stays" role="search" className={className}>
      <select name="area" defaultValue={defaults?.area ?? ""} aria-label="Where in Goa">
        <option value="">Anywhere in Goa</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <input type="date" name="from" defaultValue={defaults?.from} aria-label="Check-in" />
      <input type="date" name="to" defaultValue={defaults?.to} aria-label="Check-out" />
      <input type="number" name="guests" min={1} defaultValue={defaults?.guests ?? 2} aria-label="Guests" />
      <button type="submit">Search</button>
    </form>
  );
}
