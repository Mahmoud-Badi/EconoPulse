import { Router, Request, Response } from 'express'
import { cacheOrFetch } from '../lib/cache'
import { getNews } from '../services/massiveService'

const router = Router()

interface RawArticle {
  title?: string
  description?: string
  article_url?: string
  publisher?: { name?: string }
  published_utc?: string
  image_url?: string
  [key: string]: unknown
}

function mapArticle(article: RawArticle) {
  return {
    title: article.title ?? '',
    description: article.description ?? article.title ?? '',
    url: article.article_url ?? '',
    source: article.publisher?.name ?? 'Unknown',
    publishedAt: article.published_utc ?? '',
    urlToImage: article.image_url ?? null,
  }
}

router.get('/headlines', async (_req: Request, res: Response) => {
  try {
    const { data, cached } = await cacheOrFetch('news_headlines', 600, async () => {
      const articles = await getNews({ limit: 20 })
      return (articles as RawArticle[]).map(mapArticle)
    })
    return res.json({ cached, data })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

router.get('/top', async (_req: Request, res: Response) => {
  try {
    const { data, cached } = await cacheOrFetch('news_top', 600, async () => {
      const articles = await getNews({ ticker: 'SPY', limit: 20 })
      return (articles as RawArticle[]).map(mapArticle)
    })
    return res.json({ cached, data })
  } catch (error) {
    return res.status(500).json({ error: true, message: (error as Error).message })
  }
})

export default router
