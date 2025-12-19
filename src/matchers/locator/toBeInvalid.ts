import { expect } from '@playwright/test';
import type { Locator, ExpectMatcherState } from '@playwright/test';

interface ToBeInvalidOptions {
  timeout?: number;
  intervals?: number[];
}

// Common framework-specific invalid classes
const INVALID_CLASSES = [
  'ng-invalid', // Angular
  'is-invalid', // Bootstrap
  'error', // Common pattern
  'has-error', // Another common pattern
  'invalid', // Generic
];

/**
 * Asserts that a form element is in an invalid validation state.
 * Checks multiple validation indicators:
 * - `aria-invalid="true"` attribute
 * - `element.validity.valid === false` (native validation)
 * - Framework-specific classes: ng-invalid (Angular), is-invalid (Bootstrap), etc.
 *
 * @example
 * await expect(page.getByLabel('Email')).toBeInvalid();
 * await expect(page.getByLabel('Valid Field')).not.toBeInvalid();
 */
export async function toBeInvalid(
  this: ExpectMatcherState,
  locator: Locator,
  options: ToBeInvalidOptions = {}
) {
  const assertionName = 'toBeInvalid';
  const timeout = options.timeout ?? this.timeout;
  const intervals = options.intervals;
  let pass = false;
  let errorMessage = '';

  try {
    await expect
      .poll(
        async () => {
          // Check aria-invalid
          const ariaInvalid = await locator.getAttribute('aria-invalid');
          if (ariaInvalid === 'true') return true;

          // Check native validity
          const isNativeInvalid = await locator.evaluate((el) => {
            if ('validity' in el) {
              return !(el as HTMLInputElement).validity.valid;
            }
            return false;
          });
          if (isNativeInvalid) return true;

          // Check framework-specific classes
          const classAttr = await locator.getAttribute('class');
          if (classAttr) {
            const classes = classAttr.split(/\s+/);
            for (const invalidClass of INVALID_CLASSES) {
              if (classes.includes(invalidClass)) return true;
            }
          }

          return false;
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
        `Expected: element '${locator}' to NOT be invalid\n` +
        `Received: element is invalid`
      );
    }
    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Expected: element '${locator}' to be invalid\n` +
      `Received: element is valid\n` +
      (errorMessage ? `\nDetails: ${errorMessage}` : '')
    );
  };


  return {
    pass,
    message,
    name: assertionName,
  };
}
