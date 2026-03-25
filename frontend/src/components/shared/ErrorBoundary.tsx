import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error)
  }

  reset = () => this.setState({ hasError: false, message: '' })

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-text-dim font-mono">
          <div className="text-accent-red text-sm uppercase tracking-widest">Panel error</div>
          <div className="text-text-secondary text-xs max-w-sm text-center">{this.state.message}</div>
          <button
            onClick={this.reset}
            className="text-[10px] border border-border-default px-3 py-1 hover:border-accent-amber hover:text-accent-amber transition-colors"
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
