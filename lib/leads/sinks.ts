// Lead sinks. Each is plain fetch against a REST API (no SDKs) and throws on failure,
// so the handler can run them with Promise.allSettled and succeed if any one lands.
import type { EnquiryData } from "./schema";

export type Lead = EnquiryData & { ip: string; userAgent: string; createdAt: string };
export type Sink = { name: string; send: (lead: Lead) => Promise<void> };
type Env = Record<string, string | undefined>;

const TIMEOUT_MS = 8000;

async function post(fetchFn: typeof fetch, url: string, headers: Record<string, string>, body: unknown) {
  const res = await fetchFn(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${new URL(url).host} HTTP ${res.status}`);
}

const LABELS: [keyof Lead, string][] = [
  ["type", "Type"], ["name", "Name"], ["phone", "Phone"], ["email", "Email"],
  ["staySlug", "Stay"], ["serviceSlug", "Service"], ["checkIn", "Check-in / date"], ["checkOut", "Check-out"],
  ["moveIn", "Move-in month"], ["adults", "Adults"], ["children", "Children"], ["rooms", "Rooms"],
  ["budget", "Budget"], ["message", "Message"], ["source", "Source"], ["createdAt", "Received"],
];

export function leadText(l: Lead): string {
  const rows = LABELS.filter(([k]) => l[k] != null && l[k] !== "").map(([k, label]) => `${label}: ${l[k]}`);
  const utm = Object.entries(l.utm ?? {}).map(([k, v]) => `${k}: ${v}`);
  return [...rows, ...(utm.length ? ["", "Attribution", ...utm] : [])].join("\n");
}

export function configuredSinks(env: Env, fetchFn: typeof fetch): Sink[] {
  const sinks: Sink[] = [];

  if (env.RESEND_API_KEY && env.LEAD_TO_EMAIL && env.LEAD_FROM_EMAIL) {
    const to = env.LEAD_TO_EMAIL.split(",").map((s) => s.trim()).filter(Boolean);
    sinks.push({
      name: "resend",
      send: (l) =>
        post(fetchFn, "https://api.resend.com/emails", { authorization: `Bearer ${env.RESEND_API_KEY}` }, {
          from: env.LEAD_FROM_EMAIL,
          to,
          subject: `New ${l.type} enquiry: ${l.name}`.replace(/[\r\n]+/g, " "),
          text: leadText(l),
          ...(l.email ? { reply_to: l.email } : {}),
        }),
    });
  }

  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    const key = env.SUPABASE_SERVICE_ROLE_KEY;
    sinks.push({
      name: "supabase",
      send: (l) =>
        post(
          fetchFn,
          `${env.SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/enquiries`,
          { apikey: key, authorization: `Bearer ${key}`, prefer: "return=minimal" },
          {
            type: l.type, name: l.name, phone: l.phone, email: l.email ?? null, message: l.message ?? null,
            stay_slug: l.staySlug ?? null, service_slug: l.serviceSlug ?? null,
            check_in: l.checkIn ?? null, check_out: l.checkOut ?? null,
            move_in_month: l.moveIn ? `${l.moveIn}-01` : null,
            adults: l.adults ?? null, children: l.children ?? null, rooms: l.rooms ?? null, budget: l.budget ?? null,
            source: l.source, utm: l.utm ?? {}, ip: l.ip, user_agent: l.userAgent, created_at: l.createdAt,
          },
        ),
    });
  }

  if (env.SHEET_WEBHOOK_URL) {
    sinks.push({ name: "sheet", send: (l) => post(fetchFn, env.SHEET_WEBHOOK_URL!, {}, l) });
  }

  return sinks;
}
