import { useForex } from '../../hooks/useForex'
import { CardSkeleton } from '../shared/LoadingSkeleton'

const groups: Record<string, string[]> = {
  'Major Pairs': ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF'],
  'Asian Pairs': ['USD/CNY', 'USD/KRW', 'USD/INR'],
  'Emerging Markets': ['AUD/USD', 'USD/CAD', 'USD/MXN', 'USD/BRL'],
}

export function ForexPanel() {
  const { data: forexData, isLoading, error } = useForex()
  const pairs = forexData?.data || []

  const getPair = (name: string) => pairs.find((p: any) => p.pair === name)

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-accent-amber font-mono text-sm font-bold uppercase tracking-wider">Forex</h1>
        <div className="bg-bg-panel border border-accent-red/30 rounded p-4 text-accent-red text-sm">Failed to load forex data.</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-accent-amber font-mono text-sm font-bold uppercase tracking-wider">Foreign Exchange</h1>
      {Object.entries(groups).map(([group, pairNames]) => (
        <div key={group}>
          <h2 className="text-text-dim text-[10px] font-mono uppercase tracking-widest mb-2">{group}</h2>
          <div className="grid grid-cols-4 gap-3">
            {isLoading
              ? pairNames.map((_, i) => <CardSkeleton key={i} />)
              : pairNames.map(name => {
                  const pair = getPair(name)
                  if (!pair) return null
                  return (
                    <div key={name} className="bg-bg-panel border border-border-default rounded p-3 hover:bg-bg-hover transition-colors">
                      <div className="text-accent-amber text-[10px] font-mono mb-1">{name}</div>
                      <div className="text-text-primary font-data text-2xl font-semibold">{pair.rate?.toFixed(4)}</div>
                    </div>
                  )
                })}
          </div>
        </div>
      ))}
    </div>
  )
}
