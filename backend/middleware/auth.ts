import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production'

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: true, message: 'Missing auth token' })
  }
  try {
    const token = header.slice(7)
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string }
    req.userId = payload.userId
    return next()
  } catch {
    return res.status(401).json({ error: true, message: 'Invalid or expired token' })
  }
}

export function signToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}
