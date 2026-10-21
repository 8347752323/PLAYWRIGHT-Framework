import { test, expect } from '../../fixtures/loggedInFixture';
import { TestDataReader } from '../../utils/testDataReader';
import { URLS } from '../../utils/constants';

test.describe('Checkout Module', () => {
  const checkoutData = TestDataReader.getCheckoutData();
  const products = TestDataReader.getProductItems();
  const testProduct = products[0];

  test.beforeEach(async ({ authenticatedProductPage, cartPage }) => {
    // Add product to cart and navigate to checkout step one
    await authenticatedProductPage.addProductToCartByName(testProduct.name);
    await authenticatedProductPage.clickShoppingCart();
    await cartPage.clickCheckout();
  });

  test('TC_CHECKOUT_001: Complete checkout successfully', async ({
    checkoutPage,
    page,
  }) => {
    const customer = checkoutData.validCustomer;
    await checkoutPage.fillCustomerInformation(
      customer.firstName,
      customer.lastName,
      customer.postalCode
    );
    await checkoutPage.clickContinue();

    await expect(page).toHaveURL(new RegExp(URLS.CHECKOUT_STEP_TWO));
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Overview');

    await checkoutPage.clickFinish();

    await expect(page).toHaveURL(new RegExp(URLS.CHECKOUT_COMPLETE));
    expect(await checkoutPage.isOrderCompleteVisible()).toBe(true);
  });

  test('TC_CHECKOUT_002: Verify order confirmation message and header', async ({
    checkoutPage,
  }) => {
    const customer = checkoutData.validCustomer;
    const expectedConfirmation = checkoutData.confirmation;

    await checkoutPage.fillCustomerInformation(
      customer.firstName,
      customer.lastName,
      customer.postalCode
    );
    await checkoutPage.clickContinue();
    await checkoutPage.clickFinish();

    const headerText = await checkoutPage.getOrderConfirmationHeader();
    const messageText = await checkoutPage.getOrderConfirmationMessage();

    expect(headerText).toBe(expectedConfirmation.header);
    expect(messageText).toBe(expectedConfirmation.message);
  });

  test('TC_CHECKOUT_003: Validate mandatory customer info fields', async ({
    checkoutPage,
  }) => {
    const emptyFirst = checkoutData.emptyFirstName;
    await checkoutPage.fillCustomerInformation(
      emptyFirst.firstName,
      emptyFirst.lastName,
      emptyFirst.postalCode
    );
    await checkoutPage.clickContinue();
    expect(await checkoutPage.getErrorMessageText()).toBe(emptyFirst.expectedError);

    const emptyLast = checkoutData.emptyLastName;
    await checkoutPage.fillCustomerInformation(
      emptyLast.firstName,
      emptyLast.lastName,
      emptyLast.postalCode
    );
    await checkoutPage.clickContinue();
    expect(await checkoutPage.getErrorMessageText()).toBe(emptyLast.expectedError);

    const emptyPostal = checkoutData.emptyPostalCode;
    await checkoutPage.fillCustomerInformation(
      emptyPostal.firstName,
      emptyPostal.lastName,
      emptyPostal.postalCode
    );
    await checkoutPage.clickContinue();
    expect(await checkoutPage.getErrorMessageText()).toBe(emptyPostal.expectedError);
  });

  test('TC_CHECKOUT_004: Cancel checkout process from step one and step two', async ({
    checkoutPage,
    cartPage,
    page,
  }) => {
    // Cancel from Step One returns to Cart
    await checkoutPage.clickCancel();
    await expect(page).toHaveURL(new RegExp(URLS.CART));
    await expect(cartPage.pageTitle).toHaveText('Your Cart');

    // Return to Step One and proceed to Step Two
    await cartPage.clickCheckout();
    const customer = checkoutData.validCustomer;
    await checkoutPage.fillCustomerInformation(
      customer.firstName,
      customer.lastName,
      customer.postalCode
    );
    await checkoutPage.clickContinue();
    await expect(page).toHaveURL(new RegExp(URLS.CHECKOUT_STEP_TWO));

    // Cancel from Step Two returns to inventory
    await checkoutPage.clickCancel();
    await expect(page).toHaveURL(new RegExp(URLS.INVENTORY));
  });
});
