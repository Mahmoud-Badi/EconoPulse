// User stored as hash at key `user:{id}`
// Email→id index at key `email:{email}`
// Watchlist stored as set at key `watchlist:{userId}`

export interface User {
  id: string
  email: string
  passwordHash: string
  createdAt: string
}

function getKv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    throw new Error('KV not configured. Add KV_REST_API_URL and KV_REST_API_TOKEN env vars.')
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@vercel/kv').kv as import('@vercel/kv').VercelKV
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const kv = getKv()
  const id = await kv.get<string>(`email:${email}`)
  if (!id) return null
  return kv.get<User>(`user:${id}`)
}

export async function getUserById(id: string): Promise<User | null> {
  return getKv().get<User>(`user:${id}`)
}

export async function createUser(user: User): Promise<void> {
  const kv = getKv()
  await kv.set(`user:${user.id}`, user)
  await kv.set(`email:${user.email}`, user.id)
}

export async function getWatchlist(userId: string): Promise<string[]> {
  const list = await getKv().get<string[]>(`watchlist:${userId}`)
  return list ?? []
}

export async function addToWatchlist(userId: string, symbol: string): Promise<string[]> {
  const current = await getWatchlist(userId)
  if (current.includes(symbol)) return current
  const updated = [...current, symbol.toUpperCase()]
  await getKv().set(`watchlist:${userId}`, updated)
  return updated
}

export async function removeFromWatchlist(userId: string, symbol: string): Promise<string[]> {
  const current = await getWatchlist(userId)
  const updated = current.filter((s) => s !== symbol.toUpperCase())
  await getKv().set(`watchlist:${userId}`, updated)
  return updated
}
