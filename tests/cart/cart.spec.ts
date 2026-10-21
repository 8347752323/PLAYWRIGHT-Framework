import { test, expect } from '../../fixtures/loggedInFixture';
import { TestDataReader } from '../../utils/testDataReader';

test.describe('Cart Module', () => {
  const products = TestDataReader.getProductItems();
  const productA = products[0]; // Sauce Labs Backpack
  const productB = products[1]; // Sauce Labs Bike Light

  test.beforeEach(async ({ authenticatedProductPage }) => {
    // Starts on inventory page with a clean session
    await expect(authenticatedProductPage.pageTitle).toHaveText('Products');
  });

  test('TC_CART_001: Add single product to cart', async ({
    authenticatedProductPage,
    cartPage,
  }) => {
    await authenticatedProductPage.addProductToCartByName(productA.name);

    const badgeCount = await authenticatedProductPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);

    await authenticatedProductPage.clickShoppingCart();
    await expect(cartPage.pageTitle).toHaveText('Your Cart');

    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount).toBe(1);

    const isInCart = await cartPage.isItemInCart(productA.name);
    expect(isInCart).toBe(true);
  });

  test('TC_CART_002: Add multiple products to cart', async ({
    authenticatedProductPage,
    cartPage,
  }) => {
    await authenticatedProductPage.addProductToCartByName(productA.name);
    await authenticatedProductPage.addProductToCartByName(productB.name);

    const badgeCount = await authenticatedProductPage.getCartBadgeCount();
    expect(badgeCount).toBe(2);

    await authenticatedProductPage.clickShoppingCart();
    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount).toBe(2);

    const items = await cartPage.getCartItemNames();
    expect(items).toContain(productA.name);
    expect(items).toContain(productB.name);
  });

  test('TC_CART_003: Remove product from cart', async ({
    authenticatedProductPage,
    cartPage,
  }) => {
    await authenticatedProductPage.addProductToCartByName(productA.name);
    await authenticatedProductPage.clickShoppingCart();

    expect(await cartPage.getCartItemCount()).toBe(1);
    await cartPage.removeItemByName(productA.name);

    expect(await cartPage.getCartItemCount()).toBe(0);
    expect(await cartPage.getCartBadgeCount()).toBe(0);
  });

  test('TC_CART_004: Verify cart badge count dynamics', async ({
    authenticatedProductPage,
  }) => {
    // Initially zero
    expect(await authenticatedProductPage.getCartBadgeCount()).toBe(0);

    // After adding first item
    await authenticatedProductPage.addProductToCartByName(productA.name);
    expect(await authenticatedProductPage.getCartBadgeCount()).toBe(1);

    // After adding second item
    await authenticatedProductPage.addProductToCartByName(productB.name);
    expect(await authenticatedProductPage.getCartBadgeCount()).toBe(2);

    // After removing first item
    await authenticatedProductPage.removeProductFromCartByName(productA.name);
    expect(await authenticatedProductPage.getCartBadgeCount()).toBe(1);

    // After removing second item
    await authenticatedProductPage.removeProductFromCartByName(productB.name);
    expect(await authenticatedProductPage.getCartBadgeCount()).toBe(0);
  });

  test('TC_CART_005: Verify cart item details match product specifications', async ({
    authenticatedProductPage,
    cartPage,
  }) => {
    await authenticatedProductPage.addProductToCartByName(productA.name);
    await authenticatedProductPage.clickShoppingCart();

    const details = await cartPage.getItemDetailsByName(productA.name);
    expect(details).not.toBeNull();
    expect(details?.quantity).toBe(1);
    expect(details?.price).toBe(productA.price);
    expect(details?.description).toBe(productA.description);
  });
});
