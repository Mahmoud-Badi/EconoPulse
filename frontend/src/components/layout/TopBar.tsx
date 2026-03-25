import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { AuthModal } from './AuthModal'

export function TopBar() {
  const [time, setTime] = useState(new Date())
  const { theme, toggleTheme } = useTheme()
  const { user, logout, isLoading } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const isMarketOpen = () => {
    const et = new Date(time.toLocaleString('en-US', { timeZone: 'America/New_York' }))
    const day = et.getDay()
    const hours = et.getHours()
    const minutes = et.getMinutes()
    const totalMinutes = hours * 60 + minutes
    return day >= 1 && day <= 5 && totalMinutes >= 570 && totalMinutes < 960
  }

  const marketOpen = isMarketOpen()

  return (
    <header className="h-10 bg-bg-secondary border-b border-border-default flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-mono font-bold text-accent-amber text-sm tracking-wider">ECONOPULSE</span>
        <span className="text-text-dim text-xs">v1.0</span>
      </div>
      <div className="flex items-center gap-6">
        <span className="font-data text-text-secondary text-xs">
          {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="font-mono text-text-primary text-sm font-semibold">
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${marketOpen ? 'bg-accent-green' : 'bg-accent-red'}`} />
          <span className={`text-xs font-mono ${marketOpen ? 'text-accent-green' : 'text-accent-red'}`}>
            {marketOpen ? 'US OPEN' : 'US CLOSED'}
          </span>
        </div>
        {!isLoading && (
          user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-text-dim truncate max-w-[120px]">{user.email}</span>
              <button
                onClick={logout}
                className="text-xs font-mono px-2 py-1 border border-border-default text-text-dim hover:text-accent-red hover:border-accent-red transition-colors rounded"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="text-xs font-mono px-3 py-1 border border-accent-amber text-accent-amber hover:bg-accent-amber hover:text-bg-primary transition-colors rounded"
            >
              Sign In
            </button>
          )
        )}
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </header>
  )
}
