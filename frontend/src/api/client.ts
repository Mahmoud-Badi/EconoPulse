import axios from 'axios'
import type { ApiResponse, StockQuote, IndexQuote, MacroDataPoint, CryptoListing, CryptoGlobal, ForexPair, Commodity, NewsArticle, SentimentData, MarketNewsItem } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10000,
})

export const stocksApi = {
  getQuotes: () => api.get<ApiResponse<StockQuote[]>>('/stocks/quotes').then(r => r.data),
  getIndices: () => api.get<ApiResponse<IndexQuote[]>>('/stocks/indices').then(r => r.data),
}

export const macroApi = {
  getGdp: () => api.get<ApiResponse<MacroDataPoint[]>>('/macro/gdp').then(r => r.data),
  getInflation: () => api.get<ApiResponse<MacroDataPoint[]>>('/macro/inflation').then(r => r.data),
  getCpi: () => api.get<ApiResponse<MacroDataPoint[]>>('/macro/cpi').then(r => r.data),
  getUnemployment: () => api.get<ApiResponse<MacroDataPoint[]>>('/macro/unemployment').then(r => r.data),
  getInterestRate: () => api.get<ApiResponse<MacroDataPoint[]>>('/macro/interest-rate').then(r => r.data),
  getTreasuryYield: () => api.get<ApiResponse<MacroDataPoint[]>>('/macro/treasury-yield').then(r => r.data),
}

export const cryptoApi = {
  getListings: () => api.get<ApiResponse<CryptoListing[]>>('/crypto/listings').then(r => r.data),
  getGlobal: () => api.get<ApiResponse<CryptoGlobal>>('/crypto/global').then(r => r.data),
}

export const forexApi = {
  getRates: () => api.get<ApiResponse<ForexPair[]>>('/forex/rates').then(r => r.data),
}

export const commoditiesApi = {
  getQuotes: () => api.get<ApiResponse<Commodity[]>>('/commodities/quotes').then(r => r.data),
}

export const newsApi = {
  getHeadlines: () => api.get<ApiResponse<NewsArticle[]>>('/news/headlines').then(r => r.data),
  getTop: () => api.get<ApiResponse<NewsArticle[]>>('/news/top').then(r => r.data),
}

export const sentimentApi = {
  getFearGreed: () => api.get<ApiResponse<SentimentData>>('/sentiment/fear-greed').then(r => r.data),
  getMarketNews: () => api.get<ApiResponse<MarketNewsItem[]>>('/sentiment/market-news').then(r => r.data),
}
