import type { APIResponse, ExpectMatcherState } from '@playwright/test';

/**
 * Asserts that an API response has a specific HTTP status code.
 * Supports exact match or range matching.
 *
 * @example
 * await expect(response).toHaveStatus(200);
 * await expect(response).toHaveStatus({ min: 200, max: 299 }); // Any 2xx
 */
export async function toHaveStatus(
  this: ExpectMatcherState,
  response: APIResponse,
  expected: number | { min: number; max: number }
) {
  const assertionName = 'toHaveStatus';
  const actualStatus = response.status();
  let pass = false;

  if (typeof expected === 'number') {
    pass = actualStatus === expected;
  } else {
    pass = actualStatus >= expected.min && actualStatus <= expected.max;
  }

  const expectedDesc =
    typeof expected === 'number'
      ? `${expected}`
      : `${expected.min}-${expected.max}`;

  const message = () => {
    if (this.isNot) {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, {
          isNot: this.isNot,
        }) +
        '\n\n' +
        `Expected: status NOT to be ${expectedDesc}\n` +
        `Received: ${actualStatus}`
      );
    }
    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Expected: status ${expectedDesc}\n` +
      `Received: ${actualStatus}`
    );
  };

  return {
    pass,
    message,
    name: assertionName,
    expected: expectedDesc,
    actual: actualStatus,
  };
}
