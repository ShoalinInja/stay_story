import assert from "node:assert/strict";
import { test } from "node:test";
import { exceedsCapacity, parseStayParams } from "./params";

const AREAS = ["siolim", "anjuna"] as const;
const AMENITIES = ["wifi", "private-pool"] as const;

test("area may be an area key, a stay type or a region", () => {
  assert.deepEqual(parseStayParams({ area: "siolim", guests: "4" }, AREAS, AMENITIES).filters, { area: "siolim", guests: 4 });
  assert.deepEqual(parseStayParams({ area: "villa" }, AREAS, AMENITIES).filters, { type: "villa" });
  assert.deepEqual(parseStayParams({ area: "south-goa" }, AREAS, AMENITIES).filters, { region: "south-goa" });
  assert.equal(parseStayParams({ area: "villa", type: "apartment" }, AREAS, AMENITIES).filters.type, "apartment");
});

test("junk is dropped, numbers clamped, amenities whitelisted", () => {
  const p = parseStayParams(
    { area: "nowhere", guests: "-3", bedrooms: "2x", maxPrice: "9000", amenities: ["wifi", "evil"], sort: "drop", from: "2026-12-01", to: "tomorrow" },
    AREAS, AMENITIES,
  );
  assert.deepEqual(p.filters, { maxPrice: 9000, amenities: ["wifi"] });
  assert.equal(p.from, "2026-12-01");
  assert.equal(p.to, undefined);
  assert.equal(parseStayParams({ guests: "500" }, AREAS, AMENITIES).filters.guests, 99);
});

test("capacity check", () => {
  assert.equal(exceedsCapacity(99, [{ maxGuests: 10 }, { maxGuests: 12 }]), true);
  assert.equal(exceedsCapacity(12, [{ maxGuests: 12 }]), false);
  assert.equal(exceedsCapacity(5, []), false);
});
