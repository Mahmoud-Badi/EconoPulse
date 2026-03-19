const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const finnhubService = require('../services/finnhubService');

const cache = new NodeCache({ stdTTL: 120 });

const FOREX_PAIRS = [
  { pair: 'EUR/USD', base: 'EUR', type: 'inverse' },
  { pair: 'GBP/USD', base: 'GBP', type: 'inverse' },
  { pair: 'USD/JPY', base: 'JPY', type: 'direct' },
  { pair: 'USD/CHF', base: 'CHF', type: 'direct' },
  { pair: 'AUD/USD', base: 'AUD', type: 'inverse' },
  { pair: 'USD/CAD', base: 'CAD', type: 'direct' },
  { pair: 'USD/CNY', base: 'CNY', type: 'direct' },
  { pair: 'USD/KRW', base: 'KRW', type: 'direct' },
  { pair: 'USD/INR', base: 'INR', type: 'direct' },
  { pair: 'USD/MXN', base: 'MXN', type: 'direct' },
  { pair: 'USD/BRL', base: 'BRL', type: 'direct' }
];

// Reference rates as fallback when Finnhub forex endpoint requires premium
const FALLBACK_RATES = {
  EUR: 0.9210, GBP: 0.7890, JPY: 149.50, CHF: 0.8780,
  AUD: 1.5340, CAD: 1.3560, CNY: 7.2400, KRW: 1320.00,
  INR: 83.10, MXN: 17.15, BRL: 4.97
};

router.get('/rates', async (req, res) => {
  try {
    const cacheKey = 'forex_rates';
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json({ cached: true, data: cached });
    }

    let quote;
    try {
      const response = await finnhubService.getForexRates();
      quote = response.quote || response;
    } catch (e) {
      quote = FALLBACK_RATES;
    }

    const data = FOREX_PAIRS.map(({ pair, base, type }) => {
      const rawRate = quote[base];
      if (!rawRate) return { pair, rate: 0 };
      const rate = type === 'inverse' ? 1 / rawRate : rawRate;
      return { pair, rate };
    });

    cache.set(cacheKey, data);
    return res.json({ cached: false, data });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
