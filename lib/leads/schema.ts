// Shared enquiry schema: the client form (RHF) and POST /api/enquiry validate with the same rules.
// No server-only imports here; this file ships to the browser.
import { z } from "zod";

export const ENQUIRY_TYPES = ["stay", "service", "callback", "property-owner", "general"] as const;

const PHONE_RE = /^(?:\+?91|0)?([6-9]\d{9})$/;

/** Indian mobile → E.164 (+91XXXXXXXXXX), or null. Accepts +91 / 91 / 0 prefixes and common separators. */
export function normalisePhone(raw: string): string | null {
  const m = raw.replace(/[\s\-().]/g, "").match(PHONE_RE);
  return m ? `+91${m[1]}` : null;
}

/** Today's calendar date in Asia/Kolkata as YYYY-MM-DD. */
export function todayInKolkata(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
}

function isRealIsoDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

// Form posts send "" for empty fields; treat that as absent.
const blankToUndef = (v: unknown) => (v === "" || v === null || (typeof v === "number" && Number.isNaN(v)) ? undefined : v);
const optText = (max: number) => z.preprocess(blankToUndef, z.string().trim().max(max).optional());
const optInt = (min: number, msg: string) =>
  z.preprocess(
    (v) => {
      const b = blankToUndef(v);
      return typeof b === "string" ? Number(b) : b;
    },
    z.number({ error: msg }).int(msg).min(min, msg).max(99, "That's a lot of people. Tell us in the message.").optional(),
  );
const optDate = z.preprocess(
  blankToUndef,
  z.string().refine(isRealIsoDate, "Enter a valid date").optional(),
);

export function makeEnquirySchema(today: () => string = () => todayInKolkata()) {
  return z
    .object({
      type: z.enum(ENQUIRY_TYPES),
      name: z.string().trim().min(2, "Please enter your name").max(100),
      phone: z
        .string()
        .trim()
        .transform((v, ctx) => {
          const e164 = normalisePhone(v);
          if (!e164) {
            ctx.addIssue({ code: "custom", message: "Enter a 10-digit Indian mobile number" });
            return z.NEVER;
          }
          return e164;
        }),
      email: z.preprocess(blankToUndef, z.email("Enter a valid email").max(200).optional()),
      message: optText(2000),
      staySlug: optText(100),
      serviceSlug: optText(100),
      checkIn: optDate,
      checkOut: optDate,
      /** Long-term "preferred move-in month", YYYY-MM. */
      moveIn: z.preprocess(blankToUndef, z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Pick a month").optional()),
      adults: optInt(1, "At least 1 guest"),
      children: optInt(0, "Enter 0 or more"),
      rooms: optInt(1, "At least 1 room"),
      budget: optText(100),
      source: z.string().trim().min(1).max(200),
      utm: z
        .record(z.string().max(50), z.string().max(500))
        .refine((o) => Object.keys(o).length <= 20, "Too many attribution fields")
        .optional(),
      /** Honeypot. The schema accepts it; the API drops filled submissions silently. */
      website: z.string().optional(),
    })
    .superRefine(
      (v, ctx) => {
        // Runs even when other fields failed (see `when`), so read defensively.
        const date = (x: unknown) => (typeof x === "string" && isRealIsoDate(x) ? x : undefined);
        const checkIn = date(v.checkIn);
        const checkOut = date(v.checkOut);
        const moveIn = typeof v.moveIn === "string" ? v.moveIn : undefined;
        const t = today();
        const issue = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
        if (checkIn && checkIn < t) issue("checkIn", "Date can't be in the past");
        if (checkOut && checkOut < t) issue("checkOut", "Date can't be in the past");
        if (checkOut && !v.checkIn) issue("checkIn", "Add a check-in date");
        if (checkIn && checkOut && checkOut <= checkIn) issue("checkOut", "Check-out must be after check-in");
        if (moveIn && moveIn < t.slice(0, 7)) issue("moveIn", "Month can't be in the past");
        if ((v.type === "general" || v.type === "property-owner") && !v.message) {
          issue("message", v.type === "general" ? "Please add a message" : "Tell us about the property and its location");
        }
      },
      // Show date errors inline even while name/phone are still invalid.
      { when: () => true },
    );
}

export const enquirySchema = makeEnquirySchema();
export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryData = z.output<typeof enquirySchema>;
