import { Router, Request, Response } from 'express'
import { cacheOrFetch } from '../lib/cache'
import { getGroupedLatestDay } from '../services/massiveService'

const router = Router()

const FOREX_PAIRS = [
  { pair: 'EUR/USD', ticker: 'C:EURUSD' },
  { pair: 'GBP/USD', ticker: 'C:GBPUSD' },
  { pair: 'USD/JPY', ticker: 'C:USDJPY' },
  { pair: 'USD/CHF', ticker: 'C:USDCHF' },
  { pair: 'AUD/USD', ticker: 'C:AUDUSD' },
  { pair: 'USD/CAD', ticker: 'C:USDCAD' },
  { pair: 'NZD/USD', ticker: 'C:NZDUSD' },
  { pair: 'EUR/GBP', ticker: 'C:EURGBP' },
]

router.get('/rates', async (_req: Request, res: Response) => {
  try {
    const { data, cached } = await cacheOrFetch('forex_rates', 60, async () => {
      const map = await getGroupedLatestDay('global', 'fx')
      return FOREX_PAIRS.map(({ pair, ticker }) => {
        const bar = map.get(ticker)
        if (!bar) return null
        const change = bar.c - bar.o
        const changePercent = bar.o !== 0 ? (change / bar.o) * 100 : 0
        return {
          pair,
          rate: bar.c,
          change: parseFloat(change.toFixed(5)),
          changePercent: parseFloat(changePercent.toFixed(4)),
        }
      }).filter(Boolean)
    })
    return res.json({ cached, data })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

export default router
