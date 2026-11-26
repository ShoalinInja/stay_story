// POST /api/enquiry logic, framework-free so node:test can drive it with a plain Request.
import { makeEnquirySchema, todayInKolkata } from "./schema";
import { configuredSinks, type Lead } from "./sinks";
import type { RateLimiter } from "./rate-limit";

export type EnquiryErrorCode = "invalid" | "rate_limited" | "captcha" | "delivery_failed";
export type EnquiryResponse = {
  ok: boolean;
  error?: EnquiryErrorCode;
  issues?: { path: string; message: string }[];
  /** Present on failures so the UI can offer "Call / WhatsApp us". */
  fallback?: { phone: string; whatsapp: string | null };
  warning?: string;
};

export type HandlerDeps = {
  env: Record<string, string | undefined>;
  fetch: typeof fetch;
  limiter: RateLimiter;
  fallback: { phone: string; whatsapp: string | null };
  log?: Pick<Console, "info" | "warn" | "error">;
  today?: () => string;
};

const ATTRIBUTION_KEYS = /^(utm_[a-z]+|gclid|fbclid|msclkid)$/;

function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

async function readBody(req: Request, isForm: boolean): Promise<Record<string, unknown> | null> {
  try {
    if (!isForm) {
      const body: unknown = await req.json();
      return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
    }
    const raw: Record<string, unknown> = {};
    const utm: Record<string, string> = {};
    for (const [k, v] of await req.formData()) {
      if (typeof v !== "string") continue;
      if (ATTRIBUTION_KEYS.test(k)) utm[k] = v;
      // First non-empty value wins: the <noscript> date inputs share names with the picker's hidden inputs.
      else if (raw[k] === undefined || raw[k] === "") raw[k] = v;
    }
    return Object.keys(utm).length ? { ...raw, utm } : raw;
  } catch {
    return null;
  }
}

/** UTM/click IDs from the page the form was on (covers no-JS posts) plus the page path. */
function attributionFromReferer(referer: URL | null): Record<string, string> {
  if (!referer) return {};
  const out: Record<string, string> = { page: referer.pathname };
  for (const [k, v] of referer.searchParams) if (ATTRIBUTION_KEYS.test(k)) out[k] = v.slice(0, 500);
  return out;
}

function sameOriginReferer(req: Request): URL | null {
  const ref = req.headers.get("referer");
  if (!ref) return null;
  try {
    const url = new URL(ref);
    const host = req.headers.get("x-forwarded-host") ?? new URL(req.url).host;
    return url.host === host ? url : null;
  } catch {
    return null;
  }
}

async function verifyTurnstile(deps: HandlerDeps, token: unknown, ip: string): Promise<boolean> {
  if (typeof token !== "string" || !token) return false;
  try {
    const res = await deps.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: deps.env.TURNSTILE_SECRET_KEY!, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    return Boolean(((await res.json()) as { success?: boolean }).success);
  } catch (err) {
    deps.log?.error("[enquiry] turnstile verification error", err);
    return false;
  }
}

export async function handleEnquiry(req: Request, deps: HandlerDeps): Promise<Response> {
  const log = deps.log ?? console;
  const contentType = req.headers.get("content-type") ?? "";
  const isForm = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");
  const referer = sameOriginReferer(req);

  const reply = (status: number, body: EnquiryResponse): Response => {
    if (!isForm) return Response.json(body, { status });
    // Static pages: a query-param banner would stream hidden under Cache Components and never show without JS.
    const location = body.ok ? "/thank-you" : "/enquiry-error";
    return new Response(null, { status: 303, headers: { location } });
  };
  const fail = (status: number, error: EnquiryErrorCode, extra: Partial<EnquiryResponse> = {}) =>
    reply(status, { ok: false, error, fallback: deps.fallback, ...extra });

  const raw = await readBody(req, isForm);
  if (!raw) return fail(400, "invalid");

  // Honeypot: pretend success, store nothing.
  if (typeof raw.website === "string" && raw.website.trim()) {
    log.info("[enquiry] honeypot filled, dropped");
    return reply(200, { ok: true });
  }

  const ip = clientIp(req);
  if (!(await deps.limiter(ip))) return fail(429, "rate_limited");

  const parsed = makeEnquirySchema(deps.today ?? (() => todayInKolkata())).safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
    return fail(400, "invalid", { issues });
  }

  if (deps.env.TURNSTILE_SECRET_KEY && !(await verifyTurnstile(deps, raw["cf-turnstile-response"] ?? raw.turnstileToken, ip))) {
    return fail(400, "captcha");
  }

  const data = parsed.data;
  const lead: Lead = {
    ...data,
    website: undefined, // honeypot was empty; keep it out of the stored lead
    utm: { ...attributionFromReferer(referer), ...data.utm },
    ip,
    userAgent: (req.headers.get("user-agent") ?? "").slice(0, 300),
    createdAt: new Date().toISOString(),
  };

  const sinks = configuredSinks(deps.env, deps.fetch);
  if (sinks.length === 0) {
    if (deps.env.NODE_ENV === "production") {
      log.error("[enquiry] no lead sinks configured in production; lead not stored", lead);
      return fail(502, "delivery_failed");
    }
    log.warn("[enquiry] no lead sinks configured (dev): logging lead only", lead);
    return reply(200, { ok: true, warning: "No lead sinks configured; lead was logged only." });
  }

  const results = await Promise.allSettled(sinks.map((s) => s.send(lead)));
  const failed = results.flatMap((r, i) => (r.status === "rejected" ? [{ sink: sinks[i].name, reason: String(r.reason) }] : []));
  if (failed.length < sinks.length) {
    if (failed.length) log.error("[enquiry] some sinks failed; lead stored elsewhere", { failed, source: lead.source, type: lead.type });
    return reply(200, { ok: true });
  }
  // Every sink failed: log the full lead so it can be recovered from server logs.
  log.error("[enquiry] all sinks failed", { failed, lead });
  return fail(502, "delivery_failed");
}
