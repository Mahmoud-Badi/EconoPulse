import { Router, Request, Response } from 'express'
import { cacheOrFetch } from '../lib/cache'
import { getRecentBars, getNews } from '../services/massiveService'

const router = Router()

interface NewsInsight { sentiment?: string; [key: string]: unknown }
interface RawArticle {
  published_utc?: string
  title?: string; description?: string; article_url?: string
  publisher?: { name?: string }
  insights?: NewsInsight[]
  [key: string]: unknown
}

router.get('/fear-greed', async (_req: Request, res: Response) => {
  try {
    const { data, cached } = await cacheOrFetch('sentiment_fear_greed', 300, async () => {
      let fearGreedScore = 50
      let bullishPercent = 0.5
      let bearishPercent = 0.5
      let articlesLastWeek = 0

      try {
        const bars = await getRecentBars('SPY', 5)
        if (bars.length >= 2) {
          const latest = bars[bars.length - 1]
          const prev = bars[bars.length - 2]
          const changePercent = prev.c !== 0 ? ((latest.c - prev.c) / prev.c) * 100 : 0
          const normalized = Math.max(-3, Math.min(3, changePercent))
          fearGreedScore = Math.round(((normalized + 3) / 6) * 100)
          bullishPercent = parseFloat((fearGreedScore / 100).toFixed(2))
          bearishPercent = parseFloat((1 - bullishPercent).toFixed(2))
        }
      } catch (_) { /* use defaults */ }

      try {
        const articles = (await getNews({ limit: 50 })) as RawArticle[]
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
        const recent = articles.filter((a) => new Date(a.published_utc ?? 0).getTime() > oneWeekAgo)
        articlesLastWeek = recent.length
        const withInsights = recent.filter((a) => a.insights && a.insights.length > 0)
        if (withInsights.length > 0) {
          const pos = withInsights.reduce((s, a) => s + (a.insights ?? []).filter((i) => i.sentiment === 'positive').length, 0)
          const total = withInsights.reduce((s, a) => s + (a.insights ?? []).length, 0)
          if (total > 0) {
            bullishPercent = parseFloat((pos / total).toFixed(2))
            bearishPercent = parseFloat((1 - bullishPercent).toFixed(2))
            fearGreedScore = Math.round(bullishPercent * 100)
          }
        }
      } catch (_) { /* use defaults */ }

      return {
        fearGreedScore,
        buzz: parseFloat((articlesLastWeek / 10).toFixed(1)),
        sentiment: parseFloat((bullishPercent - 0.5).toFixed(2)),
        bearishPercent, bullishPercent, articlesLastWeek,
      }
    })
    return res.json({ cached, data })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

router.get('/market-news', async (_req: Request, res: Response) => {
  try {
    const { data, cached } = await cacheOrFetch('sentiment_market_news', 300, async () => {
      const articles = (await getNews({ limit: 10 })) as RawArticle[]
      return articles.slice(0, 10).map((a) => ({
        headline: a.title ?? '',
        summary: a.description ?? a.title ?? '',
        url: a.article_url ?? '',
        source: a.publisher?.name ?? 'Unknown',
        datetime: Math.floor(new Date(a.published_utc ?? 0).getTime() / 1000),
      }))
    })
    return res.json({ cached, data })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

export default router
