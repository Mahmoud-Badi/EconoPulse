const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const { getNews } = require('../services/massiveService');

const cache = new NodeCache({ stdTTL: 600 });

function mapArticle(article) {
  return {
    title: article.title,
    description: article.description || article.title,
    url: article.article_url,
    source: article.publisher?.name || 'Unknown',
    publishedAt: article.published_utc,
    urlToImage: article.image_url || null,
  };
}

router.get('/headlines', async (req, res) => {
  try {
    const cacheKey = 'news_headlines';
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ cached: true, data: cached });

    const articles = await getNews({ limit: 20 });
    const data = articles.map(mapArticle);

    cache.set(cacheKey, data);
    return res.json({ cached: false, data });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

router.get('/top', async (req, res) => {
  try {
    const cacheKey = 'news_top';
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ cached: true, data: cached });

    const articles = await getNews({ ticker: 'SPY', limit: 20 });
    const data = articles.map(mapArticle);

    cache.set(cacheKey, data);
    return res.json({ cached: false, data });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
