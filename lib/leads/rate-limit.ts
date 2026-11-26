// Fixed-window rate limiter: Upstash REST when configured, in-memory otherwise.

/** Resolves true when the request is allowed. */
export type RateLimiter = (key: string) => Promise<boolean>;
export type Logger = Pick<Console, "warn" | "error">;

export const LIMIT = 5;
export const WINDOW_SEC = 600;

export function memoryLimiter({ limit = LIMIT, windowMs = WINDOW_SEC * 1000, now = Date.now } = {}): RateLimiter {
  // ponytail: per-instance memory; serverless instances don't share it. Set UPSTASH_* for a real limit.
  const hits = new Map<string, { count: number; resetAt: number }>();
  return async (key) => {
    const t = now();
    if (hits.size > 5000) for (const [k, v] of hits) if (v.resetAt <= t) hits.delete(k);
    const cur = hits.get(key);
    const next = !cur || cur.resetAt <= t ? { count: 1, resetAt: t + windowMs } : { ...cur, count: cur.count + 1 };
    hits.set(key, next);
    return next.count <= limit;
  };
}

export function upstashLimiter(opts: {
  url: string;
  token: string;
  limit?: number;
  windowSec?: number;
  fetch: typeof fetch;
  log?: Logger;
}): RateLimiter {
  const { url, token, limit = LIMIT, windowSec = WINDOW_SEC, log = console } = opts;
  return async (key) => {
    const k = `rl:enquiry:${key}`;
    try {
      const res = await opts.fetch(`${url.replace(/\/$/, "")}/pipeline`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify([["SET", k, "0", "EX", String(windowSec), "NX"], ["INCR", k]]),
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error(`Upstash HTTP ${res.status}`);
      const out = (await res.json()) as { result?: unknown }[];
      const count = Number(out[1]?.result);
      if (!Number.isFinite(count)) throw new Error("Upstash returned no count");
      return count <= limit;
    } catch (err) {
      // Fail open: a dropped lead costs more than a few spam posts.
      log.error("[enquiry] rate limiter unavailable, allowing request", err);
      return true;
    }
  };
}

export function createLimiter(env: Record<string, string | undefined>, fetchFn: typeof fetch, log: Logger = console): RateLimiter {
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = env;
  if (url && token) return upstashLimiter({ url, token, fetch: fetchFn, log });
  const mem = memoryLimiter();
  let warned = false;
  return (key) => {
    if (!warned) {
      warned = true;
      log.warn("[enquiry] UPSTASH_REDIS_REST_URL/TOKEN not set: using in-memory rate limiting (per instance only).");
    }
    return mem(key);
  };
}
