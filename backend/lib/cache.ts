import NodeCache from 'node-cache'

// Single shared cache instance for all routes.
// TTL is passed per-call so each route controls its own expiry.
const store = new NodeCache({ useClones: false })

/**
 * Return cached value if present; otherwise run `fetcher`, store the result,
 * and return it. TTL is in seconds.
 */
export async function cacheOrFetch<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<{ data: T; cached: boolean }> {
  const hit = store.get<T>(key)
  if (hit !== undefined) return { data: hit, cached: true }

  const data = await fetcher()
  store.set(key, data, ttl)
  return { data, cached: false }
}
