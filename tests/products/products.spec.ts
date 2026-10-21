import { test, expect } from '../../fixtures/loggedInFixture';
import { TestDataReader } from '../../utils/testDataReader';
import { SORT_OPTIONS } from '../../utils/constants';
import { Helper } from '../../utils/helper';

test.describe('Product Module', () => {
  const productsData = TestDataReader.getProductsData();

  test.beforeEach(async ({ authenticatedProductPage }) => {
    // authenticatedProductPage navigates to /inventory.html using storageState
    await expect(authenticatedProductPage.pageTitle).toHaveText('Products');
  });

  test('TC_PROD_001: Verify all products displayed', async ({ authenticatedProductPage }) => {
    const productCount = await authenticatedProductPage.getProductCount();
    expect(productCount).toBe(productsData.totalExpectedCount);

    const names = await authenticatedProductPage.getAllProductNames();
    expect(names.length).toBe(productsData.totalExpectedCount);

    for (let i = 0; i < productCount; i++) {
      const details = await authenticatedProductPage.getProductDetailsByIndex(i);
      expect(details.name.length).toBeGreaterThan(0);
      expect(details.price).toMatch(/^\$\d+\.\d{2}$/);
      expect(details.description.length).toBeGreaterThan(0);
    }
  });

  test('TC_PROD_002: Verify product details match test data catalogue', async ({
    authenticatedProductPage,
  }) => {
    for (const expectedProduct of productsData.items) {
      const actualDetails = await authenticatedProductPage.getProductDetailsByName(expectedProduct.name);
      expect(actualDetails, `Product "${expectedProduct.name}" should exist`).not.toBeNull();
      expect(actualDetails?.price).toBe(expectedProduct.price);
      expect(actualDetails?.description).toBe(expectedProduct.description);
    }
  });

  test('TC_PROD_003: Verify sorting low to high', async ({ authenticatedProductPage }) => {
    await authenticatedProductPage.selectSortOption(SORT_OPTIONS.PRICE_LOW_TO_HIGH);

    const prices = await authenticatedProductPage.getAllProductNumericPrices();
    expect(prices.length).toBe(productsData.totalExpectedCount);
    expect(Helper.isSortedAscending(prices)).toBe(true);
  });

  test('TC_PROD_004: Verify sorting high to low', async ({ authenticatedProductPage }) => {
    await authenticatedProductPage.selectSortOption(SORT_OPTIONS.PRICE_HIGH_TO_LOW);

    const prices = await authenticatedProductPage.getAllProductNumericPrices();
    expect(prices.length).toBe(productsData.totalExpectedCount);
    expect(Helper.isSortedDescending(prices)).toBe(true);
  });

  test('TC_PROD_005: Verify sorting A to Z', async ({ authenticatedProductPage }) => {
    await authenticatedProductPage.selectSortOption(SORT_OPTIONS.NAME_A_TO_Z);

    const names = await authenticatedProductPage.getAllProductNames();
    expect(names.length).toBe(productsData.totalExpectedCount);
    expect(Helper.isAlphabeticallySortedAscending(names)).toBe(true);
  });

  test('TC_PROD_006: Verify sorting Z to A', async ({ authenticatedProductPage }) => {
    await authenticatedProductPage.selectSortOption(SORT_OPTIONS.NAME_Z_TO_A);

    const names = await authenticatedProductPage.getAllProductNames();
    expect(names.length).toBe(productsData.totalExpectedCount);
    expect(Helper.isAlphabeticallySortedDescending(names)).toBe(true);
  });
});
