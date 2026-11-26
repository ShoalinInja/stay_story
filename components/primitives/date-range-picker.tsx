"use client";

import * as React from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { format, isSameDay, isValid, parseISO, startOfDay } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Sheet } from "./sheet";

/** ISO calendar dates (YYYY-MM-DD, local, no time zone). */
export type IsoDateRange = { from: string | null; to: string | null };

export type DateRangePickerProps = {
  id: string;
  value?: IsoDateRange;
  defaultValue?: IsoDateRange;
  onValueChange?: (value: IsoDateRange) => void;
  /** Hidden input names so a plain <form> posts the dates. */
  fromName?: string;
  toName?: string;
  checkInLabel?: string;
  checkOutLabel?: string;
  placeholder?: string;
  /** Sheet title on mobile. */
  title?: string;
  clearLabel?: string;
  doneLabel?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
};

const EMPTY: IsoDateRange = { from: null, to: null };
const toIso = (d: Date | undefined) => (d ? format(d, "yyyy-MM-dd") : null); // not toISOString(): that shifts IST dates
const fromIso = (s: string | null) => {
  if (!s) return undefined;
  const d = parseISO(s);
  return isValid(d) ? d : undefined;
};

const dayPickerClassNames = {
  root: "relative w-fit",
  months: "flex flex-col gap-8 md:flex-row",
  month: "flex flex-col gap-2",
  month_caption: "flex h-11 items-center justify-center",
  caption_label: "type-h3 text-ink",
  nav: "absolute inset-x-0 top-0 flex justify-between",
  button_previous:
    "inline-grid size-11 place-items-center rounded-full text-ink hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-30",
  button_next:
    "inline-grid size-11 place-items-center rounded-full text-ink hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-30",
  month_grid: "border-collapse",
  weekday: "size-11 text-xs font-medium text-muted-text",
  day: "size-11 p-0 text-center text-sm",
  day_button:
    "size-11 rounded-full text-ink hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
  today: "font-bold [&>button]:underline [&>button]:underline-offset-4",
  selected: "",
  range_start: "rounded-l-full bg-brand-tint [&>button]:bg-cta [&>button]:text-white [&>button]:hover:bg-cta",
  range_end: "rounded-r-full bg-brand-tint [&>button]:bg-cta [&>button]:text-white [&>button]:hover:bg-cta",
  range_middle: "bg-brand-tint [&>button]:rounded-none [&>button]:hover:bg-brand-tint",
  disabled: "[&>button]:cursor-not-allowed [&>button]:text-muted-2 [&>button]:hover:bg-transparent",
  outside: "invisible",
  hidden: "invisible",
};

function Chevron({ orientation }: { orientation?: "up" | "down" | "left" | "right" }) {
  return orientation === "left" ? <ChevronLeft aria-hidden className="size-5" /> : <ChevronRight aria-hidden className="size-5" />;
}

/** Only mounted while open, so "today" is read on the client at open time (never during prerender). */
function RangeCalendar({
  range,
  onSelect,
  months,
}: {
  range: DateRange | undefined;
  onSelect: (r: DateRange | undefined) => void;
  months: number;
}) {
  const [today] = React.useState(() => startOfDay(new Date()));
  return (
    <DayPicker
      mode="range"
      min={1}
      resetOnSelect
      numberOfMonths={months}
      selected={range}
      onSelect={onSelect}
      disabled={{ before: today }}
      startMonth={today}
      defaultMonth={range?.from ?? today}
      excludeDisabled
      classNames={dayPickerClassNames}
      components={{ Chevron }}
    />
  );
}

export function DateRangePicker({
  id,
  value,
  defaultValue = EMPTY,
  onValueChange,
  fromName,
  toName,
  checkInLabel = "Check-in",
  checkOutLabel = "Check-out",
  placeholder = "Add date",
  title = "Select dates",
  clearLabel = "Clear",
  doneLabel = "Done",
  error,
  disabled,
  className,
}: DateRangePickerProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const iso = value ?? inner;
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)", true);
  const errorId = `${id}-error`;

  const range: DateRange | undefined = iso.from ? { from: fromIso(iso.from), to: fromIso(iso.to) } : undefined;

  const set = (next: IsoDateRange) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  const onSelect = (r: DateRange | undefined) => {
    // Check-out must be strictly after check-in.
    const to = r?.from && r.to && !isSameDay(r.from, r.to) ? r.to : undefined;
    set({ from: toIso(r?.from), to: toIso(to) });
    if (isDesktop && r?.from && to) setOpen(false);
  };

  const show = (s: string | null) => {
    const d = fromIso(s);
    return d ? format(d, "EEE, d MMM") : placeholder;
  };

  const trigger = (
    <button
      id={id}
      type="button"
      disabled={disabled}
      aria-haspopup="dialog"
      aria-describedby={error ? errorId : undefined}
      data-invalid={error ? "" : undefined}
      className={cn(
        "grid min-h-14 w-full grid-cols-[auto_1fr_1fr] items-center gap-3 rounded-input border border-line bg-surface px-3 py-2 text-left hover:border-ink-2 disabled:cursor-not-allowed disabled:opacity-60 data-invalid:border-destructive",
      )}
    >
      <CalendarDays aria-hidden className="size-5 text-muted-text" />
      <span className="flex flex-col">
        <span className="text-xs font-semibold text-ink">{checkInLabel}</span>
        <span className={cn("text-sm", iso.from ? "text-ink" : "text-muted-text")}>{show(iso.from)}</span>
      </span>
      <span className="flex flex-col border-l border-line-soft pl-3">
        <span className="text-xs font-semibold text-ink">{checkOutLabel}</span>
        <span className={cn("text-sm", iso.to ? "text-ink" : "text-muted-text")}>{show(iso.to)}</span>
      </span>
    </button>
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>
          <PopoverContent
            align="start"
            aria-label={title}
            className="w-auto rounded-card border border-line-soft bg-surface p-4 shadow-card-hover"
          >
            <RangeCalendar range={range} onSelect={onSelect} months={2} />
          </PopoverContent>
        </Popover>
      ) : (
        <Sheet
          trigger={trigger}
          title={title}
          open={open}
          onOpenChange={setOpen}
          footer={
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => set(EMPTY)}>
                {clearLabel}
              </Button>
              <Button variant="dark" className="flex-1" onClick={() => setOpen(false)}>
                {doneLabel}
              </Button>
            </div>
          }
        >
          <div className="flex justify-center">
            <RangeCalendar range={range} onSelect={onSelect} months={1} />
          </div>
        </Sheet>
      )}
      {fromName && <input type="hidden" name={fromName} value={iso.from ?? ""} />}
      {toName && <input type="hidden" name={toName} value={iso.to ?? ""} />}
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
