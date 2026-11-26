import { test } from "node:test";
import assert from "node:assert/strict";
import { content } from "../content";
import { buildRouteIndex, isKnownPath } from "./routing";

const live = buildRouteIndex(content, false);
const draft = buildRouteIndex(content, true);
const placeholderStay = content.stays.find((s) => s.isPlaceholder)!.slug;
const service = content.categories.find((c) => c.key === "experiences")!;

test("known routes pass", () => {
  for (const p of ["/", "/about", "/stays", "/stays/villas", "/areas/siolim", "/travel",
    `/${service.slug}/${service.items[0].slug}`, "/api/enquiry", "/stays/villas/opengraph-image"]) {
    assert.ok(isKnownPath(p, live), p);
  }
});

test("unknown routes are rejected", () => {
  for (const p of ["/nope", "/stays-nope", "/travel/nope", "/stays/nope", "/about/x", "/a/b/c", "/areas/mumbai"]) {
    assert.equal(isKnownPath(p, live), false, p);
  }
});

test("placeholder records only resolve when drafts are allowed", () => {
  assert.equal(isKnownPath(`/stays/${placeholderStay}`, live), false);
  assert.equal(isKnownPath(`/stays/${placeholderStay}`, draft), true);
});
