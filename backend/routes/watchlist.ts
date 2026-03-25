import { Router, Response } from 'express'
import { z } from 'zod'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../lib/db'

const router = Router()
const symbolSchema = z.string().min(1).max(10).regex(/^[A-Z0-9.:-]+$/i)

// All watchlist routes require auth
router.use(requireAuth)

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const symbols = await getWatchlist(req.userId!)
    return res.json({ data: symbols })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

router.post('/:symbol', async (req: AuthRequest, res: Response) => {
  try {
    const result = symbolSchema.safeParse(req.params.symbol)
    if (!result.success) {
      return res.status(400).json({ error: true, message: 'Invalid symbol' })
    }
    const updated = await addToWatchlist(req.userId!, result.data.toUpperCase())
    return res.json({ data: updated })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

router.delete('/:symbol', async (req: AuthRequest, res: Response) => {
  try {
    const result = symbolSchema.safeParse(req.params.symbol)
    if (!result.success) {
      return res.status(400).json({ error: true, message: 'Invalid symbol' })
    }
    const updated = await removeFromWatchlist(req.userId!, result.data.toUpperCase())
    return res.json({ data: updated })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

export default router
