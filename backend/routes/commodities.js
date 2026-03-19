const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const alphaVantageService = require('../services/alphaVantageService');

const cache = new NodeCache({ stdTTL: 300 });

const COMMODITIES = [
  { symbol: 'WTI', name: 'Crude Oil WTI', category: 'energy' },
  { symbol: 'BRENT', name: 'Crude Oil Brent', category: 'energy' },
  { symbol: 'NATURAL_GAS', name: 'Natural Gas', category: 'energy' },
  { symbol: 'COPPER', name: 'Copper', category: 'metals' },
  { symbol: 'ALUMINUM', name: 'Aluminum', category: 'metals' },
  { symbol: 'WHEAT', name: 'Wheat', category: 'agriculture' },
  { symbol: 'CORN', name: 'Corn', category: 'agriculture' },
  { symbol: 'COTTON', name: 'Cotton', category: 'agriculture' },
  { symbol: 'SUGAR', name: 'Sugar', category: 'agriculture' },
  { symbol: 'COFFEE', name: 'Coffee', category: 'agriculture' }
];

const FALLBACK_DATA = {
  WTI: 68.50,
  BRENT: 72.80,
  NATURAL_GAS: 3.62,
  COPPER: 4.15,
  ALUMINUM: 2450.00,
  WHEAT: 5.48,
  CORN: 4.32,
  COTTON: 0.72,
  SUGAR: 0.21,
  COFFEE: 3.45
};

router.get('/quotes', async (req, res) => {
  try {
    const cacheKey = 'commodity_quotes';
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json({ cached: true, data: cached });
    }

    let realDataCount = 0;

    const results = await Promise.allSettled(
      COMMODITIES.map(async ({ symbol, name, category }) => {
        try {
          const response = await alphaVantageService.getCommodityData(symbol);
          const dataPoints = response.data || response;

          if (Array.isArray(dataPoints) && dataPoints.length >= 2) {
            const valid = dataPoints.filter(d => d.value && d.value !== '.');
            if (valid.length >= 2) {
              const latest = valid[0];
              const previous = valid[1];
              const latestValue = parseFloat(latest.value);
              const previousValue = parseFloat(previous.value);

              if (latestValue > 0 && previousValue > 0) {
                const change = latestValue - previousValue;
                const changePercent = previousValue !== 0 ? ((change / previousValue) * 100) : 0;
                realDataCount++;
                return {
                  symbol,
                  name,
                  category,
                  price: latestValue,
                  change: parseFloat(change.toFixed(4)),
                  changePercent: parseFloat(changePercent.toFixed(2)),
                  date: latest.date,
                  source: 'api'
                };
              }
            }
          }
        } catch (err) {
          // API call failed for this commodity, fall through to fallback
        }

        // Fallback: use reference data with 0 change
        return {
          symbol,
          name,
          category,
          price: FALLBACK_DATA[symbol],
          change: 0,
          changePercent: 0,
          date: new Date().toISOString().split('T')[0],
          source: 'fallback'
        };
      })
    );

    const data = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    // Only cache if at least some commodities have real API data
    if (realDataCount > 0) {
      cache.set(cacheKey, data);
    }

    return res.json({ cached: false, data });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
