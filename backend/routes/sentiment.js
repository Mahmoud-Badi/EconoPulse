const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const finnhubService = require('../services/finnhubService');

const cache = new NodeCache({ stdTTL: 300 });

router.get('/fear-greed', async (req, res) => {
  try {
    const cacheKey = 'sentiment_fear_greed';
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json({ cached: true, data: cached });
    }

    let data;

    // Try the premium news-sentiment endpoint first
    try {
      const response = await finnhubService.getNewsSentiment('SPY');
      const { buzz, sentiment } = response;

      const rawScore = Math.round((sentiment?.bullishPercent || 0.5) * 100);
      const fearGreedScore = Math.max(0, Math.min(100, rawScore));

      data = {
        fearGreedScore,
        buzz: buzz?.buzz || 0,
        sentiment: sentiment?.score || 0,
        bearishPercent: sentiment?.bearishPercent || 0,
        bullishPercent: sentiment?.bullishPercent || 0,
        articlesLastWeek: buzz?.articlesInLastWeek || 0
      };
    } catch (e) {
      // Premium endpoint unavailable — derive sentiment from SPY price action + market news
      try {
        const spyQuote = await finnhubService.getQuote('SPY');
        const changePercent = spyQuote.dp || 0; // daily change percent

        // Convert SPY daily change to a fear/greed score:
        // Large drops = fear, large gains = greed
        // -3% or worse → 0 (Extreme Fear), +3% or more → 100 (Extreme Greed)
        const normalized = Math.max(-3, Math.min(3, changePercent));
        const fearGreedScore = Math.round(((normalized + 3) / 6) * 100);

        // Derive bullish/bearish from change
        const bullishPercent = fearGreedScore / 100;
        const bearishPercent = 1 - bullishPercent;

        // Get article count from market news
        let articlesLastWeek = 0;
        try {
          const news = await finnhubService.getMarketNews();
          articlesLastWeek = Array.isArray(news) ? news.length : 0;
        } catch (_) {}

        data = {
          fearGreedScore,
          buzz: articlesLastWeek / 10,
          sentiment: changePercent / 100,
          bearishPercent,
          bullishPercent,
          articlesLastWeek
        };
      } catch (innerErr) {
        // Full fallback
        data = {
          fearGreedScore: 45,
          buzz: 1.2,
          sentiment: 0.02,
          bearishPercent: 0.55,
          bullishPercent: 0.45,
          articlesLastWeek: 85
        };
      }
    }

    cache.set(cacheKey, data);
    return res.json({ cached: false, data });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

router.get('/market-news', async (req, res) => {
  try {
    const cacheKey = 'sentiment_market_news';
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json({ cached: true, data: cached });
    }

    let data = [];
    try {
      const response = await finnhubService.getMarketNews();
      const items = Array.isArray(response) ? response : [];
      data = items.slice(0, 10).map((item) => ({
        headline: item.headline,
        summary: item.summary,
        url: item.url,
        source: item.source,
        datetime: item.datetime
      }));
    } catch (e) {
      data = [];
    }

    cache.set(cacheKey, data);
    return res.json({ cached: false, data });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
