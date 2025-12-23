# ex-pw

Extended Playwright expect matchers with auto-waiting and improved developer
experience.

[![npm version](https://badge.fury.io/js/ex-pw.svg)](https://www.npmjs.com/package/ex-pw)

## Installation

```bash
npm install -D ex-pw
```

## Setup

### Option 1: Extend in Playwright Config (Recommended)

Update your `playwright.config.ts`:

```typescript
import { expect } from "@playwright/test";
import exPw from "ex-pw";

// Extend expect globally
expect.extend(exPw);
```

### Option 2: Import Individual Matchers

```typescript
import { expect } from "@playwright/test";
import { toBeClickable, toBeRequired, toMatchSchema } from "ex-pw";

expect.extend({ toBeClickable, toBeRequired, toMatchSchema });
```

---

## Locator Matchers

### toBeClickable

Asserts that an element is in a clickable state (visible, enabled, and not
obscured).

| Option    | Type     | Description                |
| --------- | -------- | -------------------------- |
| `timeout` | `number` | Maximum time to wait in ms |

```typescript
await expect(page.getByRole("button")).toBeClickable();
await expect(page.getByRole("button")).toBeClickable({ timeout: 5000 });
await expect(page.getByRole("button")).not.toBeClickable(); // disabled button
```

### toBeCheckable

Asserts that a checkbox or radio is in a checkable state.

| Option    | Type     | Description                |
| --------- | -------- | -------------------------- |
| `timeout` | `number` | Maximum time to wait in ms |

```typescript
await expect(page.getByRole("checkbox")).toBeCheckable();
await expect(page.getByRole("radio")).toBeCheckable();
```

### toBeRequired

Asserts that a form element is required.

| Option      | Type       | Description                |
| ----------- | ---------- | -------------------------- |
| `timeout`   | `number`   | Maximum time to wait in ms |
| `intervals` | `number[]` | Retry intervals in ms      |

```typescript
await expect(page.getByLabel("Email")).toBeRequired();
await expect(page.getByLabel("Optional")).not.toBeRequired();
```

### toBeInvalid

Asserts that a form element is in an invalid validation state.

| Option      | Type       | Description                |
| ----------- | ---------- | -------------------------- |
| `timeout`   | `number`   | Maximum time to wait in ms |
| `intervals` | `number[]` | Retry intervals in ms      |

```typescript
await expect(page.getByLabel("Email")).toBeInvalid();
```

### toBeValid

Asserts that a form element is in a valid validation state.

| Option      | Type       | Description                |
| ----------- | ---------- | -------------------------- |
| `timeout`   | `number`   | Maximum time to wait in ms |
| `intervals` | `number[]` | Retry intervals in ms      |

```typescript
await expect(page.getByLabel("Email")).toBeValid();
```

### toHaveCountGreaterThan

Asserts that a locator matches more than the specified number of elements.

| Option      | Type       | Description                    |
| ----------- | ---------- | ------------------------------ |
| `count`     | `number`   | The count threshold (required) |
| `timeout`   | `number`   | Maximum time to wait in ms     |
| `intervals` | `number[]` | Retry intervals in ms          |

```typescript
await expect(page.locator(".item")).toHaveCountGreaterThan(3);
```

### toHaveCountGreaterThanOrEqual

Asserts that a locator matches at least the specified number of elements.

| Option      | Type       | Description                    |
| ----------- | ---------- | ------------------------------ |
| `count`     | `number`   | The count threshold (required) |
| `timeout`   | `number`   | Maximum time to wait in ms     |
| `intervals` | `number[]` | Retry intervals in ms          |

```typescript
await expect(page.locator(".item")).toHaveCountGreaterThanOrEqual(5);
```

### toHaveCountLessThan

Asserts that a locator matches fewer than the specified number of elements.

| Option      | Type       | Description                    |
| ----------- | ---------- | ------------------------------ |
| `count`     | `number`   | The count threshold (required) |
| `timeout`   | `number`   | Maximum time to wait in ms     |
| `intervals` | `number[]` | Retry intervals in ms          |

```typescript
await expect(page.locator(".item")).toHaveCountLessThan(10);
```

### toHaveCountLessThanOrEqual

Asserts that a locator matches at most the specified number of elements.

| Option      | Type       | Description                    |
| ----------- | ---------- | ------------------------------ |
| `count`     | `number`   | The count threshold (required) |
| `timeout`   | `number`   | Maximum time to wait in ms     |
| `intervals` | `number[]` | Retry intervals in ms          |

```typescript
await expect(page.locator(".item")).toHaveCountLessThanOrEqual(5);
```

### toHaveWidth

Asserts that an element has the expected width.

| Option      | Type       | Description                |
| ----------- | ---------- | -------------------------- |
| `expected`  | `number`   | Expected width in pixels   |
| `timeout`   | `number`   | Maximum time to wait in ms |
| `intervals` | `number[]` | Retry intervals in ms      |

```typescript
await expect(page.locator("#box")).toHaveWidth(100);
```

### toHaveHeight

Asserts that an element has the expected height.

| Option      | Type       | Description                |
| ----------- | ---------- | -------------------------- |
| `expected`  | `number`   | Expected height in pixels  |
| `timeout`   | `number`   | Maximum time to wait in ms |
| `intervals` | `number[]` | Retry intervals in ms      |

```typescript
await expect(page.locator("#box")).toHaveHeight(50);
```

### toHaveSize

Asserts that an element has the expected width and height.

| Option      | Type       | Description                |
| ----------- | ---------- | -------------------------- |
| `width`     | `number`   | Expected width in pixels   |
| `height`    | `number`   | Expected height in pixels  |
| `timeout`   | `number`   | Maximum time to wait in ms |
| `intervals` | `number[]` | Retry intervals in ms      |

```typescript
await expect(page.locator("#box")).toHaveSize(100, 50);
```

### toHaveLoadedImage

Asserts that an `<img>` element has successfully loaded its image.

| Option      | Type       | Description                |
| ----------- | ---------- | -------------------------- |
| `timeout`   | `number`   | Maximum time to wait in ms |
| `intervals` | `number[]` | Retry intervals in ms      |

```typescript
await expect(page.locator("img#logo")).toHaveLoadedImage();
await expect(page.locator("img#broken")).not.toHaveLoadedImage();
```

---

## Page Matchers

### toHaveCookie

Asserts that a cookie exists with optional value/domain matching.

| Option    | Type               | Description                |
| --------- | ------------------ | -------------------------- |
| `name`    | `string`           | Cookie name (required)     |
| `value`   | `string \| RegExp` | Expected cookie value      |
| `domain`  | `string`           | Expected cookie domain     |
| `timeout` | `number`           | Maximum time to wait in ms |

```typescript
await expect(page).toHaveCookie("session");
await expect(page).toHaveCookie("session", { value: "abc123" });
await expect(page).toHaveCookie("session", { value: /^abc/ });
await expect(page).toHaveCookie("auth", { domain: "example.com" });
```

### toHaveLocalStorage

Asserts that localStorage contains a key with optional value matching.

| Option      | Type       | Description                     |
| ----------- | ---------- | ------------------------------- |
| `key`       | `string`   | Storage key (required)          |
| `value`     | `any`      | Expected value (parsed as JSON) |
| `timeout`   | `number`   | Maximum time to wait in ms      |
| `intervals` | `number[]` | Retry intervals in ms           |

```typescript
await expect(page).toHaveLocalStorage("authToken");
await expect(page).toHaveLocalStorage("settings", {
    value: { theme: "dark" },
});
```

### toHaveSessionStorage

Asserts that sessionStorage contains a key with optional value matching.

| Option      | Type       | Description                     |
| ----------- | ---------- | ------------------------------- |
| `key`       | `string`   | Storage key (required)          |
| `value`     | `any`      | Expected value (parsed as JSON) |
| `timeout`   | `number`   | Maximum time to wait in ms      |
| `intervals` | `number[]` | Retry intervals in ms           |

```typescript
await expect(page).toHaveSessionStorage("tempData");
await expect(page).toHaveSessionStorage("cart", {
    value: expect.arrayContaining([{ id: 1 }]),
});
```

### toHaveClipboardText

Asserts that the clipboard contains the expected text.

| Option      | Type               | Description                |
| ----------- | ------------------ | -------------------------- |
| `expected`  | `string \| RegExp` | Expected clipboard text    |
| `timeout`   | `number`           | Maximum time to wait in ms |
| `intervals` | `number[]`         | Retry intervals in ms      |

> **Note:** Requires `permissions: ["clipboard-read"]` in your Playwright
> config.

```typescript
// playwright.config.ts
export default defineConfig({
    use: {
        permissions: ["clipboard-read"],
    },
});

// In tests
await expect(page).toHaveClipboardText("copied text");
await expect(page).toHaveClipboardText(/pattern/);
```

### toHaveRequest

Asserts that the page has made a network request matching the criteria.

| Option      | Type               | Description                |
| ----------- | ------------------ | -------------------------- |
| `url`       | `string \| RegExp` | URL pattern to match       |
| `method`    | `string`           | HTTP method to match       |
| `status`    | `number`           | Expected response status   |
| `timeout`   | `number`           | Maximum time to wait in ms |
| `intervals` | `number[]`         | Retry intervals in ms      |

> **Limitations:** Only returns up to 100 most recent requests. Requests may be
> garbage collected if not accessed promptly.

```typescript
await expect(page).toHaveRequest({ url: /api\/users/ });
await expect(page).toHaveRequest({ method: "POST", url: /api\/login/ });
await expect(page).toHaveRequest({ url: "example.com/api", status: 200 });
```

### toHaveConsoleMessage

Asserts that the page has a console message matching the criteria.

| Option      | Type               | Description                |
| ----------- | ------------------ | -------------------------- |
| `type`      | `string`           | Console message type       |
| `text`      | `string \| RegExp` | Message text pattern       |
| `timeout`   | `number`           | Maximum time to wait in ms |
| `intervals` | `number[]`         | Retry intervals in ms      |

> **Limitations:** Only returns up to 200 most recent console messages.

```typescript
await expect(page).toHaveConsoleMessage({ text: "Hello" });
await expect(page).toHaveConsoleMessage({ type: "error" });
await expect(page).toHaveConsoleMessage({
    type: "warning",
    text: /deprecated/,
});
```

### toHavePageError

Asserts that the page has encountered a JavaScript error.

| Option      | Type               | Description                |
| ----------- | ------------------ | -------------------------- |
| `message`   | `string \| RegExp` | Error message pattern      |
| `name`      | `string`           | Error name to match        |
| `timeout`   | `number`           | Maximum time to wait in ms |
| `intervals` | `number[]`         | Retry intervals in ms      |

> **Limitations:** Only returns up to 200 most recent errors. Only captures
> uncaught exceptions.

```typescript
await expect(page).toHavePageError();
await expect(page).toHavePageError({ message: "undefined is not a function" });
await expect(page).toHavePageError({ message: /TypeError/ });
await expect(page).not.toHavePageError(); // No errors expected
```

### toHaveNoErrors

For use with soft assertions - checks for test errors.

| Option   | Type     | Description                  |
| -------- | -------- | ---------------------------- |
| `ignore` | `RegExp` | Pattern for errors to ignore |

```typescript
await expect.soft(page.getByTestId("status")).toHaveText("Success");
await expect.soft(page.getByTestId("eta")).toHaveText("1 day");
expect(test).toHaveNoErrors();

// Ignore specific errors
expect(test).toHaveNoErrors({ ignore: /Warning:/ });
```

---

## General Matchers

### toBeSorted

Asserts that an array or locator elements are sorted.

| Option             | Type                 | Description                          |
| ------------------ | -------------------- | ------------------------------------ |
| `descending`       | `boolean`            | Sort in descending order             |
| `key`              | `string \| Function` | Extract value from objects           |
| `compareAsNumbers` | `boolean`            | Parse text as numbers for comparison |
| `useTextContent`   | `boolean`            | Use `allTextContents()` instead      |
| `timeout`          | `number`             | Maximum time to wait in ms           |
| `intervals`        | `number[]`           | Retry intervals in ms                |

```typescript
// With arrays
await expect([1, 2, 3]).toBeSorted();
await expect(["c", "b", "a"]).toBeSorted({ descending: true });
await expect([{ val: 1 }, { val: 2 }]).toBeSorted({ key: "val" });

// With Locators - extracts text from elements
await expect(page.locator(".item")).toBeSorted();
await expect(page.locator(".price")).toBeSorted({ compareAsNumbers: true });
await expect(page.locator(".name")).toBeSorted({ descending: true });
```

---

## API Matchers

### toMatchJSON

Asserts that the response body matches expected JSON. Supports asymmetric
matchers for flexible field validation.

| Option     | Type  | Description              |
| ---------- | ----- | ------------------------ |
| `expected` | `any` | Expected JSON (required) |

```typescript
const response = await request.get("/api/user");

// Exact match
await expect(response).toMatchJSON({ id: 1, name: "John" });

// Partial match with Playwright's built-in matchers
await expect(response).toMatchJSON(expect.objectContaining({ id: 1 }));

// With ex-pw asymmetric matchers
await expect(response).toMatchJSON({
    id: expect.toBeUUID(),
    email: expect.toBeEmail(),
    createdAt: expect.toBeISODate(),
    name: expect.toStartWith("John"),
});
```

### toMatchSchema

Validates response body against a Zod schema.

| Option   | Type        | Description           |
| -------- | ----------- | --------------------- |
| `schema` | `ZodSchema` | Zod schema (required) |

```typescript
import { z } from "zod";

const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
});

const response = await request.get("/api/user");
await expect(response).toMatchSchema(UserSchema);
```

### toHaveStatus

Checks HTTP status code or range.

| Option     | Type                     | Description                     |
| ---------- | ------------------------ | ------------------------------- |
| `expected` | `number \| { min, max }` | Status code or range (required) |

```typescript
await expect(response).toHaveStatus(200);
await expect(response).toHaveStatus({ min: 200, max: 299 }); // Any 2xx
```

### toHaveHeader

Checks for HTTP header existence and optional value.

| Option  | Type               | Description            |
| ------- | ------------------ | ---------------------- |
| `name`  | `string`           | Header name (required) |
| `value` | `string \| RegExp` | Expected header value  |

```typescript
await expect(response).toHaveHeader("content-type");
await expect(response).toHaveHeader("content-type", {
    value: "application/json",
});
await expect(response).toHaveHeader("content-type", { value: /json/ });
```

### toRespondWithin

Asserts that a request completes within the specified time.

| Option    | Type     | Description             |
| --------- | -------- | ----------------------- |
| `timeout` | `number` | Max response time in ms |

```typescript
// Don't await the request - pass the promise directly
const request = page.request.get("/api/fast");
await expect(request).toRespondWithin(1000);
```

---

## Asymmetric Matchers

Asymmetric matchers can be used both in `expect().toEqual()` assertions and as
standalone matchers.

> **Note:** To use asymmetric matchers like `expect.toBeEmail()`, you need to
> import `expect` directly from ex-pw:
>
> ```typescript
> import { expect } from "ex-pw";
> ```

### String Matchers

#### toStartWith

Asserts that a string starts with the expected prefix.

```typescript
expect("JohnDoe").toStartWith("John");
expect(data).toEqual({ name: expect.toStartWith("John") });
```

#### toEndWith

Asserts that a string ends with the expected suffix.

```typescript
expect("john@example.com").toEndWith("@example.com");
expect(data).toEqual({ email: expect.toEndWith("@example.com") });
```

#### toBeUpperCase

Asserts that a string is entirely uppercase.

```typescript
expect("HELLO").toBeUpperCase();
expect(data).toEqual({ code: expect.toBeUpperCase() });
```

#### toBeLowerCase

Asserts that a string is entirely lowercase.

```typescript
expect("hello").toBeLowerCase();
expect(data).toEqual({ slug: expect.toBeLowerCase() });
```

### Case Format Matchers

#### toBePascalCase

Asserts that a string is in PascalCase format (e.g., `MyClassName`).

```typescript
expect("MyClassName").toBePascalCase();
expect(data).toEqual({ className: expect.toBePascalCase() });
```

#### toBeCamelCase

Asserts that a string is in camelCase format (e.g., `myMethodName`).

```typescript
expect("myMethodName").toBeCamelCase();
expect(data).toEqual({ methodName: expect.toBeCamelCase() });
```

#### toBeKebabCase

Asserts that a string is in kebab-case format (e.g., `my-css-class`).

```typescript
expect("my-css-class").toBeKebabCase();
expect(data).toEqual({ cssClass: expect.toBeKebabCase() });
```

#### toBeSnakeCase

Asserts that a string is in snake_case format (e.g., `my_variable_name`).

```typescript
expect("my_variable_name").toBeSnakeCase();
expect(data).toEqual({ envVar: expect.toBeSnakeCase() });
```

### Validation Matchers

#### toBeEmail

Asserts that a string is a valid email address.

```typescript
expect("user@example.com").toBeEmail();
expect(data).toEqual({ email: expect.toBeEmail() });
```

#### toBeURL

Asserts that a string is a valid URL.

| Option     | Type     | Description                     |
| ---------- | -------- | ------------------------------- |
| `protocol` | `string` | Required protocol (e.g., https) |

```typescript
expect("https://example.com").toBeURL();
expect("https://example.com").toBeURL({ protocol: "https" });
```

#### toBeUUID

Asserts that a string is a valid UUID.

| Option    | Type     | Description               |
| --------- | -------- | ------------------------- |
| `version` | `string` | UUID version (e.g., "v4") |

```typescript
expect("550e8400-e29b-41d4-a716-446655440000").toBeUUID();
expect(id).toBeUUID("v4");
```

#### toBeJSON

Asserts that a string is valid JSON.

```typescript
expect('{"key": "value"}').toBeJSON();
```

### Date Matchers

#### toBeISODate

Asserts that a string is a valid ISO 8601 date.

```typescript
expect("2024-01-15T10:30:00.000Z").toBeISODate();
```

#### toBeDateString

Asserts that a string matches a custom date format.

| Option   | Type     | Description                    |
| -------- | -------- | ------------------------------ |
| `format` | `string` | Date format pattern (required) |

```typescript
expect("2024-01-15").toBeDateString("YYYY-MM-DD");
expect("01/15/2024").toBeDateString("MM/DD/YYYY");
```

### Number Matchers

#### toBeWithinRange

Asserts that a number is within the specified range (inclusive).

| Option | Type     | Description              |
| ------ | -------- | ------------------------ |
| `min`  | `number` | Minimum value (required) |
| `max`  | `number` | Maximum value (required) |

```typescript
expect(5).toBeWithinRange(1, 10);
expect(response).toEqual({ count: expect.toBeWithinRange(0, 100) });
```

---

## License

MIT
