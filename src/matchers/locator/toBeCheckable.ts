import type { Locator, ExpectMatcherState } from '@playwright/test';

interface ToBeCheckableOptions {
  timeout?: number;
}

/**
 * Asserts that a checkbox or radio button is in a checkable state.
 * Uses Playwright's `check({ trial: true })` which performs all actionability checks
 * without actually checking - including visibility, enabled state, and not being obscured.
 *
 * @example
 * await expect(page.getByRole('checkbox')).toBeCheckable();
 * await expect(page.getByRole('radio')).toBeCheckable({ timeout: 5000 });
 */
export async function toBeCheckable(
  this: ExpectMatcherState,
  locator: Locator,
  options: ToBeCheckableOptions = {}
) {
  const assertionName = 'toBeCheckable';
  const timeout = options.timeout ?? this.timeout;
  let pass = false;
  let errorMessage = '';

  try {
    // Use trial check - performs all actionability checks without checking
    await locator.check({ trial: true, timeout });
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
        `Expected: element '${locator}' to NOT be checkable\n` +
        `Received: element is checkable`
      );
    }
    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Expected: element '${locator}' to be checkable\n` +
      `Received: element is not checkable\n` +
      (errorMessage ? `\nError: ${errorMessage}` : '')
    );
  };


  return {
    pass,
    message,
    name: assertionName,
  };
}
