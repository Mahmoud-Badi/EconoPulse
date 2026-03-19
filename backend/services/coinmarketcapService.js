const axios = require('axios');

const BASE_URL = 'https://pro-api.coinmarketcap.com/v1';
const API_KEY = process.env.COINMARKETCAP_API_KEY;

const headers = {
  'X-CMC_PRO_API_KEY': API_KEY,
};

async function getListings() {
  try {
    const response = await axios.get(`${BASE_URL}/cryptocurrency/listings/latest`, {
      headers,
      params: { limit: 20, convert: 'USD' },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch crypto listings: ${error.message}`);
  }
}

async function getGlobalMetrics() {
  try {
    const response = await axios.get(`${BASE_URL}/global-metrics/quotes/latest`, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch global metrics: ${error.message}`);
  }
}

module.exports = {
  getListings,
  getGlobalMetrics,
};
