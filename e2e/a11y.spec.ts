// axe-core WCAG 2.2 AA scan: zero serious/critical violations per template, at phone and desktop widths.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const PAGES: Record<string, string> = {
  home: "/",
  stays: "/stays",
  "stay detail": "/stays/4-bhk-luxury-villa-with-pool",
  "stay-type landing": "/stays/villas",
  "service category": "/travel",
  "service item": "/travel/airport-transfers",
  contact: "/contact",
  about: "/about",
  "not found": "/this-page-does-not-exist",
};
const VIEWPORTS = { mobile: { width: 375, height: 812 }, desktop: { width: 1280, height: 800 } };

async function blockingViolations(page: Page, rules?: string[]) {
  const builder = new AxeBuilder({ page }).withTags(TAGS);
  if (rules) builder.withRules(rules);
  const { violations } = await builder.analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => ({ id: v.id, impact: v.impact, targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")), summary: v.nodes[0]?.failureSummary }));
}

for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(`axe @ ${vpName}`, () => {
    // Scroll reveals leave elements near the fold mid-fade; axe should check the settled colours.
    test.use({ viewport, reducedMotion: "reduce" });
    for (const [name, url] of Object.entries(PAGES)) {
      test(`${name} (${url}) has no serious/critical violations`, async ({ page }) => {
        await page.goto(url);
        await page.waitForLoadState("networkidle");
        const blocking = (await blockingViolations(page));
        expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
      });
    }
  });
}
