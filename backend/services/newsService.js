const axios = require('axios');

const BASE_URL = 'https://newsapi.org/v2';
const API_KEY = process.env.NEWS_API_KEY;

async function getEconomyNews() {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: 'economy OR markets OR inflation OR GDP OR federal reserve',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20,
        apiKey: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch economy news: ${error.message}`);
  }
}

async function getTopHeadlines() {
  try {
    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        category: 'business',
        language: 'en',
        pageSize: 10,
        apiKey: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch top headlines: ${error.message}`);
  }
}

module.exports = {
  getEconomyNews,
  getTopHeadlines,
};
