import type { TestType, ExpectMatcherState } from '@playwright/test';

interface ToHaveNoErrorsOptions {
  ignore?: RegExp;
}

/**
 * Asserts that there are no test errors (useful with soft assertions).
 * Pass the `test` object and it will call `.info()` internally to check for errors.
 *
 * @example
 * await expect.soft(page.getByTestId('status')).toHaveText('Success');
 * await expect.soft(page.getByTestId('eta')).toHaveText('1 day');
 * await expect(test).toHaveNoErrors();
 *
 * @example
 * // Ignore specific errors
 * await expect(test).toHaveNoErrors({ ignore: /Warning:/ });
 */
export function toHaveNoErrors(
  this: ExpectMatcherState,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testObject: TestType<any, any>,
  options: ToHaveNoErrorsOptions = {}
) {
  const assertionName = 'toHaveNoErrors';
  const { ignore } = options;

  const testInfo = testObject.info();
  let errors = testInfo.errors || [];

  // Filter out ignored errors if pattern provided
  if (ignore) {
    errors = errors.filter((error) => {
      const message = error.message || '';
      return !ignore.test(message);
    });
  }

  const pass = errors.length === 0;

  const errorMessages = errors
    .map((e, i) => `  ${i + 1}. ${e.message || 'Unknown error'}`)
    .join('\n');

  const message = () => {
    if (this.isNot) {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, {
          isNot: this.isNot,
        }) +
        '\n\n' +
        `Expected: to have errors\n` +
        `Received: no errors`
      );
    }
    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Expected: no errors\n` +
      `Received: ${errors.length} error(s)\n\n` +
      errorMessages
    );
  };

  return {
    pass,
    message,
    name: assertionName,
    expected: 0,
    actual: errors.length,
  };
}
