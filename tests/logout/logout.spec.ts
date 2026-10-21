import { test, expect } from '../../fixtures/loggedInFixture';
import { URLS } from '../../utils/constants';

test.describe('Logout Module', () => {
  test.beforeEach(async ({ authenticatedProductPage }) => {
    // Session is pre-authenticated on products page
    await expect(authenticatedProductPage.pageTitle).toHaveText('Products');
  });

  test('TC_LOGOUT_001: Logout successfully via sidebar navigation menu', async ({
    authenticatedProductPage,
    loginPage,
    page,
  }) => {
    await authenticatedProductPage.logout();

    // Verify user is redirected to the login page
    await expect(page).toHaveURL(URLS.BASE + '/');
    expect(await loginPage.isLoginPageLoaded()).toBe(true);
  });

  test('TC_LOGOUT_002: Verify user redirected to login page and cannot access inventory after logout', async ({
    authenticatedProductPage,
    loginPage,
    page,
  }) => {
    await authenticatedProductPage.logout();

    // Confirm redirection to login page
    await expect(page).toHaveURL(URLS.BASE + '/');
    await expect(loginPage.loginButton).toBeVisible();

    // Attempt direct navigation to protected inventory page after logout
    await page.goto(URLS.BASE + URLS.INVENTORY);

    // Verify access is blocked and redirected to login page with security error
    await expect(page).toHaveURL(URLS.BASE + '/');
    const errorMessage = await loginPage.getErrorMessageText();
    expect(errorMessage).toContain("You can only access '/inventory.html' when you are logged in.");
  });
});
