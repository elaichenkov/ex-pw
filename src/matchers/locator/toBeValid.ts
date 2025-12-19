import { expect } from '@playwright/test';
import type { Locator, ExpectMatcherState } from '@playwright/test';

interface ToBeValidOptions {
  timeout?: number;
  intervals?: number[];
}

// Common framework-specific invalid classes to check for absence
const INVALID_CLASSES = [
  'ng-invalid', // Angular
  'is-invalid', // Bootstrap
  'error', // Common pattern
  'has-error', // Another common pattern
  'invalid', // Generic
];

/**
 * Asserts that a form element is in a valid validation state.
 * This is the opposite of toBeInvalid - checks that:
 * - `aria-invalid` is NOT "true"
 * - `element.validity.valid === true` (native validation)
 * - No framework-specific invalid classes present
 *
 * @example
 * await expect(page.getByLabel('Email')).toBeValid();
 * await expect(page.getByLabel('Invalid Field')).not.toBeValid();
 */
export async function toBeValid(
  this: ExpectMatcherState,
  locator: Locator,
  options: ToBeValidOptions = {}
) {
  const assertionName = 'toBeValid';
  const timeout = options.timeout ?? this.timeout;
  const intervals = options.intervals;
  let pass = false;
  let errorMessage = '';

  try {
    await expect
      .poll(
        async () => {
          // Check aria-invalid is not true
          const ariaInvalid = await locator.getAttribute('aria-invalid');
          if (ariaInvalid === 'true') return false;

          // Check native validity (if applicable)
          const hasValidity = await locator.evaluate((el) => 'validity' in el);
          if (hasValidity) {
            const isNativeValid = await locator.evaluate((el) => {
              return (el as HTMLInputElement).validity.valid;
            });
            if (!isNativeValid) return false;
          }

          // Check no framework-specific invalid classes
          const classAttr = await locator.getAttribute('class');
          if (classAttr) {
            const classes = classAttr.split(/\s+/);
            for (const invalidClass of INVALID_CLASSES) {
              if (classes.includes(invalidClass)) return false;
            }
          }

          return true;
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
        `Expected: element '${locator}' to NOT be valid\n` +
        `Received: element is valid`
      );
    }
    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Expected: element '${locator}' to be valid\n` +
      `Received: element is invalid\n` +
      (errorMessage ? `\nDetails: ${errorMessage}` : '')
    );
  };


  return {
    pass,
    message,
    name: assertionName,
  };
}
