
export function toBeUpperCase(received: unknown) {
  const pass = typeof received === 'string' && received === received.toUpperCase() && received !== received.toLowerCase();
  return {
    message: () => pass
      ? `expected ${received} not to be upper case`
      : `expected ${received} to be upper case`,
    pass,
  };
}
