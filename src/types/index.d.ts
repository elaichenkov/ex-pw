import type { Locator, Page, TestInfo, APIResponse } from '@playwright/test';
import type { ZodSchema } from 'zod';

// Options interfaces
interface TimeoutOptions {
  timeout?: number;
  intervals?: number[];
}

interface ToHaveCookieOptions {
  value?: string | RegExp;
  domain?: string;
  timeout?: number;
  intervals?: number[];
}

interface ToHaveStorageOptions {
  value?: unknown;
  timeout?: number;
  intervals?: number[];
}

interface ToHaveNoErrorsOptions {
  ignore?: RegExp;
}

interface ToBeURLAsymmetricOptions {
  protocol?: string | string[];
}

interface ToHaveRequestOptions {
  method?: string;
  status?: number;
  url?: string | RegExp;
  timeout?: number;
  intervals?: number[];
}

type ConsoleMessageType = 'log' | 'debug' | 'info' | 'error' | 'warning' | 'dir' | 'dirxml' | 'table' | 'trace' | 'clear' | 'startGroup' | 'startGroupCollapsed' | 'endGroup' | 'assert' | 'profile' | 'profileEnd' | 'count' | 'timeEnd';

interface ToHaveConsoleMessageOptions {
  type?: ConsoleMessageType;
  text?: string | RegExp;
  timeout?: number;
  intervals?: number[];
}

interface ToHavePageErrorOptions {
  message?: string | RegExp;
  name?: string;
  timeout?: number;
  intervals?: number[];
}

// Locator matchers
interface ExPwLocatorMatchers {
  /**
   * Asserts that an element is in a clickable state.
   * Uses Playwright's `click({ trial: true })` which performs all actionability checks.
   */
  toBeClickable(options?: TimeoutOptions): Promise<void>;

  /**
   * Asserts that a checkbox or radio button is in a checkable state.
   * Uses Playwright's `check({ trial: true })` which performs all actionability checks.
   */
  toBeCheckable(options?: TimeoutOptions): Promise<void>;

  /**
   * Asserts that a form element is required.
   * Checks `required` attribute, `aria-required`, and element's required property.
   */
  toBeRequired(options?: TimeoutOptions): Promise<void>;

  /**
   * Asserts that a form element is in an invalid validation state.
   * Checks `aria-invalid`, native validity, and framework classes (ng-invalid, is-invalid, etc).
   */
  toBeInvalid(options?: TimeoutOptions): Promise<void>;

  /**
   * Asserts that a form element is in a valid validation state.
   */
  toBeValid(options?: TimeoutOptions): Promise<void>;

  /**
   * Asserts that a locator matches more than N elements.
   */
  toHaveCountGreaterThan(count: number, options?: TimeoutOptions): Promise<void>;

  /**
   * Asserts that a locator matches N or more elements.
   */
  toHaveCountGreaterThanOrEqual(count: number, options?: TimeoutOptions): Promise<void>;

  /**
   * Asserts that a locator matches fewer than N elements.
   */
  toHaveCountLessThan(count: number, options?: TimeoutOptions): Promise<void>;

  /**
   * Asserts that a locator matches N or fewer elements.
   */
  toHaveCountLessThanOrEqual(count: number, options?: TimeoutOptions): Promise<void>;

  /**
   * Asserts that an element has a specific width.
   */
  toHaveWidth(expected: number, options?: TimeoutOptions): Promise<void>;

  /**
   * Asserts that an element has a specific height.
   */
  toHaveHeight(expected: number, options?: TimeoutOptions): Promise<void>;

  /**
   * Asserts that an element has a specific size.
   */
  toHaveSize(width: number, height: number, options?: TimeoutOptions): Promise<void>;

  /**
   * Asserts that an img element has loaded its image (complete and naturalWidth > 0).
   */
  toHaveLoadedImage(options?: TimeoutOptions): Promise<void>;
}




// Page matchers
interface ExPwPageMatchers {
  /**
   * Asserts that the page's context has a specific cookie.
   */
  toHaveCookie(name: string, options?: ToHaveCookieOptions): Promise<void>;

  /**
   * Asserts that localStorage contains a specific key.
   */
  toHaveLocalStorage(key: string, options?: ToHaveStorageOptions): Promise<void>;

  /**
   * Asserts that sessionStorage contains a specific key.
   */
  toHaveSessionStorage(key: string, options?: ToHaveStorageOptions): Promise<void>;

