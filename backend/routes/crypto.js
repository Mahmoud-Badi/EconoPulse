const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const coinmarketcapService = require('../services/coinmarketcapService');

const cache = new NodeCache({ stdTTL: 300 });

router.get('/listings', async (req, res) => {
  try {
    const cacheKey = 'crypto_listings';
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json({ cached: true, data: cached });
    }

    const response = await coinmarketcapService.getListings();
    const coins = response.data || response;
    const data = (Array.isArray(coins) ? coins : []).map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.quote.USD.price,
      percent_change_1h: coin.quote.USD.percent_change_1h,
      percent_change_24h: coin.quote.USD.percent_change_24h,
      percent_change_7d: coin.quote.USD.percent_change_7d,
      market_cap: coin.quote.USD.market_cap,
      volume_24h: coin.quote.USD.volume_24h,
      circulating_supply: coin.circulating_supply
    }));

    cache.set(cacheKey, data);
    return res.json({ cached: false, data });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

router.get('/global', async (req, res) => {
  try {
    const cacheKey = 'crypto_global';
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json({ cached: true, data: cached });
    }

    const response = await coinmarketcapService.getGlobalMetrics();
    const metrics = response.data || response;
    const data = {
      total_market_cap: metrics.quote.USD.total_market_cap,
      total_volume_24h: metrics.quote.USD.total_volume_24h,
      bitcoin_dominance: metrics.btc_dominance,
      active_cryptocurrencies: metrics.active_cryptocurrencies
    };

    cache.set(cacheKey, data);
    return res.json({ cached: false, data });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
