export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  previousClose: number
}

export interface IndexQuote extends StockQuote {
  name: string
}

export interface MacroDataPoint {
  date: string
  value: string
}

export interface CryptoListing {
  id: number
  name: string
  symbol: string
  price: number
  percent_change_1h: number
  percent_change_24h: number
  percent_change_7d: number
  market_cap: number
  volume_24h: number
  circulating_supply: number
}

export interface CryptoGlobal {
  total_market_cap: number
  total_volume_24h: number
  bitcoin_dominance: number
  active_cryptocurrencies: number
}

export interface ForexPair {
  pair: string
  rate: number
  change?: number
  changePercent?: number
}

export interface Commodity {
  name: string
  function: string
  price: number
  previousPrice: number
  change: number
  changePercent: number
  category: 'energy' | 'metals' | 'agriculture'
}

export interface NewsArticle {
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  urlToImage: string | null
}

export interface SentimentData {
  buzz: number
  sentiment: number
  bearishPercent: number
  bullishPercent: number
  fearGreedScore: number
  articlesLastWeek: number
}

export interface MarketNewsItem {
  headline: string
  summary: string
  url: string
  source: string
  datetime: number
}

export interface ApiResponse<T> {
  cached: boolean
  data: T
}
