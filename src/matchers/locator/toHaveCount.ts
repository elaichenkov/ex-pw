import { expect } from '@playwright/test';
import type { Locator, ExpectMatcherState } from '@playwright/test';

interface CountOptions {
  timeout?: number;
  intervals?: number[];
}

/**
 * Asserts that a locator matches more than N elements.
 *
 * @example
 * await expect(page.locator('.item')).toHaveCountGreaterThan(3);
 * await expect(page.locator('.item')).toHaveCountGreaterThan(0, { timeout: 5000 });
 */
export async function toHaveCountGreaterThan(
  this: ExpectMatcherState,
  locator: Locator,
  count: number,
  options: CountOptions = {}
) {
  const assertionName = 'toHaveCountGreaterThan';
  const timeout = options.timeout ?? this.timeout;
  const intervals = options.intervals;
  let pass = false;
  let actualCount = 0;

  try {
    await expect
      .poll(
        async () => {
          actualCount = await locator.count();
          return actualCount;
        },
        { timeout, intervals }
      )
      .toBeGreaterThan(count);

    pass = true;
  } catch {
    pass = false;
  }

  const message = () => {
    if (this.isNot) {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, {
          isNot: this.isNot,
        }) +
        '\n\n' +
        `Expected: element '${locator}' count to NOT be greater than ${count}\n` +
        `Received: ${actualCount}`
      );
    }
    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Expected: element '${locator}' count to be greater than ${count}\n` +
      `Received: ${actualCount}`
    );
  };


  return {
    pass,
    message,
    name: assertionName,
    expected: `> ${count}`,
    actual: actualCount,
  };
}

/**
 * Asserts that a locator matches N or more elements.
 *
 * @example
 * await expect(page.locator('.item')).toHaveCountGreaterThanOrEqual(5);
 */
export async function toHaveCountGreaterThanOrEqual(
  this: ExpectMatcherState,
  locator: Locator,
  count: number,
  options: CountOptions = {}
) {
  const assertionName = 'toHaveCountGreaterThanOrEqual';
  const timeout = options.timeout ?? this.timeout;
  const intervals = options.intervals;
  let pass = false;
  let actualCount = 0;

  try {
    await expect
      .poll(
        async () => {
          actualCount = await locator.count();
          return actualCount;
        },
        { timeout, intervals }
      )
      .toBeGreaterThanOrEqual(count);

    pass = true;
  } catch {
    pass = false;
  }

  const message = () => {
    if (this.isNot) {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, {
          isNot: this.isNot,
        }) +
        '\n\n' +
        `Expected: element '${locator}' count to NOT be greater than or equal to ${count}\n` +
        `Received: ${actualCount}`
      );
    }
    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Expected: element '${locator}' count to be greater than or equal to ${count}\n` +
      `Received: ${actualCount}`
    );
  };


  return {
    pass,
    message,
    name: assertionName,
    expected: `>= ${count}`,
    actual: actualCount,
  };
}

/**
 * Asserts that a locator matches fewer than N elements.
 *
 * @example
 * await expect(page.locator('.item')).toHaveCountLessThan(10);
 */
export async function toHaveCountLessThan(
  this: ExpectMatcherState,
  locator: Locator,
  count: number,
  options: CountOptions = {}
) {
  const assertionName = 'toHaveCountLessThan';
  const timeout = options.timeout ?? this.timeout;
  const intervals = options.intervals;
  let pass = false;
  let actualCount = 0;

  try {
    await expect
      .poll(
        async () => {
          actualCount = await locator.count();
          return actualCount;
        },
        { timeout, intervals }
      )
      .toBeLessThan(count);

    pass = true;
  } catch {
    pass = false;
  }

  const message = () => {
    if (this.isNot) {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, {
          isNot: this.isNot,
        }) +
        '\n\n' +
        `Expected: element '${locator}' count to NOT be less than ${count}\n` +
        `Received: ${actualCount}`
      );
    }
    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Expected: element '${locator}' count to be less than ${count}\n` +
      `Received: ${actualCount}`
    );
  };


  return {
    pass,
    message,
    name: assertionName,
    expected: `< ${count}`,
    actual: actualCount,
  };
}

/**
 * Asserts that a locator matches N or fewer elements.
 *
 * @example
 * await expect(page.locator('.item')).toHaveCountLessThanOrEqual(5);
 */
export async function toHaveCountLessThanOrEqual(
  this: ExpectMatcherState,
  locator: Locator,
  count: number,
  options: CountOptions = {}
) {
  const assertionName = 'toHaveCountLessThanOrEqual';
  const timeout = options.timeout ?? this.timeout;
  const intervals = options.intervals;
  let pass = false;
  let actualCount = 0;

  try {
    await expect
      .poll(
        async () => {
          actualCount = await locator.count();
          return actualCount;
        },
        { timeout, intervals }
      )
      .toBeLessThanOrEqual(count);

    pass = true;
  } catch {
    pass = false;
  }

  const message = () => {
    if (this.isNot) {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, {
          isNot: this.isNot,
        }) +
        '\n\n' +
        `Expected: element '${locator}' count to NOT be less than or equal to ${count}\n` +
        `Received: ${actualCount}`
      );
    }
    return (
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Expected: element '${locator}' count to be less than or equal to ${count}\n` +
      `Received: ${actualCount}`
    );
  };


  return {
    pass,
    message,
    name: assertionName,
    expected: `<= ${count}`,
    actual: actualCount,
  };
}
