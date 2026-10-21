import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../utils/constants';
import { Logger } from '../utils/logger';

/**
 * CartPage encapsulates locators and interactions on the shopping cart review screen.
 */
export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
    this.cartItemPrices = page.locator('[data-test="inventory-item-price"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  /**
   * Navigates directly to the cart page.
   */
  async navigate(): Promise<void> {
    Logger.step(`Navigating to Cart page: ${URLS.CART}`);
    await this.navigateTo(URLS.CART);
    await expect(this.checkoutButton).toBeVisible();
  }

  /**
   * Returns total count of items currently in the cart.
   */
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Returns list of item names currently listed in the cart.
   */
  async getCartItemNames(): Promise<string[]> {
    return await this.cartItemNames.allInnerTexts();
  }

  /**
   * Retrieves specific details (quantity, price, description) for an item in the cart.
   */
  async getItemDetailsByName(
    productName: string
  ): Promise<{ quantity: number; price: string; description: string } | null> {
    const item = this.cartItems.filter({ hasText: productName }).first();
    if ((await item.count()) === 0) {
      return null;
    }
    const quantityStr = (await item.locator('[data-test="item-quantity"]').innerText()).trim();
    const price = (await item.locator('[data-test="inventory-item-price"]').innerText()).trim();
    const description = (await item.locator('[data-test="inventory-item-desc"]').innerText()).trim();
    return {
      quantity: parseInt(quantityStr, 10),
      price,
      description,
    };
  }

  /**
   * Removes a product from the cart by its name.
   */
  async removeItemByName(productName: string): Promise<void> {
    Logger.step(`Removing item "${productName}" from cart`);
    const item = this.cartItems.filter({ hasText: productName }).first();
    const removeBtn = item.getByRole('button', { name: 'Remove' });
    await expect(removeBtn).toBeVisible();
    await removeBtn.click();
    await expect(item).toHaveCount(0);
  }

  /**
   * Checks if an item with the given name is displayed in the cart.
   */
  async isItemInCart(productName: string): Promise<boolean> {
    const names = await this.getCartItemNames();
    return names.includes(productName);
  }

  /**
   * Clicks 'Continue Shopping' to return to products inventory.
   */
  async clickContinueShopping(): Promise<void> {
    Logger.info('Clicking Continue Shopping button');
    await this.continueShoppingButton.click();
  }

  /**
   * Clicks 'Checkout' button to begin checkout process.
   */
  async clickCheckout(): Promise<void> {
    Logger.step('Proceeding to Checkout step');
    await this.checkoutButton.click();
  }
}
