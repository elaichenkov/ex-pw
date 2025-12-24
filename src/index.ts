/**
 * ex-pw - Extended Playwright expect matchers
 *
 * A TypeScript library that extends Playwright's built-in `expect` matchers
 * with additional assertions focused on auto-waiting and leveraging
 * Playwright's built-in functions for the best developer experience.
 *
 * @example
 * // Option 1: Extend existing expect with all matchers
 * import { expect } from '@playwright/test';
 * import exPw from 'ex-pw';
 * expect.extend(exPw);
 *
 * @example
 * // Option 2: Import individual matchers to extend
 * import { expect } from '@playwright/test';
 * import { toBeClickable, toBeRequired } from 'ex-pw';
 * expect.extend({ toBeClickable, toBeRequired });
 */

import { expect as playwrightExpect } from '@playwright/test';
import type { ExPwAsymmetricMatchers } from './types';
import {
  allMatchers,
  locatorMatchers,
  pageMatchers,
  apiMatchers,
  asymmetricMatchers,
  generalMatchers,
} from './matchers';

const exPwExpect = playwrightExpect.extend(allMatchers)
export const expect = exPwExpect as typeof exPwExpect & ExPwAsymmetricMatchers;

// Default export: all matchers combined (for expect.extend(exPw))
const exPw = {
  ...allMatchers,
};

export default exPw;

// Named exports for individual matchers
// Locator matchers
export {
  toBeClickable,
  toBeCheckable,
  toBeRequired,
  toBeInvalid,
  toBeValid,
  toHaveCountGreaterThan,
  toHaveCountGreaterThanOrEqual,
  toHaveCountLessThan,

  toHaveCountLessThanOrEqual,
  toHaveWidth,
  toHaveHeight,
  toHaveSize,
  toHaveLoadedImage,
} from './matchers/locator';

// Page matchers
export {
  toHaveNoSoftErrors,
  toHaveCookie,
  toHaveLocalStorage,
  toHaveSessionStorage,
  toHaveClipboardText,
  toHaveRequest,
  toHaveConsoleMessage,
  toHavePageError,
} from './matchers/page';

// API matchers
export {
  toMatchJSON,
  toMatchSchema,
  toHaveStatus,
  toHaveHeader,
  toRespondWithin,
} from './matchers/api';

// General matchers
export {
  toBeSorted,
} from './matchers/general';

// Asymmetric matchers
export {
  toBeWithinRange,
  toBeUUID,
  toBeISODate,
  toBeDateString,
  toBeEmail,
  toBeURL,
  toBeJSON,
  toStartWith,
  toEndWith,
  toBeUpperCase,
  toBeLowerCase,
  toBeKebabCase,
  toBeCamelCase,
  toBeSnakeCase,
  toBePascalCase,
} from './matchers/asymmetric';

// Export grouped matchers for selective extension
export {
  locatorMatchers,
  pageMatchers,
  apiMatchers,
  asymmetricMatchers,
  generalMatchers,
};

// Re-export types
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
  ToHaveNoSoftErrorsOptions,
  ToBeURLAsymmetricOptions,
  ToHaveRequestOptions,
  ToHaveConsoleMessageOptions,
  ToHavePageErrorOptions,
} from './types';

