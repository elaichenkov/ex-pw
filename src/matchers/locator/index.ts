// Locator matchers - named exports
export * from './toBeClickable';
export * from './toBeCheckable';
export * from './toBeRequired';
export * from './toBeInvalid';
export * from './toBeValid';
export * from './toHaveCount';
export * from './toHaveWidth';
export * from './toHaveHeight';
export * from './toHaveSize';
export * from './toHaveLoadedImage';

// Import for combined object
import { toBeClickable } from './toBeClickable';
import { toBeCheckable } from './toBeCheckable';
import { toBeRequired } from './toBeRequired';
import { toBeInvalid } from './toBeInvalid';
import { toBeValid } from './toBeValid';
import {
  toHaveCountGreaterThan,
  toHaveCountGreaterThanOrEqual,
  toHaveCountLessThan,
  toHaveCountLessThanOrEqual,
} from './toHaveCount';
import { toHaveWidth } from './toHaveWidth';
import { toHaveHeight } from './toHaveHeight';
import { toHaveSize } from './toHaveSize';
import { toHaveLoadedImage } from './toHaveLoadedImage';

// Combined object for easy spreading
export const locatorMatchers = {
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
};
