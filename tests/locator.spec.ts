import { test, expect as playwrightExpect } from '@playwright/test';
import xpecto from '../src';

// Extend expect with xpecto matchers
const expect = playwrightExpect.extend(xpecto);

test.describe('Locator Matchers', () => {
  test('Dimension matchers', async ({ page }) => {
    await page.setContent('<div id="box" style="width: 100px; height: 50px;"></div>');
    const box = page.locator('#box');

    await expect(box).toHaveWidth(100);
    await expect(box).toHaveHeight(50);
    await expect(box).toHaveSize(100, 50);

    await expect(box).not.toHaveWidth(200);
    await expect(box).not.toHaveHeight(100);
    await expect(box).not.toHaveSize(50, 50);
  });

  test('toHaveLoadedImage', async ({ page }) => {
    // Valid image
    await page.setContent('<img id="valid" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=" />');
    await expect(page.locator('#valid')).toHaveLoadedImage();

    // Broken image
    await page.setContent('<img id="broken" src="invalid-url.png" />');
    await expect(page.locator('#broken')).not.toHaveLoadedImage({ timeout: 1000 });

    // Not an image
    await page.setContent('<div id="div"></div>');
    await expect(page.locator('#div')).not.toHaveLoadedImage();
  });

  test.describe('toBeClickable', () => {


    test('passes for enabled visible button', async ({ page }) => {
      await page.setContent('<button>Click me</button>');
      await expect(page.getByRole('button')).toBeClickable();
    });

    test('fails for disabled button', async ({ page }) => {
      await page.setContent('<button disabled>Click me</button>');
      await expect(page.getByRole('button')).not.toBeClickable();
    });

    test('waits for button to become clickable', async ({ page }) => {
      await page.setContent(`
        <button disabled id="btn">Click me</button>
        <script>
          setTimeout(() => {
            document.getElementById('btn').disabled = false;
          }, 500);
        </script>
      `);
      await expect(page.getByRole('button')).toBeClickable({ timeout: 5000 });
    });

    test('fails for hidden element', async ({ page }) => {
      await page.setContent('<button style="display:none">Click me</button>');
      await expect(page.getByRole('button')).not.toBeClickable();
    });
  });

  test.describe('toBeCheckable', () => {
    test('passes for enabled checkbox', async ({ page }) => {
      await page.setContent('<input type="checkbox" />');
      await expect(page.getByRole('checkbox')).toBeCheckable();
    });

    test('fails for disabled checkbox', async ({ page }) => {
      await page.setContent('<input type="checkbox" disabled />');
      await expect(page.getByRole('checkbox')).not.toBeCheckable();
    });
  });

  test.describe('toBeRequired', () => {
    test('passes for required input', async ({ page }) => {
      await page.setContent('<input type="text" required />');
      await expect(page.locator('input')).toBeRequired();
    });

    test('passes for aria-required input', async ({ page }) => {
      await page.setContent('<input type="text" aria-required="true" />');
      await expect(page.locator('input')).toBeRequired();
    });

    test('fails for optional input', async ({ page }) => {
      await page.setContent('<input type="text" />');
      await expect(page.locator('input')).not.toBeRequired();
    });

    test('waits for input to become required', async ({ page }) => {
      await page.setContent(`
        <input type="text" id="field" />
        <script>
          setTimeout(() => {
            document.getElementById('field').required = true;
          }, 500);
        </script>
      `);
      await expect(page.locator('input')).toBeRequired({ timeout: 5000 });
    });
  });

  test.describe('toBeInvalid', () => {
    test('passes for invalid input', async ({ page }) => {
      await page.setContent('<input type="email" value="invalid" />');
      const input = page.locator('input');
      // Trigger validation
      await input.evaluate((el: HTMLInputElement) => el.reportValidity());
      await expect(input).toBeInvalid();
    });

    test('passes for ng-invalid class (Angular)', async ({ page }) => {
      await page.setContent('<input type="text" class="ng-invalid" />');
      await expect(page.locator('input')).toBeInvalid();
    });

    test('passes for is-invalid class (Bootstrap)', async ({ page }) => {
      await page.setContent('<input type="text" class="is-invalid" />');
      await expect(page.locator('input')).toBeInvalid();
    });
  });

  test.describe('toBeValid', () => {
    test('passes for valid input', async ({ page }) => {
      await page.setContent('<input type="email" value="test@example.com" />');
      await expect(page.locator('input')).toBeValid();
    });
  });

  test.describe('Count matchers', () => {
    test('toHaveCountGreaterThan works', async ({ page }) => {
      await page.setContent('<div class="item"></div><div class="item"></div><div class="item"></div>');
      await expect(page.locator('.item')).toHaveCountGreaterThan(2);
      await expect(page.locator('.item')).not.toHaveCountGreaterThan(3);
    });

    test('toHaveCountGreaterThanOrEqual works', async ({ page }) => {
      await page.setContent('<div class="item"></div><div class="item"></div><div class="item"></div>');
      await expect(page.locator('.item')).toHaveCountGreaterThanOrEqual(3);
    });

    test('toHaveCountLessThan works', async ({ page }) => {
      await page.setContent('<div class="item"></div><div class="item"></div>');
      await expect(page.locator('.item')).toHaveCountLessThan(3);
    });

    test('toHaveCountLessThanOrEqual works', async ({ page }) => {
      await page.setContent('<div class="item"></div><div class="item"></div>');
      await expect(page.locator('.item')).toHaveCountLessThanOrEqual(2);
    });

    test('waits for count to change', async ({ page }) => {
      await page.setContent(`
        <div id="container"></div>
        <script>
          setTimeout(() => {
            for (let i = 0; i < 5; i++) {
              const div = document.createElement('div');
              div.className = 'item';
              document.getElementById('container').appendChild(div);
            }
          }, 500);
        </script>
      `);
      await expect(page.locator('.item')).toHaveCountGreaterThan(3, { timeout: 5000 });
    });
  });
});
