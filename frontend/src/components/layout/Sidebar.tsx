interface SidebarProps {
  active: string
  onNavigate: (section: any) => void
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: '◉' },
  { id: 'markets', label: 'Markets', icon: '▲' },
  { id: 'crypto', label: 'Crypto', icon: '₿' },
  { id: 'forex', label: 'Forex', icon: '¥' },
  { id: 'commodities', label: 'Cmdty', icon: '⬡' },
  { id: 'macro', label: 'Macro', icon: '◫' },
  { id: 'countries', label: 'Countries', icon: '⊕' },
  { id: 'news', label: 'News', icon: '▤' },
  { id: 'sentiment', label: 'Sentiment', icon: '◐' },
]

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <nav className="w-20 bg-bg-secondary border-r border-border-default flex flex-col py-2 shrink-0">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center justify-center py-3 px-1 transition-colors ${
            active === item.id
              ? 'text-accent-amber bg-bg-hover border-r-2 border-accent-amber'
              : 'text-text-dim hover:text-text-secondary hover:bg-bg-hover'
          }`}
        >
          <span className="text-lg leading-none">{item.icon}</span>
          <span className="text-[10px] mt-1 font-mono">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
