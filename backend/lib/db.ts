import { createClient } from 'redis'

// User stored at key `user:{id}`
// Email→id index at key `email:{email}`
// Watchlist stored at key `watchlist:{userId}`

export interface User {
  id: string
  email: string
  passwordHash: string
  createdAt: string
}

let client: ReturnType<typeof createClient> | null = null

async function getClient() {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL env var is not set.')
  }
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL })
    client.on('error', (err) => console.error('Redis error:', err))
    await client.connect()
  }
  return client
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const r = await getClient()
  const id = await r.get(`email:${email}`)
  if (!id) return null
  const raw = await r.get(`user:${id}`)
  return raw ? JSON.parse(raw) : null
}

export async function getUserById(id: string): Promise<User | null> {
  const r = await getClient()
  const raw = await r.get(`user:${id}`)
  return raw ? JSON.parse(raw) : null
}

export async function createUser(user: User): Promise<void> {
  const r = await getClient()
  await r.set(`user:${user.id}`, JSON.stringify(user))
  await r.set(`email:${user.email}`, user.id)
}

export async function getWatchlist(userId: string): Promise<string[]> {
  const r = await getClient()
  const raw = await r.get(`watchlist:${userId}`)
  return raw ? JSON.parse(raw) : []
}

export async function addToWatchlist(userId: string, symbol: string): Promise<string[]> {
  const current = await getWatchlist(userId)
  if (current.includes(symbol)) return current
  const updated = [...current, symbol.toUpperCase()]
  const r = await getClient()
  await r.set(`watchlist:${userId}`, JSON.stringify(updated))
  return updated
}

export async function removeFromWatchlist(userId: string, symbol: string): Promise<string[]> {
  const current = await getWatchlist(userId)
  const updated = current.filter((s) => s !== symbol.toUpperCase())
  const r = await getClient()
  await r.set(`watchlist:${userId}`, JSON.stringify(updated))
  return updated
}
