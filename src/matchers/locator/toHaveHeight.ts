import { expect, Locator, ExpectMatcherState } from '@playwright/test';
import { TimeoutOptions } from '../../types';

export async function toHaveHeight(
  this: ExpectMatcherState,
  locator: Locator,
  expected: number,
  options?: TimeoutOptions
) {
  const timeout = options?.timeout ?? this.timeout;
  const intervals = options?.intervals;

  try {
    await expect.poll(async () => {
      const box = await locator.boundingBox();
      return box ? box.height : null;
    }, { timeout, intervals }).toBe(expected);

    return {
      message: () => `expected element '${locator}' to have height ${expected}`,
      pass: true,
    };
  } catch (e: any) {
    return {
      message: () => `expected element '${locator}' to have height ${expected}`,
      pass: false,
    };

  }
}
