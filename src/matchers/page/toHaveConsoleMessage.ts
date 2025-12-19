import { expect } from '@playwright/test';
import type { Page, ExpectMatcherState, ConsoleMessage } from '@playwright/test';

type ConsoleMessageType = 'log' | 'debug' | 'info' | 'error' | 'warning' | 'dir' | 'dirxml' | 'table' | 'trace' | 'clear' | 'startGroup' | 'startGroupCollapsed' | 'endGroup' | 'assert' | 'profile' | 'profileEnd' | 'count' | 'timeEnd';

interface ToHaveConsoleMessageOptions {
    type?: ConsoleMessageType;
    text?: string | RegExp;
    timeout?: number;
    intervals?: number[];
}

/**
 * Asserts that the page has a console message matching the specified criteria.
 * Uses `page.consoleMessages()` with polling to wait for matching messages.
 *
 * **Limitations:**
 * - Only returns up to 200 most recent console messages (Playwright limit)
 *
 * @example
 * await expect(page).toHaveConsoleMessage({ text: 'Hello' });
 * await expect(page).toHaveConsoleMessage({ type: 'error' });
 * await expect(page).toHaveConsoleMessage({ type: 'warning', text: /deprecated/ });
 */
export async function toHaveConsoleMessage(
    this: ExpectMatcherState,
    page: Page,
    options: ToHaveConsoleMessageOptions = {}
) {
    const assertionName = 'toHaveConsoleMessage';
    const { type, text, timeout = this.timeout, intervals } = options;

    let matchedMessage: ConsoleMessage | undefined;
    let messages: ConsoleMessage[] = [];
    let pass = false;

    try {
        await expect
            .poll(
                async () => {
                    messages = await page.consoleMessages();

                    matchedMessage = messages.find((msg) => {
                        // Match type
                        if (type !== undefined) {
                            if (msg.type() !== type) return false;
                        }

                        // Match text
                        if (text !== undefined) {
                            const msgText = msg.text();
                            if (typeof text === 'string') {
                                if (!msgText.includes(text)) return false;
                            } else {
                                if (!text.test(msgText)) return false;
                            }
                        }

                        return true;
                    });

                    return matchedMessage !== undefined;
                },
                { timeout, intervals }
            )
            .toBe(true);

        pass = true;
    } catch {
        pass = false;
    }

    const criteriaDesc = [
        type ? `type "${type}"` : null,
        text ? `text matching ${text instanceof RegExp ? text : `"${text}"`}` : null,
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
                `Expected: NOT to have console message with ${criteriaDesc || 'any criteria'}\n` +
                `Received: found matching message: "${matchedMessage?.text()}"`
            );
        }

        const capturedMessages = messages
            .slice(0, 5)
            .map((m) => `  [${m.type()}] ${m.text().substring(0, 50)}${m.text().length > 50 ? '...' : ''}`)
            .join('\n');

        return (
            this.utils.matcherHint(assertionName, undefined, undefined, {
                isNot: this.isNot,
            }) +
            '\n\n' +
            `Expected: console message with ${criteriaDesc || 'any criteria'}\n` +
            `Received: no matching message found among ${messages.length} captured messages\n` +
            (capturedMessages ? `\nRecent messages:\n${capturedMessages}` : '') +
            `\n\nNote: page.consoleMessages() only returns up to 200 most recent messages`
        );
    };

    return {
        pass,
        message,
        name: assertionName,
    };
}
