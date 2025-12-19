import { expect, Locator, ExpectMatcherState } from '@playwright/test';
import { TimeoutOptions } from '../../types';

export async function toHaveLoadedImage(
  this: ExpectMatcherState,
  locator: Locator,
  options?: TimeoutOptions
) {
  const timeout = options?.timeout ?? this.timeout;
  const intervals = options?.intervals;

  try {
    await expect.poll(async () => {
      return await locator.evaluate((el) => {
        if (!(el instanceof HTMLImageElement)) {
          throw new Error('Element is not an HTMLImageElement');
        }
        return el.complete && el.naturalWidth > 0;
      });
    }, { timeout, intervals }).toBe(true);

    return {
      message: () => `expected element '${locator}' to have loaded image`,
      pass: true,
    };
  } catch (e: any) {
    // Check if it failed because it's not an image
    if (e.message && e.message.includes('Element is not an HTMLImageElement')) {
      return {
        message: () => `expected element '${locator}' to have loaded image, but it is not an HTMLImageElement`,
        pass: false,
      };
    }

    return {
      message: () => `expected element '${locator}' to have loaded image`,
      pass: false,
    };
  }
}
