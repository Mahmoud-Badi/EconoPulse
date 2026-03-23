const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const { getRecentBars, getNews } = require('../services/massiveService');

const cache = new NodeCache({ stdTTL: 300 });

router.get('/fear-greed', async (req, res) => {
  try {
    const cacheKey = 'sentiment_fear_greed';
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ cached: true, data: cached });

    // Derive fear/greed from SPY daily change + news sentiment scores
    let fearGreedScore = 50;
    let bullishPercent = 0.5;
    let bearishPercent = 0.5;
    let articlesLastWeek = 0;

    try {
      const bars = await getRecentBars('SPY', 5);
      if (bars.length >= 2) {
        const latest = bars[bars.length - 1];
        const prev = bars[bars.length - 2];
        const changePercent = prev.c !== 0 ? ((latest.c - prev.c) / prev.c) * 100 : 0;
        // -3% = extreme fear (0), +3% = extreme greed (100)
        const normalized = Math.max(-3, Math.min(3, changePercent));
        fearGreedScore = Math.round(((normalized + 3) / 6) * 100);
        bullishPercent = parseFloat((fearGreedScore / 100).toFixed(2));
        bearishPercent = parseFloat((1 - bullishPercent).toFixed(2));
      }
    } catch (_) {}

    try {
      const articles = await getNews({ limit: 50 });
      // Count articles with positive/negative insights from last 7 days
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const recent = articles.filter(
        (a) => new Date(a.published_utc).getTime() > oneWeekAgo
      );
      articlesLastWeek = recent.length;

      // Adjust sentiment from article insights if available
      const withInsights = recent.filter((a) => a.insights?.length > 0);
      if (withInsights.length > 0) {
        const positiveCount = withInsights.reduce(
          (sum, a) =>
            sum +
            a.insights.filter((i) => i.sentiment === 'positive').length,
          0
        );
        const totalInsights = withInsights.reduce(
          (sum, a) => sum + a.insights.length,
          0
        );
        if (totalInsights > 0) {
          bullishPercent = parseFloat((positiveCount / totalInsights).toFixed(2));
          bearishPercent = parseFloat((1 - bullishPercent).toFixed(2));
          fearGreedScore = Math.round(bullishPercent * 100);
        }
      }
    } catch (_) {}

    const data = {
      fearGreedScore,
      buzz: parseFloat((articlesLastWeek / 10).toFixed(1)),
      sentiment: parseFloat((bullishPercent - 0.5).toFixed(2)),
      bearishPercent,
      bullishPercent,
      articlesLastWeek,
    };

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
    if (cached) return res.json({ cached: true, data: cached });

    const articles = await getNews({ limit: 10 });
    const data = articles.slice(0, 10).map((a) => ({
      headline: a.title,
      summary: a.description || a.title,
      url: a.article_url,
      source: a.publisher?.name || 'Unknown',
      datetime: Math.floor(new Date(a.published_utc).getTime() / 1000),
    }));

    cache.set(cacheKey, data);
    return res.json({ cached: false, data });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
