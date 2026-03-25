import { Router, Request, Response } from 'express'
import { cacheOrFetch } from '../lib/cache'
import { getGroupedLatestDay, MassiveBar } from '../services/massiveService'

const router = Router()

const STOCK_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META',
  'JPM', 'BAC', 'GS',
]

interface IndexConfig {
  name: string
  multiplier: number
}

const INDEX_MAP: Record<string, IndexConfig> = {
  SPY: { name: 'S&P 500',      multiplier: 10.19 },
  QQQ: { name: 'NASDAQ',       multiplier: 34.3  },
  DIA: { name: 'Dow Jones',    multiplier: 95.0  },
  IWM: { name: 'Russell 2000', multiplier: 8.7   },
}

function barToQuote(symbol: string, bar: MassiveBar) {
  const change = bar.c - bar.o
  const changePercent = bar.o !== 0 ? (change / bar.o) * 100 : 0
  return {
    symbol,
    price: bar.c,
    change: parseFloat(change.toFixed(4)),
    changePercent: parseFloat(changePercent.toFixed(4)),
    high: bar.h,
    low: bar.l,
    previousClose: bar.o,
    volume: bar.v,
  }
}

router.get('/quotes', async (_req: Request, res: Response) => {
  try {
    const { data, cached } = await cacheOrFetch('stock_quotes', 60, async () => {
      const map = await getGroupedLatestDay('us', 'stocks')
      return STOCK_SYMBOLS
        .map((symbol) => { const bar = map.get(symbol); return bar ? barToQuote(symbol, bar) : null })
        .filter(Boolean)
    })
    return res.json({ cached, data })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

router.get('/indices', async (_req: Request, res: Response) => {
  try {
    const { data, cached } = await cacheOrFetch('stock_indices', 60, async () => {
      const map = await getGroupedLatestDay('us', 'stocks')
      return Object.entries(INDEX_MAP)
        .map(([symbol, { name, multiplier }]) => {
          const bar = map.get(symbol)
          if (!bar) return null
          const q = barToQuote(symbol, bar)
          return {
            ...q,
            name,
            price: parseFloat((q.price * multiplier).toFixed(2)),
            change: parseFloat((q.change * multiplier).toFixed(2)),
            previousClose: parseFloat((q.previousClose * multiplier).toFixed(2)),
            high: parseFloat((q.high * multiplier).toFixed(2)),
            low: parseFloat((q.low * multiplier).toFixed(2)),
          }
        })
        .filter(Boolean)
    })
    return res.json({ cached, data })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

export default router
