import { useState } from 'react'
import { useStocks, useIndices } from '../../hooks/useStocks'
import { DataCard } from '../shared/DataCard'
import { ChangeIndicator } from '../shared/ChangeIndicator'
import { CardSkeleton, TableSkeleton } from '../shared/LoadingSkeleton'

type SortKey = 'symbol' | 'price' | 'change' | 'changePercent' | 'high' | 'low'

export function StocksPanel() {
  const { data: stocksData, isLoading: stocksLoading, error: stocksError } = useStocks()
  const { data: indicesData, isLoading: indicesLoading } = useIndices()
  const [sortKey, setSortKey] = useState<SortKey>('symbol')
  const [sortAsc, setSortAsc] = useState(true)

  const stocks = stocksData?.data || []
  const indices = indicesData?.data || []

  const sorted = [...stocks].sort((a: any, b: any) => {
    const va = a[sortKey]
    const vb = b[sortKey]
    if (typeof va === 'string') return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va)
    return sortAsc ? va - vb : vb - va
  })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  const sortIcon = (key: SortKey) => sortKey === key ? (sortAsc ? ' ↑' : ' ↓') : ''

  const formatPrice = (p: number) => `$${p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div className="space-y-4">
      <h1 className="text-accent-amber font-mono text-sm font-bold uppercase tracking-wider">Markets</h1>

      {/* Index cards */}
      <div>
        <h2 className="text-text-dim text-[10px] font-mono uppercase tracking-widest mb-2">Indices</h2>
        <div className="grid grid-cols-4 gap-3">
          {indicesLoading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : indices.map((idx: any) => (
                <DataCard key={idx.symbol} label={idx.name || idx.symbol} value={formatPrice(idx.price)} change={idx.change} changePercent={idx.changePercent} />
              ))}
        </div>
      </div>

      {/* Stocks table */}
      <div>
        <h2 className="text-text-dim text-[10px] font-mono uppercase tracking-widest mb-2">Stocks</h2>
        {stocksError ? (
          <div className="bg-bg-panel border border-accent-red/30 rounded p-4 text-accent-red text-sm">
            Failed to load stock data. Please try again.
          </div>
        ) : stocksLoading ? (
          <TableSkeleton rows={10} />
        ) : (
          <div className="bg-bg-panel border border-border-default rounded overflow-hidden">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border-default text-text-dim">
                  {[
                    { key: 'symbol', label: 'Symbol' },
                    { key: 'price', label: 'Price' },
                    { key: 'change', label: 'Change' },
                    { key: 'changePercent', label: 'Change %' },
                    { key: 'high', label: 'High' },
                    { key: 'low', label: 'Low' },
                  ].map(col => (
                    <th
                      key={col.key}
                      className={`p-2 cursor-pointer hover:text-text-secondary ${col.key === 'symbol' ? 'text-left' : 'text-right'}`}
                      onClick={() => handleSort(col.key as SortKey)}
                    >
                      {col.label}{sortIcon(col.key as SortKey)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((stock: any) => (
                  <tr key={stock.symbol} className="border-b border-border-default hover:bg-bg-hover transition-colors">
                    <td className="p-2 text-accent-amber font-semibold">{stock.symbol}</td>
                    <td className="p-2 text-right text-text-primary">{formatPrice(stock.price)}</td>
                    <td className="p-2 text-right">
                      <ChangeIndicator value={stock.change} suffix="" />
                    </td>
                    <td className="p-2 text-right">
                      <ChangeIndicator value={stock.changePercent} />
                    </td>
                    <td className="p-2 text-right text-text-secondary">{formatPrice(stock.high)}</td>
                    <td className="p-2 text-right text-text-secondary">{formatPrice(stock.low)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
