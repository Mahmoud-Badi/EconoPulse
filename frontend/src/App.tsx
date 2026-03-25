import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { TopBar } from './components/layout/TopBar'
import { Sidebar } from './components/layout/Sidebar'
import { StatusBar } from './components/layout/StatusBar'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import { OverviewPanel } from './components/panels/OverviewPanel'
import { StocksPanel } from './components/panels/StocksPanel'
import { CryptoPanel } from './components/panels/CryptoPanel'
import { ForexPanel } from './components/panels/ForexPanel'
import { CommoditiesPanel } from './components/panels/CommoditiesPanel'
import { MacroPanel } from './components/panels/MacroPanel'
import { CountryPanel } from './components/panels/CountryPanel'
import { NewsPanel } from './components/panels/NewsPanel'
import { SentimentPanel } from './components/panels/SentimentPanel'
import { WatchlistPanel } from './components/panels/WatchlistPanel'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
            <TopBar />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-4 panel-transition">
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<OverviewPanel />} />
                    <Route path="/markets" element={<StocksPanel />} />
                    <Route path="/crypto" element={<CryptoPanel />} />
                    <Route path="/forex" element={<ForexPanel />} />
                    <Route path="/commodities" element={<CommoditiesPanel />} />
                    <Route path="/macro" element={<MacroPanel />} />
                    <Route path="/countries" element={<CountryPanel />} />
                    <Route path="/news" element={<NewsPanel />} />
                    <Route path="/sentiment" element={<SentimentPanel />} />
                    <Route path="/watchlist" element={<WatchlistPanel />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ErrorBoundary>
              </main>
            </div>
            <StatusBar />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
