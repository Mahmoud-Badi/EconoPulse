import { kv } from '@vercel/kv'

// User stored as hash at key `user:{id}`
// Email→id index at key `email:{email}`
// Watchlist stored as set at key `watchlist:{userId}`

export interface User {
  id: string
  email: string
  passwordHash: string
  createdAt: string
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const id = await kv.get<string>(`email:${email}`)
  if (!id) return null
  return kv.get<User>(`user:${id}`)
}

export async function getUserById(id: string): Promise<User | null> {
  return kv.get<User>(`user:${id}`)
}

export async function createUser(user: User): Promise<void> {
  await kv.set(`user:${user.id}`, user)
  await kv.set(`email:${user.email}`, user.id)
}

export async function getWatchlist(userId: string): Promise<string[]> {
  const list = await kv.get<string[]>(`watchlist:${userId}`)
  return list ?? []
}

export async function addToWatchlist(userId: string, symbol: string): Promise<string[]> {
  const current = await getWatchlist(userId)
  if (current.includes(symbol)) return current
  const updated = [...current, symbol.toUpperCase()]
  await kv.set(`watchlist:${userId}`, updated)
  return updated
}

export async function removeFromWatchlist(userId: string, symbol: string): Promise<string[]> {
  const current = await getWatchlist(userId)
  const updated = current.filter((s) => s !== symbol.toUpperCase())
  await kv.set(`watchlist:${userId}`, updated)
  return updated
}