  /**
   * Asserts that the clipboard has specific text.
   */
  toHaveClipboardText(expected: string | RegExp, options?: TimeoutOptions): Promise<void>;

  /**
   * Asserts that the page has made a network request matching the specified criteria.
   * Uses `page.requests()` to check already captured requests.
   * 
   * **Limitations:**
   * - Only returns up to 100 most recent requests (Playwright limit)
   * - Does not wait for future requests; only checks already captured ones
   */
  toHaveRequest(options?: ToHaveRequestOptions): Promise<void>;

  /**
   * Asserts that the page has a console message matching the specified criteria.
   * Uses `page.consoleMessages()` to check already captured console output.
   * 
   * **Limitations:**
   * - Only returns up to 200 most recent console messages (Playwright limit)
   * - Does not wait for future messages; only checks already captured ones
   */
  toHaveConsoleMessage(options?: ToHaveConsoleMessageOptions): Promise<void>;

  /**
   * Asserts that the page has encountered a JavaScript error matching the specified criteria.
   * Uses `page.pageErrors()` to check already captured uncaught exceptions.
   * 
   * **Limitations:**
   * - Only returns up to 200 most recent page errors (Playwright limit)
   * - Does not wait for future errors; only checks already captured ones
   */
  toHavePageError(options?: ToHavePageErrorOptions): Promise<void>;
}



// Test matchers (when T is test object)
interface ExPwTestMatchers {
  /**
   * Asserts that there are no test errors (useful with soft assertions).
   * Pass the `test` object and it calls `.info()` internally to check for errors.
   * 
   * @example
   * await expect(test).toHaveNoErrors();
   */
  toHaveNoErrors(options?: ToHaveNoErrorsOptions): void;
}

// API matchers
interface ExPwAPIMatchers {
  /**
   * Asserts that an API response body matches the expected JSON.
   */
  toMatchJSON(expected: unknown): Promise<void>;

  /**
   * Asserts that an API response body matches a Zod schema.
   */
  toMatchSchema(schema: ZodSchema): Promise<void>;

  /**
   * Asserts that an API response has a specific HTTP status code.
   */
  toHaveStatus(expected: number | { min: number; max: number }): Promise<void>;

  /**
   * Asserts that an API response has a specific header.
   */
  toHaveHeader(name: string, options?: { value?: string | RegExp }): Promise<void>;

  /**
   * Asserts that an API request/response responds within a specified timeout.
   * Expects a Promise or function returning a Promise.
   */
  toRespondWithin(timeout: number): Promise<void>;
}


// General matchers
interface ToBeSortedOptions {
  descending?: boolean;
  /**
   * For array of objects, extract value using this key or function.
   */
  key?: string | ((item: any) => any);
  /**
   * When used with Locator, use allTextContents() instead of allInnerTexts().
   * @default false
   */
  useTextContent?: boolean;
  /**
   * Whether to parse values as numbers for comparison.
   * @default false
   */
  compareAsNumbers?: boolean;
  timeout?: number;
  intervals?: number[];
}

interface ExPwGeneralMatchers {
  /**
   * Asserts that an array or locator elements are sorted.
   * When used with a Locator, extracts text using allInnerTexts() or allTextContents().
   */
  toBeSorted(options?: ToBeSortedOptions): Promise<void>;
}


// Asymmetric matchers (added to expect object)
interface ExPwAsymmetricMatchers {
  /**
   * Asymmetric matcher that checks if a number is within a specified range.
   */
  toBeWithinRange(min: number, max: number): any;

  /**
   * Asymmetric matcher that checks if a string is a valid UUID.
   */
  toBeUUID(version?: 'v1' | 'v4' | 'v5'): any;

  /**
   * Asymmetric matcher that checks if a string is a valid ISO 8601 date.
   */
  toBeISODate(): any;

  /**
   * Asymmetric matcher that checks if a string matches a date format.
   */
  toBeDateString(format: string): any;

  /**
   * Asymmetric matcher that checks if a string is a valid email address.
   */
  toBeEmail(): any;

  /**
   * Asymmetric matcher that checks if a string is a valid URL.
   */
  toBeURL(options?: ToBeURLAsymmetricOptions): any;

  /**
   * Matches any string that is valid JSON.
   */
  toBeJSON(): any;

  /**
   * Matches string starting with expected prefix
   */
  toStartWith(expected: string): any;

  /**
   * Matches string ending with expected suffix
   */
  toEndWith(expected: string): any;

