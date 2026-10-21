import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../utils/constants';
import { Logger } from '../utils/logger';

/**
 * CheckoutPage encapsulates the three stages of checkout:
 * Step 1: Customer Information
 * Step 2: Order Overview & Summary
 * Step 3: Complete / Confirmation
 */
export class CheckoutPage extends BasePage {
  // Step 1: Customer Info
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step 2: Overview
  readonly finishButton: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  // Step 3: Complete
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    // Step 1 locators
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.errorMessage = page.locator('[data-test="error"]');

    // Step 2 locators
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');

    // Step 3 locators
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
  }

  /**
   * Navigates directly to Checkout Step One.
   */
  async navigateStepOne(): Promise<void> {
    Logger.step(`Navigating to Checkout Step One: ${URLS.CHECKOUT_STEP_ONE}`);
    await this.navigateTo(URLS.CHECKOUT_STEP_ONE);
    await expect(this.continueButton).toBeVisible();
  }

  /**
   * Enters customer information fields.
   */
  async fillCustomerInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    Logger.step(`Filling customer info: "${firstName} ${lastName}", Postal: "${postalCode}"`);
    if (firstName) {
      await this.firstNameInput.fill(firstName);
    } else {
      await this.firstNameInput.clear();
    }

    if (lastName) {
      await this.lastNameInput.fill(lastName);
    } else {
      await this.lastNameInput.clear();
    }

    if (postalCode) {
      await this.postalCodeInput.fill(postalCode);
    } else {
      await this.postalCodeInput.clear();
    }
  }

  /**
   * Submits customer info to proceed to Step Two.
   */
  async clickContinue(): Promise<void> {
    Logger.info('Clicking Continue button');
    await this.continueButton.click();
  }

  /**
   * Cancels current checkout stage.
   */
  async clickCancel(): Promise<void> {
    Logger.info('Clicking Cancel button');
    await this.cancelButton.click();
  }

  /**
   * Completes the checkout by clicking 'Finish' on overview page.
   */
  async clickFinish(): Promise<void> {
    Logger.step('Submitting final order via Finish button');
    await expect(this.finishButton).toBeVisible();
    await this.finishButton.click();
  }

  /**
   * Retrieves the validation error message text.
   */
  async getErrorMessageText(): Promise<string> {
    await expect(this.errorMessage).toBeVisible();
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }

  /**
   * Retrieves the header text on the order confirmation screen.
   */
  async getOrderConfirmationHeader(): Promise<string> {
    await expect(this.completeHeader).toBeVisible();
    return (await this.completeHeader.textContent())?.trim() ?? '';
  }

  /**
   * Retrieves the dispatch message text on the confirmation screen.
   */
  async getOrderConfirmationMessage(): Promise<string> {
    await expect(this.completeText).toBeVisible();
    return (await this.completeText.textContent())?.trim() ?? '';
  }

  /**
   * Verifies if the order complete screen is displayed.
   */
  async isOrderCompleteVisible(): Promise<boolean> {
    return (await this.completeHeader.isVisible()) && (await this.backHomeButton.isVisible());
  }

  /**
   * Clicks 'Back Home' button to return to catalogue from confirmation screen.
   */
  async clickBackHome(): Promise<void> {
    Logger.info('Navigating back to catalogue via Back Home button');
    await this.backHomeButton.click();
  }
}
