import { test } from "node:test";
import assert from "node:assert/strict";
import { makeEnquirySchema, normalisePhone, todayInKolkata } from "./schema";

const TODAY = "2026-11-26";
const schema = makeEnquirySchema(() => TODAY);
const base = { type: "callback", name: "Asha Rao", phone: "9876543210", source: "test" };
const issuesAt = (input: object, path: string) => {
  const r = schema.safeParse(input);
  return r.success ? [] : r.error.issues.filter((i) => i.path.join(".") === path);
};

test("normalisePhone accepts +91 / 91 / 0 / bare 10-digit and returns E.164", () => {
  for (const raw of ["+91 98765 43210", "919876543210", "09876543210", "9876543210", "+91-98765-43210", "(+91) 98765 43210"]) {
    assert.equal(normalisePhone(raw), "+919876543210", raw);
  }
});

test("normalisePhone rejects numbers not starting 6-9, wrong length or foreign", () => {
  for (const raw of ["5876543210", "987654321", "98765432100", "+1 415 555 0100", "+92 9876543210", "abc", ""]) {
    assert.equal(normalisePhone(raw), null, raw);
  }
});

test("schema outputs the normalised phone", () => {
  const r = schema.parse({ ...base, phone: "0 98765 43210" });
  assert.equal(r.phone, "+919876543210");
});

test("callback needs only name and phone", () => {
  assert.ok(schema.safeParse(base).success);
  assert.ok(issuesAt({ ...base, name: "" }, "name").length);
  assert.ok(issuesAt({ ...base, phone: "123" }, "phone").length);
});

test("email is optional but must be valid when given; empty string is treated as absent", () => {
  assert.ok(schema.safeParse({ ...base, email: "" }).success);
  assert.ok(schema.safeParse({ ...base, email: "a@b.in" }).success);
  assert.ok(issuesAt({ ...base, email: "nope" }, "email").length);
});

test("contact and property-owner require a message", () => {
  assert.ok(issuesAt({ ...base, type: "general" }, "message").length);
  assert.ok(issuesAt({ ...base, type: "property-owner" }, "message").length);
  assert.ok(schema.safeParse({ ...base, type: "general", message: "Hello there" }).success);
});

test("check-out must be after check-in", () => {
  const stay = { ...base, type: "stay", adults: 2 };
  assert.ok(schema.safeParse({ ...stay, checkIn: "2026-12-01", checkOut: "2026-12-03" }).success);
  assert.ok(issuesAt({ ...stay, checkIn: "2026-12-03", checkOut: "2026-12-03" }, "checkOut").length);
  assert.ok(issuesAt({ ...stay, checkIn: "2026-12-05", checkOut: "2026-12-03" }, "checkOut").length);
  assert.ok(issuesAt({ ...stay, checkOut: "2026-12-03" }, "checkIn").length, "check-out without check-in");
});

test("date errors show even while other fields are still invalid", () => {
  const bad = { type: "stay", name: "", phone: "1", source: "t", checkIn: "2026-12-05", checkOut: "2026-12-01" };
  assert.ok(issuesAt(bad, "checkOut").length);
});

test("dates may not be in the past (today in Asia/Kolkata is allowed)", () => {
  const stay = { ...base, type: "stay" };
  assert.ok(schema.safeParse({ ...stay, checkIn: TODAY, checkOut: "2026-11-27" }).success);
  assert.ok(issuesAt({ ...stay, checkIn: "2026-11-25", checkOut: "2026-11-27" }, "checkIn").length);
  assert.ok(issuesAt({ ...stay, checkIn: "2026-02-30" }, "checkIn").length, "impossible date");
  assert.ok(issuesAt({ ...stay, checkIn: "26/12/2026" }, "checkIn").length, "non-ISO");
});

test("move-in month may be this month but not earlier", () => {
  const stay = { ...base, type: "stay" };
  assert.ok(schema.safeParse({ ...stay, moveIn: "2026-11" }).success);
  assert.ok(issuesAt({ ...stay, moveIn: "2026-10" }, "moveIn").length);
});

test("guests must be at least 1; numeric strings from form posts are coerced", () => {
  assert.equal(schema.parse({ ...base, type: "stay", adults: "3", children: "" }).adults, 3);
  assert.ok(issuesAt({ ...base, type: "stay", adults: 0 }, "adults").length);
});

test("honeypot field is accepted by the schema so the handler can drop it silently", () => {
  assert.equal(schema.parse({ ...base, website: "http://spam" }).website, "http://spam");
});

test("todayInKolkata uses IST, not UTC", () => {
  // 20:00 UTC on 25 Nov is 01:30 IST on 26 Nov.
  assert.equal(todayInKolkata(new Date("2026-11-25T20:00:00Z")), "2026-11-26");
});
