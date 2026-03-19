const axios = require('axios');

const BASE_URL = 'https://www.alphavantage.co/query';
const API_KEY = process.env.ALPHA_VANTAGE_KEY;

async function getMacroData(functionName) {
  try {
    const params = {
      function: functionName,
      apikey: API_KEY,
    };

    if (functionName === 'REAL_GDP') {
      params.interval = 'annual';
    } else if (functionName === 'INFLATION') {
      // No interval parameter for INFLATION
    } else if (functionName === 'TREASURY_YIELD') {
      params.interval = 'monthly';
      params.maturity = '10year';
    } else {
      // CPI, UNEMPLOYMENT, FEDERAL_FUNDS_RATE
      params.interval = 'monthly';
    }

    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch macro data for ${functionName}: ${error.message}`);
  }
}

async function getCommodityData(functionName) {
  try {
    const params = {
      function: functionName,
      interval: 'monthly',
      apikey: API_KEY,
    };

    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch commodity data for ${functionName}: ${error.message}`);
  }
}

module.exports = {
  getMacroData,
  getCommodityData,
};
