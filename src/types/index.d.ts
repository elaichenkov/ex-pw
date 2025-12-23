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


// Augment Playwright's types using global namespace
declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T = unknown> {
      // Locator matchers (when T is Locator)

      /**
       * Asserts that an element is visible, enabled, stable, and not obscured.
       * @example
       * await expect(page.getByRole('button')).toBeClickable();
       */
      toBeClickable(options?: TimeoutOptions): Promise<R>;

      /**
       * Asserts that a checkbox or radio button is in a checkable state.
       * @example
       * await expect(page.getByRole('checkbox')).toBeCheckable();
       */
      toBeCheckable(options?: TimeoutOptions): Promise<R>;

      /**
       * Asserts that a form element is required.
       * @example
       * await expect(page.getByLabel('Email')).toBeRequired();
       */
      toBeRequired(options?: TimeoutOptions): Promise<R>;

      /**
       * Asserts that a form element is in an invalid validation state.
       * @example
       * await expect(page.getByRole('textbox')).toBeInvalid();
       */
      toBeInvalid(options?: TimeoutOptions): Promise<R>;

      /**
       * Asserts that a form element is in a valid validation state.
       * @example
       * await expect(page.getByRole('textbox')).toBeValid();
       */
      toBeValid(options?: TimeoutOptions): Promise<R>;

      /**
       * Asserts that a locator resolves to more than the specified number of elements.
       * @example
       * await expect(page.locator('li')).toHaveCountGreaterThan(3);
       */
      toHaveCountGreaterThan(count: number, options?: TimeoutOptions): Promise<R>;

      /**
       * Asserts that a locator resolves to at least the specified number of elements.
       * @example
       * await expect(page.locator('li')).toHaveCountGreaterThanOrEqual(1);
       */
      toHaveCountGreaterThanOrEqual(count: number, options?: TimeoutOptions): Promise<R>;

      /**
       * Asserts that a locator resolves to fewer than the specified number of elements.
       * @example
       * await expect(page.locator('.loading')).toHaveCountLessThan(1);
       */
      toHaveCountLessThan(count: number, options?: TimeoutOptions): Promise<R>;

      /**
       * Asserts that a locator resolves to at most the specified number of elements.
       * @example
       * await expect(page.locator('.result')).toHaveCountLessThanOrEqual(5);
       */
      toHaveCountLessThanOrEqual(count: number, options?: TimeoutOptions): Promise<R>;

      /**
       * Asserts that an element has a specific width in pixels.
       * @example
       * await expect(page.locator('#box')).toHaveWidth(100);
       */
      toHaveWidth(expected: number, options?: TimeoutOptions): Promise<R>;

      /**
       * Asserts that an element has a specific height in pixels.
       * @example
       * await expect(page.locator('#box')).toHaveHeight(200);
       */
      toHaveHeight(expected: number, options?: TimeoutOptions): Promise<R>;

      /**
       * Asserts that an element has a specific width and height in pixels.
       * @example
       * await expect(page.locator('#box')).toHaveSize(100, 200);
       */
      toHaveSize(width: number, height: number, options?: TimeoutOptions): Promise<R>;

      /**
       * Asserts that an image element has fully loaded.
       * @example
       * await expect(page.locator('img.logo')).toHaveLoadedImage();
       */
      toHaveLoadedImage(options?: TimeoutOptions): Promise<R>;

      // Page matchers (when T is Page)

      /**
       * Asserts that the page has a cookie with the specified name.
       * @example
       * await expect(page).toHaveCookie('session_id');
       * await expect(page).toHaveCookie('csrf', { value: /.+/ });
       */
      toHaveCookie(name: string, options?: ToHaveCookieOptions): Promise<R>;

      /**
       * Asserts that localStorage has a specific key.
       * @example
       * await expect(page).toHaveLocalStorage('token');
       */
      toHaveLocalStorage(key: string, options?: ToHaveStorageOptions): Promise<R>;

      /**
       * Asserts that sessionStorage has a specific key.
       * @example
       * await expect(page).toHaveSessionStorage('cart_id');
       */
      toHaveSessionStorage(key: string, options?: ToHaveStorageOptions): Promise<R>;

      /**
       * Asserts that the clipboard contains the specified text.
       * @example
       * await expect(page).toHaveClipboardText('copied text');
       */
      toHaveClipboardText(expected: string | RegExp, options?: TimeoutOptions): Promise<R>;

      /**
       * Asserts that a network request matching the criteria was made.
       * @example
       * await expect(page).toHaveRequest({ url: '/api/login', method: 'POST' });
       */
      toHaveRequest(options?: ToHaveRequestOptions): Promise<R>;

      /**
       * Asserts that a console message matching the criteria was logged.
       * @example
       * await expect(page).toHaveConsoleMessage({ type: 'error', text: /failed/ });
       */
      toHaveConsoleMessage(options?: ToHaveConsoleMessageOptions): Promise<R>;

      /**
       * Asserts that the page threw an uncaught exception.
       * @example
       * await expect(page).toHavePageError({ message: /ReferenceError/ });
       */
      toHavePageError(options?: ToHavePageErrorOptions): Promise<R>;

      // TestInfo matchers (when T is TestInfo)

      /**
       * Asserts that there are no errors in the current test execution. Common with soft assertions.
       * @example
       * await expect(test).toHaveNoErrors();
       */
      toHaveNoErrors(options?: ToHaveNoErrorsOptions): R;

      // API matchers (when T is APIResponse)

      /**
       * Asserts that the API response body matches the expected JSON.
       * @example
       * await expect(response).toMatchJSON({ success: true });
       */
      toMatchJSON(expected: unknown): Promise<R>;

      /**
       * Asserts that the API response body matches a Zod schema.
       * @example
       * await expect(response).toMatchSchema(UserSchema);
       */
      toMatchSchema(schema: ZodSchema): Promise<R>;

      /**
       * Asserts that the API response has the specified status code or is within range.
       * @example
       * await expect(response).toHaveStatus(200);
       * await expect(response).toHaveStatus({ min: 200, max: 299 });
       */
      toHaveStatus(expected: number | { min: number; max: number }): Promise<R>;

      /**
       * Asserts that the API response contains a specific header.
       * @example
       * await expect(response).toHaveHeader('content-type', { value: /json/ });
       */
      toHaveHeader(name: string, options?: { value?: string | RegExp }): Promise<R>;

      /**
       * Asserts that the API response was received within the specified timeout.
       * @example
       * await expect(requestPromise).toRespondWithin(1000);
       */
      toRespondWithin(timeout: number): Promise<R>;

      // General matchers (when T is Array or Locator)

      /**
       * Asserts that an array or items in a locator are sorted.
       * @example
       * await expect([1, 2, 3]).toBeSorted();
       * await expect(page.locator('li')).toBeSorted({ descending: true });
       */
      toBeSorted(options?: ToBeSortedOptions): Promise<R>;

      // Asymmetric matchers available as symmetric matchers

      /**
       * Asserts that the value is within the specified range (inclusive).
       * @example
       * await expect(5).toBeWithinRange(1, 10);
       */
      toBeWithinRange(min: number, max: number): R;

      /**
       * Asserts that the value is a valid UUID.
       * @example
       * await expect(uuid).toBeUUID();
       */
      toBeUUID(version?: 'v1' | 'v4' | 'v5'): R;

      /**
       * Asserts that the value is a valid ISO 8601 date string.
       * @example
       * await expect('2023-01-01T00:00:00Z').toBeISODate();
       */
      toBeISODate(): R;

      /**
       * Asserts that the value matches the specified date format.
       * @example
       * await expect('01/01/2023').toBeDateString('MM/DD/YYYY');
       */
      toBeDateString(format: string): R;

      /**
       * Asserts that the value is a valid email address.
       * @example
       * await expect('user@example.com').toBeEmail();
       */
      toBeEmail(): R;

      /**
       * Asserts that the value is a valid URL.
       * @example
       * await expect('https://example.com').toBeURL();
       */
      toBeURL(options?: ToBeURLAsymmetricOptions): R;

      /**
       * Asserts that the string value is valid JSON.
       * @example
       * await expect('{"a":1}').toBeJSON();
       */
      toBeJSON(): R;

      /**
       * Asserts that the string starts with the expected prefix.
       * @example
       * await expect('Hello World').toStartWith('Hello');
       */
      toStartWith(expected: string): R;

      /**
       * Asserts that the string ends with the expected suffix.
       * @example
       * await expect('image.png').toEndWith('.png');
       */
      toEndWith(expected: string): R;

      /**
       * Asserts that the string is uppercase.
       * @example
       * await expect('HELLO').toBeUpperCase();
       */
      toBeUpperCase(): R;

      /**
       * Asserts that the string is lowercase.
       * @example
       * await expect('hello').toBeLowerCase();
       */
      toBeLowerCase(): R;

      /**
       * Asserts that the string is kebab-case.
       * @example
       * await expect('my-class-name').toBeKebabCase();
       */
      toBeKebabCase(): R;

      /**
       * Asserts that the string is camelCase.
       * @example
       * await expect('myVariable').toBeCamelCase();
       */
      toBeCamelCase(): R;

      /**
       * Asserts that the string is snake_case.
       * @example
       * await expect('my_variable').toBeSnakeCase();
       */
      toBeSnakeCase(): R;

      /**
       * Asserts that the string is PascalCase.
       * @example
       * await expect('MyClass').toBePascalCase();
       */
      toBePascalCase(): R;
    }

    // Asymmetric matchers available on the expect object (e.g., expect.toBeLowerCase())
    interface AsymmetricMatchers {
      /**
       * Matches any number within the specified range.
       * @example
       * expect(value).toEqual(expect.toBeWithinRange(1, 10));
       */
      toBeWithinRange(min: number, max: number): any;

      /**
       * Matches any string that is a valid UUID.
       * @example
       * expect(value).toEqual(expect.toBeUUID());
       */
      toBeUUID(version?: 'v1' | 'v4' | 'v5'): any;

      /**
       * Matches any string that is a valid ISO 8601 date.
       * @example
       * expect(value).toEqual(expect.toBeISODate());
       */
      toBeISODate(): any;

      /**
       * Matches any string that follows the specified date format.
       * @example
       * expect(value).toEqual(expect.toBeDateString('YYYY-MM-DD'));
       */
      toBeDateString(format: string): any;

      /**
       * Matches any string that is a valid email address.
       * @example
       * expect(value).toEqual(expect.toBeEmail());
       */
      toBeEmail(): any;

      /**
       * Matches any string that is a valid URL.
       * @example
       * expect(value).toEqual(expect.toBeURL());
       */
      toBeURL(options?: any): any;

      /**
       * Matches any string that is valid JSON.
       * @example
       * expect(value).toEqual(expect.toBeJSON());
       */
      toBeJSON(): any;

      /**
       * Matches any string starting with the expected prefix.
       * @example
       * expect(value).toEqual(expect.toStartWith('Pre'));
       */
      toStartWith(expected: string): any;

      /**
       * Matches any string ending with the expected suffix.
       * @example
       * expect(value).toEqual(expect.toEndWith('fix'));
       */
      toEndWith(expected: string): any;

      /**
       * Matches any string that is uppercase.
       * @example
       * expect(value).toEqual(expect.toBeUpperCase());
       */
      toBeUpperCase(): any;

      /**
       * Matches any string that is lowercase.
       * @example
       * expect(value).toEqual(expect.toBeLowerCase());
       */
      toBeLowerCase(): any;

      /**
       * Matches any string that is kebab-case.
       * @example
       * expect(value).toEqual(expect.toBeKebabCase());
       */
      toBeKebabCase(): any;

      /**
       * Matches any string that is camelCase.
       * @example
       * expect(value).toEqual(expect.toBeCamelCase());
       */
      toBeCamelCase(): any;

      /**
       * Matches any string that is snake_case.
       * @example
       * expect(value).toEqual(expect.toBeSnakeCase());
       */
      toBeSnakeCase(): any;

      /**
       * Matches any string that is PascalCase.
       * @example
       * expect(value).toEqual(expect.toBePascalCase());
       */
      toBePascalCase(): any;
    }
  }

  // Workaround for Playwright's Expect type limitation:
  // Since Expect is a type alias intersection that cannot be augmented directly,
  // and it is compatible with Function, we add the asymmetric matchers to the
  // global Function interface to make them available on the expect object.
  interface Function extends PlaywrightTest.AsymmetricMatchers { }
}

// Module augmentation for playwright/test - this extends the AsymmetricMatchers interface
// that is already intersected with the Expect type in Playwright's types

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
