import { expect } from '@playwright/test';
import type { APIResponse, ExpectMatcherState } from '@playwright/test';
import { formatValue } from '../../utils/matcherUtils';

/**
 * Asserts that an API response body matches the expected JSON.
 * Supports asymmetric matchers like expect.toBeEmail(), expect.toBeUUID(), etc.
 *
 * @example
 * const response = await request.get('/api/user');
 * await expect(response).toMatchJSON({ id: 1, name: 'John' });
 * await expect(response).toMatchJSON(expect.objectContaining({ id: 1 }));
 * await expect(response).toMatchJSON({ 
 *   email: expect.toBeEmail(),
 *   id: expect.toBeUUID()
 * });
 */
export async function toMatchJSON(
  this: ExpectMatcherState,
  response: APIResponse,
  expected: unknown
) {
  const assertionName = 'toMatchJSON';
  let pass = false;
  let actualBody: unknown;
  let parseError: string | null = null;

  try {
    actualBody = await response.json();
  } catch (error) {
    parseError = error instanceof Error ? error.message : String(error);
  }

  if (parseError) {
    pass = false;
  } else {
    // Use expect().toEqual() which supports asymmetric matchers
    try {
      expect(actualBody).toEqual(expected);
      pass = true;
    } catch {
      pass = false;
    }
  }

  const message = () => {
    if (parseError) {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, {
          isNot: this.isNot,
        }) +
        '\n\n' +
        `Failed to parse response body as JSON:\n${parseError}`
      );
    }

    const diff = this.utils.diff(expected, actualBody);

    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      (this.isNot
        ? `Expected: not ${formatValue(expected)}\n`
        : `Expected: ${formatValue(expected)}\n`) +
      `Received: ${formatValue(actualBody)}` +
      (diff ? `\n\nDifference:\n${diff}` : '')
    );
  };

  return {
    pass,
    message,
    name: assertionName,
    expected,
    actual: actualBody,
  };
}
