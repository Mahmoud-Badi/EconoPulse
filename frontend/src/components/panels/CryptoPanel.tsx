import { useCrypto, useCryptoGlobal } from '../../hooks/useCrypto'
import { ChangeIndicator } from '../shared/ChangeIndicator'
import { CardSkeleton, TableSkeleton } from '../shared/LoadingSkeleton'

export function CryptoPanel() {
  const { data: listingsData, isLoading: listingsLoading, error } = useCrypto()
  const { data: globalData, isLoading: globalLoading } = useCryptoGlobal()

  const listings = listingsData?.data || []
  const global = globalData?.data

  const formatBig = (n: number) => {
    if (!n) return '...'
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
    return `$${n.toFixed(2)}`
  }

  const formatPrice = (p: number) => {
    if (p >= 1) return `$${p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    return `$${p.toFixed(6)}`
  }

  return (
    <div className="space-y-4">
      <h1 className="text-accent-cyan font-mono text-sm font-bold uppercase tracking-wider">Crypto Markets</h1>

      {/* Global metrics */}
      <div className="grid grid-cols-4 gap-3">
        {globalLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <div className="bg-bg-panel border border-border-default rounded p-3">
              <div className="text-text-dim text-[10px] font-mono uppercase">Total Market Cap</div>
              <div className="text-text-primary font-data text-lg font-semibold">{formatBig(global?.total_market_cap || 0)}</div>
            </div>
            <div className="bg-bg-panel border border-border-default rounded p-3">
              <div className="text-text-dim text-[10px] font-mono uppercase">24h Volume</div>
              <div className="text-text-primary font-data text-lg font-semibold">{formatBig(global?.total_volume_24h || 0)}</div>
            </div>
            <div className="bg-bg-panel border border-border-default rounded p-3">
              <div className="text-text-dim text-[10px] font-mono uppercase">BTC Dominance</div>
              <div className="text-accent-amber font-data text-lg font-semibold">{global?.bitcoin_dominance?.toFixed(1) || '...'}%</div>
            </div>
            <div className="bg-bg-panel border border-border-default rounded p-3">
              <div className="text-text-dim text-[10px] font-mono uppercase">Active Coins</div>
              <div className="text-text-primary font-data text-lg font-semibold">{global?.active_cryptocurrencies?.toLocaleString() || '...'}</div>
            </div>
          </>
        )}
      </div>

      {/* Listings table */}
      {error ? (
        <div className="bg-bg-panel border border-accent-red/30 rounded p-4 text-accent-red text-sm">Failed to load crypto data.</div>
      ) : listingsLoading ? (
        <TableSkeleton rows={10} />
      ) : (
        <div className="bg-bg-panel border border-border-default rounded overflow-hidden">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border-default text-text-dim">
                <th className="p-2 text-left w-8">#</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-right">Price</th>
                <th className="p-2 text-right">1h %</th>
                <th className="p-2 text-right">24h %</th>
                <th className="p-2 text-right">7d %</th>
                <th className="p-2 text-right">Market Cap</th>
                <th className="p-2 text-right">Volume 24h</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((coin: any, i: number) => (
                <tr key={coin.id} className="border-b border-border-default hover:bg-bg-hover transition-colors">
                  <td className="p-2 text-text-dim">{i + 1}</td>
                  <td className="p-2">
                    <span className="text-accent-cyan font-semibold">{coin.symbol}</span>
                    <span className="text-text-dim ml-1.5">{coin.name}</span>
                  </td>
                  <td className="p-2 text-right text-text-primary">{formatPrice(coin.price)}</td>
                  <td className="p-2 text-right"><ChangeIndicator value={coin.percent_change_1h} /></td>
                  <td className="p-2 text-right"><ChangeIndicator value={coin.percent_change_24h} /></td>
                  <td className="p-2 text-right"><ChangeIndicator value={coin.percent_change_7d} /></td>
                  <td className="p-2 text-right text-text-secondary">{formatBig(coin.market_cap)}</td>
                  <td className="p-2 text-right text-text-secondary">{formatBig(coin.volume_24h)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
