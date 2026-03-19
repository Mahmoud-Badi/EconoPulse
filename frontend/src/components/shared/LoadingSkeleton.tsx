interface LoadingSkeletonProps {
  className?: string
  rows?: number
}

export function LoadingSkeleton({ className = '', rows = 1 }: LoadingSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-shimmer rounded h-4 mb-2" style={{ width: `${80 + Math.random() * 20}%` }} />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-bg-panel border border-border-default rounded p-3">
      <div className="animate-shimmer rounded h-3 w-20 mb-2" />
      <div className="animate-shimmer rounded h-6 w-32 mb-1" />
      <div className="animate-shimmer rounded h-3 w-24" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="animate-shimmer rounded h-4 w-16" />
          <div className="animate-shimmer rounded h-4 w-24" />
          <div className="animate-shimmer rounded h-4 w-20" />
          <div className="animate-shimmer rounded h-4 w-16" />
        </div>
      ))}
    </div>
  )
}
