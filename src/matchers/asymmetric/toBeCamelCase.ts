
export function toBeCamelCase(received: unknown) {
  const pass = typeof received === 'string' && /^[a-z][a-zA-Z0-9]*$/.test(received) && !/[_\-]/.test(received);
  return {
    message: () => pass
      ? `expected ${received} not to be camelCase`
      : `expected ${received} to be camelCase`,
    pass,
  };
}
