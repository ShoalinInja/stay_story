"use client";

import * as React from "react";
import {
  Button,
  DateRangePicker,
  GuestStepper,
  Toaster,
  guestSummary,
  toast,
  type GuestCounts,
  type IsoDateRange,
} from "@/components/primitives";

export function ToastDemo() {
  return (
    <>
      <Button variant="dark" onClick={() => toast("Code STAY10 copied")}>
        Show toast
      </Button>
      <Toaster />
    </>
  );
}

export function ControlledDatesDemo() {
  const [dates, setDates] = React.useState<IsoDateRange>({ from: null, to: null });
  return (
    <div className="flex max-w-md flex-col gap-2">
      <DateRangePicker id="sg-dates-controlled" value={dates} onValueChange={setDates} fromName="from" toName="to" />
      <p className="type-meta">
        Output: <code>{JSON.stringify(dates)}</code>
      </p>
    </div>
  );
}

export function ControlledGuestsDemo() {
  const [guests, setGuests] = React.useState<GuestCounts>({ adults: 2, children: 0, rooms: 1 });
  return (
    <div className="max-w-sm">
      <GuestStepper value={guests} onValueChange={setGuests} />
      <p className="type-meta">Summary: {guestSummary(guests)}</p>
    </div>
  );
}
