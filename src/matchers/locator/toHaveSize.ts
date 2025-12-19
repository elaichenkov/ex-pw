import { expect, Locator, ExpectMatcherState } from '@playwright/test';
import { TimeoutOptions } from '../../types';

export async function toHaveSize(
  this: ExpectMatcherState,
  locator: Locator,
  width: number,
  height: number,
  options?: TimeoutOptions
) {
  const timeout = options?.timeout ?? this.timeout;
  const intervals = options?.intervals;

  try {
    await expect.poll(async () => {
      const box = await locator.boundingBox();
      return box ? { width: box.width, height: box.height } : null;
    }, { timeout, intervals }).toEqual({ width, height });

    return {
      message: () => `expected element '${locator}' to have size { width: ${width}, height: ${height} }`,
      pass: true,
    };
  } catch (e: any) {
    return {
      message: () => `expected element '${locator}' to have size { width: ${width}, height: ${height} }`,
      pass: false,
    };

  }
}