  /**
   * Matches any string that is uppercase
   */
  toBeUpperCase(): any;

  /**
   * Matches any string that is lowercase
   */
  toBeLowerCase(): any;

  /**
   * Matches any string that is kebab-case
   */
  toBeKebabCase(): any;

  /**
   * Matches any string that is camelCase
   */
  toBeCamelCase(): any;

  /**
   * Matches any string that is snake_case
   */
  toBeSnakeCase(): any;

  /**
   * Matches any string that is PascalCase
   */
  toBePascalCase(): any;
}


// Augment Playwright's types
declare module '@playwright/test' {
  interface Matchers<R, T = unknown> {
    // Locator matchers (when T is Locator)
    toBeClickable(options?: TimeoutOptions): Promise<R>;
    toBeCheckable(options?: TimeoutOptions): Promise<R>;
    toBeRequired(options?: TimeoutOptions): Promise<R>;
    toBeInvalid(options?: TimeoutOptions): Promise<R>;
    toBeValid(options?: TimeoutOptions): Promise<R>;
    toHaveCountGreaterThan(count: number, options?: TimeoutOptions): Promise<R>;
    toHaveCountGreaterThanOrEqual(count: number, options?: TimeoutOptions): Promise<R>;
    toHaveCountLessThan(count: number, options?: TimeoutOptions): Promise<R>;
    toHaveCountLessThanOrEqual(count: number, options?: TimeoutOptions): Promise<R>;
    toHaveWidth(expected: number, options?: TimeoutOptions): Promise<R>;
    toHaveHeight(expected: number, options?: TimeoutOptions): Promise<R>;
    toHaveSize(width: number, height: number, options?: TimeoutOptions): Promise<R>;
    toHaveLoadedImage(options?: TimeoutOptions): Promise<R>;


    // Page matchers (when T is Page)
    toHaveCookie(name: string, options?: ToHaveCookieOptions): Promise<R>;
    toHaveLocalStorage(key: string, options?: ToHaveStorageOptions): Promise<R>;
    toHaveSessionStorage(key: string, options?: ToHaveStorageOptions): Promise<R>;
    toHaveClipboardText(expected: string | RegExp, options?: TimeoutOptions): Promise<R>;
    toHaveRequest(options?: ToHaveRequestOptions): Promise<R>;
    toHaveConsoleMessage(options?: ToHaveConsoleMessageOptions): Promise<R>;
    toHavePageError(options?: ToHavePageErrorOptions): Promise<R>;


    // TestInfo matchers (when T is TestInfo)
    toHaveNoErrors(options?: ToHaveNoErrorsOptions): R;

    // API matchers (when T is APIResponse)
    toMatchJSON(expected: unknown): Promise<R>;
    toMatchSchema(schema: ZodSchema): Promise<R>;
    toHaveStatus(expected: number | { min: number; max: number }): Promise<R>;
    toHaveHeader(name: string, options?: { value?: string | RegExp }): Promise<R>;
    toRespondWithin(timeout: number): Promise<R>;

    // General matchers (when T is Array or Locator)
    toBeSorted(options?: ToBeSortedOptions): Promise<R>;

    // Asymmetric matchers available as symmetric matchers
    toBeWithinRange(min: number, max: number): R;
    toBeUUID(version?: 'v1' | 'v4' | 'v5'): R;
    toBeISODate(): R;
    toBeDateString(format: string): R;
    toBeEmail(): R;
    toBeURL(options?: ToBeURLAsymmetricOptions): R;
    toBeJSON(): R;
    toStartWith(expected: string): R;
    toEndWith(expected: string): R;
    toBeUpperCase(): R;
    toBeLowerCase(): R;
    toBeKebabCase(): R;
    toBeCamelCase(): R;
    toBeSnakeCase(): R;
    toBePascalCase(): R;
  }


  interface Expect extends ExPwAsymmetricMatchers { }
}

export type {
  ExPwLocatorMatchers,
  ExPwPageMatchers,
  ExPwTestMatchers,
  ExPwAPIMatchers,
  ExPwAsymmetricMatchers,

  TimeoutOptions,
  ToBeSortedOptions,
  ToHaveCookieOptions,
  ToHaveStorageOptions,
  ToHaveNoErrorsOptions,
  ToBeURLAsymmetricOptions,
  ToHaveRequestOptions,
  ToHaveConsoleMessageOptions,
  ToHavePageErrorOptions,
};
