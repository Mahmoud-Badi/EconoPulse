const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const { getGroupedLatestDay } = require('../services/massiveService');

const cache = new NodeCache({ stdTTL: 300 });

const CRYPTO_SYMBOLS = [
  { id: 1,  name: 'Bitcoin',   symbol: 'BTC',  ticker: 'X:BTCUSD'  },
  { id: 2,  name: 'Ethereum',  symbol: 'ETH',  ticker: 'X:ETHUSD'  },
  { id: 3,  name: 'Solana',    symbol: 'SOL',  ticker: 'X:SOLUSD'  },
  { id: 4,  name: 'XRP',       symbol: 'XRP',  ticker: 'X:XRPUSD'  },
  { id: 5,  name: 'BNB',       symbol: 'BNB',  ticker: 'X:BNBUSD'  },
  { id: 6,  name: 'Cardano',   symbol: 'ADA',  ticker: 'X:ADAUSD'  },
  { id: 7,  name: 'Dogecoin',  symbol: 'DOGE', ticker: 'X:DOGEUSD' },
  { id: 8,  name: 'Avalanche', symbol: 'AVAX', ticker: 'X:AVAXUSD' },
  { id: 9,  name: 'Chainlink', symbol: 'LINK', ticker: 'X:LINKUSD' },
  { id: 10, name: 'Polkadot',  symbol: 'DOT',  ticker: 'X:DOTUSD'  },
];

router.get('/listings', async (req, res) => {
  try {
    const cacheKey = 'crypto_listings';
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ cached: true, data: cached });

    const map = await getGroupedLatestDay('global', 'crypto');

    const data = CRYPTO_SYMBOLS.map(({ id, name, symbol, ticker }) => {
      const bar = map.get(ticker);
      if (!bar) return null;
      const pct24h = bar.o !== 0 ? ((bar.c - bar.o) / bar.o) * 100 : 0;
      return {
        id,
        name,
        symbol,
        price: bar.c,
        percent_change_1h: 0,
        percent_change_24h: parseFloat(pct24h.toFixed(2)),
        percent_change_7d: 0,
        market_cap: 0,
        volume_24h: bar.v || 0,
        circulating_supply: 0,
      };
    }).filter(Boolean);

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
    if (cached) return res.json({ cached: true, data: cached });

    const map = await getGroupedLatestDay('global', 'crypto');
    const btc = map.get('X:BTCUSD');
    const BTC_SUPPLY = 19_700_000;
    const btcMarketCap = btc ? btc.c * BTC_SUPPLY : 0;
    const totalMarketCap = btcMarketCap ? Math.round(btcMarketCap / 0.55) : 0;

    const data = {
      total_market_cap: totalMarketCap,
      total_volume_24h: btc ? Math.round(btc.v * btc.c) : 0,
      bitcoin_dominance: 55.0,
      active_cryptocurrencies: CRYPTO_SYMBOLS.length,
    };

    cache.set(cacheKey, data);
    return res.json({ cached: false, data });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
