
// RFC 5322 compliant email pattern (simplified but comprehensive)
const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function toBeEmail(received: unknown) {
  const pass = typeof received === 'string' && EMAIL_PATTERN.test(received);

  return {
    message: () => pass
      ? `expected ${received} not to be a valid email`
      : `expected ${received} to be a valid email`,
    pass,
  };
}
