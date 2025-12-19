
export function toBeLowerCase(received: unknown) {
  const pass = typeof received === 'string' && received === received.toLowerCase() && received !== received.toUpperCase();
  return {
    message: () => pass
      ? `expected ${received} not to be lower case`
      : `expected ${received} to be lower case`,
    pass,
  };
}
