import { test } from "node:test";
import assert from "node:assert/strict";
import type { ServiceCategory, ServiceItem } from "@/lib/content/types";
import { isServiceCategory, resolveRelated } from "./whitelist";

test("whitelist accepts the five service categories and rejects stays/unknown", () => {
  for (const ok of ["travel", "experiences", "events", "concierge", "entertainment"]) assert.equal(isServiceCategory(ok), true);
  for (const bad of ["stays", "stays-nope", "about", "", "Travel"]) assert.equal(isServiceCategory(bad), false);
});

test("resolveRelated keeps order, skips unknown and self slugs", () => {
  const item = (slug: string, related: string[] = []) => ({ slug, related }) as unknown as ServiceItem;
  const a = item("a", ["c", "missing", "a", "b"]);
  const category = { items: [a, item("b"), item("c")] } as unknown as ServiceCategory;
  assert.deepEqual(resolveRelated(category, a).map((i) => i.slug), ["c", "b"]);
});
