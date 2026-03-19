import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useGdp, useInflation, useCpi, useUnemployment, useInterestRate, useTreasuryYield } from '../../hooks/useMacro'
import { CardSkeleton } from '../shared/LoadingSkeleton'

const tabs = [
  { id: 'gdp', label: 'GDP', desc: 'Real Gross Domestic Product measures the total value of goods and services produced, adjusted for inflation.' },
  { id: 'inflation', label: 'Inflation', desc: 'Annual inflation rate measures the percentage change in the general price level of goods and services.' },
  { id: 'cpi', label: 'CPI', desc: 'Consumer Price Index tracks changes in the price of a basket of consumer goods and services.' },
  { id: 'unemployment', label: 'Unemployment', desc: 'Unemployment rate represents the percentage of the labor force that is jobless and actively seeking employment.' },
  { id: 'interest-rate', label: 'Fed Funds Rate', desc: 'The federal funds rate is the interest rate at which banks lend reserve balances to other banks overnight.' },
  { id: 'treasury-yield', label: '10Y Treasury', desc: 'The 10-year Treasury yield represents the return on US government bonds with a 10-year maturity.' },
] as const

type TabId = typeof tabs[number]['id']

export function MacroPanel() {
  const [activeTab, setActiveTab] = useState<TabId>('gdp')

  const { data: gdpData, isLoading: gdpLoading } = useGdp()
  const { data: inflationData, isLoading: inflationLoading } = useInflation()
  const { data: cpiData, isLoading: cpiLoading } = useCpi()
  const { data: unemploymentData, isLoading: unemploymentLoading } = useUnemployment()
  const { data: interestData, isLoading: interestLoading } = useInterestRate()
  const { data: treasuryData, isLoading: treasuryLoading } = useTreasuryYield()

  const dataMap: Record<TabId, { data: any; loading: boolean }> = {
    'gdp': { data: gdpData, loading: gdpLoading },
    'inflation': { data: inflationData, loading: inflationLoading },
    'cpi': { data: cpiData, loading: cpiLoading },
    'unemployment': { data: unemploymentData, loading: unemploymentLoading },
    'interest-rate': { data: interestData, loading: interestLoading },
    'treasury-yield': { data: treasuryData, loading: treasuryLoading },
  }

  const current = dataMap[activeTab]
  const currentTab = tabs.find(t => t.id === activeTab)!
  const chartData = (current.data?.data || []).slice().reverse().map((d: any) => ({
    date: d.date?.substring(0, 7) || d.date,
    value: parseFloat(d.value),
  }))
  const latestValue = current.data?.data?.[0]?.value

  const chartColor = activeTab === 'gdp' ? '#f0a500' : activeTab === 'inflation' ? '#ff3d3d' : activeTab === 'cpi' ? '#00bcd4' : activeTab === 'unemployment' ? '#2979ff' : activeTab === 'interest-rate' ? '#00c853' : '#f0a500'

  const useBarChart = activeTab === 'cpi'

  return (
    <div className="space-y-4">
      <h1 className="text-accent-amber font-mono text-sm font-bold uppercase tracking-wider">Macroeconomic Indicators</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border-default">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-xs font-mono transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-accent-amber border-accent-amber'
                : 'text-text-dim border-transparent hover:text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Current value card */}
      <div className="bg-bg-panel border border-border-default rounded p-4">
        <div className="text-text-dim text-[10px] font-mono uppercase tracking-wider">{currentTab.label} — Latest</div>
        {current.loading ? (
          <CardSkeleton />
        ) : (
          <div className="text-text-primary font-data text-3xl font-bold mt-1">
            {latestValue ?? '...'}
            {activeTab !== 'gdp' && '%'}
          </div>
        )}
        <div className="text-text-dim text-xs mt-2">{currentTab.desc}</div>
      </div>

      {/* Chart */}
      <div className="bg-bg-panel border border-border-default rounded p-4" style={{ height: 350 }}>
        {current.loading ? (
          <div className="flex items-center justify-center h-full text-text-dim text-sm font-mono">Loading chart...</div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-dim text-sm font-mono">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {useBarChart ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 4, fontFamily: 'IBM Plex Mono', fontSize: 11 }} labelStyle={{ color: 'var(--text-secondary)' }} itemStyle={{ color: 'var(--text-primary)' }} />
                <Bar dataKey="value" fill={chartColor} />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 4, fontFamily: 'IBM Plex Mono', fontSize: 11 }} labelStyle={{ color: 'var(--text-secondary)' }} itemStyle={{ color: 'var(--text-primary)' }} />
                <Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} dot={{ fill: chartColor, r: 2 }} activeDot={{ r: 4 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
