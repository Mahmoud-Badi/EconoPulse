import { render, screen } from '@testing-library/react'
import { ChangeIndicator } from './ChangeIndicator'

describe('ChangeIndicator', () => {
  it('shows up arrow for positive value', () => {
    render(<ChangeIndicator value={1.23} />)
    expect(screen.getByText('▲')).toBeInTheDocument()
    expect(screen.getByText('1.23%')).toBeInTheDocument()
  })

  it('shows down arrow for negative value', () => {
    render(<ChangeIndicator value={-2.5} />)
    expect(screen.getByText('▼')).toBeInTheDocument()
    expect(screen.getByText('2.50%')).toBeInTheDocument()
  })

  it('shows dash for zero', () => {
    render(<ChangeIndicator value={0} />)
    expect(screen.getByText('–')).toBeInTheDocument()
  })

  it('renders custom suffix', () => {
    render(<ChangeIndicator value={5} suffix=" pts" />)
    expect(screen.getByText('5.00 pts')).toBeInTheDocument()
  })
})
