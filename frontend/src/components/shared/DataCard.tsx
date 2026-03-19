import { ReactNode } from 'react'

interface DataCardProps {
  label: string
  value: string | number
  change?: number
  changePercent?: number
  suffix?: string
  children?: ReactNode
  className?: string
}

export function DataCard({ label, value, change, changePercent, suffix, children, className = '' }: DataCardProps) {
  const changeColor = change !== undefined ? (change >= 0 ? 'text-accent-green' : 'text-accent-red') : ''
  const changeIcon = change !== undefined ? (change >= 0 ? '▲' : '▼') : ''

  return (
    <div className={`bg-bg-panel border border-border-default rounded p-3 hover:bg-bg-hover transition-colors ${className}`}>
      <div className="text-text-dim text-[10px] font-mono uppercase tracking-wider mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-text-primary font-data text-xl font-semibold">
          {typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
        </span>
        {suffix && <span className="text-text-dim text-xs">{suffix}</span>}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-1 text-xs font-mono ${changeColor}`}>
          <span>{changeIcon}</span>
          <span>{Math.abs(change).toFixed(2)}</span>
          {changePercent !== undefined && (
            <span>({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)</span>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
