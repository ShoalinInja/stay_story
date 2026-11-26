// axe-core WCAG 2.2 AA scan: zero serious/critical violations per template, at phone and desktop widths.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const PAGES: Record<string, string> = {
  home: "/",
  stays: "/stays",
  "stay detail": "/stays/casa-siolim",
  "stay-type landing": "/stays/villas",
  "service category": "/travel",
  "service item": "/travel/airport-transfers",
  contact: "/contact",
  about: "/about",
  "not found": "/this-page-does-not-exist",
};
const VIEWPORTS = { mobile: { width: 375, height: 812 }, desktop: { width: 1280, height: 800 } };

/** Rules with an open defect in QA-REPORT.md. Excluded from the sweep, asserted by the fixme tests below. */
const KNOWN: Record<string, string> = {
  "color-contrast": "D5 (brand-strong 4.18:1) + D6 (success 3.49:1)",
  "label-content-name-mismatch": "D7 (gallery '+N More' tile)",
};

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
    test.use({ viewport });
    for (const [name, url] of Object.entries(PAGES)) {
      test(`${name} (${url}) has no serious/critical violations`, async ({ page }) => {
        await page.goto(url);
        await page.waitForLoadState("networkidle");
        const blocking = (await blockingViolations(page)).filter((v) => !(v.id in KNOWN));
        expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
      });
    }
  });
}

for (const [rule, defect] of Object.entries(KNOWN)) {
  test.fixme(`${defect}: axe ${rule} clean on every template`, async ({ page }) => {
    const failures: Record<string, unknown> = {};
    for (const url of Object.values(PAGES)) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      const v = await blockingViolations(page, [rule]);
      if (v.length) failures[url] = v;
    }
    expect(failures, JSON.stringify(failures, null, 2)).toEqual({});
  });
}
