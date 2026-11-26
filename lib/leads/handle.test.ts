import { test } from "node:test";
import assert from "node:assert/strict";
import { handleEnquiry, type HandlerDeps } from "./handle";

const lead = { type: "callback", name: "Asha Rao", phone: "+91 98765 43210", source: "test" };
const silent = { info: () => {}, warn: () => {}, error: () => {} };
const ALL_SINKS = {
  RESEND_API_KEY: "re_x", LEAD_TO_EMAIL: "to@x.in", LEAD_FROM_EMAIL: "from@x.in",
  SUPABASE_URL: "https://db.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "srk",
  SHEET_WEBHOOK_URL: "https://hook.example/sheet",
};

function deps(over: Partial<HandlerDeps> & { failing?: string[] } = {}) {
  const hits: string[] = [];
  const fakeFetch = (async (input: string | URL) => {
    const host = new URL(String(input)).host;
    hits.push(host);
    return over.failing?.some((h) => host.includes(h)) ? new Response("boom", { status: 500 }) : new Response("{}", { status: 200 });
  }) as typeof fetch;
  const d: HandlerDeps = {
    env: ALL_SINKS, fetch: fakeFetch, limiter: async () => true, log: silent,
    fallback: { phone: "+918160182809", whatsapp: "+918160182809" },
    today: () => "2026-11-26",
    ...over,
  };
  return { d, hits };
}

const json = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/enquiry", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "9.9.9.9", ...headers },
    body: JSON.stringify(body),
  });
const form = (body: Record<string, string>, referer = "http://localhost/stays/casa?x=1") =>
  new Request("http://localhost/api/enquiry", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", referer },
    body: new URLSearchParams(body).toString(),
  });

test("200 when one sink fails but another succeeds", async () => {
  const { d, hits } = deps({ failing: ["resend", "supabase"] });
  const res = await handleEnquiry(json(lead), d);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).ok, true);
  assert.equal(hits.length, 3, "all three sinks attempted");
});

test("502 with Call/WhatsApp fallback and no error detail when every sink fails", async () => {
  const { d } = deps({ failing: ["resend", "supabase", "hook"] });
  const res = await handleEnquiry(json(lead), d);
  assert.equal(res.status, 502);
  const body = await res.json();
  assert.equal(body.ok, false);
  assert.deepEqual(body.fallback, { phone: "+918160182809", whatsapp: "+918160182809" });
  assert.ok(!JSON.stringify(body).includes("boom"));
});

test("a thrown sink (network error) counts as a failure, not a crash", async () => {
  const { d } = deps({ env: { SHEET_WEBHOOK_URL: "https://hook.example" }, fetch: (async () => { throw new Error("ECONNRESET"); }) as typeof fetch });
  assert.equal((await handleEnquiry(json(lead), d)).status, 502);
});

test("honeypot: 200 and no sink is called", async () => {
  const { d, hits } = deps();
  const res = await handleEnquiry(json({ ...lead, website: "http://spam.example" }), d);
  assert.equal(res.status, 200);
  assert.equal(hits.length, 0);
});

test("invalid payload: 400 with field issues, no sink call", async () => {
  const { d, hits } = deps();
  const res = await handleEnquiry(json({ ...lead, phone: "123" }), d);
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.ok(body.issues.some((i: { path: string }) => i.path === "phone"));
  assert.equal(hits.length, 0);
});

test("rate limited: 429 keyed on the first X-Forwarded-For IP", async () => {
  const keys: string[] = [];
  const { d } = deps({ limiter: async (k) => { keys.push(k); return false; } });
  const res = await handleEnquiry(json(lead, { "x-forwarded-for": "1.2.3.4, 10.0.0.1" }), d);
  assert.equal(res.status, 429);
  assert.deepEqual(keys, ["1.2.3.4"]);
});

test("no sinks configured outside production: logs the lead and returns 200 with a warning", async () => {
  const logged: unknown[] = [];
  const { d } = deps({ env: { NODE_ENV: "development" }, log: { ...silent, warn: (...a: unknown[]) => logged.push(a) } });
  const res = await handleEnquiry(json(lead), d);
  assert.equal(res.status, 200);
  assert.ok((await res.json()).warning);
  assert.ok(logged.length > 0);
});

test("no sinks configured in production: 502", async () => {
  const { d } = deps({ env: { NODE_ENV: "production" } });
  assert.equal((await handleEnquiry(json(lead), d)).status, 502);
});

test("form post success: 303 to /thank-you", async () => {
  const { d } = deps();
  const res = await handleEnquiry(form(lead), d);
  assert.equal(res.status, 303);
  assert.equal(res.headers.get("location"), "/thank-you");
});

test("form post failure: 303 to the static /enquiry-error page", async () => {
  const { d } = deps();
  const res = await handleEnquiry(form({ ...lead, phone: "1" }), d);
  assert.equal(res.status, 303);
  assert.equal(res.headers.get("location"), "/enquiry-error");
});

test("form post: UTM params are recovered from the referrer page URL and sent to sinks", async () => {
  let sheetBody = "";
  const { d } = deps({
    env: { SHEET_WEBHOOK_URL: "https://hook.example" },
    fetch: (async (_u: string, init: RequestInit) => { sheetBody = String(init.body); return new Response("ok"); }) as typeof fetch,
  });
  await handleEnquiry(form(lead, "http://localhost/stays?utm_source=ig&utm_campaign=diwali"), d);
  const sent = JSON.parse(sheetBody);
  assert.equal(sent.utm.utm_source, "ig");
  assert.equal(sent.utm.utm_campaign, "diwali");
  assert.equal(sent.phone, "+919876543210");
});

test("Turnstile: rejects with 400 when the secret is set and verification fails", async () => {
  const { d } = deps({
    env: { ...ALL_SINKS, TURNSTILE_SECRET_KEY: "s" },
    fetch: (async (u: string) => String(u).includes("challenges.cloudflare.com")
      ? Response.json({ success: false }) : new Response("{}")) as typeof fetch,
  });
  const res = await handleEnquiry(json({ ...lead, turnstileToken: "bad" }), d);
  assert.equal(res.status, 400);
});
