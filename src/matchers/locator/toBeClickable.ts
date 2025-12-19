import type { Locator, ExpectMatcherState } from '@playwright/test';

interface ToBeClickableOptions {
  timeout?: number;
}

/**
 * Asserts that an element is in a clickable state.
 * Uses Playwright's `click({ trial: true })` which performs all actionability checks
 * without actually clicking - including visibility, enabled state, and not being obscured.
 *
 * @example
 * await expect(page.getByRole('button')).toBeClickable();
 * await expect(page.getByRole('button')).toBeClickable({ timeout: 5000 });
 */
export async function toBeClickable(
  this: ExpectMatcherState,
  locator: Locator,
  options: ToBeClickableOptions = {}
) {
  const assertionName = 'toBeClickable';
  const timeout = options.timeout ?? this.timeout;
  let pass = false;
  let errorMessage = '';

  try {
    // Use trial click - performs all actionability checks without clicking
    await locator.click({ trial: true, timeout });
    pass = true;
  } catch (error: unknown) {
    pass = false;
    errorMessage = error instanceof Error ? error.message : String(error);
  }

  // Note: Do NOT flip pass for isNot - Playwright handles that
  const message = () => {
    if (this.isNot) {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, {
          isNot: this.isNot,
        }) +
        '\n\n' +
        `Expected: element to NOT be clickable\n` +
        `Received: element is clickable`
      );
    }
    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Expected: element '${locator}' to be clickable\n` +
      `Received: element is not clickable\n` +
      (errorMessage ? `\nError: ${errorMessage}` : '')
    );
  };


  return {
    pass,
    message,
    name: assertionName,
  };
}
