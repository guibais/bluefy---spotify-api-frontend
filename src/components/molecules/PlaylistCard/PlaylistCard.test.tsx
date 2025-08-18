import { render, screen, fireEvent } from '@testing-library/react'
import { PlaylistCard } from './PlaylistCard'

vi.spyOn(window, 'open').mockImplementation(() => null as any)

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className, ...rest }: any) => (
    <a href={to} className={className} {...rest}>
      {children}
    </a>
  ),
}))

describe('PlaylistCard', () => {
  it('renders as link when to provided', () => {
    render(<PlaylistCard id="1" name="N" image="/i.png" subtitle="S" to="/t" />)
    const link = screen.getByRole('link')
    expect(link).toBeTruthy()
  })

  it('renders as button and opens spotify when url provided', () => {
    render(<PlaylistCard id="1" name="N" spotifyUrl="https://s" />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[1])
    expect(window.open).toHaveBeenCalled()
  })

  it('renders placeholder icon when no image in link variant', () => {
    render(<PlaylistCard id="1" name="N" to="/t" />)
    expect(screen.getByText('🎶')).toBeTruthy()
  })

  it('renders image and subtitle in button variant when provided', () => {
    render(<PlaylistCard id="1" name="N" image="/i.png" subtitle="S" spotifyUrl="https://s" />)
    expect(screen.getByAltText('N')).toBeTruthy()
    expect(screen.getByText('S')).toBeTruthy()
  })
})
