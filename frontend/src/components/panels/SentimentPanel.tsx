import { useFearGreed, useMarketNews } from '../../hooks/useSentiment'
import { CardSkeleton } from '../shared/LoadingSkeleton'

function FearGreedGauge({ score }: { score: number }) {
  const getLabel = (s: number) =>
    s <= 25 ? 'Extreme Fear' : s <= 45 ? 'Fear' : s <= 55 ? 'Neutral' : s <= 75 ? 'Greed' : 'Extreme Greed'
  const getColor = (s: number) =>
    s <= 25 ? '#ff3d3d' : s <= 45 ? '#ff6b6b' : s <= 55 ? '#f0a500' : s <= 75 ? '#66bb6a' : '#00c853'

  const color = getColor(score)

  // Arc helper: compute point on arc given angle in degrees (0=left, 180=right)
  const cx = 100, cy = 100, r = 75
  const polarToCart = (angleDeg: number) => {
    const rad = (Math.PI * angleDeg) / 180
    return {
      x: cx - r * Math.cos(rad),
      y: cy - r * Math.sin(rad),
    }
  }

  // Gauge zones: each zone is [startAngle, endAngle, color]
  const zones: [number, number, string][] = [
    [0, 45, '#ff3d3d'],     // Extreme Fear (0-25)
    [45, 81, '#ff6b6b'],    // Fear (25-45)
    [81, 99, '#f0a500'],    // Neutral (45-55)
    [99, 135, '#66bb6a'],   // Greed (55-75)
    [135, 180, '#00c853'],  // Extreme Greed (75-100)
  ]

  const makeArc = (startDeg: number, endDeg: number) => {
    const s = polarToCart(startDeg)
    const e = polarToCart(endDeg)
    const largeArc = endDeg - startDeg > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`
  }

  // Needle angle: score 0 → 0°, score 100 → 180°
  const needleAngle = (score / 100) * 180
  const needleTip = polarToCart(needleAngle)

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 130" width="260" height="170">
        {/* Background arc */}
        <path d={makeArc(0, 180)} fill="none" stroke="var(--bg-hover)" strokeWidth="18" strokeLinecap="round" />

        {/* Colored zone arcs */}
        {zones.map(([start, end, zoneColor], i) => (
          <path
            key={i}
            d={makeArc(start, end)}
            fill="none"
            stroke={zoneColor}
            strokeWidth="18"
            strokeLinecap={i === 0 || i === zones.length - 1 ? 'round' : 'butt'}
          />
        ))}

        {/* Zone labels */}
        <text x="18" y="118" fill="var(--text-dim)" fontSize="7" fontFamily="JetBrains Mono">0</text>
        <text x="88" y="16" fill="var(--text-dim)" fontSize="7" fontFamily="JetBrains Mono">50</text>
        <text x="173" y="118" fill="var(--text-dim)" fontSize="7" fontFamily="JetBrains Mono">100</text>

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Needle center dot */}
        <circle cx={cx} cy={cy} r="6" fill={color} />
        <circle cx={cx} cy={cy} r="3" fill="var(--bg-primary)" />
      </svg>
      <div className="font-data text-4xl font-bold -mt-2" style={{ color }}>{score}</div>
      <div className="font-mono text-sm mt-1" style={{ color }}>{getLabel(score)}</div>
    </div>
  )
}

export function SentimentPanel() {
  const { data: fgData, isLoading: fgLoading, error: fgError } = useFearGreed()
  const { data: marketNewsData, isLoading: newsLoading } = useMarketNews()

  const sentiment = fgData?.data
  const marketNews = marketNewsData?.data || []

  const fearGreedScore = sentiment?.fearGreedScore ?? 50

  return (
    <div className="space-y-4">
      <h1 className="text-accent-amber font-mono text-sm font-bold uppercase tracking-wider">Market Sentiment</h1>

      <div className="grid grid-cols-3 gap-4">
        {/* Fear & Greed Gauge */}
        <div className="col-span-1 bg-bg-panel border border-border-default rounded p-4">
          <div className="text-text-dim text-[10px] font-mono uppercase tracking-wider mb-3">Fear & Greed Index</div>
          {fgLoading || fgError ? <CardSkeleton /> : <FearGreedGauge score={fearGreedScore} />}
          <div className="mt-3 grid grid-cols-5 gap-0.5 text-[8px] font-mono text-center">
            <div className="text-accent-red">Extreme<br/>Fear</div>
            <div className="text-[#ff6b6b]">Fear</div>
            <div className="text-accent-amber">Neutral</div>
            <div className="text-[#66bb6a]">Greed</div>
            <div className="text-accent-green">Extreme<br/>Greed</div>
          </div>
        </div>

        {/* Sentiment breakdown */}
        <div className="col-span-1 bg-bg-panel border border-border-default rounded p-4">
          <div className="text-text-dim text-[10px] font-mono uppercase tracking-wider mb-3">SPY Sentiment Breakdown</div>
          {fgLoading ? (
            <CardSkeleton />
          ) : (
            <div className="space-y-4 mt-2">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-accent-green">Bullish</span>
                  <span className="text-text-secondary">{((sentiment?.bullishPercent || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-green rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(2, (sentiment?.bullishPercent || 0) * 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-accent-red">Bearish</span>
                  <span className="text-text-secondary">{((sentiment?.bearishPercent || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-red rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(2, (sentiment?.bearishPercent || 0) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border-default space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-text-dim">Buzz Score</span>
                  <span className="text-text-primary font-semibold">{sentiment?.buzz?.toFixed(2) ?? '...'}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-text-dim">Sentiment Score</span>
                  <span className="text-text-primary font-semibold">{sentiment?.sentiment?.toFixed(4) ?? '...'}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-text-dim">Articles Tracked</span>
                  <span className="text-text-primary font-semibold">{sentiment?.articlesLastWeek ?? '...'}</span>
                </div>
              </div>

              {/* Overall sentiment bar */}
              <div className="pt-3 border-t border-border-default">
                <div className="text-text-dim text-[10px] font-mono uppercase mb-2">Overall Market Mood</div>
                <div className="h-4 bg-bg-secondary rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-accent-red transition-all duration-500"
                    style={{ width: `${(sentiment?.bearishPercent || 0.5) * 100}%` }}
                  />
                  <div
                    className="h-full bg-accent-green transition-all duration-500"
                    style={{ width: `${(sentiment?.bullishPercent || 0.5) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono mt-1">
                  <span className="text-accent-red">Fear</span>
                  <span className="text-accent-green">Greed</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Market Headlines */}
        <div className="col-span-1 bg-bg-panel border border-border-default rounded p-4">
          <div className="text-text-dim text-[10px] font-mono uppercase tracking-wider mb-3">Market-Moving Headlines</div>
          {newsLoading ? (
            <CardSkeleton />
          ) : marketNews.length === 0 ? (
            <div className="text-text-dim text-xs font-mono">No headlines available</div>
          ) : (
            <div className="space-y-1 overflow-y-auto max-h-96">
              {marketNews.slice(0, 10).map((item: any, i: number) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 rounded hover:bg-bg-hover transition-colors border-b border-border-default last:border-0"
                >
                  <div className="text-text-primary text-[11px] font-medium leading-snug">{item.headline}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-accent-blue text-[9px] font-mono bg-bg-secondary px-1 py-0.5 rounded">{item.source}</span>
                    <span className="text-text-dim text-[9px] font-mono">
                      {item.datetime ? new Date(item.datetime * 1000).toLocaleDateString() : ''}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
