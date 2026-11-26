// Keyboard/focus: every tab stop shows a visible focus indicator, and nothing uses a positive tabindex.
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/stays", "/stays/casa-siolim", "/travel/airport-transfers", "/contact"];
const TAB_STOPS = 40;

for (const url of PAGES) {
  test(`no positive tabindex on ${url}`, async ({ page }) => {
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    const positive = await page.locator("[tabindex]").evaluateAll((els) =>
      els.filter((e) => Number(e.getAttribute("tabindex")) > 0).map((e) => e.outerHTML.slice(0, 120)),
    );
    expect(positive).toEqual([]);
  });

  test(`first ${TAB_STOPS} tab stops on ${url} show a focus indicator`, async ({ page }) => {
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    const missing: string[] = [];
    for (let i = 0; i < TAB_STOPS; i++) {
      await page.keyboard.press("Tab");
      const r = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        // D10: native date inputs get only Chrome's pale segment highlight, no ring. Excluded here, tracked below.
        if (el instanceof HTMLInputElement && el.type === "date") return null;
        const shows = (s: CSSStyleDeclaration) =>
          (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== "none";
        // Card links draw their ring on ::after so the whole card is outlined.
        return { ok: shows(getComputedStyle(el)) || shows(getComputedStyle(el, "::after")), el: `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40)}"` };
      });
      if (r && !r.ok) missing.push(r.el);
    }
    expect(missing).toEqual([]);
  });
}

test("D10: native date inputs show the focus ring", async ({ page }) => {
  await page.goto("/travel/airport-transfers");
  const date = page.locator('main input[type="date"]').first();
  await date.focus();
  const ringed = await date.evaluate((el) => {
    const s = getComputedStyle(el);
    return (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== "none";
  });
  expect(ringed).toBe(true);
});
