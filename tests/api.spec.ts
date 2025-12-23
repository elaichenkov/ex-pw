import { test, expect as playwrightExpect, APIResponse } from '@playwright/test';
import { z } from 'zod';
import { expect } from '../src';

test.describe('API Matchers', () => {
  test('toMatchJSON works with exact match', async () => {
    const mockResponse = {
      json: async () => ({ id: 1, name: 'Test' }),
      status: () => 200,
      headers: () => ({ 'content-type': 'application/json' })
    } as unknown as APIResponse;

    await expect(mockResponse).toMatchJSON({ id: 1, name: 'Test' });
    await expect(mockResponse).not.toMatchJSON({ id: 2 });
  });

  test('toMatchJSON works with Playwright asymmetric matchers', async () => {
    const mockResponse = {
      json: async () => ({ id: 1, name: 'Test', items: [1, 2, 3] }),
    } as unknown as APIResponse;

    await expect(mockResponse).toMatchJSON(expect.objectContaining({ id: 1 }));
    await expect(mockResponse).toMatchJSON({
      id: expect.any(Number),
      name: expect.any(String),
      items: expect.arrayContaining([1, 2]),
    });
  });

  test('toMatchJSON works with exPw asymmetric matchers', async () => {
    const mockResponse = {
      json: async () => ({
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'john@example.com',
        createdAt: '2024-01-15T10:30:00.000Z',
        name: 'JohnDoe',
        status: 'ACTIVE',
        slug: 'user-profile',
      }),
    } as unknown as APIResponse;

    await expect(mockResponse).toMatchJSON({
      id: expect.toBeUUID(),
      email: expect.toBeEmail(),
      createdAt: expect.toBeISODate(),
      name: expect.toStartWith('John'),
      status: expect.toBeUpperCase(),
      slug: expect.toBeKebabCase(),
    });
  });

  test('toMatchJSON fails with non-matching asymmetric matchers', async () => {
    const mockResponse = {
      json: async () => ({
        email: 'not-an-email',
      }),
    } as unknown as APIResponse;

    await expect(mockResponse).not.toMatchJSON({
      email: expect.toBeEmail(),
    });
  });

  test('toMatchSchema works', async () => {
    const mockResponse = {
      json: async () => ({ id: 1, name: 'Test', email: 'test@example.com' }),
    } as unknown as APIResponse;

    const schema = z.object({
      id: z.number(),
      name: z.string(),
      email: z.string().email()
    });

    await expect(mockResponse).toMatchSchema(schema);
  });

  test('toHaveStatus works', async () => {
    const mockResponse = {
      status: () => 200
    } as unknown as APIResponse;

    await expect(mockResponse).toHaveStatus(200);
    await expect(mockResponse).toHaveStatus({ min: 200, max: 299 });
    await expect(mockResponse).not.toHaveStatus(404);
  });

  test('toHaveHeader works', async () => {
    const mockResponse = {
      headers: () => ({ 'content-type': 'application/json; charset=utf-8' })
    } as unknown as APIResponse;

    await expect(mockResponse).toHaveHeader('content-type');
    await expect(mockResponse).toHaveHeader('content-type', { value: /json/ });
    await expect(mockResponse).not.toHaveHeader('x-custom-header');
  });

  test.describe('toRespondWithin', () => {
    test('passes when function responds within time', async () => {
      const fastFn = async () => {
        await new Promise(r => setTimeout(r, 50));
        return {} as any;
      };
      await expect(fastFn).toRespondWithin(200);
    });

    test('fails when function checks out of time', async () => {
      const slowFn = async () => {
        await new Promise(r => setTimeout(r, 300));
        return {} as any;
      };
      // We expect it to FAIL to respond within 100ms
      await expect(slowFn).not.toRespondWithin(100);
    });

    test('passes when promise resolves within time', async () => {
      const p = new Promise<any>(r => setTimeout(r, 50));
      await expect(p).toRespondWithin(200);
    });
  });
});

