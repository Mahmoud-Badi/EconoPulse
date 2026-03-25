import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/',            label: 'Overview',   icon: '◉' },
  { path: '/markets',     label: 'Markets',    icon: '▲' },
  { path: '/crypto',      label: 'Crypto',     icon: '₿' },
  { path: '/forex',       label: 'Forex',      icon: '¥' },
  { path: '/commodities', label: 'Cmdty',      icon: '⬡' },
  { path: '/macro',       label: 'Macro',      icon: '◫' },
  { path: '/countries',   label: 'Countries',  icon: '⊕' },
  { path: '/news',        label: 'News',       icon: '▤' },
  { path: '/sentiment',   label: 'Sentiment',  icon: '◐' },
  { path: '/watchlist',   label: 'Watch',      icon: '★' },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center justify-center transition-colors ${
    isActive
      ? 'text-accent-amber bg-bg-hover'
      : 'text-text-dim hover:text-text-secondary hover:bg-bg-hover'
  }`

export function Sidebar() {
  return (
    <>
      {/* Desktop: vertical sidebar */}
      <nav className="hidden md:flex w-20 bg-bg-secondary border-r border-border-default flex-col py-2 shrink-0">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `${navLinkClass({ isActive })} py-3 px-1 border-r-2 ${isActive ? 'border-accent-amber' : 'border-transparent'}`
            }
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="text-[10px] mt-1 font-mono">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Mobile: horizontal bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-secondary border-t border-border-default flex overflow-x-auto shrink-0">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `${navLinkClass({ isActive })} py-2 px-3 shrink-0 border-t-2 ${isActive ? 'border-accent-amber' : 'border-transparent'}`
            }
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span className="text-[9px] mt-0.5 font-mono">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
