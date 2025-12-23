import { test, expect } from '@playwright/test';

test.describe('Page Matchers', () => {
  test.describe('toHaveCookie', () => {
    test('passes when cookie exists', async ({ page }) => {
      await page.goto('about:blank');
      await page.context().addCookies([
        { name: 'session', value: 'abc123', domain: 'localhost', path: '/' }
      ]);
      await expect(page).toHaveCookie('session');
    });

    test('matches cookie value', async ({ page }) => {
      await page.goto('about:blank');
      await page.context().addCookies([
        { name: 'token', value: 'secret-value', domain: 'localhost', path: '/' }
      ]);
      await expect(page).toHaveCookie('token', { value: 'secret-value' });
      await expect(page).toHaveCookie('token', { value: /^secret/ });
    });
  });

  // Note: These tests are skipped because localStorage/sessionStorage require a proper origin
  // In real tests, navigate to your app's URL first before using these matchers
  test.describe('toHaveLocalStorage', () => {
    test('passes when localStorage key exists', async ({ page }) => {
      await page.goto('https://example.com');
      await page.evaluate(() => window.localStorage.setItem('authToken', 'test123'));
      await expect(page).toHaveLocalStorage('authToken');
    });

    test('matches localStorage value', async ({ page }) => {
      await page.goto('https://example.com');
      await page.evaluate(() => window.localStorage.setItem('settings', JSON.stringify({ theme: 'dark' })));
      await expect(page).toHaveLocalStorage('settings', { value: { theme: 'dark' } });
    });
  });

  test.describe('toHaveSessionStorage', () => {
    test('passes when sessionStorage key exists', async ({ page }) => {
      await page.goto('https://example.com');
      await page.evaluate(() => window.sessionStorage.setItem('tempData', 'value'));
      await expect(page).toHaveSessionStorage('tempData');
    });
  });

  test('toHaveClipboardText', async ({ page, context }) => {
    // Grant permissions for clipboard access
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('https://example.com');

    await page.setContent('<button onclick="navigator.clipboard.writeText(\'hello world\')">Copy</button>');

    await page.click('button');

    await expect(page).toHaveClipboardText('hello world');
    await expect(page).toHaveClipboardText(/hello/);
    await expect(page).not.toHaveClipboardText('goodbye');
  });

  /**
   * Tests for toHaveRequest matcher
   * 
   * LIMITATIONS:
   * - Only returns up to 100 most recent requests (Playwright limit)
   * - Requests may be garbage collected if not accessed promptly
   */
  test.describe('toHaveRequest', () => {
    test('passes when matching request exists by URL string', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveRequest({ url: 'example.com' });
    });

    test('passes when matching request exists by URL regex', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveRequest({ url: /example\.com/ });
    });

    test('passes when matching request exists by method', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveRequest({ method: 'GET' });
    });

    test('fails when no matching request exists', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).not.toHaveRequest({ url: /nonexistent-domain\.xyz/ });
    });

    test('passes with combined criteria', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveRequest({ method: 'GET', url: /example\.com/ });
    });
  });

  /**
   * Tests for toHaveConsoleMessage matcher
   * 
   * LIMITATIONS:
   * - Only returns up to 200 most recent console messages (Playwright limit)
   */
  test.describe('toHaveConsoleMessage', () => {
    test('passes when matching console log exists', async ({ page }) => {
      await page.goto('about:blank');
      await page.evaluate(() => console.log('Hello World'));
      await expect(page).toHaveConsoleMessage({ text: 'Hello World' });
    });

    test('passes when matching console message by type', async ({ page }) => {
      await page.goto('about:blank');
      await page.evaluate(() => console.warn('Warning message'));
      await expect(page).toHaveConsoleMessage({ type: 'warning' });
    });

    test('passes when matching console message by regex', async ({ page }) => {
      await page.goto('about:blank');
      await page.evaluate(() => console.log('User ID: 12345'));
      await expect(page).toHaveConsoleMessage({ text: /User ID: \d+/ });
    });

    test('fails when no matching console message exists', async ({ page }) => {
      await page.goto('about:blank');
      await expect(page).not.toHaveConsoleMessage({ text: 'This was never logged' });
    });

    test('passes with combined criteria', async ({ page }) => {
      await page.goto('about:blank');
      await page.evaluate(() => console.error('Error occurred'));
      await expect(page).toHaveConsoleMessage({ type: 'error', text: /Error/ });
    });
  });

  /**
   * Tests for toHavePageError matcher
   * 
   * LIMITATIONS:
   * - Only returns up to 200 most recent page errors (Playwright limit)
   * - Only captures uncaught exceptions in the page's JavaScript context
   */
  test.describe('toHavePageError', () => {
    test('passes when page error exists', async ({ page }) => {
      await page.goto('about:blank');
      // Trigger an uncaught error
      await page.evaluate(() => {
        setTimeout(() => {
          throw new Error('Uncaught test error');
        }, 0);
      });
      // Matcher will poll until error is captured
      await expect(page).toHavePageError({ message: 'Uncaught test error' });
    });

    test('passes when matching error by message regex', async ({ page }) => {
      await page.goto('about:blank');
      await page.evaluate(() => {
        setTimeout(() => {
          throw new TypeError('Cannot read property of undefined');
        }, 0);
      });
      await expect(page).toHavePageError({ message: /Cannot read property/ });
    });

    test('fails when no page error exists', async ({ page }) => {
      await page.goto('about:blank');
      await expect(page).not.toHavePageError({ timeout: 500 });
    });

    test('passes with any error when no criteria specified', async ({ page }) => {
      await page.goto('about:blank');
      await page.evaluate(() => {
        setTimeout(() => {
          throw new Error('Some error');
        }, 0);
      });
      await expect(page).toHavePageError();
    });
  });
});
