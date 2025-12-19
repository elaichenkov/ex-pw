import type { APIResponse, ExpectMatcherState } from '@playwright/test';

interface ToHaveHeaderOptions {
  value?: string | RegExp;
}

/**
 * Asserts that an API response has a specific header.
 * Optionally matches by value.
 *
 * @example
 * await expect(response).toHaveHeader('content-type');
 * await expect(response).toHaveHeader('content-type', { value: 'application/json' });
 * await expect(response).toHaveHeader('content-type', { value: /json/ });
 */
export async function toHaveHeader(
  this: ExpectMatcherState,
  response: APIResponse,
  name: string,
  options: ToHaveHeaderOptions = {}
) {
  const assertionName = 'toHaveHeader';
  const { value } = options;

  // Header names are case-insensitive
  const headers = response.headers();
  const lowerName = name.toLowerCase();
  const actualValue = Object.entries(headers).find(
    ([key]) => key.toLowerCase() === lowerName
  )?.[1];

  let pass = actualValue !== undefined;

  // If value matching is required
  if (pass && value !== undefined) {
    if (typeof value === 'string') {
      pass = actualValue === value;
    } else {
      pass = value.test(actualValue!);
    }
  }

  const expectedDesc = value
    ? `header "${name}" with value ${value instanceof RegExp ? value : `"${value}"`}`
    : `header "${name}"`;

  const message = () => {
    if (this.isNot) {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, {
          isNot: this.isNot,
        }) +
        '\n\n' +
        `Expected: NOT to have ${expectedDesc}\n` +
        `Received: header found with value "${actualValue}"`
      );
    }
    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Expected: ${expectedDesc}\n` +
      (actualValue !== undefined
        ? `Received: header found with value "${actualValue}"`
        : `Received: header not found`)
    );
  };

  return {
    pass,
    message,
    name: assertionName,
    expected: value ?? name,
    actual: actualValue,
  };
}
