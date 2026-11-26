"use client";
// A4 owns the implementation (BRIEF §2.2 SearchBar); A3 renders variant="compact" in the detail-page header.
// Keep the props signature stable. Server render (and no-JS) is a native GET form to /stays?area=&from=&to=&guests=;
// after hydration it swaps to Combobox · DateRangePicker · GuestStepper and routes client-side.
import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Users } from "lucide-react";
import {
  Button,
  Combobox,
  DateRangePicker,
  GuestStepper,
  guestSummary,
  inputClass,
  type GuestCounts,
  type IsoDateRange,
} from "@/components/primitives";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { HOME_COPY } from "./copy";

export type SearchOption = { value: string; label: string; group?: string };

export type SearchBarProps = {
  variant?: "hero" | "compact";
  /** Areas + stay types for "Where in Goa" — build on the server with getSearchOptions(). */
  options: SearchOption[];
  defaults?: { area?: string; from?: string; to?: string; guests?: number };
  className?: string;
};

const T = HOME_COPY.search;
const noopSubscribe = () => () => {};
/** false during SSR/prerender and hydration, true after; no setState-in-effect. */
const useHydrated = () => React.useSyncExternalStore(noopSubscribe, () => true, () => false);

/** Valid when no dates are chosen, or check-out is strictly after check-in (ISO strings compare lexically). */
export function datesValid({ from, to }: IsoDateRange): boolean {
  if (!from && !to) return true;
  return !!from && !!to && to > from;
}

const label = "text-xs font-semibold text-ink";

export function SearchBar({ variant = "hero", options, defaults, className }: SearchBarProps) {
  const hydrated = useHydrated();
  const shell = cn(
    "grid items-end gap-3 bg-surface md:grid-cols-[1fr_1.6fr_1fr_auto]",
    variant === "hero" ? "rounded-2xl p-4 shadow-card-hover md:p-5" : "rounded-card border border-line-soft p-2",
    className,
  );
  return hydrated ? (
    <EnhancedSearch options={options} defaults={defaults} className={shell} />
  ) : (
    <NativeSearch options={options} defaults={defaults} className={shell} />
  );
}

type InnerProps = Pick<SearchBarProps, "options" | "defaults"> & { className: string };

function NativeSearch({ options, defaults, className }: InnerProps) {
  const id = React.useId();
  return (
    <form method="get" action="/stays" role="search" aria-label={T.formLabel} className={className}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-area`} className={label}>{T.where}</label>
        <select id={`${id}-area`} name="area" defaultValue={defaults?.area ?? ""} className={inputClass}>
          <option value="">{T.wherePlaceholder}</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-from`} className={label}>{T.checkIn}</label>
          <input id={`${id}-from`} type="date" name="from" defaultValue={defaults?.from} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-to`} className={label}>{T.checkOut}</label>
          <input id={`${id}-to`} type="date" name="to" defaultValue={defaults?.to} className={inputClass} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-guests`} className={label}>{T.guests}</label>
        <input id={`${id}-guests`} type="number" name="guests" min={1} defaultValue={defaults?.guests ?? 2} className={inputClass} />
      </div>
      <Button type="submit" size="lg" className="w-full md:w-auto">
        <Search aria-hidden />
        {T.submit}
      </Button>
    </form>
  );
}

function EnhancedSearch({ options, defaults, className }: InnerProps) {
  const id = React.useId();
  const router = useRouter();
  const [area, setArea] = React.useState<string | null>(defaults?.area || null);
  const [dates, setDates] = React.useState<IsoDateRange>({ from: defaults?.from ?? null, to: defaults?.to ?? null });
  const [guests, setGuests] = React.useState<GuestCounts>({
    adults: Math.max(1, defaults?.guests ?? 2),
    children: 0,
    rooms: 1,
  });
  const valid = datesValid(dates);
  const total = guests.adults + guests.children;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valid) return;
    const q = new URLSearchParams();
    if (area) q.set("area", area);
    if (dates.from && dates.to) {
      q.set("from", dates.from);
      q.set("to", dates.to);
    }
    q.set("guests", String(total));
    router.push(`/stays?${q}`);
  };

  return (
    <form method="get" action="/stays" role="search" aria-label={T.formLabel} onSubmit={onSubmit} className={className}>
      <Combobox
        id={`${id}-area`}
        label={T.where}
        placeholder={T.wherePlaceholder}
        options={options}
        value={area}
        onValueChange={setArea}
        className="[&>label]:text-xs"
      />
      <DateRangePicker
        id={`${id}-dates`}
        value={dates}
        onValueChange={setDates}
        checkInLabel={T.checkIn}
        checkOutLabel={T.checkOut}
        title={T.datesTitle}
        error={valid ? undefined : T.datesError}
      />
      <div className="flex flex-col gap-1.5">
        <span id={`${id}-guests-label`} className={label}>{T.guests}</span>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-labelledby={`${id}-guests-label ${id}-guests-value`}
              className={cn(inputClass, "flex items-center gap-2 text-left")}
            >
              <Users aria-hidden className="size-4 text-muted-text" />
              <span id={`${id}-guests-value`}>{guestSummary(guests)}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 rounded-card border border-line-soft bg-surface p-4 shadow-card-hover">
            <GuestStepper value={guests} onValueChange={setGuests} />
          </PopoverContent>
        </Popover>
      </div>
      <Button type="submit" size="lg" disabled={!valid} className="w-full md:w-auto">
        <Search aria-hidden />
        {T.submit}
      </Button>
    </form>
  );
}
