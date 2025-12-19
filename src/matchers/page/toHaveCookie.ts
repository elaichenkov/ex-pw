import { expect } from '@playwright/test';
import type { Page, ExpectMatcherState } from '@playwright/test';

interface ToHaveCookieOptions {
  value?: string | RegExp;
  domain?: string;
  timeout?: number;
  intervals?: number[];
}

/**
 * Asserts that the page's context has a specific cookie.
 * Optionally matches by value and/or domain.
 *
 * @example
 * await expect(page).toHaveCookie('session');
 * await expect(page).toHaveCookie('session', { value: 'abc123' });
 * await expect(page).toHaveCookie('session', { value: /^abc/ });
 * await expect(page).toHaveCookie('session', { domain: 'example.com' });
 */
export async function toHaveCookie(
  this: ExpectMatcherState,
  page: Page,
  name: string,
  options: ToHaveCookieOptions = {}
) {
  const assertionName = 'toHaveCookie';
  const { value, domain, timeout = this.timeout, intervals } = options;

  let pass = false;
  let actualValue: string | undefined;
  let foundCookie = false;

  try {
    await expect
      .poll(
        async () => {
          const cookies = await page.context().cookies();
          const cookie = cookies.find((c) => {
            if (c.name !== name) return false;
            if (domain && c.domain !== domain) return false;
            return true;
          });

          if (!cookie) {
            foundCookie = false;
            actualValue = undefined;
            return false;
          }

          foundCookie = true;
          actualValue = cookie.value;

          // If value matching is required
          if (value !== undefined) {
            if (typeof value === 'string') {
              return cookie.value === value;
            } else {
              return value.test(cookie.value);
            }
          }

          return true;
        },
        { timeout, intervals }
      )
      .toBe(true);

    pass = true;
  } catch {
    pass = false;
  }

  const expectedDesc = value
    ? `cookie "${name}" with value ${value instanceof RegExp ? value : `"${value}"`}`
    : `cookie "${name}"`;

  const message = () => {
    if (this.isNot) {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, {
          isNot: this.isNot,
        }) +
        '\n\n' +
        `Expected: NOT to have ${expectedDesc}\n` +
        `Received: cookie found with value "${actualValue}"`
      );
    }
    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Expected: ${expectedDesc}\n` +
      (foundCookie
        ? `Received: cookie found with value "${actualValue}"`
        : `Received: cookie not found`)
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
