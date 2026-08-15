// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

/**
 * Central Playwright configuration for the Reporting Tool regression suite.
 * BASE_URL / QA_USERNAME / QA_PASSWORD are injected via .env locally
 * or as secret pipeline variables in Azure DevOps (see azure-pipelines.yml).
 */
module.exports = defineConfig({
  testDir: './tests',
  outputDir: './test-results/artifacts',
  timeout: 45 * 1000,
  expect: {
    timeout: 8 * 1000,
  },

  // Fail the CI build if someone accidentally leaves .only in a spec
  forbidOnly: !!process.env.CI,

  // Flaky-test tolerance: retry twice on CI, never locally (fail fast for devs)
  retries: process.env.CI ? 2 : 0,

  // Parallelism
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    // JUnit XML is what the Azure DevOps "Publish Test Results" task consumes
    ['junit', { outputFile: 'test-results/junit/results.xml' }],
    process.env.CI ? ['github'] : ['dot'],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://demo.metabase.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10 * 1000,
    navigationTimeout: 15 * 1000,
    ignoreHTTPSErrors: true,
  },

  projects: [
    // Reusable authenticated session so every spec doesn't repeat login
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
});
