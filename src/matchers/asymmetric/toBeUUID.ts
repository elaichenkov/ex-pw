
// UUID regex patterns for different versions
const UUID_PATTERNS = {
  v1: /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  v4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  v5: /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  any: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};

export function toBeUUID(received: unknown, version?: 'v1' | 'v4' | 'v5') {
  const pattern = version ? UUID_PATTERNS[version] : UUID_PATTERNS.any;
  const versionLabel = version || 'any';
  const pass = typeof received === 'string' && pattern.test(received);

  return {
    message: () => pass
      ? `expected ${received} not to be a valid UUID (${versionLabel})`
      : `expected ${received} to be a valid UUID (${versionLabel})`,
    pass,
  };
}
