import { useIndices } from '../../hooks/useStocks'
import { useCrypto } from '../../hooks/useCrypto'
import { useCommodities } from '../../hooks/useCommodities'
import { useForex } from '../../hooks/useForex'
import { useNews } from '../../hooks/useNews'
import { useFearGreed } from '../../hooks/useSentiment'
import { useCpi, useUnemployment, useInterestRate } from '../../hooks/useMacro'
import { DataCard } from '../shared/DataCard'
import { ChangeIndicator } from '../shared/ChangeIndicator'
import { CardSkeleton } from '../shared/LoadingSkeleton'

export function OverviewPanel() {
  const { data: indicesData, isLoading: indicesLoading } = useIndices()
  const { data: cryptoData, isLoading: cryptoLoading } = useCrypto()
  const { data: commoditiesData, isLoading: commoditiesLoading } = useCommodities()
  const { data: forexData, isLoading: forexLoading } = useForex()
  const { data: newsData, isLoading: newsLoading } = useNews()
  const { data: fearGreedData, isLoading: fgLoading } = useFearGreed()
  const { data: cpiData } = useCpi()
  const { data: unemploymentData } = useUnemployment()
  const { data: interestRateData } = useInterestRate()

  const indices = indicesData?.data || []
  const cryptos = (cryptoData?.data || []).slice(0, 5)
  const commodities = (commoditiesData?.data || []).slice(0, 5)
  const forexPairs = (forexData?.data || []).slice(0, 6)
  const news = (newsData?.data || []).slice(0, 5)

  const latestCpi = cpiData?.data?.[0]
  const latestUnemployment = unemploymentData?.data?.[0]
  const latestRate = interestRateData?.data?.[0]

  const fearGreedScore = fearGreedData?.data?.fearGreedScore ?? 50
  const fgLabel = fearGreedScore <= 25 ? 'Extreme Fear' : fearGreedScore <= 45 ? 'Fear' : fearGreedScore <= 55 ? 'Neutral' : fearGreedScore <= 75 ? 'Greed' : 'Extreme Greed'
  const fgColor = fearGreedScore <= 25 ? 'text-accent-red' : fearGreedScore <= 45 ? 'text-accent-red' : fearGreedScore <= 55 ? 'text-accent-amber' : fearGreedScore <= 75 ? 'text-accent-green' : 'text-accent-green'

  const formatPrice = (p: number) => {
    if (p >= 1) return `$${p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    return `$${p.toFixed(4)}`
  }

  return (
    <div className="space-y-4">
      {/* Section: Major Indices */}
      <div>
        <h2 className="text-text-dim text-[10px] font-mono uppercase tracking-widest mb-2">Major Indices</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {indicesLoading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : indices.map((idx: any) => (
                <DataCard
                  key={idx.symbol}
                  label={idx.name || idx.symbol}
                  value={formatPrice(idx.price)}
                  change={idx.change}
                  changePercent={idx.changePercent}
                />
              ))}
        </div>
      </div>

      {/* Section: Fear/Greed + Macro */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-bg-panel border border-border-default rounded p-3">
          <div className="text-text-dim text-[10px] font-mono uppercase tracking-wider mb-1">Fear & Greed Index</div>
          {fgLoading ? (
            <CardSkeleton />
          ) : (
            <>
              <div className={`font-data text-3xl font-bold ${fgColor}`}>{fearGreedScore}</div>
              <div className={`text-xs font-mono ${fgColor}`}>{fgLabel}</div>
            </>
          )}
        </div>
        <DataCard label="CPI (Latest)" value={latestCpi?.value ?? '...'} suffix="%" />
        <DataCard label="Unemployment" value={latestUnemployment?.value ?? '...'} suffix="%" />
        <DataCard label="Fed Funds Rate" value={latestRate?.value ?? '...'} suffix="%" />
      </div>

      {/* Section: Top Crypto + Commodities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h2 className="text-text-dim text-[10px] font-mono uppercase tracking-widest mb-2">Top Crypto</h2>
          <div className="bg-bg-panel border border-border-default rounded overflow-hidden">
            {cryptoLoading ? (
              <div className="p-3"><CardSkeleton /></div>
            ) : (
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-border-default text-text-dim">
                    <th className="text-left p-2">Name</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">24h</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptos.map((c: any) => (
                    <tr key={c.id} className="border-b border-border-default hover:bg-bg-hover">
                      <td className="p-2 text-accent-cyan">{c.symbol}</td>
                      <td className="p-2 text-right text-text-primary">{formatPrice(c.price)}</td>
                      <td className="p-2 text-right"><ChangeIndicator value={c.percent_change_24h} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-text-dim text-[10px] font-mono uppercase tracking-widest mb-2">Top Commodities</h2>
          <div className="bg-bg-panel border border-border-default rounded overflow-hidden">
            {commoditiesLoading ? (
              <div className="p-3"><CardSkeleton /></div>
            ) : (
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-border-default text-text-dim">
                    <th className="text-left p-2">Name</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {commodities.map((c: any) => (
                    <tr key={c.name} className="border-b border-border-default hover:bg-bg-hover">
                      <td className="p-2 text-text-label">{c.name}</td>
                      <td className="p-2 text-right text-text-primary">{formatPrice(c.price)}</td>
                      <td className="p-2 text-right"><ChangeIndicator value={c.changePercent} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Section: News + Forex */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-3">
          <h2 className="text-text-dim text-[10px] font-mono uppercase tracking-widest mb-2">Latest Headlines</h2>
          <div className="space-y-1">
            {newsLoading ? (
              Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
            ) : (
              news.map((article: any, i: number) => (
                <a
                  key={i}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-bg-panel border border-border-default rounded p-2 hover:bg-bg-hover transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-accent-blue text-[10px] font-mono bg-bg-secondary px-1.5 py-0.5 rounded shrink-0">{article.source}</span>
                    <div>
                      <div className="text-text-primary text-xs font-medium leading-tight">{article.title}</div>
                      <div className="text-text-dim text-[10px] mt-0.5">
                        {new Date(article.publishedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-text-dim text-[10px] font-mono uppercase tracking-widest mb-2">Forex Snapshot</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
            {forexLoading
              ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
              : forexPairs.map((pair: any) => (
                  <div key={pair.pair} className="bg-bg-panel border border-border-default rounded p-2">
                    <div className="text-accent-amber text-[10px] font-mono">{pair.pair}</div>
                    <div className="text-text-primary font-data text-sm font-semibold">{pair.rate?.toFixed(4)}</div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}
