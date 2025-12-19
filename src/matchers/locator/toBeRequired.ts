import { expect } from '@playwright/test';
import type { Locator, ExpectMatcherState } from '@playwright/test';

interface ToBeRequiredOptions {
  timeout?: number;
  intervals?: number[];
}

/**
 * Asserts that a form element is required.
 * Checks multiple conditions for comprehensive coverage:
 * - `required` HTML attribute
 * - `aria-required="true"` attribute
 * - Element's `required` property (covers dynamic JS-set required)
 *
 * @example
 * await expect(page.getByLabel('Email')).toBeRequired();
 * await expect(page.getByLabel('Optional')).not.toBeRequired();
 */
export async function toBeRequired(
  this: ExpectMatcherState,
  locator: Locator,
  options: ToBeRequiredOptions = {}
) {
  const assertionName = 'toBeRequired';
  const timeout = options.timeout ?? this.timeout;
  const intervals = options.intervals;
  let pass = false;
  let errorMessage = '';

  try {
    await expect
      .poll(
        async () => {
          // Check required attribute
          const hasRequiredAttr = await locator.getAttribute('required');
          if (hasRequiredAttr !== null) return true;

          // Check aria-required
          const ariaRequired = await locator.getAttribute('aria-required');
          if (ariaRequired === 'true') return true;

          // Check element's required property via evaluate
          const isRequired = await locator.evaluate((el) => {
            if ('required' in el) {
              return (el as HTMLInputElement).required;
            }
            return false;
          });

          return isRequired;
        },
        { timeout, intervals }
      )
      .toBe(true);

    pass = true;
  } catch (error: unknown) {
    pass = false;
    errorMessage = error instanceof Error ? error.message : String(error);
  }

  const message = () => {
    if (this.isNot) {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, {
          isNot: this.isNot,
        }) +
        '\n\n' +
        `Expected: element '${locator}' to NOT be required\n` +
        `Received: element is required`
      );
    }
    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Expected: element '${locator}' to be required\n` +
      `Received: element is not required\n` +
      (errorMessage ? `\nDetails: ${errorMessage}` : '')
    );
  };


  return {
    pass,
    message,
    name: assertionName,
  };
}
