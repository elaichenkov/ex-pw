import { expect, Page, ExpectMatcherState } from '@playwright/test';
import { TimeoutOptions } from '../../types';

/**
 * Asserts that the clipboard contains the expected text.
 *
 * @note This matcher requires clipboard permissions to be granted in the browser context.
 * Make sure to set `permissions: ["clipboard-read"]` when launching the browser.
 *
 * @example
 * ```ts
 * // playwright.config.ts
 * export default defineConfig({
 *  use: {
 *    permissions: ["clipboard-read"],
 *  },
 * });
 * ```
 */
export async function toHaveClipboardText(
  this: ExpectMatcherState,
  page: Page,
  expected: string | RegExp,
  options?: TimeoutOptions
) {
  const timeout = options?.timeout ?? this.timeout;
  const intervals = options?.intervals;

  try {
    const assertion = expect.poll(async () => {
      return await page.evaluate(() => navigator.clipboard.readText());
    }, { timeout, intervals });

    if (expected instanceof RegExp) {
      await assertion.toMatch(expected);
    } else {
      await assertion.toBe(expected);
    }


    return {
      message: () => `expected clipboard to have text ${expected}`,
      pass: true,
    };
  } catch (e: any) {
    return {
      message: () => `expected clipboard to have text ${expected} but got error or different text: ${e.message}`,
      pass: false,
    };
  }
}
