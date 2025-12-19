
export function toBeJSON(received: unknown) {
  let pass = false;
  if (typeof received === 'string') {
    try {
      JSON.parse(received);
      pass = true;
    } catch {
      pass = false;
    }
  }

  return {
    message: () => pass
      ? `expected ${received} not to be valid JSON`
      : `expected ${received} to be valid JSON`,
    pass,
  };
}
