import { expect } from '@playwright/test';
import type { Page, ExpectMatcherState } from '@playwright/test';
import { formatValue } from '../../utils/matcherUtils';

interface ToHaveLocalStorageOptions {
  value?: unknown;
  timeout?: number;
  intervals?: number[];
}

/**
 * Asserts that localStorage contains a specific key with optional value matching.
 * Uses `page.context().storageState()` to retrieve localStorage.
 *
 * @example
 * await expect(page).toHaveLocalStorage('authToken');
 * await expect(page).toHaveLocalStorage('authToken', { value: 'secret' });
 * await expect(page).toHaveLocalStorage('settings', { value: expect.objectContaining({ theme: 'dark' }) });
 */
export async function toHaveLocalStorage(
  this: ExpectMatcherState,
  page: Page,
  key: string,
  options: ToHaveLocalStorageOptions = {}
) {
  const assertionName = 'toHaveLocalStorage';
  const { value, timeout = this.timeout, intervals } = options;

  let pass = false;
  let actualValue: unknown;
  let foundKey = false;

  try {
    await expect
      .poll(
        async () => {
          const storageState = await page.context().storageState();
          const pageUrl = page.url();

          // Handle about:blank or other special URLs
          let origin: string;
          try {
            origin = new URL(pageUrl).origin;
          } catch {
            origin = pageUrl;
          }

          // Find localStorage for the current origin
          const originStorage = storageState.origins.find(
            (o) => o.origin === origin
          );

          if (!originStorage) {
            foundKey = false;
            actualValue = undefined;
            return false;
          }

          const item = originStorage.localStorage.find((ls) => ls.name === key);

          if (!item) {
            foundKey = false;
            actualValue = undefined;
            return false;
          }

          foundKey = true;

          // Try to parse as JSON, otherwise use raw string
          try {
            actualValue = JSON.parse(item.value);
          } catch {
            actualValue = item.value;
          }

          // If value matching is required
          if (value !== undefined) {
            // Use deep equality check
            try {
              expect(actualValue).toEqual(value);
              return true;
            } catch {
              return false;
            }
          }

          return true;
        },
        { timeout, intervals }
      )
      .toBe(true);

    pass = true;
  } catch {
    pass = false;
  }

  const expectedDesc = value !== undefined
    ? `localStorage key "${key}" with value ${formatValue(value)}`
    : `localStorage key "${key}"`;

  const message = () => {
    if (this.isNot) {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, {
          isNot: this.isNot,
        }) +
        '\n\n' +
        `Expected: NOT to have ${expectedDesc}\n` +
        `Received: key found with value ${formatValue(actualValue)}`
      );
    }
    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Expected: ${expectedDesc}\n` +
      (foundKey
        ? `Received: key found with value ${formatValue(actualValue)}`
        : `Received: key not found`)
    );
  };

  return {
    pass,
    message,
    name: assertionName,
    expected: value ?? key,
    actual: actualValue,
  };
}
