
// ISO 8601 date pattern
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:?\d{2})?$/;

export function toBeISODate(received: unknown) {
  let pass = false;
  if (typeof received === 'string' && ISO_DATE_PATTERN.test(received)) {
    const date = new Date(received);
    if (!isNaN(date.getTime())) {
      pass = true;
    }
  }

  return {
    message: () => pass
      ? `expected ${received} not to be a valid ISO date`
      : `expected ${received} to be a valid ISO date`,
    pass,
  };
}
