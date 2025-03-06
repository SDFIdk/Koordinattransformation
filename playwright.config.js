import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 20 * 1000,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    headless: true,
    screenshot: 'on',
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
    permissions: ['geolocation', 'notifications'],
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'] },
    },
    // Wait for stable version of Webkit for Linux or dockerize test environment to include this
    /*
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari']}
    },
    */
  ],
  webServer: {
    command: 'npm run build:test && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
  },
})


