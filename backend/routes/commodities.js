const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const { getGroupedLatestDay } = require('../services/massiveService');

const cache = new NodeCache({ stdTTL: 300 });

const COMMODITIES = [
  { symbol: 'GLD',  name: 'Gold',           category: 'metals',      function: 'GOLD'        },
  { symbol: 'SLV',  name: 'Silver',          category: 'metals',      function: 'SILVER'      },
  { symbol: 'CPER', name: 'Copper',          category: 'metals',      function: 'COPPER'      },
  { symbol: 'USO',  name: 'Crude Oil (WTI)', category: 'energy',      function: 'WTI'         },
  { symbol: 'UNG',  name: 'Natural Gas',     category: 'energy',      function: 'NATURAL_GAS' },
  { symbol: 'WEAT', name: 'Wheat',           category: 'agriculture', function: 'WHEAT'       },
  { symbol: 'CORN', name: 'Corn',            category: 'agriculture', function: 'CORN'        },
  { symbol: 'BAL',  name: 'Cotton',          category: 'agriculture', function: 'COTTON'      },
  { symbol: 'SGG',  name: 'Sugar',           category: 'agriculture', function: 'SUGAR'       },
  { symbol: 'JO',   name: 'Coffee',          category: 'agriculture', function: 'COFFEE'      },
];

router.get('/quotes', async (req, res) => {
  try {
    const cacheKey = 'commodity_quotes';
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ cached: true, data: cached });

    // Commodity ETFs trade on US exchanges — share the same grouped call as stocks
    const map = await getGroupedLatestDay('us', 'stocks');

    const data = COMMODITIES.map(({ symbol, name, category, function: fn }) => {
      const bar = map.get(symbol);
      if (!bar) return null;
      const change = bar.c - bar.o;
      const changePercent = bar.o !== 0 ? (change / bar.o) * 100 : 0;
      return {
        symbol,
        name,
        function: fn,
        category,
        price: bar.c,
        previousPrice: bar.o,
        change: parseFloat(change.toFixed(4)),
        changePercent: parseFloat(changePercent.toFixed(2)),
      };
    }).filter(Boolean);

    cache.set(cacheKey, data);
    return res.json({ cached: false, data });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
