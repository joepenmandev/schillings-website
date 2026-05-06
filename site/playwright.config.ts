import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4321';

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
    command: 'npm run preview -- --port 4321 --host 127.0.0.1',
    url: `${baseURL}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 90_000,
  },
});
