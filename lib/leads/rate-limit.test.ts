import { test } from "node:test";
import assert from "node:assert/strict";
import { createLimiter, memoryLimiter, upstashLimiter } from "./rate-limit";

test("memory limiter allows 5 per window per key, then blocks, then resets", async () => {
  let now = 0;
  const allow = memoryLimiter({ limit: 5, windowMs: 600_000, now: () => now });
  for (let i = 0; i < 5; i++) assert.equal(await allow("1.1.1.1"), true, `request ${i + 1}`);
  assert.equal(await allow("1.1.1.1"), false);
  assert.equal(await allow("2.2.2.2"), true, "other IPs unaffected");
  now = 600_001;
  assert.equal(await allow("1.1.1.1"), true, "window reset");
});

test("upstash limiter sends SET NX EX + INCR via the REST pipeline and blocks after the limit", async () => {
  let count = 0;
  const calls: { url: string; body: unknown; auth: string | null }[] = [];
  const fakeFetch = (async (url: string, init: RequestInit) => {
    calls.push({ url, body: JSON.parse(String(init.body)), auth: new Headers(init.headers).get("authorization") });
    count++;
    return Response.json([{ result: count === 1 ? "OK" : null }, { result: count }]);
  }) as typeof fetch;
  const allow = upstashLimiter({ url: "https://r.upstash.io", token: "t", limit: 5, windowSec: 600, fetch: fakeFetch });
  for (let i = 0; i < 5; i++) assert.equal(await allow("ip"), true);
  assert.equal(await allow("ip"), false);
  assert.equal(calls[0].url, "https://r.upstash.io/pipeline");
  assert.equal(calls[0].auth, "Bearer t");
  assert.deepEqual(calls[0].body, [["SET", "rl:enquiry:ip", "0", "EX", "600", "NX"], ["INCR", "rl:enquiry:ip"]]);
});

test("upstash limiter fails open when Upstash is down (a lost lead costs more than spam)", async () => {
  const errors: unknown[] = [];
  const allow = upstashLimiter({
    url: "https://r", token: "t", limit: 5, windowSec: 600,
    fetch: (async () => new Response("down", { status: 500 })) as typeof fetch,
    log: { error: (...a: unknown[]) => errors.push(a), warn: () => {} },
  });
  assert.equal(await allow("ip"), true);
  assert.equal(errors.length, 1);
});

test("createLimiter falls back to memory and warns exactly once without Upstash env", async () => {
  const warnings: unknown[] = [];
  const allow = createLimiter({}, fetch, { warn: (...a: unknown[]) => warnings.push(a), error: () => {} });
  await allow("a");
  await allow("b");
  assert.equal(warnings.length, 1);
});
