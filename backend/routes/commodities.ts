import { Router, Request, Response } from 'express'
import { cacheOrFetch } from '../lib/cache'
import { getGroupedLatestDay } from '../services/massiveService'

const router = Router()

const COMMODITIES = [
  { symbol: 'GLD',  name: 'Gold',           category: 'metals',      fn: 'GOLD'        },
  { symbol: 'SLV',  name: 'Silver',          category: 'metals',      fn: 'SILVER'      },
  { symbol: 'CPER', name: 'Copper',          category: 'metals',      fn: 'COPPER'      },
  { symbol: 'USO',  name: 'Crude Oil (WTI)', category: 'energy',      fn: 'WTI'         },
  { symbol: 'UNG',  name: 'Natural Gas',     category: 'energy',      fn: 'NATURAL_GAS' },
  { symbol: 'WEAT', name: 'Wheat',           category: 'agriculture', fn: 'WHEAT'       },
  { symbol: 'CORN', name: 'Corn',            category: 'agriculture', fn: 'CORN'        },
  { symbol: 'BAL',  name: 'Cotton',          category: 'agriculture', fn: 'COTTON'      },
  { symbol: 'SGG',  name: 'Sugar',           category: 'agriculture', fn: 'SUGAR'       },
  { symbol: 'JO',   name: 'Coffee',          category: 'agriculture', fn: 'COFFEE'      },
]

router.get('/quotes', async (_req: Request, res: Response) => {
  try {
    const { data, cached } = await cacheOrFetch('commodity_quotes', 300, async () => {
      const map = await getGroupedLatestDay('us', 'stocks')
      return COMMODITIES.map(({ symbol, name, category, fn }) => {
        const bar = map.get(symbol)
        if (!bar) return null
        const change = bar.c - bar.o
        const changePercent = bar.o !== 0 ? (change / bar.o) * 100 : 0
        return {
          symbol, name, category,
          function: fn,
          price: bar.c,
          previousPrice: bar.o,
          change: parseFloat(change.toFixed(4)),
          changePercent: parseFloat(changePercent.toFixed(2)),
        }
      }).filter(Boolean)
    })
    return res.json({ cached, data })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

export default router
