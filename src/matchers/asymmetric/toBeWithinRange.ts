
export function toBeWithinRange(received: unknown, min: number, max: number) {
  const pass = typeof received === 'number' && received >= min && received <= max;
  return {
    message: () => pass
      ? `expected ${received} not to be within range ${min} - ${max}`
      : `expected ${received} to be within range ${min} - ${max}`,
    pass,
  };
}
