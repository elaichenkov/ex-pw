import { expect } from '@playwright/test';
import type { Page, ExpectMatcherState, Request } from '@playwright/test';

interface ToHaveRequestOptions {
    method?: string;
    status?: number;
    url?: string | RegExp;
    timeout?: number;
    intervals?: number[];
}

/**
 * Asserts that the page has made a network request matching the specified criteria.
 * Uses `page.requests()` with polling to wait for matching requests.
 *
 * **Limitations:**
 * - Only returns up to 100 most recent requests (Playwright limit)
 * - Requests may be garbage collected if not accessed promptly
 * - Collected requests may have limited information available
 *
 * @example
 * await expect(page).toHaveRequest({ url: /api\/users/ });
 * await expect(page).toHaveRequest({ method: 'POST', url: /api\/login/ });
 * await expect(page).toHaveRequest({ url: 'https://example.com/api', status: 200 });
 */
export async function toHaveRequest(
    this: ExpectMatcherState,
    page: Page,
    options: ToHaveRequestOptions = {}
) {
    const assertionName = 'toHaveRequest';
    const { method, status, url, timeout = this.timeout, intervals } = options;

    let matchedRequest: Request | undefined;
    let requests: Request[] = [];
    let pass = false;

    try {
        await expect
            .poll(
                async () => {
                    requests = await page.requests();

                    for (const request of requests) {
                        let matches = true;

                        // Match URL
                        if (url !== undefined) {
                            const requestUrl = request.url();
                            if (typeof url === 'string') {
                                if (!requestUrl.includes(url)) matches = false;
                            } else {
                                if (!url.test(requestUrl)) matches = false;
                            }
                        }

                        // Match method
                        if (matches && method !== undefined) {
                            if (request.method().toUpperCase() !== method.toUpperCase()) matches = false;
                        }

                        // Match status (requires response)
                        if (matches && status !== undefined) {
                            const response = await request.response();
                            if (!response || response.status() !== status) matches = false;
                        }

                        if (matches) {
                            matchedRequest = request;
                            return true;
                        }
                    }

                    return false;
                },
                { timeout, intervals }
            )
            .toBe(true);

        pass = true;
    } catch {
        pass = false;
    }

    const criteriaDesc = [
        url ? `URL matching ${url instanceof RegExp ? url : `"${url}"`}` : null,
        method ? `method "${method}"` : null,
        status ? `status ${status}` : null,
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
                `Expected: NOT to have request with ${criteriaDesc || 'any criteria'}\n` +
                `Received: found matching request: ${matchedRequest?.method()} ${matchedRequest?.url()}`
            );
        }
        return (
            this.utils.matcherHint(assertionName, undefined, undefined, {
                isNot: this.isNot,
            }) +
            '\n\n' +
            `Expected: request with ${criteriaDesc || 'any criteria'}\n` +
            `Received: no matching request found among ${requests.length} captured requests\n` +
            `\nNote: page.requests() only returns up to 100 most recent requests`
        );
    };

    return {
        pass,
        message,
        name: assertionName,
    };
}
