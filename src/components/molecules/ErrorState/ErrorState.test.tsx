import { render, screen } from '@testing-library/react'
import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  it('renders default title and icon', () => {
    render(<ErrorState />)
    expect(screen.getByRole('heading', { level: 3 })).toBeTruthy()
  })

  it('renders message and action and size lg', () => {
    render(<ErrorState title="T" message="M" action={<button aria-label="retry" />} size="lg" />)
    expect(screen.getByText('M')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'retry' })).toBeTruthy()
    const heading = screen.getByRole('heading', { level: 3 }) as HTMLElement
    expect(heading.className).toContain('text-2xl')
  })
})
