import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import pinoHttp from 'pino-http'
import pino from 'pino'
import dotenv from 'dotenv'
import { initSentry, Sentry } from './lib/sentry'

dotenv.config()
initSentry()

import stocksRouter from './routes/stocks'
import macroRouter from './routes/macro'
import cryptoRouter from './routes/crypto'
import forexRouter from './routes/forex'
import commoditiesRouter from './routes/commodities'
import newsRouter from './routes/news'
import sentimentRouter from './routes/sentiment'
import authRouter from './routes/auth'
import watchlistRouter from './routes/watchlist'

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
})

const app = express()

app.use(pinoHttp({
  logger,
  // Don't log health checks — too noisy
  autoLogging: { ignore: (req) => req.url === '/api/health' },
}))

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://econopulse.live'
    : 'http://localhost:3000',
  credentials: true,
}))
app.use(helmet())
app.use(express.json())

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, message: 'Too many requests, please slow down.' },
})
app.use('/api/', limiter)

// Cache-Control headers per route type
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/health') {
    res.set('Cache-Control', 'no-store')
  } else if (req.path.startsWith('/api/macro')) {
    res.set('Cache-Control', 'public, max-age=86400')
  } else if (req.path.startsWith('/api/crypto') || req.path.startsWith('/api/commodities')) {
    res.set('Cache-Control', 'public, max-age=300')
  } else {
    res.set('Cache-Control', 'public, max-age=60')
  }
  next()
})

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/stocks', stocksRouter)
app.use('/api/macro', macroRouter)
app.use('/api/crypto', cryptoRouter)
app.use('/api/forex', forexRouter)
app.use('/api/commodities', commoditiesRouter)
app.use('/api/news', newsRouter)
app.use('/api/sentiment', sentimentRouter)
app.use('/api/auth', authRouter)
app.use('/api/watchlist', watchlistRouter)

// Sentry error handler must come before custom error handler
if (process.env.SENTRY_DSN) Sentry.setupExpressErrorHandler(app)

app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, 'Unhandled error')
  res.status(err.status ?? 500).json({ error: err.message || 'Internal Server Error' })
})

const PORT = parseInt(process.env.PORT ?? '5000', 10)

if (process.env.VITEST !== 'true') {
  app.listen(PORT, () => logger.info(`EconoPulse server running on port ${PORT}`))
}

export default app
