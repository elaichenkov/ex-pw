
export function toBePascalCase(received: unknown) {
  const pass = typeof received === 'string' && /^[A-Z][a-zA-Z0-9]*$/.test(received) && !/[_\-]/.test(received);
  return {
    message: () => pass
      ? `expected ${received} not to be PascalCase`
      : `expected ${received} to be PascalCase`,
    pass,
  };
}
