import { render, screen } from '@testing-library/react'
import { MiniPlaylistCard } from './MiniPlaylistCard'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}))

vi.mock('@/components/atoms/Image/Image', () => ({
  Image: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} />
  ),
}))

vi.mock('@/components/atoms', () => ({
  // Render as a button to avoid nested <a> inside mocked Link
  OpenInSpotifyButton: ({ url, ariaLabel }: any) => (
    <button type="button" aria-label={ariaLabel} data-url={url}>
      open
    </button>
  ),
}))

vi.mock('@/paraglide/messages.js', () => ({
  tracks_suffix: () => 'faixas',
  open_in_spotify: () => 'Open in Spotify',
}))

describe('MiniPlaylistCard', () => {
  const baseProps = {
    id: '123',
    name: 'Minha Playlist',
    imageUrl: 'http://image',
    tracksCount: 42,
  }

  it('renders desktop variant with classes and content', () => {
    render(<MiniPlaylistCard {...baseProps} size="desktop" />)

    const link = screen.getByRole('link') as HTMLAnchorElement
    expect(link.className.includes('card')).toBe(true)
    expect(link.className.includes('p-3')).toBe(true)

    const img = screen.getByRole('img') as HTMLImageElement
    expect(img.getAttribute('src')).toBe('http://image')
    expect(img.getAttribute('alt')).toBe('Minha Playlist')
    expect(img.className.includes('mb-3')).toBe(true)

    expect(screen.getByText('Minha Playlist')).toBeTruthy()
    expect(screen.getByText(/42 faixas/)).toBeTruthy()
  })

  it('renders mobile variant with adjusted classes', () => {
    render(<MiniPlaylistCard {...baseProps} size="mobile" />)

    const link = screen.getByRole('link') as HTMLAnchorElement
    expect(link.className.includes('card')).toBe(true)
    expect(link.className.includes('p-2')).toBe(true)

    const img = screen.getByRole('img') as HTMLImageElement
    expect(img.className.includes('mb-2')).toBe(true)

    expect(screen.getByText('Minha Playlist')).toBeTruthy()
    expect(screen.getByText(/42 faixas/)).toBeTruthy()
  })

  it('shows OpenInSpotifyButton when externalUrl is provided', () => {
    render(<MiniPlaylistCard {...baseProps} externalUrl="https://open.spotify.com/playlist/123" />)

    const btn = screen.getByRole('button', { name: 'Open in Spotify - Minha Playlist' }) as HTMLButtonElement
    expect(btn).toBeTruthy()
    expect(btn.getAttribute('data-url')).toBe('https://open.spotify.com/playlist/123')
  })

  it('does not render OpenInSpotifyButton when externalUrl is missing', () => {
    render(<MiniPlaylistCard {...baseProps} externalUrl={undefined} />)

    expect(screen.queryByRole('button', { name: 'Open in Spotify - Minha Playlist' })).toBeNull()
  })
})
