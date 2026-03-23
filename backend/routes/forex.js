const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const { getGroupedLatestDay } = require('../services/massiveService');

const cache = new NodeCache({ stdTTL: 60 });

const FOREX_PAIRS = [
  { pair: 'EUR/USD', ticker: 'C:EURUSD' },
  { pair: 'GBP/USD', ticker: 'C:GBPUSD' },
  { pair: 'USD/JPY', ticker: 'C:USDJPY' },
  { pair: 'USD/CHF', ticker: 'C:USDCHF' },
  { pair: 'AUD/USD', ticker: 'C:AUDUSD' },
  { pair: 'USD/CAD', ticker: 'C:USDCAD' },
  { pair: 'NZD/USD', ticker: 'C:NZDUSD' },
  { pair: 'EUR/GBP', ticker: 'C:EURGBP' },
];

router.get('/rates', async (req, res) => {
  try {
    const cacheKey = 'forex_rates';
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ cached: true, data: cached });

    const map = await getGroupedLatestDay('global', 'fx');

    const data = FOREX_PAIRS.map(({ pair, ticker }) => {
      const bar = map.get(ticker);
      if (!bar) return null;
      const change = bar.c - bar.o;
      const changePercent = bar.o !== 0 ? (change / bar.o) * 100 : 0;
      return {
        pair,
        rate: bar.c,
        change: parseFloat(change.toFixed(5)),
        changePercent: parseFloat(changePercent.toFixed(4)),
      };
    }).filter(Boolean);

    cache.set(cacheKey, data);
    return res.json({ cached: false, data });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
