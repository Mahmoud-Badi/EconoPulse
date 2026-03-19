const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const finnhubService = require('../services/finnhubService');

const cache = new NodeCache({ stdTTL: 60 });

const STOCK_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META',
  'JPM', 'BAC', 'GS', 'SPY', 'QQQ', 'DIA', 'IWM'
];

const INDEX_MAP = {
  SPY: 'S&P 500',
  QQQ: 'NASDAQ',
  DIA: 'Dow Jones',
  IWM: 'Russell 2000'
};

router.get('/quotes', async (req, res) => {
  try {
    const cacheKey = 'stock_quotes';
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json({ cached: true, data: cached });
    }

    const quotes = await Promise.all(
      STOCK_SYMBOLS.map(async (symbol) => {
        const response = await finnhubService.getQuote(symbol);
        return {
          symbol,
          price: response.c,
          change: response.d,
          changePercent: response.dp,
          high: response.h,
          low: response.l,
          previousClose: response.pc
        };
      })
    );

    cache.set(cacheKey, quotes);
    return res.json({ cached: false, data: quotes });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

router.get('/indices', async (req, res) => {
  try {
    const cacheKey = 'stock_indices';
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json({ cached: true, data: cached });
    }

    const indexSymbols = Object.keys(INDEX_MAP);
    const indices = await Promise.all(
      indexSymbols.map(async (symbol) => {
        const response = await finnhubService.getQuote(symbol);
        return {
          symbol,
          name: INDEX_MAP[symbol],
          price: response.c,
          change: response.d,
          changePercent: response.dp,
          high: response.h,
          low: response.l,
          previousClose: response.pc
        };
      })
    );

    cache.set(cacheKey, indices);
    return res.json({ cached: false, data: indices });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
