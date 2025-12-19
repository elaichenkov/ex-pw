
export function toEndWith(received: unknown, expected: string) {
  const pass = typeof received === 'string' && received.endsWith(expected);
  return {
    message: () => pass
      ? `expected ${received} not to end with ${expected}`
      : `expected ${received} to end with ${expected}`,
    pass,
  };
}
