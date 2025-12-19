# xpecto

Extended Playwright expect matchers with auto-waiting and improved developer
experience.

[![npm version](https://badge.fury.io/js/xpecto.svg)](https://www.npmjs.com/package/xpecto)

## Installation

```bash
npm install -D xpecto
```

## Setup

### Option 1: Extend in Playwright Config (Recommended)

Update your `playwright.config.ts`:

```typescript
import { expect } from "@playwright/test";
import xpecto from "xpecto";

// Extend expect globally
expect.extend(xpecto);
```

### Option 2: Import Individual Matchers

```typescript
import { expect } from "@playwright/test";
import { toBeClickable, toBeRequired, toMatchSchema } from "xpecto";

expect.extend({ toBeClickable, toBeRequired, toMatchSchema });
```

## Locator Matchers

### `toBeClickable({ timeout? })`

Asserts that an element is in a clickable state (visible, enabled, and not
obscured).

```typescript
await expect(page.getByRole("button")).toBeClickable();
await expect(page.getByRole("button")).toBeClickable({ timeout: 5000 });
await expect(page.getByRole("button")).not.toBeClickable(); // disabled button
```

### `toBeCheckable({ timeout? })`

Asserts that a checkbox or radio is in a checkable state.

```typescript
await expect(page.getByRole("checkbox")).toBeCheckable();
await expect(page.getByRole("radio")).toBeCheckable();
```

### `toBeRequired({ timeout?, intervals? })`

Asserts that a form element is required.

```typescript
await expect(page.getByLabel("Email")).toBeRequired();
await expect(page.getByLabel("Optional")).not.toBeRequired();
```

### `toBeInvalid({ timeout?, intervals? })`

Asserts that a form element is in an invalid validation state.

```typescript
await expect(page.getByLabel("Email")).toBeInvalid();
```

### `toBeValid({ timeout?, intervals? })`

Asserts that a form element is in a valid validation state.

```typescript
await expect(page.getByLabel("Email")).toBeValid();
```

### `toHaveCountGreaterThan(count, { timeout?, intervals? })`

### `toHaveCountGreaterThanOrEqual(count, { timeout?, intervals? })`

### `toHaveCountLessThan(count, { timeout?, intervals? })`

### `toHaveCountLessThanOrEqual(count, { timeout?, intervals? })`

```typescript
await expect(page.locator(".item")).toHaveCountGreaterThan(3);
await expect(page.locator(".item")).toHaveCountGreaterThanOrEqual(5);
await expect(page.locator(".item")).toHaveCountLessThan(10);
await expect(page.locator(".item")).toHaveCountLessThanOrEqual(5);
```

### `toHaveWidth(expected, { timeout?, intervals? })`

### `toHaveHeight(expected, { timeout?, intervals? })`

### `toHaveSize(width, height, { timeout?, intervals? })`

```typescript
await expect(page.locator("#box")).toHaveWidth(100);
await expect(page.locator("#box")).toHaveHeight(50);
await expect(page.locator("#box")).toHaveSize(100, 50);
```

### `toHaveLoadedImage({ timeout?, intervals? })`

Asserts that an `<img>` element has successfully loaded its image.

```typescript
await expect(page.locator("img#logo")).toHaveLoadedImage();
await expect(page.locator("img#broken")).not.toHaveLoadedImage();
```

## Page Matchers

### `toHaveCookie(name, { value?, domain?, timeout?, intervals? })`

Asserts that a cookie exists with optional value/domain matching.

```typescript
await expect(page).toHaveCookie("session");
await expect(page).toHaveCookie("session", { value: "abc123" });
await expect(page).toHaveCookie("session", { value: /^abc/ });
await expect(page).toHaveCookie("auth", { domain: "example.com" });
```

### `toHaveLocalStorage(key, { value?, timeout?, intervals? })`

Asserts that localStorage contains a key with optional value matching.

```typescript
await expect(page).toHaveLocalStorage("authToken");
await expect(page).toHaveLocalStorage("settings", {
    value: { theme: "dark" },
});
```

### `toHaveSessionStorage(key, { value?, timeout?, intervals? })`

Asserts that sessionStorage contains a key with optional value matching.

```typescript
await expect(page).toHaveSessionStorage("tempData");
await expect(page).toHaveSessionStorage("cart", {
    value: expect.arrayContaining([{ id: 1 }]),
});
```

### `toHaveClipboardText(expected, { timeout?, intervals? })`

Asserts that the clipboard contains the expected text.

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

### `toHaveRequest({ url?, method?, status?, timeout?, intervals? })`

Asserts that the page has made a network request matching the criteria.

> **Limitations:** Only returns up to 100 most recent requests. Requests may be
> garbage collected if not accessed promptly.

```typescript
await expect(page).toHaveRequest({ url: /api\/users/ });
await expect(page).toHaveRequest({ method: "POST", url: /api\/login/ });
await expect(page).toHaveRequest({ url: "example.com/api", status: 200 });
```

### `toHaveConsoleMessage({ type?, text?, timeout?, intervals? })`

Asserts that the page has a console message matching the criteria.

> **Limitations:** Only returns up to 200 most recent console messages.

```typescript
await expect(page).toHaveConsoleMessage({ text: "Hello" });
await expect(page).toHaveConsoleMessage({ type: "error" });
await expect(page).toHaveConsoleMessage({
    type: "warning",
    text: /deprecated/,
});
```

### `toHavePageError({ message?, name?, timeout?, intervals? })`

Asserts that the page has encountered a JavaScript error.

> **Limitations:** Only returns up to 200 most recent errors. Only captures
> uncaught exceptions.

```typescript
await expect(page).toHavePageError();
await expect(page).toHavePageError({ message: "undefined is not a function" });
await expect(page).toHavePageError({ message: /TypeError/ });
await expect(page).not.toHavePageError(); // No errors expected
```

### `toHaveNoErrors({ ignore? })`

For use with soft assertions - checks for test errors.

```typescript
await expect.soft(page.getByTestId("status")).toHaveText("Success");
await expect.soft(page.getByTestId("eta")).toHaveText("1 day");
expect(test).toHaveNoErrors();

// Ignore specific errors
expect(test).toHaveNoErrors({ ignore: /Warning:/ });
```

## General Matchers

### `toBeSorted({ descending?, key?, compareAsNumbers?, useTextContent?, timeout?, intervals? })`

Asserts that an array or locator elements are sorted.

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

**Options:**

- `descending` - Sort in descending order
- `key` - For arrays of objects, extract value using key or function
- `compareAsNumbers` - Parse text as numbers for comparison (useful for prices
  like "$10")
- `useTextContent` - Use `allTextContents()` instead of `allInnerTexts()`
  (includes hidden text)

## API Matchers

### `toMatchJSON(expected)`

Asserts that the response body matches expected JSON. Supports asymmetric
matchers for flexible field validation.

```typescript
const response = await request.get("/api/user");

// Exact match
await expect(response).toMatchJSON({ id: 1, name: "John" });

// Partial match with Playwright's built-in matchers
await expect(response).toMatchJSON(expect.objectContaining({ id: 1 }));

// With xpecto asymmetric matchers
await expect(response).toMatchJSON({
    id: expect.toBeUUID(),
    email: expect.toBeEmail(),
    createdAt: expect.toBeISODate(),
    name: expect.toStartWith("John"),
});
```

### `toMatchSchema(schema)`

Validates response body against a Zod schema.

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

### `toHaveStatus(expected)`

Checks HTTP status code or range.

- `expected` - A number for exact match, or `{ min, max }` for range

```typescript
await expect(response).toHaveStatus(200);
await expect(response).toHaveStatus({ min: 200, max: 299 }); // Any 2xx
```

### `toHaveHeader(name, { value? })`

Checks for HTTP header existence and optional value.

```typescript
await expect(response).toHaveHeader("content-type");
await expect(response).toHaveHeader("content-type", {
    value: "application/json",
});
await expect(response).toHaveHeader("content-type", { value: /json/ });
```

### `toRespondWithin(timeout)`

Asserts that a request completes within the specified time in milliseconds.

```typescript
// Don't await the request - pass the promise directly
const request = page.request.get("/api/fast");
await expect(request).toRespondWithin(1000);
```

## Asymmetric Matchers

Asymmetric matchers can be used both in `expect().toEqual()` assertions and as
standalone matchers.

> **Note:** To use asymmetric matchers like `expect.toBeEmail()`, you need to
> import `expect` directly from xpecto:
>
> ```typescript
> import { expect } from "xpecto";
> ```

### String Matchers

#### `toStartWith(expected)`

#### `toEndWith(expected)`

#### `toBeUpperCase()`

#### `toBeLowerCase()`

```typescript
// As asymmetric matchers
expect(data).toEqual({
    name: expect.toStartWith("John"),
    email: expect.toEndWith("@example.com"),
    code: expect.toBeUpperCase(),
    slug: expect.toBeLowerCase(),
});

// As standalone matchers
expect("JohnDoe").toStartWith("John");
expect("john@example.com").toEndWith("@example.com");
expect("HELLO").toBeUpperCase();
expect("hello").toBeLowerCase();
```

### Case Format Matchers

#### `toBePascalCase()`

#### `toBeCamelCase()`

#### `toBeKebabCase()`

#### `toBeSnakeCase()`

```typescript
// Asymmetric usage
expect(data).toEqual({
    className: expect.toBePascalCase(), // "MyClass"
    methodName: expect.toBeCamelCase(), // "myMethod"
    cssClass: expect.toBeKebabCase(), // "my-class"
    envVar: expect.toBeSnakeCase(), // "my_variable"
});

// Standalone usage
expect("MyClassName").toBePascalCase();
expect("myMethodName").toBeCamelCase();
expect("my-css-class").toBeKebabCase();
expect("my_variable_name").toBeSnakeCase();
```

### Validation Matchers

#### `toBeEmail()`

#### `toBeURL({ protocol? })`

#### `toBeUUID(version?)`

#### `toBeJSON()`

```typescript
// Email validation
expect("user@example.com").toBeEmail();
expect(data).toEqual({ email: expect.toBeEmail() });

// URL validation
expect("https://example.com").toBeURL();
expect("https://example.com").toBeURL({ protocol: "https" });

// UUID validation
expect("550e8400-e29b-41d4-a716-446655440000").toBeUUID();
expect(id).toBeUUID("v4");

// JSON string validation
expect('{"key": "value"}').toBeJSON();
```

### Date Matchers

#### `toBeISODate()`

#### `toBeDateString(format)`

```typescript
// ISO date validation
expect("2024-01-15T10:30:00.000Z").toBeISODate();

// Custom date format
expect("2024-01-15").toBeDateString("YYYY-MM-DD");
expect("01/15/2024").toBeDateString("MM/DD/YYYY");
```

### Number Matchers

#### `toBeWithinRange(min, max)`

```typescript
// Range validation
expect(5).toBeWithinRange(1, 10);
expect(response).toEqual({
    count: expect.toBeWithinRange(0, 100),
});
```

## License

MIT
