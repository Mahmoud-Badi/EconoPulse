import NodeCache from 'node-cache'
import { createClient } from 'redis'

// In-process fallback for local dev / when REDIS_URL is absent
const localStore = new NodeCache({ useClones: false })

let redisClient: ReturnType<typeof createClient> | null = null
let redisConnecting = false

async function getRedis(): Promise<ReturnType<typeof createClient> | null> {
  if (!process.env.REDIS_URL) return null
  if (redisClient?.isReady) return redisClient
  if (redisConnecting) return null
  try {
    redisConnecting = true
    redisClient = createClient({ url: process.env.REDIS_URL })
    redisClient.on('error', () => { redisClient = null; redisConnecting = false })
    await redisClient.connect()
    redisConnecting = false
    return redisClient
  } catch {
    redisClient = null
    redisConnecting = false
    return null
  }
}

/**
 * Return cached value if present; otherwise run `fetcher`, store the result,
 * and return it. TTL is in seconds. Uses Redis when available, falls back to
 * in-process NodeCache (e.g. local dev).
 */
export async function cacheOrFetch<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<{ data: T; cached: boolean }> {
  const redis = await getRedis()

  if (redis) {
    const raw = await redis.get(key)
    if (raw !== null) return { data: JSON.parse(raw) as T, cached: true }
    const data = await fetcher()
    await redis.set(key, JSON.stringify(data), { EX: ttl })
    return { data, cached: false }
  }

  // Fallback: in-process cache
  const hit = localStore.get<T>(key)
  if (hit !== undefined) return { data: hit, cached: true }
  const data = await fetcher()
  localStore.set(key, data, ttl)
  return { data, cached: false }
}
