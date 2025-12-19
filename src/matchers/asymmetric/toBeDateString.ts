
// Date format patterns
const FORMAT_PATTERNS: Record<string, RegExp> = {
  'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
  'MM/DD/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
  'DD/MM/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
  'YYYY/MM/DD': /^\d{4}\/\d{2}\/\d{2}$/,
  'MM-DD-YYYY': /^\d{2}-\d{2}-\d{4}$/,
  'DD-MM-YYYY': /^\d{2}-\d{2}-\d{4}$/,
  'YYYYMMDD': /^\d{8}$/,
};

export function toBeDateString(received: unknown, format: string) {
  const pattern = FORMAT_PATTERNS[format];

  if (!pattern) {
    throw new Error(
      `Unsupported date format: ${format}. Supported formats: ${Object.keys(FORMAT_PATTERNS).join(', ')}`
    );
  }

  const pass = typeof received === 'string' && pattern.test(received);

  return {
    message: () => pass
      ? `expected ${received} not to be a date string (${format})`
      : `expected ${received} to be a date string (${format})`,
    pass,
  };
}
