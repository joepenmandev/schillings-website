import { defineConfig, devices } from '@playwright/test';

/** Dedicated port avoids clashes with a developer’s normal `astro dev` on 4321. `@astrojs/vercel` does not support `astro preview`. */
const devPort = process.env.PLAYWRIGHT_DEV_PORT ?? '8787';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${devPort}`;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
  },
  projects: [
    {
      name: 'http',
      testMatch: ['**/smoke.spec.ts', '**/locale-region.spec.ts'],
    },
    {
      name: 'chromium',
      testMatch: '**/a11y-contact.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${devPort} --host 127.0.0.1`,
    url: `${baseURL}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
