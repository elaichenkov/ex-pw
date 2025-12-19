import { expect } from '@playwright/test';
import type { Locator, ExpectMatcherState } from '@playwright/test';

interface ToBeSortedOptions {
  descending?: boolean;
  /**
   * For array of objects, extract value using this key or function.
   */
  key?: string | ((item: any) => any);
  /**
   * When used with Locator, specifies which method to use for extracting text.
   * - false (default): uses allInnerTexts() - excludes hidden elements
   * - true: uses allTextContents() - includes hidden elements
   * @default false
   */
  useTextContent?: boolean;
  /**
   * Whether to parse values as numbers for comparison.
   * @default false - compares as strings
   */
  compareAsNumbers?: boolean;
  timeout?: number;
  intervals?: number[];
}

function isLocator(value: unknown): value is Locator {
  return value !== null && typeof value === 'object' && 'allInnerTexts' in value;
}

function checkSorted(
  values: any[],
  descending: boolean,
  key?: string | ((item: any) => any)
): boolean {
  return values.every((item, index) => {
    if (index === 0) return true;
    const prev = values[index - 1];

    let a = key ? (typeof key === 'function' ? key(prev) : prev[key]) : prev;
    let b = key ? (typeof key === 'function' ? key(item) : item[key]) : item;

    // Handle dates
    if (a instanceof Date) a = a.getTime();
    if (b instanceof Date) b = b.getTime();

    if (descending) {
      return a >= b;
    }
    return a <= b;
  });
}

/**
 * Asserts that an array or locator elements are sorted.
 * 
 * When used with a Locator, it extracts text from all matching elements
 * using `allInnerTexts()` (default) or `allTextContents()`.
 *
 * @example
 * // With arrays
 * expect([1, 2, 3]).toBeSorted();
 * expect(['c', 'b', 'a']).toBeSorted({ descending: true });
 * expect([{ val: 1 }, { val: 2 }]).toBeSorted({ key: 'val' });
 * 
 * @example
 * // With Locators
 * await expect(page.locator('.price')).toBeSorted({ compareAsNumbers: true });
 * await expect(page.locator('.name')).toBeSorted({ descending: true });
 */
export async function toBeSorted(
  this: ExpectMatcherState,
  received: Locator | any[],
  options?: ToBeSortedOptions
) {
  const {
    descending = false,
    key,
    useTextContent = false,
    compareAsNumbers = false,
    timeout = this.timeout,
    intervals
  } = options || {};

  // Handle array case (synchronous but returned as Promise for consistency)
  if (Array.isArray(received)) {
    const pass = checkSorted(received, descending, key);
    return {
      message: () =>
        pass
          ? `expected array not to be sorted ${descending ? 'descending' : 'ascending'}`
          : `expected array to be sorted ${descending ? 'descending' : 'ascending'}, but received: [${received.join(', ')}]`,
      pass,
    };
  }

  // Handle Locator case (asynchronous with polling)
  if (isLocator(received)) {
    const locator = received;
    let values: string[] = [];
    let pass = false;

    try {
      await expect
        .poll(
          async () => {
            values = useTextContent
              ? await locator.allTextContents()
              : await locator.allInnerTexts();

            const compareValues = compareAsNumbers
              ? values.map((v) => parseFloat(v.replace(/[^0-9.-]/g, '')))
              : values;

            return checkSorted(compareValues, descending);
          },
          { timeout, intervals }
        )
        .toBe(true);

      pass = true;
    } catch {
      pass = false;
    }

    return {
      message: () =>
        pass
          ? `expected locator elements not to be sorted ${descending ? 'descending' : 'ascending'}`
          : `expected locator elements to be sorted ${descending ? 'descending' : 'ascending'}, but received: [${values.join(', ')}]`,
      pass,
    };
  }

  // Fallback for unexpected types
  return {
    message: () => `expected an array or Locator, but received: ${typeof received}`,
    pass: false,
  };
}
