import { test as base, expect } from './baseFixture';
import { STORAGE_STATE_PATH, URLS } from '../utils/constants';
import { TestDataReader } from '../utils/testDataReader';
import { ProductPage } from '../pages/ProductPage';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../utils/logger';

/**
 * loggedInFixture provides a pre-authenticated session by leveraging Playwright's storageState.
 * If the storageState file does not already exist, it performs a single login,
 * writes the session state to playwright/.auth/user.json, and reuses it across test runs.
 */
export const test = base.extend<{
  authenticatedProductPage: ProductPage;
}>({
  storageState: async ({}, use) => {
    const fullPath = path.resolve(process.cwd(), STORAGE_STATE_PATH);
    if (!fs.existsSync(fullPath)) {
      Logger.info(`Storage state not found at ${fullPath}. Performing one-time authentication...`);
      const { chromium } = await import('@playwright/test');
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      const standardUser = TestDataReader.getStandardUser();

      await page.goto(URLS.BASE);
      await page.getByPlaceholder('Username').fill(standardUser.username);
      await page.getByPlaceholder('Password').fill(standardUser.password);
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForURL('**/inventory.html');

      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      await context.storageState({ path: fullPath });
      Logger.info(`Authentication state saved to ${STORAGE_STATE_PATH}`);
      await browser.close();
    }

    await use(STORAGE_STATE_PATH);
  },

  authenticatedProductPage: async ({ productPage }, use) => {
    await productPage.navigate();
    await use(productPage);
  },
});

export { expect };
