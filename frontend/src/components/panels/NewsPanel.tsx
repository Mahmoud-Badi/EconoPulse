import { useNews, useTopNews } from '../../hooks/useNews'
import { CardSkeleton } from '../shared/LoadingSkeleton'

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const sourceColors: Record<string, string> = {
  'Reuters': 'bg-blue-900/50 text-accent-blue',
  'Bloomberg': 'bg-red-900/50 text-accent-red',
  'CNBC': 'bg-yellow-900/50 text-accent-amber',
  'Financial Times': 'bg-orange-900/50 text-accent-amber',
}

function getSourceStyle(source: string) {
  return sourceColors[source] || 'bg-bg-secondary text-text-label'
}

function ArticleItem({ article }: { article: any }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-bg-panel border border-border-default rounded p-3 hover:bg-bg-hover transition-colors"
    >
      <div className="flex items-start gap-2 mb-1">
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${getSourceStyle(article.source)}`}>
          {article.source}
        </span>
        <span className="text-text-dim text-[10px] font-mono shrink-0" title={new Date(article.publishedAt).toLocaleString()}>
          {timeAgo(article.publishedAt)}
        </span>
      </div>
      <div className="text-text-primary text-xs font-medium leading-snug">{article.title}</div>
      {article.description && (
        <div className="text-text-dim text-[10px] mt-1 line-clamp-2">{article.description}</div>
      )}
    </a>
  )
}

export function NewsPanel() {
  const { data: newsData, isLoading: newsLoading, error: newsError } = useNews()
  const { data: topData, isLoading: topLoading, error: topError } = useTopNews()

  const headlines = newsData?.data || []
  const topNews = topData?.data || []

  return (
    <div className="space-y-4">
      <h1 className="text-accent-amber font-mono text-sm font-bold uppercase tracking-wider">News</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-text-dim text-[10px] font-mono uppercase tracking-widest mb-2">Top Business Headlines</h2>
          <div className="space-y-2">
            {topError ? (
              <div className="text-accent-red text-xs">Failed to load headlines</div>
            ) : topLoading ? (
              Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
            ) : (
              topNews.map((article: any, i: number) => <ArticleItem key={i} article={article} />)
            )}
          </div>
        </div>
        <div>
          <h2 className="text-text-dim text-[10px] font-mono uppercase tracking-widest mb-2">Economy & Markets</h2>
          <div className="space-y-2">
            {newsError ? (
              <div className="text-accent-red text-xs">Failed to load news</div>
            ) : newsLoading ? (
              Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
            ) : (
              headlines.map((article: any, i: number) => <ArticleItem key={i} article={article} />)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
