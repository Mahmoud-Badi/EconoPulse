interface ChangeIndicatorProps {
  value: number
  suffix?: string
  className?: string
}

export function ChangeIndicator({ value, suffix = '%', className = '' }: ChangeIndicatorProps) {
  const color = value > 0 ? 'text-accent-green' : value < 0 ? 'text-accent-red' : 'text-text-dim'
  const icon = value > 0 ? '▲' : value < 0 ? '▼' : '–'

  return (
    <span className={`inline-flex items-center gap-0.5 font-mono text-xs ${color} ${className}`}>
      <span>{icon}</span>
      <span>{Math.abs(value).toFixed(2)}{suffix}</span>
    </span>
  )
}
