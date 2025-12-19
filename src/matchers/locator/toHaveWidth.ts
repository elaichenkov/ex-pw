import { expect, Locator, ExpectMatcherState } from '@playwright/test';
import { TimeoutOptions } from '../../types';

export async function toHaveWidth(
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
      return box ? box.width : null;
    }, { timeout, intervals }).toBe(expected);

    return {
      message: () => `expected element '${locator}' to have width ${expected}`,
      pass: true,
    };
  } catch (e: any) {
    return {
      message: () => `expected element '${locator}' to have width ${expected}`,
      pass: false,
    };

  }
}
