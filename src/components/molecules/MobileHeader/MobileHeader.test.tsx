import { render, screen } from '@testing-library/react'
import { MobileHeader } from './MobileHeader'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}))

describe('MobileHeader', () => {
  it('renders title and back link', () => {
    render(<MobileHeader title="Title" backTo="/x" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeTruthy()
    const link = screen.getByRole('link') as HTMLAnchorElement
    expect(link.getAttribute('href')).toBe('/x')
  })

  it('hides back link when showBack is false', () => {
    render(<MobileHeader title="T" showBack={false} />)
    expect(screen.getByRole('heading', { level: 1, name: 'T' })).toBeTruthy()
    expect(screen.queryByRole('link')).toBeNull()
  })
})
