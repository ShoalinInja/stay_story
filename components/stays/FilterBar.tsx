"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button, Sheet, inputClass } from "@/components/primitives";
import type { StayFilters } from "@/lib/content/types";
import { AMENITIES, TYPE_LABELS, copy } from "./copy";
import { STAY_TYPES, whereValue } from "./params";

type Option = { value: string; label: string };

export type FilterBarProps = {
  /** Areas and regions for the "Area" select, built on the server from getAreas(). */
  areaOptions: Option[];
  filters: StayFilters;
  from?: string;
  to?: string;
  /** Number of stays matching the current filters. */
  total: number;
};

const BEDROOMS = [1, 2, 3, 4, 5];
const t = copy.filters;
const selectClass = `${inputClass} appearance-auto`;

/** FormData → query string, dropping empty values so URLs stay short. */
function toQuery(form: HTMLFormElement): string {
  const qs = new URLSearchParams();
  for (const [k, v] of new FormData(form)) if (typeof v === "string" && v.trim()) qs.append(k, v.trim());
  return qs.toString();
}

/**
 * GET form, so it works without JS. With JS the desktop sidebar re-queries on every change and
 * the mobile sheet on "Show stays"; both write the URL with router.replace (no full reload).
 */
function FilterForm({ id, live, onDone, ...p }: FilterBarProps & { id: string; live: boolean; onDone?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const apply = (form: HTMLFormElement) => {
    const qs = toQuery(form);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const f = p.filters;

  return (
    <form
      method="get"
      action={pathname}
      aria-label={t.title}
      onChange={live ? (e) => apply(e.currentTarget) : undefined}
      onSubmit={(e) => {
        e.preventDefault();
        apply(e.currentTarget);
        onDone?.();
      }}
      className="flex flex-col gap-5"
    >
      {p.from && <input type="hidden" name="from" value={p.from} />}
      {p.to && <input type="hidden" name="to" value={p.to} />}

      <Field id={`${id}-area`} label={t.area}>
        <select id={`${id}-area`} name="area" defaultValue={whereValue(f)} className={selectClass}>
          <option value="">{t.anyArea}</option>
          {p.areaOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </Field>
      <Field id={`${id}-type`} label={t.type}>
        <select id={`${id}-type`} name="type" defaultValue={f.type ?? ""} className={selectClass}>
          <option value="">{t.anyType}</option>
          {STAY_TYPES.map((s) => <option key={s} value={s}>{TYPE_LABELS[s]}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field id={`${id}-guests`} label={t.guests}>
          <input id={`${id}-guests`} name="guests" type="number" inputMode="numeric" min={1} max={99} defaultValue={f.guests ?? ""} className={inputClass} />
        </Field>
        <Field id={`${id}-bedrooms`} label={t.bedrooms}>
          <select id={`${id}-bedrooms`} name="bedrooms" defaultValue={f.bedrooms ?? ""} className={selectClass}>
            <option value="">{t.anyBedrooms}</option>
            {BEDROOMS.map((n) => <option key={n} value={n}>{t.bedroomsMin(n)}</option>)}
          </select>
        </Field>
      </div>
      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-ink">{t.amenities}</legend>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1 lg:grid-cols-1">
          {Object.entries(AMENITIES).map(([key, a]) => (
            <li key={key}>
              <label className="flex min-h-9 cursor-pointer items-center gap-2 text-sm text-ink-2">
                <input type="checkbox" name="amenities" value={key} defaultChecked={f.amenities?.includes(key as never)} className="size-4 accent-cta" />
                {a.label}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <div className="flex items-center gap-3">
        <Button type="submit" className="flex-1">{t.apply}</Button>
        <Link href={pathname} className="text-sm font-semibold text-ink underline underline-offset-4" onClick={onDone}>{t.clear}</Link>
      </div>
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">{label}</label>
      {children}
    </div>
  );
}

export function FilterBar(props: FilterBarProps) {
  const [open, setOpen] = React.useState(false);
  // Remount the forms when the URL changes so uncontrolled defaults follow it (e.g. after "Clear all").
  const key = JSON.stringify(props.filters);
  return (
    <>
      <div className="flex items-center justify-between gap-3 lg:hidden" data-filters-trigger>
        <p className="type-meta" aria-live="polite">{t.results(props.total)}</p>
        <Sheet
          open={open}
          onOpenChange={setOpen}
          title={t.title}
          trigger={<Button variant="outline" size="sm"><SlidersHorizontal aria-hidden />{t.open}</Button>}
        >
          <FilterForm key={key} id="m-filter" live={false} onDone={() => setOpen(false)} {...props} />
        </Sheet>
      </div>
      <aside className="hidden lg:block" data-filters-aside>
        <p className="mb-4 type-meta" aria-live="polite">{t.results(props.total)}</p>
        <FilterForm key={key} id="d-filter" live {...props} />
      </aside>
      {/* No JS: the sheet can't open, so show the sidebar form on every screen size. */}
      <noscript>
        <style>{"[data-filters-aside]{display:block!important}[data-filters-trigger]{display:none!important}"}</style>
      </noscript>
    </>
  );
}
