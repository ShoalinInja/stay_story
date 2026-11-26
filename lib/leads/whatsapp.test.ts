import { test } from "node:test";
import assert from "node:assert/strict";
import { leadWhatsAppMessage, whatsAppUrl } from "./whatsapp";

test("whatsAppUrl strips non-digits from the number and URI-encodes the text", () => {
  const url = whatsAppUrl("+91 81601-82809", "Hi & hello? 20–24 Dec #villa");
  assert.equal(url, `https://wa.me/918160182809?text=${encodeURIComponent("Hi & hello? 20–24 Dec #villa")}`);
  assert.ok(!url.includes(" ") && !url.includes("&h") && !url.includes("#"));
});

test("leadWhatsAppMessage names the stay and the dates", () => {
  const msg = leadWhatsAppMessage({ type: "stay", staySlug: "casa-siolim", checkIn: "2026-12-20", checkOut: "2026-12-24" });
  assert.match(msg, /Casa Siolim/);
  assert.match(msg, /2026-12-20/);
  assert.match(msg, /2026-12-24/);
});

test("leadWhatsAppMessage names the service", () => {
  assert.match(leadWhatsAppMessage({ type: "service", serviceSlug: "yacht-charter" }), /Yacht Charter/);
});

test("decoded URL round-trips the message exactly", () => {
  const msg = leadWhatsAppMessage({ type: "stay", staySlug: "a-b", checkIn: "2026-12-20", checkOut: "2026-12-24" });
  const text = new URL(whatsAppUrl("+918160182809", msg)).searchParams.get("text");
  assert.equal(text, msg);
});
