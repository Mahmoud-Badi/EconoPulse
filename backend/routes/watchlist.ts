import { Router, Response } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../lib/db'

const router = Router()

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
    const symbol = String(req.params.symbol)
    const updated = await addToWatchlist(req.userId!, symbol)
    return res.json({ data: updated })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

router.delete('/:symbol', async (req: AuthRequest, res: Response) => {
  try {
    const symbol = String(req.params.symbol)
    const updated = await removeFromWatchlist(req.userId!, symbol)
    return res.json({ data: updated })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

export default router
