import usersData from '../test-data/users.json';
import productsData from '../test-data/products.json';
import checkoutData from '../test-data/checkoutData.json';

export interface UserCredential {
  username: string;
  password: string;
  errorMessage?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: string;
  priceNumeric: number;
}

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  postalCode: string;
  expectedError?: string;
}

export interface CheckoutConfirmation {
  header: string;
  message: string;
}

/**
 * Strongly typed reader utility for externalized JSON test data.
 */
export class TestDataReader {
  /**
   * Returns all user credentials defined in test-data/users.json
   */
  static getUsers() {
    return usersData;
  }

  /**
   * Returns standard user credentials
   */
  static getStandardUser(): UserCredential {
    return usersData.standardUser;
  }

  /**
   * Returns locked-out user credentials and expected error message
   */
  static getLockedUser(): UserCredential {
    return usersData.lockedUser;
  }

  /**
   * Returns invalid user credentials
   */
  static getInvalidUser(): UserCredential {
    return usersData.invalidUser;
  }

  /**
   * Returns empty credentials cases
   */
  static getEmptyUsernameUser(): UserCredential {
    return usersData.emptyUsername;
  }

  static getEmptyPasswordUser(): UserCredential {
    return usersData.emptyPassword;
  }

  /**
   * Returns full product catalogue and sorting options from test-data/products.json
   */
  static getProductsData() {
    return productsData;
  }

  /**
   * Returns list of product items
   */
  static getProductItems(): ProductItem[] {
    return productsData.items as ProductItem[];
  }

  /**
   * Finds a product item by its name
   */
  static getProductByName(name: string): ProductItem | undefined {
    return (productsData.items as ProductItem[]).find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Returns checkout data including customer profiles and confirmation expectations
   */
  static getCheckoutData() {
    return checkoutData;
  }

  static getValidCustomer(): CheckoutCustomer {
    return checkoutData.validCustomer;
  }

  static getEmptyFirstNameCustomer(): CheckoutCustomer {
    return checkoutData.emptyFirstName;
  }

  static getEmptyLastNameCustomer(): CheckoutCustomer {
    return checkoutData.emptyLastName;
  }

  static getEmptyPostalCodeCustomer(): CheckoutCustomer {
    return checkoutData.emptyPostalCode;
  }

  static getConfirmationExpectation(): CheckoutConfirmation {
    return checkoutData.confirmation;
  }
}
