import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { STORAGE_STATE_PATH, URLS } from '../utils/constants';
import { TestDataReader } from '../utils/testDataReader';
import { Logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

setup('authenticate standard user and generate storageState', async ({ page }) => {
  Logger.step('Executing global authentication setup for storageState');
  const loginPage = new LoginPage(page);
  const standardUser = TestDataReader.getStandardUser();

  await loginPage.navigate();
  await loginPage.login(standardUser.username, standardUser.password);

  // Assert successful navigation to inventory
  await expect(page).toHaveURL(new RegExp(URLS.INVENTORY));

  // Ensure target folder exists
  const targetDir = path.dirname(path.resolve(process.cwd(), STORAGE_STATE_PATH));
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Persist authentication state
  await page.context().storageState({ path: STORAGE_STATE_PATH });
  Logger.info(`Saved authenticated storageState to: ${STORAGE_STATE_PATH}`);
});
