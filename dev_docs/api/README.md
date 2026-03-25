# EconoPulse API Reference

Base URL (production): `https://www.econopulse.live/api`

All responses follow the shape:
```json
{ "cached": boolean, "data": T }
```
Errors return:
```json
{ "error": true, "message": "Description" }
```

Rate limit: **60 requests / IP / minute** (HTTP 429 on breach).

Cache-Control headers are set per endpoint type — clients may respect them to avoid unnecessary refetches.

---

## Stocks

### `GET /stocks/quotes`
Returns the latest daily bar for 10 large-cap US stocks.

**Cache TTL:** 60s

**Response `data`:** `StockQuote[]`
```ts
{
  symbol: string          // e.g. "AAPL"
  price: number           // latest close
  change: number          // close − open (intraday change)
  changePercent: number   // change as %
  high: number
  low: number
  previousClose: number   // day's open (used as reference)
  volume: number
}
```

**Symbols:** AAPL, MSFT, GOOGL, AMZN, NVDA, TSLA, META, JPM, BAC, GS

---

### `GET /stocks/indices`
Returns the 4 major US indices via ETF proxies, scaled to approximate index levels.

**Cache TTL:** 60s

**Response `data`:** `IndexQuote[]`
```ts
{
  symbol: string          // ETF ticker (SPY, QQQ, DIA, IWM)
  name: string            // "S&P 500" | "NASDAQ" | "Dow Jones" | "Russell 2000"
  price: number           // ETF price × multiplier ≈ index level
  change: number
  changePercent: number
  high: number
  low: number
  previousClose: number
  volume: number
}
```

**Proxy multipliers:** SPY×10.19, QQQ×34.3, DIA×95, IWM×8.7

---

## Crypto

### `GET /crypto/listings`
Returns the top 10 cryptocurrencies by market cap.

**Cache TTL:** 300s

**Response `data`:** `CryptoListing[]`
```ts
{
  id: number
  name: string
  symbol: string          // e.g. "BTC"
  price: number           // USD
  percent_change_24h: number
  volume_24h: number
  market_cap: number      // 0 — not available on current plan
  circulating_supply: number  // 0 — not available on current plan
}
```

---

### `GET /crypto/global`
Global crypto market summary.

**Cache TTL:** 300s

**Response `data`:**
```ts
{
  total_market_cap: number      // approximated from BTC dominance
  total_volume_24h: number      // BTC volume × price
  bitcoin_dominance: number     // 55.0 (static estimate)
  active_cryptocurrencies: number
}
```

---

## Forex

### `GET /forex/rates`
Returns exchange rates for 8 major currency pairs.

**Cache TTL:** 60s

**Response `data`:** `ForexPair[]`
```ts
{
  pair: string            // e.g. "EUR/USD"
  rate: number
  change: number          // close − open
  changePercent: number
}
```

**Pairs:** EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, NZD/USD, EUR/GBP

---

## Commodities

### `GET /commodities/quotes`
Returns prices for 10 commodities via US-listed ETF proxies.

**Cache TTL:** 300s

**Response `data`:** `Commodity[]`
```ts
{
  symbol: string          // ETF ticker (GLD, SLV, USO, ...)
  name: string            // "Gold" | "Silver" | ...
  category: "metals" | "energy" | "agriculture"
  function: string        // original commodity identifier
  price: number           // ETF close price
  previousPrice: number   // day's open
  change: number
  changePercent: number
}
```

**ETF proxies:** GLD (Gold), SLV (Silver), CPER (Copper), USO (Crude Oil), UNG (Natural Gas), WEAT (Wheat), CORN (Corn), BAL (Cotton), SGG (Sugar), JO (Coffee)

---

## Macro

All macro endpoints share the same response shape. Data is cached for 24h. Falls back to hardcoded reference data when Alpha Vantage is unavailable.

**Response `data`:** `MacroDataPoint[]`
```ts
{ date: string; value: string }  // date: "YYYY-MM-DD", value: numeric string
```

| Endpoint | Indicator | Points |
|----------|-----------|--------|
| `GET /macro/gdp` | Real GDP (annual, billions USD) | 10 |
| `GET /macro/inflation` | CPI YoY % | 10 |
| `GET /macro/cpi` | CPI index value (monthly) | 12 |
| `GET /macro/unemployment` | Unemployment rate % (monthly) | 24 |
| `GET /macro/interest-rate` | Federal Funds Rate % (monthly) | 24 |
| `GET /macro/treasury-yield` | 10-year Treasury yield % (monthly) | 24 |

---

## News

### `GET /news/headlines`
General financial news headlines.

**Cache TTL:** 600s

**Response `data`:** `NewsArticle[]`
```ts
{
  title: string
  description: string
  url: string
  source: string
  publishedAt: string     // ISO 8601
  urlToImage: string | null
}
```

### `GET /news/top`
Market news filtered to SPY-related articles.

Same shape as `/news/headlines`.

---

## Sentiment

### `GET /sentiment/fear-greed`
Fear & Greed index derived from SPY price action and news sentiment.

**Cache TTL:** 300s

**Response `data`:**
```ts
{
  fearGreedScore: number    // 0–100 (0=extreme fear, 100=extreme greed)
  buzz: number              // articles last 7 days ÷ 10
  sentiment: number         // bullishPercent − 0.5 (−0.5 to +0.5)
  bullishPercent: number
  bearishPercent: number
  articlesLastWeek: number
}
```

### `GET /sentiment/market-news`
Recent market news headlines with sentiment context.

**Cache TTL:** 300s

**Response `data`:** `MarketNewsItem[]`
```ts
{
  headline: string
  summary: string
  url: string
  source: string
  datetime: number    // Unix timestamp
}
```

---

## Health

### `GET /health`
Server liveness check. Not rate-limited. No cache.

**Response:**
```json
{ "status": "ok", "timestamp": "2026-03-24T12:00:00.000Z" }
```

---

## Data Source

All market data is provided by [Massive](https://massive.com/) (Polygon.io-compatible API).
Macro data from Alpha Vantage (falls back to reference data when unavailable).
