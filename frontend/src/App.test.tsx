import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

// Mock all panel components to avoid real API calls in smoke tests
vi.mock('./components/panels/OverviewPanel', () => ({ OverviewPanel: () => <div>Overview Panel</div> }))
vi.mock('./components/panels/StocksPanel', () => ({ StocksPanel: () => <div>Stocks Panel</div> }))
vi.mock('./components/panels/CryptoPanel', () => ({ CryptoPanel: () => <div>Crypto Panel</div> }))
vi.mock('./components/panels/ForexPanel', () => ({ ForexPanel: () => <div>Forex Panel</div> }))
vi.mock('./components/panels/CommoditiesPanel', () => ({ CommoditiesPanel: () => <div>Commodities Panel</div> }))
vi.mock('./components/panels/MacroPanel', () => ({ MacroPanel: () => <div>Macro Panel</div> }))
vi.mock('./components/panels/CountryPanel', () => ({ CountryPanel: () => <div>Country Panel</div> }))
vi.mock('./components/panels/NewsPanel', () => ({ NewsPanel: () => <div>News Panel</div> }))
vi.mock('./components/panels/SentimentPanel', () => ({ SentimentPanel: () => <div>Sentiment Panel</div> }))

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}

describe('App', () => {
  it('renders without crashing', () => {
    renderApp()
    expect(screen.getByText('Overview Panel')).toBeInTheDocument()
  })

  it('shows overview panel by default', () => {
    renderApp()
    expect(screen.getByText('Overview Panel')).toBeInTheDocument()
  })

  it('switches to crypto panel when crypto nav is clicked', async () => {
    renderApp()
    const cryptoLink = screen.getByText(/crypto/i)
    await userEvent.click(cryptoLink)
    expect(screen.getByText('Crypto Panel')).toBeInTheDocument()
  })

  it('switches to markets panel when markets nav is clicked', async () => {
    renderApp()
    const marketsLink = screen.getByText(/markets/i)
    await userEvent.click(marketsLink)
    expect(screen.getByText('Stocks Panel')).toBeInTheDocument()
  })
})
