import { test, expect } from '../../fixtures/baseFixture';
import { TestDataReader } from '../../utils/testDataReader';
import { URLS } from '../../utils/constants';

test.describe('Login Module', () => {
  const users = TestDataReader.getUsers();

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('TC_LOGIN_001: Login with valid credentials', async ({ loginPage, page }) => {
    const validUser = users.standardUser;
    await loginPage.login(validUser.username, validUser.password);

    await expect(page).toHaveURL(new RegExp(URLS.INVENTORY));
  });

  test('TC_LOGIN_002: Login with locked user', async ({ loginPage }) => {
    const lockedUser = users.lockedUser;
    await loginPage.login(lockedUser.username, lockedUser.password);

    const errorMessage = await loginPage.getErrorMessageText();
    expect(errorMessage).toContain(lockedUser.errorMessage);
  });

  test('TC_LOGIN_003: Login with invalid password', async ({ loginPage }) => {
    const invalidUser = users.invalidUser;
    await loginPage.login(invalidUser.username, invalidUser.password);

    const errorMessage = await loginPage.getErrorMessageText();
    expect(errorMessage).toContain(invalidUser.errorMessage);
  });

  test('TC_LOGIN_004: Verify error message for empty credentials', async ({ loginPage }) => {
    // Attempt login with empty username
    const emptyUser = users.emptyUsername;
    await loginPage.login(emptyUser.username, emptyUser.password);
    let errorMessage = await loginPage.getErrorMessageText();
    expect(errorMessage).toContain(emptyUser.errorMessage);

    // Attempt login with empty password
    const emptyPasswordUser = users.emptyPassword;
    await loginPage.login(emptyPasswordUser.username, emptyPasswordUser.password);
    errorMessage = await loginPage.getErrorMessageText();
    expect(errorMessage).toContain(emptyPasswordUser.errorMessage);
  });

  test('TC_LOGIN_005: Verify successful navigation after login', async ({ loginPage, productPage, page }) => {
    const validUser = users.standardUser;
    await loginPage.login(validUser.username, validUser.password);

    await expect(page).toHaveURL(new RegExp(URLS.INVENTORY));
    await expect(productPage.pageTitle).toHaveText('Products');
    await expect(productPage.inventoryContainer).toBeVisible();
  });
});
