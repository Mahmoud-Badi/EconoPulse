import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { getUserByEmail, createUser } from '../lib/db'
import { signToken, requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

router.post('/register', async (req: Request, res: Response) => {
  try {
    const result = authSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ error: true, message: result.error.issues[0].message })
    }
    const { email, password } = result.data

    const existing = await getUserByEmail(email.toLowerCase())
    if (existing) {
      return res.status(409).json({ error: true, message: 'Email already registered' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = {
      id: randomUUID(),
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
    }
    await createUser(user)

    const token = signToken(user.id)
    return res.status(201).json({ token, user: { id: user.id, email: user.email } })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  try {
    const result = authSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ error: true, message: result.error.issues[0].message })
    }
    const { email, password } = result.data

    const user = await getUserByEmail(email.toLowerCase())
    if (!user) {
      return res.status(401).json({ error: true, message: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: true, message: 'Invalid credentials' })
    }

    const token = signToken(user.id)
    return res.json({ token, user: { id: user.id, email: user.email } })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { getUserById } = await import('../lib/db')
    const user = await getUserById(req.userId!)
    if (!user) return res.status(404).json({ error: true, message: 'User not found' })
    return res.json({ user: { id: user.id, email: user.email } })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

export default router
