import type { APIResponse, ExpectMatcherState } from '@playwright/test';
import type { ZodSchema, ZodError } from 'zod';
import { formatValue } from '../../utils/matcherUtils';

/**
 * Asserts that an API response body matches a Zod schema.
 * Provides detailed validation error messages.
 *
 * @example
 * import { z } from 'zod';
 *
 * const UserSchema = z.object({
 *   id: z.number(),
 *   name: z.string(),
 *   email: z.string().email(),
 * });
 *
 * const response = await request.get('/api/user');
 * await expect(response).toMatchSchema(UserSchema);
 */
export async function toMatchSchema(
  this: ExpectMatcherState,
  response: APIResponse,
  schema: ZodSchema
) {
  const assertionName = 'toMatchSchema';
  let pass = false;
  let actualBody: unknown;
  let parseError: string | null = null;
  let validationErrors: string[] = [];

  try {
    actualBody = await response.json();
  } catch (error) {
    parseError = error instanceof Error ? error.message : String(error);
  }

  if (parseError) {
    pass = false;
  } else {
    const result = schema.safeParse(actualBody);
    pass = result.success;

    if (!result.success) {
      validationErrors = formatZodErrors(result.error);
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

    if (this.isNot) {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, {
          isNot: this.isNot,
        }) +
        '\n\n' +
        `Expected: response to NOT match schema\n` +
        `Received: response matches schema\n\n` +
        `Body: ${formatValue(actualBody)}`
      );
    }

    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Expected: response to match schema\n` +
      `Received: validation failed\n\n` +
      `Validation errors:\n${validationErrors.map((e) => `  • ${e}`).join('\n')}\n\n` +
      `Body: ${formatValue(actualBody)}`
    );
  };

  return {
    pass,
    message,
    name: assertionName,
    expected: 'valid schema',
    actual: actualBody,
  };
}

/**
 * Format Zod errors into readable strings
 */
function formatZodErrors(error: ZodError): string[] {
  return error.errors.map((e) => {
    const path = e.path.length > 0 ? `${e.path.join('.')}: ` : '';
    return `${path}${e.message}`;
  });
}
