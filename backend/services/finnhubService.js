const axios = require('axios');

const BASE_URL = 'https://finnhub.io/api/v1';
const API_KEY = process.env.FINNHUB_API_KEY;

async function getQuote(symbol) {
  try {
    const response = await axios.get(`${BASE_URL}/quote`, {
      params: { symbol, token: API_KEY },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch quote for ${symbol}: ${error.message}`);
  }
}

async function getForexRates() {
  try {
    const response = await axios.get(`${BASE_URL}/forex/rates`, {
      params: { base: 'USD', token: API_KEY },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch forex rates: ${error.message}`);
  }
}

async function getNewsSentiment(symbol) {
  try {
    const response = await axios.get(`${BASE_URL}/news-sentiment`, {
      params: { symbol, token: API_KEY },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch news sentiment for ${symbol}: ${error.message}`);
  }
}

async function getMarketNews() {
  try {
    const response = await axios.get(`${BASE_URL}/news`, {
      params: { category: 'general', token: API_KEY },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch market news: ${error.message}`);
  }
}

module.exports = {
  getQuote,
  getForexRates,
  getNewsSentiment,
  getMarketNews,
};
