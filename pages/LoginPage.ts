import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../utils/constants';
import { Logger } from '../utils/logger';

/**
 * LoginPage handles interactions with the SauceDemo authentication page.
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;
  readonly loginLogo: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('.error-button');
    this.loginLogo = page.locator('.login_logo');
  }

  /**
   * Navigates directly to the login page.
   */
  async navigate(): Promise<void> {
    Logger.step(`Navigating to Login page: ${URLS.LOGIN}`);
    await this.navigateTo(URLS.LOGIN);
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Enters the provided username into the username field.
   */
  async enterUsername(username: string): Promise<void> {
    Logger.info(`Entering username: ${username}`);
    await this.usernameInput.fill(username);
  }

  /**
   * Enters the provided password into the password field.
   */
  async enterPassword(password: string): Promise<void> {
    Logger.info('Entering password');
    await this.passwordInput.fill(password);
  }

  /**
   * Clicks the login submit button.
   */
  async clickLogin(): Promise<void> {
    Logger.info('Clicking login button');
    await this.loginButton.click();
  }

  /**
   * Performs full login flow in a single step.
   */
  async login(username: string = '', password: string = ''): Promise<void> {
    Logger.step(`Submitting login credentials for user: "${username}"`);
    if (username) {
      await this.enterUsername(username);
    } else {
      await this.usernameInput.clear();
    }

    if (password) {
      await this.enterPassword(password);
    } else {
      await this.passwordInput.clear();
    }

    await this.clickLogin();
  }

  /**
   * Returns text content from the error message container.
   */
  async getErrorMessageText(): Promise<string> {
    await expect(this.errorMessage).toBeVisible();
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }

  /**
   * Checks whether the error banner is displayed.
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Verifies if the login page elements are displayed.
   */
  async isLoginPageLoaded(): Promise<boolean> {
    return (
      (await this.usernameInput.isVisible()) &&
      (await this.passwordInput.isVisible()) &&
      (await this.loginButton.isVisible())
    );
  }
}
