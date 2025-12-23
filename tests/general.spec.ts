import { test, expect } from '@playwright/test';

test.describe('toBeSorted', () => {
  test('should pass when array is sorted ascending', async () => {
    await expect([1, 2, 3]).toBeSorted();
    await expect(['a', 'b', 'c']).toBeSorted();
  });

  test('should pass when array is sorted descending', async () => {
    await expect([3, 2, 1]).toBeSorted({ descending: true });
    await expect(['c', 'b', 'a']).toBeSorted({ descending: true });
  });

  test('should fail when array is not sorted', async () => {
    await expect([1, 3, 2]).not.toBeSorted();
  });

  test('should fail when array is not sorted descending', async () => {
    await expect([1, 2, 3]).not.toBeSorted({ descending: true });
  });

  test('should support sorting by key', async () => {
    const items = [{ val: 1 }, { val: 2 }, { val: 3 }];
    await expect(items).toBeSorted({ key: 'val' });
    await expect([...items].reverse()).toBeSorted({ key: 'val', descending: true });
  });

  test('should support sorting by key function', async () => {
    const items = [{ val: 1 }, { val: 2 }, { val: 3 }];
    await expect(items).toBeSorted({ key: (item) => item.val });
  });

  test('should handle dates', async () => {
    const now = new Date();
    const later = new Date(now.getTime() + 1000);
    await expect([now, later]).toBeSorted();
    await expect([later, now]).toBeSorted({ descending: true });
  });

  test.describe('with Locators', () => {
    test('should pass when locator elements are sorted ascending', async ({ page }) => {
      await page.setContent(`
        <ul>
          <li class="item">Apple</li>
          <li class="item">Banana</li>
          <li class="item">Cherry</li>
        </ul>
      `);
      await expect(page.locator('.item')).toBeSorted();
    });

    test('should pass when locator elements are sorted descending', async ({ page }) => {
      await page.setContent(`
        <ul>
          <li class="item">Cherry</li>
          <li class="item">Banana</li>
          <li class="item">Apple</li>
        </ul>
      `);
      await expect(page.locator('.item')).toBeSorted({ descending: true });
    });

    test('should fail when locator elements are not sorted', async ({ page }) => {
      await page.setContent(`
        <ul>
          <li class="item">Banana</li>
          <li class="item">Apple</li>
          <li class="item">Cherry</li>
        </ul>
      `);
      await expect(page.locator('.item')).not.toBeSorted();
    });

    test('should compare as numbers when specified', async ({ page }) => {
      await page.setContent(`
        <ul>
          <li class="price">$10</li>
          <li class="price">$20</li>
          <li class="price">$100</li>
        </ul>
      `);
      await expect(page.locator('.price')).toBeSorted({ compareAsNumbers: true });
    });

    test('should use textContent when specified', async ({ page }) => {
      await page.setContent(`
        <ul>
          <li class="item">Apple<span style="display:none">Z</span></li>
          <li class="item">Banana<span style="display:none">Y</span></li>
          <li class="item">Cherry<span style="display:none">X</span></li>
        </ul>
      `);
      // With innerText (default), hidden text is excluded
      await expect(page.locator('.item')).toBeSorted();
      // With textContent, hidden text is included, so order would be different
      // AppleZ, BananaY, CherryX - still alphabetically sorted
      await expect(page.locator('.item')).toBeSorted({ useTextContent: true });
    });
  });
});
