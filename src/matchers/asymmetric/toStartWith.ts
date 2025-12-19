
export function toStartWith(received: unknown, expected: string) {
  const pass = typeof received === 'string' && received.startsWith(expected);
  return {
    message: () => pass
      ? `expected ${received} not to start with ${expected}`
      : `expected ${received} to start with ${expected}`,
    pass,
  };
}
