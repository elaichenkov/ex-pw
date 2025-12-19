
interface ToBeURLOptions {
  protocol?: string | string[];
}

export function toBeURL(received: unknown, options: ToBeURLOptions = {}) {
  const { protocol } = options;
  let pass = false;

  if (typeof received === 'string') {
    try {
      const url = new URL(received);
      pass = true;
      
      // Check protocol if specified
      if (protocol) {
        const urlProtocol = url.protocol.replace(':', '');
        const allowedProtocols = Array.isArray(protocol) ? protocol : [protocol];
        if (!allowedProtocols.includes(urlProtocol)) {
          pass = false;
        }
      }
    } catch {
      pass = false;
    }
  }

  const protocolMsg = protocol 
    ? ` (protocol: ${Array.isArray(protocol) ? protocol.join('|') : protocol})`
    : '';

  return {
    message: () => pass
      ? `expected ${received} not to be a valid URL${protocolMsg}`
      : `expected ${received} to be a valid URL${protocolMsg}`,
    pass,
  };
}
