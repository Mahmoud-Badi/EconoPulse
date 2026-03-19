# EconoPulse

Bloomberg Terminal-style world economy dashboard.

**Live:** [econopulse.live](http://econopulse.live/)

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Recharts, TanStack Query
- **Backend:** Node.js, Express
- **Deployment:** Vercel

## Data Sources

| Provider | Data |
|---|---|
| [Finnhub](https://finnhub.io) | Stocks, forex, sentiment, news |
| [Alpha Vantage](https://www.alphavantage.co) | Macro economic indicators, commodities |
| [CoinMarketCap](https://coinmarketcap.com) | Crypto prices and market data |
| [NewsAPI](https://newsapi.org) | Economic and business headlines |

## Local Development

### Backend

```bash
cd backend
npm install
cp .env.example .env   # add your API keys
npm run dev            # starts on port 5001
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # starts on port 3000
```

## Environment Variables

Create `backend/.env` with the following keys:

```
FINNHUB_API_KEY=
ALPHA_VANTAGE_KEY=
COINMARKETCAP_API_KEY=
NEWS_API_KEY=
```
