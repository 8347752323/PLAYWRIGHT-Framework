import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS, SortOption } from '../utils/constants';
import { Helper } from '../utils/helper';
import { Logger } from '../utils/logger';

/**
 * ProductPage manages interactions on the inventory / products catalogue screen.
 */
export class ProductPage extends BasePage {
  readonly inventoryContainer: Locator;
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productDescriptions: Locator;
  readonly productPrices: Locator;
  readonly sortDropdown: Locator;
  readonly activeSortOption: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = page.locator('#inventory_container').first();
    this.productItems = page.locator('[data-test="inventory-item"]');
    this.productNames = page.locator('[data-test="inventory-item-name"]');
    this.productDescriptions = page.locator('[data-test="inventory-item-desc"]');
    this.productPrices = page.locator('[data-test="inventory-item-price"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.activeSortOption = page.locator('[data-test="active-option"]');
  }

  /**
   * Navigates directly to the inventory/products page.
   */
  async navigate(): Promise<void> {
    Logger.step(`Navigating to Products page: ${URLS.INVENTORY}`);
    await this.navigateTo(URLS.INVENTORY);
    await expect(this.productItems.first()).toBeVisible();
  }

  /**
   * Returns the total count of product cards rendered on the page.
   */
  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  /**
   * Returns an array of all product title strings.
   */
  async getAllProductNames(): Promise<string[]> {
    return await this.productNames.allInnerTexts();
  }

  /**
   * Returns an array of all product price strings (e.g. ["$29.99", "$9.99"]).
   */
  async getAllProductPriceStrings(): Promise<string[]> {
    return await this.productPrices.allInnerTexts();
  }

  /**
   * Returns an array of parsed numeric product prices (e.g. [29.99, 9.99]).
   */
  async getAllProductNumericPrices(): Promise<number[]> {
    const rawPrices = await this.getAllProductPriceStrings();
    return rawPrices.map((price) => Helper.cleanPrice(price));
  }

  /**
   * Retrieves product details (name, description, price) by index.
   */
  async getProductDetailsByIndex(index: number): Promise<{ name: string; description: string; price: string }> {
    const item = this.productItems.nth(index);
    const name = (await item.locator('[data-test="inventory-item-name"]').innerText()).trim();
    const description = (await item.locator('[data-test="inventory-item-desc"]').innerText()).trim();
    const price = (await item.locator('[data-test="inventory-item-price"]').innerText()).trim();
    return { name, description, price };
  }

  /**
   * Retrieves product details for a given product name.
   */
  async getProductDetailsByName(productName: string): Promise<{ description: string; price: string } | null> {
    const item = this.productItems.filter({ hasText: productName }).first();
    if ((await item.count()) === 0) {
      return null;
    }
    const description = (await item.locator('[data-test="inventory-item-desc"]').innerText()).trim();
    const price = (await item.locator('[data-test="inventory-item-price"]').innerText()).trim();
    return { description, price };
  }

  /**
   * Selects a sorting option from the sort dropdown by value (e.g. 'lohi', 'hilo', 'az', 'za').
   */
  async selectSortOption(sortValue: SortOption | string): Promise<void> {
    Logger.step(`Selecting product sorting option: "${sortValue}"`);
    await this.sortDropdown.selectOption(sortValue);
  }

  /**
   * Gets the currently visible active sort label text.
   */
  async getActiveSortText(): Promise<string> {
    return (await this.activeSortOption.innerText()).trim();
  }

  /**
   * Adds a product to the cart by matching its title.
   */
  async addProductToCartByName(productName: string): Promise<void> {
    Logger.step(`Adding product to cart: "${productName}"`);
    const item = this.productItems.filter({ hasText: productName }).first();
    const addButton = item.getByRole('button', { name: 'Add to cart' });
    await expect(addButton).toBeVisible();
    await addButton.click();
    await expect(item.getByRole('button', { name: 'Remove' })).toBeVisible();
  }

  /**
   * Removes a product from the cart directly from the product catalogue page.
   */
  async removeProductFromCartByName(productName: string): Promise<void> {
    Logger.step(`Removing product from cart: "${productName}"`);
    const item = this.productItems.filter({ hasText: productName }).first();
    const removeButton = item.getByRole('button', { name: 'Remove' });
    await expect(removeButton).toBeVisible();
    await removeButton.click();
    await expect(item.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  }

  /**
   * Adds product by its zero-based index on the grid.
   */
  async addProductToCartByIndex(index: number): Promise<void> {
    const item = this.productItems.nth(index);
    const addButton = item.getByRole('button', { name: 'Add to cart' });
    await addButton.click();
  }

  /**
   * Checks if the "Add to cart" button is visible for a specified product.
   */
  async isAddToCartButtonVisible(productName: string): Promise<boolean> {
    const item = this.productItems.filter({ hasText: productName }).first();
    return await item.getByRole('button', { name: 'Add to cart' }).isVisible();
  }

  /**
   * Checks if the "Remove" button is visible for a specified product.
   */
  async isRemoveButtonVisible(productName: string): Promise<boolean> {
    const item = this.productItems.filter({ hasText: productName }).first();
    return await item.getByRole('button', { name: 'Remove' }).isVisible();
  }
}
