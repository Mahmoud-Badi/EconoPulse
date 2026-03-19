import { useCommodities } from '../../hooks/useCommodities'
import { ChangeIndicator } from '../shared/ChangeIndicator'
import { CardSkeleton } from '../shared/LoadingSkeleton'

const categoryColors: Record<string, string> = {
  energy: 'text-accent-amber',
  metals: 'text-accent-cyan',
  agriculture: 'text-accent-green',
}

const categoryOrder = ['energy', 'metals', 'agriculture'] as const

export function CommoditiesPanel() {
  const { data: commoditiesData, isLoading, error } = useCommodities()
  const commodities = commoditiesData?.data || []

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-accent-amber font-mono text-sm font-bold uppercase tracking-wider">Commodities</h1>
        <div className="bg-bg-panel border border-accent-red/30 rounded p-4 text-accent-red text-sm">Failed to load commodities data.</div>
      </div>
    )
  }

  const grouped = categoryOrder.map(cat => ({
    category: cat,
    items: commodities.filter((c: any) => c.category === cat),
  }))

  return (
    <div className="space-y-4">
      <h1 className="text-accent-amber font-mono text-sm font-bold uppercase tracking-wider">Commodities</h1>
      {grouped.map(({ category, items }) => (
        <div key={category}>
          <h2 className={`text-[10px] font-mono uppercase tracking-widest mb-2 ${categoryColors[category]}`}>
            {category}
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
              : items.map((c: any) => (
                  <div key={c.name} className="bg-bg-panel border border-border-default rounded p-3 hover:bg-bg-hover transition-colors">
                    <div className="text-text-label text-[10px] font-mono uppercase mb-1">{c.name}</div>
                    <div className="text-text-primary font-data text-lg font-semibold">
                      ${c.price?.toFixed(2)}
                    </div>
                    <div className="mt-1">
                      <ChangeIndicator value={c.changePercent || 0} />
                    </div>
                  </div>
                ))}
          </div>
        </div>
      ))}
    </div>
  )
}
