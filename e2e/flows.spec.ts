// Critical user flows against the production build (no lead sinks configured, so the API returns 502).
import { expect, test, type Page } from "@playwright/test";

// The enquiry limiter allows 5 posts / 10 min per IP; give each test its own "IP" so runs don't collide.
const fakeIp = () => `10.${(Math.random() * 255) | 0}.${(Math.random() * 255) | 0}.${(Math.random() * 255) | 0}`;
test.beforeEach(async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": fakeIp() });
});

async function fillContactForm(page: Page) {
  const form = page.getByRole("region", { name: "Send an enquiry" });
  await form.getByRole("textbox", { name: "Name" }).fill("QA Tester");
  await form.getByRole("textbox", { name: "Phone" }).fill("+91 98765 43210");
  await form.getByRole("textbox", { name: "Message" }).fill("Looking for a villa for four in December.");
  return form;
}

test("search bar submit routes to /stays with params and filtered results", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("search", { name: "Search stays" });
  await search.getByRole("combobox", { name: "Where in Goa" }).click();
  await page.getByRole("option", { name: "Siolim" }).click();
  await search.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/\/stays\?area=siolim&guests=2$/);
  // Next keeps the previous route mounted but hidden after client navigation, so scope to the visible <main>.
  const main = page.locator("main:visible");
  await expect(main.locator('a[href="/stays/casa-siolim"]').first()).toBeVisible();
  await expect(main.locator('a[href="/stays/vagator-cliffside-villa"]')).toHaveCount(0);
});

test("filter bar changes update the URL and results", async ({ page }) => {
  await page.goto("/stays");
  const filters = page.getByRole("complementary").getByRole("form", { name: "Filters" });
  await filters.getByRole("combobox", { name: "Stay type" }).selectOption("long-term");
  await expect(page).toHaveURL(/[?&]type=long-term/);
  const main = page.locator("main:visible");
  await expect(main.locator('a[href="/stays/panjim-long-stay-residence"]').first()).toBeVisible();
  await expect(main.locator('a[href="/stays/casa-siolim"]')).toHaveCount(0);
});

