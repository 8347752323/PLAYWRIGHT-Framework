/**
 * Framework-wide constants including routes, storage paths, and options.
 */

export const URLS = {
  BASE: 'https://www.saucedemo.com',
  LOGIN: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html',
} as const;

export const STORAGE_STATE_PATH = 'playwright/.auth/user.json';

export const SORT_OPTIONS = {
  NAME_A_TO_Z: 'az',
  NAME_Z_TO_A: 'za',
  PRICE_LOW_TO_HIGH: 'lohi',
  PRICE_HIGH_TO_LOW: 'hilo',
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

export const TIMEOUTS = {
  PAGE_LOAD: 30000,
  ACTION: 10000,
  ASSERTION: 5000,
} as const;
