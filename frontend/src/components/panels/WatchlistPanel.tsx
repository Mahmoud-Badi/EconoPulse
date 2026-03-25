import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { watchlistApi, stocksApi } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { ChangeIndicator } from '../shared/ChangeIndicator'

export function WatchlistPanel() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [input, setInput] = useState('')

  const { data: watchlist = [], isLoading } = useQuery({
    queryKey: ['watchlist'],
    queryFn: watchlistApi.get,
    enabled: !!user,
  })

  const { data: quotesData } = useQuery({
    queryKey: ['stocks', 'quotes'],
    queryFn: stocksApi.getQuotes,
    staleTime: 60_000,
    enabled: watchlist.length > 0,
  })

  const add = useMutation({
    mutationFn: (symbol: string) => watchlistApi.add(symbol),
    onSuccess: (data) => { qc.setQueryData(['watchlist'], data); setInput('') },
  })

  const remove = useMutation({
    mutationFn: (symbol: string) => watchlistApi.remove(symbol),
    onSuccess: (data) => qc.setQueryData(['watchlist'], data),
  })

  const quotes = quotesData?.data ?? []
  const quoteMap = new Map(quotes.map((q) => [q.symbol, q]))

  if (!user) {
    return (
      <div className="space-y-4">
        <h1 className="text-accent-amber font-mono text-sm font-bold uppercase tracking-wider">Watchlist</h1>
        <div className="bg-bg-panel border border-border-default rounded p-8 text-center">
          <p className="text-text-dim text-xs font-mono">Sign in to save and track your watchlist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-accent-amber font-mono text-sm font-bold uppercase tracking-wider">Watchlist</h1>

      {/* Add symbol */}
      <form
        onSubmit={(e) => { e.preventDefault(); if (input.trim()) add.mutate(input.trim().toUpperCase()) }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="Add symbol (e.g. AAPL)"
          maxLength={10}
          className="flex-1 bg-bg-panel border border-border-default text-text-primary text-xs font-mono px-3 py-2 rounded focus:outline-none focus:border-accent-amber"
        />
        <button
          type="submit"
          disabled={add.isPending || !input.trim()}
          className="text-xs font-mono px-4 py-2 border border-accent-amber text-accent-amber hover:bg-accent-amber hover:text-bg-primary transition-colors disabled:opacity-40 rounded"
        >
          Add
        </button>
      </form>

      {isLoading ? (
        <div className="text-text-dim text-xs font-mono animate-pulse">Loading watchlist...</div>
      ) : watchlist.length === 0 ? (
        <div className="bg-bg-panel border border-border-default rounded p-6 text-center text-text-dim text-xs font-mono">
          No symbols yet. Add tickers above.
        </div>
      ) : (
        <div className="bg-bg-panel border border-border-default rounded overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[360px] text-xs font-mono">
            <thead>
              <tr className="border-b border-border-default text-text-dim">
                <th className="p-2 text-left">Symbol</th>
                <th className="p-2 text-right">Price</th>
                <th className="p-2 text-right">Change</th>
                <th className="p-2 text-right">Change %</th>
                <th className="p-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((symbol) => {
                const q = quoteMap.get(symbol)
                return (
                  <tr key={symbol} className="border-b border-border-default hover:bg-bg-hover transition-colors">
                    <td className="p-2 text-accent-amber font-semibold">{symbol}</td>
                    <td className="p-2 text-right text-text-primary">
                      {q ? `$${q.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                    </td>
                    <td className="p-2 text-right">
                      {q ? <ChangeIndicator value={q.change} suffix="" /> : '—'}
                    </td>
                    <td className="p-2 text-right">
                      {q ? <ChangeIndicator value={q.changePercent} /> : '—'}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => remove.mutate(symbol)}
                        className="text-text-dim hover:text-accent-red transition-colors"
                        title="Remove"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
