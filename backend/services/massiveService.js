const axios = require('axios');
const NodeCache = require('node-cache');

const BASE_URL = 'https://api.massive.com';
const API_KEY = process.env.MASSIVE_API_KEY;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  params: { apiKey: API_KEY },
});

// Service-level cache — shared within a warm Lambda instance
const groupedCache = new NodeCache({ stdTTL: 60 });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Fetch with automatic retry on Massive's soft rate-limit error body {status:"ERROR"}
async function massiveGet(path, extraParams = {}) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await client.get(path, { params: extraParams });
    if (response.data.status === 'ERROR') {
      if (attempt < 3) await sleep(2000 * attempt);
      else throw new Error(`Massive API error: ${response.data.error}`);
      continue;
    }
    return response.data;
  }
}

// Return a Map<ticker, bar> for the most recent completed trading day.
// Makes exactly ONE API call per locale+market combination.
// Uses `c - o` (close minus open) as the day's change since we only have one day.
async function getGroupedLatestDay(locale, market) {
  const cacheKey = `grouped1_${locale}_${market}`;
  const cached = groupedCache.get(cacheKey);
  if (cached) return cached;

  const today = new Date();

  for (let back = 1; back <= 10; back++) {
    const d = new Date(today);
    d.setDate(d.getDate() - back);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue; // skip weekends

    const dateStr = d.toISOString().split('T')[0];
    try {
      const data = await massiveGet(`/v2/aggs/grouped/locale/${locale}/market/${market}/${dateStr}`);
      const bars = data?.results || [];
      if (bars.length > 0) {
        const map = new Map(bars.map((b) => [b.T, b]));
        groupedCache.set(cacheKey, map);
        return map;
      }
    } catch (_) {
      // rate limit or no data for this date — try next
    }
  }

  return new Map();
}

// Get last N calendar days of bars for a single ticker (used by sentiment/macro)
async function getRecentBars(ticker, days = 5) {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - Math.max(days * 2, 14));
  const fromStr = from.toISOString().split('T')[0];
  const toStr = to.toISOString().split('T')[0];
  const data = await massiveGet(`/v2/aggs/ticker/${ticker}/range/1/day/${fromStr}/${toStr}`);
  const results = data?.results || [];
  return results.slice(-days);
}

// Get previous day bar for a single ticker
async function getPrevBar(ticker) {
  const data = await massiveGet(`/v2/aggs/ticker/${ticker}/prev`);
  const result = data?.results?.[0];
  if (!result) throw new Error(`No data for ${ticker}`);
  return result;
}

// Get news articles (with optional ticker filter)
async function getNews({ ticker, limit = 20 } = {}) {
  const params = { limit };
  if (ticker) params.ticker = ticker;
  const data = await massiveGet('/v2/reference/news', params);
  return data?.results || [];
}

// Get market status
async function getMarketStatus() {
  return massiveGet('/v1/marketstatus/now');
}

module.exports = { getPrevBar, getRecentBars, getGroupedLatestDay, getNews, getMarketStatus };
