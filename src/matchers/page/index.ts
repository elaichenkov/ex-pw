// Page matchers
export { toHaveNoSoftErrors } from './toHaveNoSoftErrors';
export { toHaveCookie } from './toHaveCookie';
export * from './toHaveNoSoftErrors';
export * from './toHaveCookie';
export * from './toHaveLocalStorage';
export * from './toHaveSessionStorage';
export * from './toHaveClipboardText';
export * from './toHaveRequest';
export * from './toHaveConsoleMessage';
export * from './toHavePageError';

import { toHaveNoSoftErrors } from './toHaveNoSoftErrors';
import { toHaveCookie } from './toHaveCookie';
import { toHaveLocalStorage } from './toHaveLocalStorage';
import { toHaveSessionStorage } from './toHaveSessionStorage';
import { toHaveClipboardText } from './toHaveClipboardText';
import { toHaveRequest } from './toHaveRequest';
import { toHaveConsoleMessage } from './toHaveConsoleMessage';
import { toHavePageError } from './toHavePageError';

// Combined object for easy spreading
export const pageMatchers = {
  toHaveNoSoftErrors,
  toHaveCookie,
  toHaveLocalStorage,
  toHaveSessionStorage,
  toHaveClipboardText,
  toHaveRequest,
  toHaveConsoleMessage,
  toHavePageError,
};
