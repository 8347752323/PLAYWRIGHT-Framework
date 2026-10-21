import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * BasePage encapsulates common UI elements and actions shared across all pages,
 * such as the header, burger menu, shopping cart badge, and navigation.
 */
export class BasePage {
  readonly page: Page;
  readonly burgerMenuButton: Locator;
  readonly logoutSidebarLink: Locator;
  readonly allItemsSidebarLink: Locator;
  readonly resetSidebarLink: Locator;
  readonly closeMenuButton: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.burgerMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutSidebarLink = page.locator('[data-test="logout-sidebar-link"]');
    this.allItemsSidebarLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.resetSidebarLink = page.locator('[data-test="reset-sidebar-link"]');
    this.closeMenuButton = page.getByRole('button', { name: 'Close Menu' });
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.pageTitle = page.locator('[data-test="title"]');
  }

  /**
   * Navigates to a relative path using baseURL.
   */
  async navigateTo(path: string): Promise<void> {
    Logger.step(`Navigating to path: ${path}`);
    await this.page.goto(path);
  }

  /**
   * Returns the current page URL.
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Opens the sidebar hamburger navigation menu.
   */
  async openMenu(): Promise<void> {
    Logger.info('Opening burger navigation menu');
    await this.burgerMenuButton.click();
    await expect(this.logoutSidebarLink).toBeVisible();
  }

  /**
   * Closes the sidebar navigation menu.
   */
  async closeMenu(): Promise<void> {
    Logger.info('Closing burger navigation menu');
    await this.closeMenuButton.click();
    await expect(this.logoutSidebarLink).toBeHidden();
  }

  /**
   * Triggers logout via the sidebar navigation menu.
   */
  async logout(): Promise<void> {
    Logger.step('Logging out via sidebar menu');
    await this.openMenu();
    await this.logoutSidebarLink.click();
  }

  /**
   * Clicks on the shopping cart icon to open the cart page.
   */
  async clickShoppingCart(): Promise<void> {
    Logger.info('Clicking on shopping cart icon');
    await this.shoppingCartLink.click();
  }

  /**
   * Retrieves the current count displayed in the shopping cart badge.
   * Returns 0 if the badge is not present.
   */
  async getCartBadgeCount(): Promise<number> {
    const isVisible = await this.shoppingCartBadge.isVisible();
    if (!isVisible) {
      return 0;
    }
    const text = (await this.shoppingCartBadge.textContent())?.trim();
    return text ? parseInt(text, 10) : 0;
  }
}
