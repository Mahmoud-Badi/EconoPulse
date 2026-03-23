const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const { getGroupedLatestDay } = require('../services/massiveService');

const cache = new NodeCache({ stdTTL: 60 });

const STOCK_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META',
  'JPM', 'BAC', 'GS',
];

// ETF proxies for major indices.
// multiplier converts ETF price → approximate index level.
const INDEX_MAP = {
  SPY: { name: 'S&P 500',      multiplier: 10.19 },
  QQQ: { name: 'NASDAQ',       multiplier: 34.3  },
  DIA: { name: 'Dow Jones',    multiplier: 95.0  },
  IWM: { name: 'Russell 2000', multiplier: 8.7   },
};

// Build a quote from a single grouped bar using close-vs-open as change
function barToQuote(symbol, bar) {
  const change = bar.c - bar.o;
  const changePercent = bar.o !== 0 ? (change / bar.o) * 100 : 0;
  return {
    symbol,
    price: bar.c,
    change: parseFloat(change.toFixed(4)),
    changePercent: parseFloat(changePercent.toFixed(4)),
    high: bar.h,
    low: bar.l,
    previousClose: bar.o,
    volume: bar.v,
  };
}

router.get('/quotes', async (req, res) => {
  try {
    const cacheKey = 'stock_quotes';
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ cached: true, data: cached });

    const map = await getGroupedLatestDay('us', 'stocks');

    const data = STOCK_SYMBOLS
      .map((symbol) => {
        const bar = map.get(symbol);
        return bar ? barToQuote(symbol, bar) : null;
      })
      .filter(Boolean);

    cache.set(cacheKey, data);
    return res.json({ cached: false, data });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

router.get('/indices', async (req, res) => {
  try {
    const cacheKey = 'stock_indices';
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ cached: true, data: cached });

    const map = await getGroupedLatestDay('us', 'stocks');

    const data = Object.entries(INDEX_MAP)
      .map(([symbol, { name, multiplier }]) => {
        const bar = map.get(symbol);
        if (!bar) return null;
        const q = barToQuote(symbol, bar);
        return {
          ...q,
          name,
          price: parseFloat((q.price * multiplier).toFixed(2)),
          change: parseFloat((q.change * multiplier).toFixed(2)),
          previousClose: parseFloat((q.previousClose * multiplier).toFixed(2)),
          high: parseFloat((q.high * multiplier).toFixed(2)),
          low: parseFloat((q.low * multiplier).toFixed(2)),
        };
      })
      .filter(Boolean);

    cache.set(cacheKey, data);
    return res.json({ cached: false, data });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
