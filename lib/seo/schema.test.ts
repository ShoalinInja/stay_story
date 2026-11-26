import { test } from "node:test";
import assert from "node:assert/strict";
import { content } from "../../content";
import { faqLd, serializeLd, stayLd } from "./schema";

const stay = content.stays[0];

test("aggregateRating only for real, rated stays", () => {
  const rating = { value: 4.8, count: 12, source: "google" as const };
  assert.equal(stayLd({ ...stay, rating: undefined, isPlaceholder: false }).aggregateRating, undefined);
  assert.equal(stayLd({ ...stay, rating, isPlaceholder: true }).aggregateRating, undefined);
  assert.ok(stayLd({ ...stay, rating, isPlaceholder: false }).aggregateRating);
});

test("JSON-LD escapes < and drops empty nodes", () => {
  const json = serializeLd([faqLd([{ q: "</script><b>", a: "x" }]), faqLd([])])!;
  assert.ok(!json.includes("<"));
  assert.equal(JSON.parse(json)["@graph"].length, 1);
  assert.equal(serializeLd([null]), null);
});
