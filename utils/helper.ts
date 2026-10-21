/**
 * Common helper functions for data parsing, array sorting verification, and formatting.
 */

export class Helper {
  /**
   * Extracts numeric value from a price string (e.g. "$29.99" -> 29.99).
   */
  static cleanPrice(priceString: string): number {
    const cleaned = priceString.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed)) {
      throw new Error(`Unable to parse price from string: "${priceString}"`);
    }
    return parsed;
  }

  /**
   * Checks if an array of numbers is sorted in ascending order.
   */
  static isSortedAscending(numbers: number[]): boolean {
    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] > numbers[i + 1]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks if an array of numbers is sorted in descending order.
   */
  static isSortedDescending(numbers: number[]): boolean {
    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] < numbers[i + 1]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks if an array of strings is sorted in alphabetical ascending order (A to Z).
   */
  static isAlphabeticallySortedAscending(strings: string[]): boolean {
    for (let i = 0; i < strings.length - 1; i++) {
      if (strings[i].localeCompare(strings[i + 1]) > 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks if an array of strings is sorted in alphabetical descending order (Z to A).
   */
  static isAlphabeticallySortedDescending(strings: string[]): boolean {
    for (let i = 0; i < strings.length - 1; i++) {
      if (strings[i].localeCompare(strings[i + 1]) < 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * Formats a number as a USD price string (e.g. 29.99 -> "$29.99").
   */
  static formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`;
  }

  /**
   * Generates a random alphanumeric string of specified length.
   */
  static generateRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
