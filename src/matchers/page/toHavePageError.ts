import { expect } from '@playwright/test';
import type { Page, ExpectMatcherState } from '@playwright/test';

interface ToHavePageErrorOptions {
    message?: string | RegExp;
    name?: string;
    timeout?: number;
    intervals?: number[];
}

/**
 * Asserts that the page has encountered a JavaScript error matching the specified criteria.
 * Uses `page.pageErrors()` with polling to wait for matching errors.
 *
 * **Limitations:**
 * - Only returns up to 200 most recent page errors (Playwright limit)
 * - Only captures uncaught exceptions in the page's JavaScript context
 *
 * @example
 * await expect(page).toHavePageError();
 * await expect(page).toHavePageError({ message: 'undefined is not a function' });
 * await expect(page).toHavePageError({ message: /TypeError/, name: 'TypeError' });
 */
export async function toHavePageError(
    this: ExpectMatcherState,
    page: Page,
    options: ToHavePageErrorOptions = {}
) {
    const assertionName = 'toHavePageError';
    const { message: errorMessage, name: errorName, timeout = this.timeout, intervals } = options;

    let matchedError: Error | undefined;
    let errors: Error[] = [];
    let pass = false;

    try {
        await expect
            .poll(
                async () => {
                    errors = await page.pageErrors();

                    matchedError = errors.find((error) => {
                        // Match error message
                        if (errorMessage !== undefined) {
                            const msg = error.message;
                            if (typeof errorMessage === 'string') {
                                if (!msg.includes(errorMessage)) return false;
                            } else {
                                if (!errorMessage.test(msg)) return false;
                            }
                        }

                        // Match error name
                        if (errorName !== undefined) {
                            if (error.name !== errorName) return false;
                        }

                        return true;
                    });

                    return matchedError !== undefined;
                },
                { timeout, intervals }
            )
            .toBe(true);

        pass = true;
    } catch {
        pass = false;
    }

    const criteriaDesc = [
        errorMessage
            ? `message matching ${errorMessage instanceof RegExp ? errorMessage : `"${errorMessage}"`}`
            : null,
        errorName ? `name "${errorName}"` : null,
    ]
        .filter(Boolean)
        .join(', ');

    const message = () => {
        if (this.isNot) {
            return (
                this.utils.matcherHint(assertionName, undefined, undefined, {
                    isNot: this.isNot,
                }) +
                '\n\n' +
                `Expected: NOT to have page error with ${criteriaDesc || 'any criteria'}\n` +
                `Received: found matching error: ${matchedError?.name}: ${matchedError?.message}`
            );
        }

        const capturedErrors = errors
            .slice(0, 5)
            .map((e) => `  ${e.name}: ${e.message.substring(0, 60)}${e.message.length > 60 ? '...' : ''}`)
            .join('\n');

        return (
            this.utils.matcherHint(assertionName, undefined, undefined, {
                isNot: this.isNot,
            }) +
            '\n\n' +
            `Expected: page error with ${criteriaDesc || 'any criteria'}\n` +
            `Received: no matching error found among ${errors.length} captured errors\n` +
            (capturedErrors ? `\nRecent errors:\n${capturedErrors}` : '') +
            `\n\nNote: page.pageErrors() only returns up to 200 most recent errors`
        );
    };

    return {
        pass,
        message,
        name: assertionName,
    };
}
