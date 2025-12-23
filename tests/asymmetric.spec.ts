import { test, expect } from '@playwright/test';

test.describe('Asymmetric Matchers', () => {
  test('toStartWith', () => {
    expect({ name: 'John Doe' }).toEqual({
      name: expect.toStartWith('John')
    });
    expect({ name: 'Jane Doe' }).not.toEqual({
      name: expect.toStartWith('John')
    });
  });

  test('toEndWith', () => {
    expect({ file: 'image.png' }).toEqual({
      file: expect.toEndWith('.png')
    });
    expect({ file: 'image.jpg' }).not.toEqual({
      file: expect.toEndWith('.png')
    });
  });

  test('toBeUpperCase', () => {
    expect({ code: 'ABC' }).toEqual({
      code: expect.toBeUpperCase()
    });
    expect({ code: 'Abc' }).not.toEqual({
      code: expect.toBeUpperCase()
    });
    expect({ code: 'abc' }).not.toEqual({
      code: expect.toBeUpperCase()
    });
  });

  test('toBeLowerCase', () => {
    expect({ slug: 'some-slug' }).toEqual({
      slug: expect.toBeLowerCase()
    });
    expect({ slug: 'Some-Slug' }).not.toEqual({
      slug: expect.toBeLowerCase()
    });
    expect({ slug: 'SOME-SLUG' }).not.toEqual({
      slug: expect.toBeLowerCase()
    });
  });

  test('toBeKebabCase', () => {
    expect({ id: 'my-id' }).toEqual({ id: expect.toBeKebabCase() });
    expect({ id: 'my-long-id' }).toEqual({ id: expect.toBeKebabCase() });
    expect({ id: 'myId' }).not.toEqual({ id: expect.toBeKebabCase() });
    expect({ id: 'MyId' }).not.toEqual({ id: expect.toBeKebabCase() });
    expect({ id: 'my_id' }).not.toEqual({ id: expect.toBeKebabCase() });
  });

  test('toBeCamelCase', () => {
    expect({ prop: 'myProp' }).toEqual({ prop: expect.toBeCamelCase() });
    expect({ prop: 'myLongProp' }).toEqual({ prop: expect.toBeCamelCase() });
    expect({ prop: 'my-prop' }).not.toEqual({ prop: expect.toBeCamelCase() });
    expect({ prop: 'MyProp' }).not.toEqual({ prop: expect.toBeCamelCase() });
    expect({ prop: 'my_prop' }).not.toEqual({ prop: expect.toBeCamelCase() });
  });

  test('toBeSnakeCase', () => {
    expect({ key: 'my_key' }).toEqual({ key: expect.toBeSnakeCase() });
    expect({ key: 'my_long_key' }).toEqual({ key: expect.toBeSnakeCase() });
    expect({ key: 'my-key' }).not.toEqual({ key: expect.toBeSnakeCase() });
    expect({ key: 'myKey' }).not.toEqual({ key: expect.toBeSnakeCase() });
    expect({ key: 'MyKey' }).not.toEqual({ key: expect.toBeSnakeCase() });
  });

  test('toBePascalCase', () => {
    expect({ cls: 'MyClass' }).toEqual({ cls: expect.toBePascalCase() });
    expect({ cls: 'MyLongClass' }).toEqual({ cls: expect.toBePascalCase() });
    expect({ cls: 'myClass' }).not.toEqual({ cls: expect.toBePascalCase() });
    expect({ cls: 'my-class' }).not.toEqual({ cls: expect.toBePascalCase() });
    expect({ cls: 'my_class' }).not.toEqual({ cls: expect.toBePascalCase() });
  });

  test('toBeJSON', () => {
    expect({ val: '{"a":1}' }).toEqual({ val: expect.toBeJSON() });
    expect({ val: '{a:1}' }).not.toEqual({ val: expect.toBeJSON() });
  });

  test('toBeEmail', () => {
    expect({ email: 'user@example.com' }).toEqual({ email: expect.toBeEmail() });
    expect({ email: 'invalid' }).not.toEqual({ email: expect.toBeEmail() });
  });

  test('toBeURL', () => {
    expect({ url: 'https://example.com' }).toEqual({ url: expect.toBeURL() });
    expect({ url: 'invalid' }).not.toEqual({ url: expect.toBeURL() });
    expect({ url: 'https://example.com' }).toEqual({ url: expect.toBeURL({ protocol: 'https' }) });
    expect({ url: 'http://example.com' }).not.toEqual({ url: expect.toBeURL({ protocol: 'https' }) });
  });

  test('toBeUUID', () => {
    expect({ id: '123e4567-e89b-12d3-a456-426614174000' }).toEqual({ id: expect.toBeUUID() });
    expect({ id: 'not-uuid' }).not.toEqual({ id: expect.toBeUUID() });
  });

  test('toBeDateString', () => {
    expect({ date: '2023-01-01' }).toEqual({ date: expect.toBeDateString('YYYY-MM-DD') });
    expect({ date: '01/01/2023' }).not.toEqual({ date: expect.toBeDateString('YYYY-MM-DD') });
  });

  test('toBeISODate', () => {
    expect({ ts: '2023-01-01T00:00:00.000Z' }).toEqual({ ts: expect.toBeISODate() });
    expect({ ts: '2023-01-01' }).not.toEqual({ ts: expect.toBeISODate() });
  });

  test('toBeWithinRange', () => {
    expect({ count: 15 }).toEqual({ count: expect.toBeWithinRange(10, 20) });
    expect({ count: 5 }).not.toEqual({ count: expect.toBeWithinRange(10, 20) });
  });

  test.describe('Symmetric Usage', () => {
    test('String Casing Matchers', () => {
      expect('PascalCase').toBePascalCase();
      expect('camelCase').not.toBePascalCase();

      expect('camelCase').toBeCamelCase();
      expect('PascalCase').not.toBeCamelCase();

      expect('kebab-case').toBeKebabCase();
      expect('snake_case').not.toBeKebabCase();

      expect('snake_case').toBeSnakeCase();
      expect('kebab-case').not.toBeSnakeCase();

      expect('UPPER').toBeUpperCase();
      expect('Lower').not.toBeUpperCase();

      expect('lower').toBeLowerCase();
      expect('Upper').not.toBeLowerCase();
    });

    test('String Content Matchers', () => {
      expect('Hello World').toStartWith('Hello');
      expect('Hello World').not.toStartWith('World');

      expect('image.png').toEndWith('.png');
      expect('image.jpg').not.toEndWith('.png');

      expect('{"a":1}').toBeJSON();
      expect('{a:1}').not.toBeJSON();
    });

    test('Validation Matchers', () => {
      expect('test@example.com').toBeEmail();
      expect('invalid-email').not.toBeEmail();

      expect('https://example.com').toBeURL();
      expect('not-a-url').not.toBeURL();
      expect('https://example.com').toBeURL({ protocol: 'https' });
      expect('http://example.com').not.toBeURL({ protocol: 'https' });

      expect('79e17c3a-52d3-4613-b52b-7c5054b63374').toBeUUID();
      expect('not-uuid').not.toBeUUID();
    });

    test('Date Matchers', () => {
      expect('2023-01-01').toBeDateString('YYYY-MM-DD');
      expect('01/01/2023').not.toBeDateString('YYYY-MM-DD');

      expect('2023-01-01T00:00:00.000Z').toBeISODate();
      expect('2023-01-01').not.toBeISODate();
    });

    test('Number Matchers', () => {
      expect(15).toBeWithinRange(10, 20);
      expect(5).not.toBeWithinRange(10, 20);
    });
  });
});

