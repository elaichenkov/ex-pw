// Page matchers
export { toHaveNoErrors } from './toHaveNoErrors';
export { toHaveCookie } from './toHaveCookie';
export * from './toHaveNoErrors';
export * from './toHaveCookie';
export * from './toHaveLocalStorage';
export * from './toHaveSessionStorage';
export * from './toHaveClipboardText';
export * from './toHaveRequest';
export * from './toHaveConsoleMessage';
export * from './toHavePageError';

import { toHaveNoErrors } from './toHaveNoErrors';
import { toHaveCookie } from './toHaveCookie';
import { toHaveLocalStorage } from './toHaveLocalStorage';
import { toHaveSessionStorage } from './toHaveSessionStorage';
import { toHaveClipboardText } from './toHaveClipboardText';
import { toHaveRequest } from './toHaveRequest';
import { toHaveConsoleMessage } from './toHaveConsoleMessage';
import { toHavePageError } from './toHavePageError';

// Combined object for easy spreading
export const pageMatchers = {
  toHaveNoErrors,
  toHaveCookie,
  toHaveLocalStorage,
  toHaveSessionStorage,
  toHaveClipboardText,
  toHaveRequest,
  toHaveConsoleMessage,
  toHavePageError,
};
