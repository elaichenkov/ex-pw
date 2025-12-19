import { expect } from '@playwright/test';
import type { Page, ExpectMatcherState } from '@playwright/test';
import { formatValue } from '../../utils/matcherUtils';

interface ToHaveSessionStorageOptions {
  value?: unknown;
  timeout?: number;
  intervals?: number[];
}

/**
 * Asserts that sessionStorage contains a specific key with optional value matching.
 * Note: sessionStorage is not included in storageState(), so this uses page.evaluate().
 *
 * @example
 * await expect(page).toHaveSessionStorage('tempData');
 * await expect(page).toHaveSessionStorage('cart', { value: expect.arrayContaining([{ id: 1 }]) });
 */
export async function toHaveSessionStorage(
  this: ExpectMatcherState,
  page: Page,
  key: string,
  options: ToHaveSessionStorageOptions = {}
) {
  const assertionName = 'toHaveSessionStorage';
  const { value, timeout = this.timeout, intervals } = options;

  let pass = false;
  let actualValue: unknown;
  let foundKey = false;

  try {
    await expect
      .poll(
        async () => {
          const rawValue = await page.evaluate((k) => {
            return window.sessionStorage.getItem(k);
          }, key);

          if (rawValue === null) {
            foundKey = false;
            actualValue = undefined;
            return false;
          }

          foundKey = true;

          // Try to parse as JSON, otherwise use raw string
          try {
            actualValue = JSON.parse(rawValue);
          } catch {
            actualValue = rawValue;
          }

          // If value matching is required
          if (value !== undefined) {
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
    ? `sessionStorage key "${key}" with value ${formatValue(value)}`
    : `sessionStorage key "${key}"`;

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
