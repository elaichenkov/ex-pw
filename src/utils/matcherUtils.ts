import type { ExpectMatcherState } from '@playwright/test';

/**
 * Creates a standardized matcher result object
 */
export function createMatcherResult(
  pass: boolean,
  matcherName: string,
  matcherState: ExpectMatcherState,
  options: {
    message: string;
    notMessage: string;
    expected?: unknown;
    actual?: unknown;
  }
) {
  const { isNot, utils } = matcherState;

  const finalPass = isNot ? !pass : pass;
  const messageToUse = finalPass ? options.notMessage : options.message;

  return {
    pass: finalPass,
    message: () =>
      utils.matcherHint(matcherName, undefined, undefined, { isNot }) +
      '\n\n' +
      messageToUse,
    name: matcherName,
    expected: options.expected,
    actual: options.actual,
  };
}

/**
 * Default timeout for matchers (uses Playwright's default if not specified)
 */
export const DEFAULT_TIMEOUT = 5000;


/**
 * Validates that a value is a Playwright Locator
 */
export function isLocator(value: unknown): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    'click' in value &&
    'count' in value &&
    'locator' in value
  );
}

/**
 * Validates that a value is a Playwright Page
 */
export function isPage(value: unknown): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    'goto' in value &&
    'context' in value &&
    'locator' in value
  );
}

/**
 * Validates that a value is a Playwright APIResponse
 */
export function isAPIResponse(value: unknown): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    'status' in value &&
    'headers' in value &&
    'json' in value
  );
}

/**
 * Formats a value for display in error messages
 */
export function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}