test("stay detail gallery opens the lightbox and closes with Escape", async ({ page }) => {
  await page.goto("/stays/casa-siolim");
  await page.getByRole("button", { name: "View photos" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("img").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

// D2: the lightbox is a controlled Modal with no Radix trigger, so on close focus falls to <body>.
test.fixme("D2: closing the stay lightbox returns focus to the opener", async ({ page }) => {
  await page.goto("/stays/casa-siolim");
  const trigger = page.getByRole("button", { name: "View photos" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("enquiry form shows and links validation errors; submit stays disabled", async ({ page }) => {
  await page.goto("/contact");
  const form = page.getByRole("region", { name: "Send an enquiry" });
  const phone = form.getByRole("textbox", { name: "Phone" });
  await phone.fill("123");
  await phone.blur();
  await expect(phone).toHaveAttribute("aria-invalid", "true");
  // Error text is programmatically associated, so screen readers read it with the field.
  const describedBy = await phone.getAttribute("aria-describedby");
  expect(describedBy).toBeTruthy();
  await expect(page.locator(`#${describedBy!.split(" ").at(-1)!.replace(/:/g, "\\:")}`)).not.toBeEmpty();
  await expect(phone).toHaveAccessibleDescription(/.+/);
  await expect(form.getByRole("button", { name: "Enquire Now" })).toBeDisabled();
});

test("enquiry submit with no sinks configured falls back gracefully to Call us", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/contact");
  const form = await fillContactForm(page);
  const submit = form.getByRole("button", { name: "Enquire Now" });
  await expect(submit).toBeEnabled();
  const [res] = await Promise.all([page.waitForResponse("**/api/enquiry"), submit.click()]);
  expect(res.status()).toBe(502);
  const alert = form.getByRole("alert");
  await expect(alert).toContainText("couldn't send");
  await expect(alert.getByRole("link", { name: "Call us" })).toHaveAttribute("href", /^tel:\+91/);
  await expect(alert.getByRole("link", { name: /WhatsApp/ })).toHaveCount(0); // site.whatsapp is null
  expect(errors).toEqual([]);
});

test.describe("no JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("native form POST answers 303 and lands on a page with the phone fallback", async ({ page }) => {
    await page.goto("/contact");
    await fillContactForm(page);
    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/api/enquiry") && r.request().method() === "POST"),
      page.getByRole("region", { name: "Send an enquiry" }).getByRole("button", { name: "Enquire Now" }).click(),
    ]);
    expect(res.status()).toBe(303);
    // No sinks in this build → handler redirects back with ?enquiry=error (with sinks it would be /thank-you).
    expect(res.headers().location).toMatch(/^\/contact\?enquiry=error$|^\/thank-you$/);
    await page.waitForURL(/enquiry=error|thank-you/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  // D4: request-time content streams into <div hidden id="S:n"> and is revealed by an inline $RC script.
  // Without JS it stays hidden, so the ?enquiry=error banner never shows and the visitor gets no feedback.
  test.fixme("D4: no-JS enquiry failure shows the call fallback banner", async ({ page }) => {
    await page.goto("/contact?enquiry=error");
    await expect(page.getByRole("alert").locator('a[href^="tel:+91"]')).toBeVisible();
  });

  // D3: same cause; the /stays grid and filter form live in the Suspense hole, so no-JS visitors see a skeleton.
  test.fixme("D3: /stays lists stays and the filter form without JS", async ({ page }) => {
    await page.goto("/stays?type=long-term");
    await expect(page.locator('main a[href="/stays/panjim-long-stay-residence"]:visible').first()).toBeVisible();
    await expect(page.getByRole("form", { name: "Filters" })).toBeVisible();
  });

  test("static pages keep nav, content and the enquiry form without JS", async ({ page }) => {
    await page.goto("/stays/casa-siolim");
    await expect(page.getByRole("heading", { level: 1, name: "Casa Siolim" })).toBeVisible();
    await expect(page.locator("main form[action='/api/enquiry']:visible").first()).toBeVisible();
    await page.goto("/travel/airport-transfers");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("main form[action='/api/enquiry']:visible").first()).toBeVisible();
  });
});

test("honeypot submissions are accepted silently and not stored", async ({ request }) => {
  const res = await request.post("/api/enquiry", {
    headers: { "x-forwarded-for": fakeIp() },
    data: { type: "general", source: "e2e", name: "Bot", phone: "+919876543210", message: "spam", website: "http://spam.example" },
  });
  // A real submission 502s here (no sinks); 200 proves the honeypot short-circuits before delivery.
  expect(res.status()).toBe(200);
  expect(await res.json()).toEqual({ ok: true });
});

test("enquiry modal traps focus, closes on Escape and returns focus", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("banner").getByRole("button", { name: "Enquire Now" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Shift+Tab");
  expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test.describe("mobile 375", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("mobile menu sheet opens and closes with the keyboard", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("link", { name: "Open menu" }).filter({ visible: true });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const sheet = page.getByRole("dialog", { name: "Menu" });
    await expect(sheet).toBeVisible();
    await sheet.getByRole("button", { name: "Stays" }).press("Enter");
    await expect(sheet.getByRole("link", { name: "Villas (Short Stay)" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});

test("skip link is first in tab order and moves focus into #main", async ({ page }) => {
  await page.goto("/stays");
  await page.waitForLoadState("networkidle"); // hydration resets the sequential-focus start point
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("#main"))).toBe(true);
});

for (const route of ["/", "/stays/casa-siolim", "/contact", "/travel/airport-transfers"]) {
  test(`no WhatsApp UI when site.whatsapp is null: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('a[href*="wa.me"], a[href*="whatsapp.com"]')).toHaveCount(0);
    await expect(page.getByText(/whatsapp/i).filter({ visible: true })).toHaveCount(0);
  });
}
