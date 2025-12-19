
export function toBeKebabCase(received: unknown) {
  const pass = typeof received === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(received);
  return {
    message: () => pass
      ? `expected ${received} not to be kebab-case`
      : `expected ${received} to be kebab-case`,
    pass,
  };
}
