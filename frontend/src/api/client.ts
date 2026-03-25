import axios from 'axios'
import type { ApiResponse, StockQuote, IndexQuote, MacroDataPoint, CryptoListing, CryptoGlobal, ForexPair, Commodity, NewsArticle, SentimentData, MarketNewsItem, AuthResponse, AuthUser } from '../types'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ep_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
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

export const authApi = {
  register: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { email, password }).then(r => r.data),
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }).then(r => r.data),
  me: () => api.get<{ user: AuthUser }>('/auth/me').then(r => r.data),
}

export const watchlistApi = {
  get: () => api.get<{ data: string[] }>('/watchlist').then(r => r.data.data),
  add: (symbol: string) => api.post<{ data: string[] }>(`/watchlist/${symbol}`).then(r => r.data.data),
  remove: (symbol: string) => api.delete<{ data: string[] }>(`/watchlist/${symbol}`).then(r => r.data.data),
}
