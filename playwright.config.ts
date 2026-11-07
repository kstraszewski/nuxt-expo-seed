import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: { ...devices['Desktop Chrome'], trace: 'retain-on-failure' },
  webServer: [
    {
      command: 'pnpm --filter @seed/landing dev --host 127.0.0.1',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'pnpm --filter @seed/crm dev --host 127.0.0.1',
      url: 'http://127.0.0.1:3001/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      env: { SEED_MODE: 'demo' },
    },
  ],
})
