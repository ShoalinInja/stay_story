"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export type GuestKey = "adults" | "children" | "rooms";
export type GuestCounts = Record<GuestKey, number>;

export type GuestRow = {
  key: GuestKey;
  label: string;
  hint?: string;
  min: number;
  max: number;
};

export const DEFAULT_GUEST_ROWS: GuestRow[] = [
  { key: "adults", label: "Adults", hint: "Ages 13+", min: 1, max: 30 },
  { key: "children", label: "Children", hint: "Ages 2–12", min: 0, max: 20 },
  { key: "rooms", label: "Rooms", min: 1, max: 15 },
];

export type GuestStepperProps = {
  value?: GuestCounts;
  defaultValue?: GuestCounts;
  onValueChange?: (value: GuestCounts) => void;
  rows?: GuestRow[];
  /** Adds hidden inputs (adults, children, rooms) so a plain <form> posts the values. */
  namePrefix?: string;
  /** "{label}" is replaced with the row label (strings, so server callers can pass them). */
  decreaseLabel?: string;
  increaseLabel?: string;
  className?: string;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function GuestStepper({
  value,
  defaultValue = { adults: 2, children: 0, rooms: 1 },
  onValueChange,
  rows = DEFAULT_GUEST_ROWS,
  namePrefix,
  decreaseLabel = "Decrease {label}",
  increaseLabel = "Increase {label}",
  className,
}: GuestStepperProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const counts = value ?? inner;
  const [announcement, setAnnouncement] = React.useState("");
  const uid = React.useId();

  const change = (row: GuestRow, delta: number) => {
    const n = clamp(counts[row.key] + delta, row.min, row.max);
    if (n === counts[row.key]) return;
    const next = { ...counts, [row.key]: n };
    if (value === undefined) setInner(next);
    onValueChange?.(next);
    setAnnouncement(`${row.label}: ${n}`);
  };

  return (
    <div className={cn("flex flex-col divide-y divide-line-soft", className)}>
      {rows.map((row) => {
        const n = counts[row.key];
        const labelId = `${uid}-${row.key}`;
        return (
          <div key={row.key} role="group" aria-labelledby={labelId} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p id={labelId} className="type-h3 text-ink">
                {row.label}
              </p>
              {row.hint && <p className="type-meta">{row.hint}</p>}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="icon-circle"
                className="shadow-none"
                aria-label={decreaseLabel.replace("{label}", row.label.toLowerCase())}
                disabled={n <= row.min}
                onClick={() => change(row, -1)}
              >
                <Minus aria-hidden />
              </Button>
              <output aria-labelledby={labelId} className="w-6 text-center text-base font-semibold tabular-nums">
                {n}
              </output>
              <Button
                variant="icon-circle"
                className="shadow-none"
                aria-label={increaseLabel.replace("{label}", row.label.toLowerCase())}
                disabled={n >= row.max}
                onClick={() => change(row, 1)}
              >
                <Plus aria-hidden />
              </Button>
              {namePrefix !== undefined && <input type="hidden" name={`${namePrefix}${row.key}`} value={n} />}
            </div>
          </div>
        );
      })}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

export function guestSummary(c: GuestCounts): string {
  const guests = c.adults + c.children;
  return `${guests} guest${guests === 1 ? "" : "s"} · ${c.rooms} room${c.rooms === 1 ? "" : "s"}`;
}
