import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { TopBar } from './components/layout/TopBar'
import { Sidebar } from './components/layout/Sidebar'
import { StatusBar } from './components/layout/StatusBar'
import { OverviewPanel } from './components/panels/OverviewPanel'
import { StocksPanel } from './components/panels/StocksPanel'
import { CryptoPanel } from './components/panels/CryptoPanel'
import { ForexPanel } from './components/panels/ForexPanel'
import { CommoditiesPanel } from './components/panels/CommoditiesPanel'
import { MacroPanel } from './components/panels/MacroPanel'
import { CountryPanel } from './components/panels/CountryPanel'
import { NewsPanel } from './components/panels/NewsPanel'
import { SentimentPanel } from './components/panels/SentimentPanel'

type Section = 'overview' | 'markets' | 'crypto' | 'forex' | 'commodities' | 'macro' | 'countries' | 'news' | 'sentiment'

const panels: Record<Section, React.ComponentType> = {
  overview: OverviewPanel,
  markets: StocksPanel,
  crypto: CryptoPanel,
  forex: ForexPanel,
  commodities: CommoditiesPanel,
  macro: MacroPanel,
  countries: CountryPanel,
  news: NewsPanel,
  sentiment: SentimentPanel,
}

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('overview')
  const ActivePanel = panels[activeSection]

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar active={activeSection} onNavigate={setActiveSection} />
          <main className="flex-1 overflow-y-auto p-4 panel-transition">
            <ActivePanel />
          </main>
        </div>
        <StatusBar />
      </div>
    </ThemeProvider>
  )
}
