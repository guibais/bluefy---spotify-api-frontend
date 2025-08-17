import { render, screen } from '@testing-library/react'
import { BottomTabs } from './BottomTabs'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useLocation: () => ({ pathname: '/search' }),
}))

describe('BottomTabs', () => {
  it('renders tabs and marks current path as active', () => {
    render(<BottomTabs />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBe(3)
    const searchLink = links.find((a) => a.getAttribute('href') === '/search') as HTMLAnchorElement
    expect(searchLink).toBeTruthy()
    expect(searchLink.className).toContain('bg-purplefy-primary/10')
  })
})
