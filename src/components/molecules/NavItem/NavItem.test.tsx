import { render, screen } from '@testing-library/react'
import { NavItem } from './NavItem'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}))

describe('NavItem', () => {
  it('renders link with label and href', () => {
    render(<NavItem to="/home" label="Home" />)
    const link = screen.getByRole('link', { name: 'Home' }) as HTMLAnchorElement
    expect(link.getAttribute('href')).toBe('/home')
  })
})
