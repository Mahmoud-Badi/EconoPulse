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

export function Sidebar() {
  return (
    <nav className="w-20 bg-bg-secondary border-r border-border-default flex flex-col py-2 shrink-0">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-3 px-1 transition-colors ${
              isActive
                ? 'text-accent-amber bg-bg-hover border-r-2 border-accent-amber'
                : 'text-text-dim hover:text-text-secondary hover:bg-bg-hover'
            }`
          }
        >
          <span className="text-lg leading-none">{item.icon}</span>
          <span className="text-[10px] mt-1 font-mono">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
