const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const newsService = require('../services/newsService');

const cache = new NodeCache({ stdTTL: 600 });

const mapArticles = (articles) =>
  articles.map((article) => ({
    title: article.title,
    description: article.description,
    url: article.url,
    source: article.source.name,
    publishedAt: article.publishedAt,
    urlToImage: article.urlToImage
  }));

router.get('/headlines', async (req, res) => {
  try {
    const cacheKey = 'news_headlines';
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json({ cached: true, data: cached });
    }

    const response = await newsService.getEconomyNews();
    const data = mapArticles(response.articles || []);

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

    if (cached) {
      return res.json({ cached: true, data: cached });
    }

    const response = await newsService.getTopHeadlines();
    const data = mapArticles(response.articles || []);

    cache.set(cacheKey, data);
    return res.json({ cached: false, data });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
