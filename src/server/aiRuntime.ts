export function parseGeminiKeys(plural = '', single = ''): string[] {
  const parse = (value: string) => [...new Set(value.split(/[\n,;]+/)
    .map(k => k.trim().replace(/^["']|["']$/g, ''))
    .filter(k => k && !/^(?:MY_GEMINI_API_KEYS?|YOUR_KEY|AIzaSyKey\d.*|AIzaSySingleKey.*)$/i.test(k)))];
  const keys = parse(plural);
  return keys.length ? keys : parse(single);
}

/** Retry another account only when it could resolve the failure. */
export function createKeyRotation<T>(clients: T[]) {
  let cursor = 0;
  return async <R>(run: (client: T) => Promise<R>, signal: AbortSignal): Promise<R> => {
    if (!clients.length) throw new Error('NO_API_KEYS');
    const start = cursor;
    cursor = (cursor + 1) % clients.length;
    let lastError: unknown;
    for (let attempt = 0; attempt < clients.length; attempt++) {
      signal.throwIfAborted();
      try {
        return await run(clients[(start + attempt) % clients.length]);
      } catch (error) {
        lastError = error;
        signal.throwIfAborted();
        const status = Number((error as { status?: number })?.status);
        // Invalid request/model (400/404) will fail for every account.
        if (status && ![401, 403, 429].includes(status) && status < 500) throw error;
      }
    }
    throw lastError;
  };
}

/** Sliding window with bounded per-IP histories and no global reset at capacity. */
export function createRateLimiter(windowMs = 60_000, limit = 15, maxIps = 5000) {
  const hits = new Map<string, number[]>();
  let calls = 0;
  return (ip: string, now = Date.now()): boolean => {
    if (++calls % 100 === 0 || hits.size >= maxIps) {
      for (const [key, times] of hits) if (now - times[times.length - 1] >= windowMs) hits.delete(key);
    }
    const recent = (hits.get(ip) || []).filter(t => now - t < windowMs);
    if (recent.length >= limit) return true;
    if (!hits.has(ip) && hits.size >= maxIps) return true;
    recent.push(now);
    hits.set(ip, recent);
    return false;
  };
}
