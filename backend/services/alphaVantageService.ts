import axios from 'axios'

const BASE_URL = 'https://www.alphavantage.co/query'
const API_KEY = process.env.ALPHA_VANTAGE_KEY

export async function getMacroData(functionName: string): Promise<Record<string, unknown>> {
  const params: Record<string, string> = {
    function: functionName,
    apikey: API_KEY ?? '',
  }

  if (functionName === 'REAL_GDP') {
    params.interval = 'annual'
  } else if (functionName === 'TREASURY_YIELD') {
    params.interval = 'monthly'
    params.maturity = '10year'
  } else if (functionName !== 'INFLATION') {
    params.interval = 'monthly'
  }

  const response = await axios.get<Record<string, unknown>>(BASE_URL, { params })
  return response.data
}

export async function getCommodityData(functionName: string): Promise<Record<string, unknown>> {
  const params = { function: functionName, interval: 'monthly', apikey: API_KEY ?? '' }
  const response = await axios.get<Record<string, unknown>>(BASE_URL, { params })
  return response.data
}
