
export function toBeSnakeCase(received: unknown) {
  const pass = typeof received === 'string' && /^[a-z0-9]+(_[a-z0-9]+)*$/.test(received);
  return {
    message: () => pass
      ? `expected ${received} not to be snake_case`
      : `expected ${received} to be snake_case`,
    pass,
  };
}
