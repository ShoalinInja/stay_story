import { defineConfig, devices } from "@playwright/test";

// E2E runs against a prior production build: `ALLOW_PLACEHOLDERS=true pnpm build && pnpm test:e2e`.
const PORT = Number(process.env.E2E_PORT ?? 3219);
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "e2e",
  // .next/ is already git-ignored, so artifacts never need a .gitignore entry.
  outputDir: ".next/e2e-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } }],
  webServer: {
    command: "pnpm start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // Placeholder stays are the only stays today; without this they 404 in a production server.
    env: { PORT: String(PORT), ALLOW_PLACEHOLDERS: "true" },
  },
});
