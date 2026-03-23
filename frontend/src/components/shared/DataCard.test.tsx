import { render, screen } from '@testing-library/react'
import { DataCard } from './DataCard'

describe('DataCard', () => {
  it('renders label and value', () => {
    render(<DataCard label="S&P 500" value={5123.45} />)
    expect(screen.getByText('S&P 500')).toBeInTheDocument()
    expect(screen.getByText('5,123.45')).toBeInTheDocument()
  })

  it('renders string value', () => {
    render(<DataCard label="Status" value="Active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders suffix when provided', () => {
    render(<DataCard label="Yield" value={4.5} suffix="%" />)
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('renders green arrow for positive change', () => {
    render(<DataCard label="AAPL" value={182.5} change={1.2} changePercent={0.66} />)
    expect(screen.getByText('▲')).toBeInTheDocument()
    expect(screen.getByText('(+0.66%)')).toBeInTheDocument()
  })

  it('renders red arrow for negative change', () => {
    render(<DataCard label="AAPL" value={182.5} change={-1.2} changePercent={-0.66} />)
    expect(screen.getByText('▼')).toBeInTheDocument()
    expect(screen.getByText('(-0.66%)')).toBeInTheDocument()
  })
})
