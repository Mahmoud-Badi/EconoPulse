import { useStocks } from '../../hooks/useStocks'
import { useCrypto } from '../../hooks/useCrypto'

export function StatusBar() {
  const { data: stocksData } = useStocks()
  const { data: cryptoData } = useCrypto()

  const stocks = stocksData?.data || []
  const cryptos = cryptoData?.data || []

  const tickerItems = [
    ...stocks.slice(0, 8).map((s: any) => ({
      symbol: s.symbol,
      price: s.price,
      change: s.changePercent,
      type: 'stock' as const,
    })),
    ...cryptos.slice(0, 5).map((c: any) => ({
      symbol: c.symbol,
      price: c.price,
      change: c.percent_change_24h,
      type: 'crypto' as const,
    })),
  ]

  if (tickerItems.length === 0) {
    return (
      <footer className="h-7 bg-bg-secondary border-t border-border-default flex items-center px-4 shrink-0">
        <span className="text-text-dim text-xs font-mono">Loading market data...</span>
      </footer>
    )
  }

  const formatPrice = (p: number) => {
    if (p >= 1000) return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    if (p >= 1) return p.toFixed(2)
    return p.toFixed(4)
  }

  return (
    <footer className="h-7 bg-bg-secondary border-t border-border-default overflow-hidden shrink-0">
      <div className="animate-ticker flex items-center h-full whitespace-nowrap">
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 mx-4 text-xs font-mono">
            <span className={item.type === 'crypto' ? 'text-accent-amber' : 'text-text-label'}>{item.symbol}</span>
            <span className="text-text-primary">${formatPrice(item.price)}</span>
            <span className={item.change >= 0 ? 'text-accent-green' : 'text-accent-red'}>
              {item.change >= 0 ? '▲' : '▼'}{Math.abs(item.change).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </footer>
  )
}
