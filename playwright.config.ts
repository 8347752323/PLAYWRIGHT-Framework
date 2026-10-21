import { defineConfig, devices } from '@playwright/test';
import { URLS } from './utils/constants';

/**
 * Enterprise Playwright Configuration for SauceDemo Automation Framework
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Maximum execution time per test */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  /* Run tests across test files in parallel */
  fullyParallel: true,
  /* Fail build on CI if test.only is left in codebase */
  forbidOnly: !!process.env.CI,
  /* Retry policy */
  retries: process.env.CI ? 2 : 0,
  /* Parallel worker processes */
  workers: process.env.CI ? 2 : undefined,
  /* Comprehensive multi-reporter setup */
  reporter: [
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'reports/test-results.json' }],
  ],
  /* Shared settings across projects */
  use: {
    baseURL: URLS.BASE,
    /* Collect trace on failure */
    trace: 'retain-on-failure',
    /* Capture full-page screenshot on failure */
    screenshot: 'only-on-failure',
    /* Retain video recording on failure */
    video: 'retain-on-failure',
    /* Headless mode default; overridden via --headed */
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },

  /* Project matrix including authentication setup dependency */
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },
  ],

  /* Output directory for test failure artifacts (screenshots, traces, videos) */
  outputDir: 'test-results/',
});
