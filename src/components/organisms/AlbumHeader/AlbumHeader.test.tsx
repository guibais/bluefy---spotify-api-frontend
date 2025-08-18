import { render, screen } from '@testing-library/react'
import { AlbumHeader } from './AlbumHeader'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className }: any) => (
    <a href={typeof to === 'string' ? to : '/artist/x'} className={className}>
      {children}
    </a>
  ),
}))

vi.mock('@/components/atoms', () => ({
  OpenInSpotifyButton: ({ url }: any) => <button aria-label="open-spotify" data-url={url} />,
}))

vi.mock('@/components/atoms/Image/Image', () => ({
  Image: ({ src, alt, className }: any) => <img src={src} alt={alt} className={className} />,
}))

describe('AlbumHeader', () => {
  const base = {
    name: 'Nome do Álbum',
    imageUrl: '/img.jpg',
    albumType: 'album',
    artists: [
      { id: 'a1', name: 'Artista 1' },
      { id: 'a2', name: 'Artista 2' },
    ],
    year: 2020,
    tracksCount: 12,
    externalUrl: 'https://s',
  }

  it('renders desktop layout with metadata and external button', () => {
    render(<AlbumHeader {...base} />)
    expect(screen.getByRole('img', { name: base.name })).toBeTruthy()
    expect(screen.getByText(base.albumType)).toBeTruthy()
    expect(screen.getByRole('heading', { level: 1, name: base.name })).toBeTruthy()
    expect(screen.getByText('por')).toBeTruthy()
    expect(screen.getByText('2020')).toBeTruthy()
    expect(screen.getByText('12 faixas')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'open-spotify' })).toBeTruthy()
  })

  it('renders mobile layout and hides optional parts when undefined', () => {
    render(<AlbumHeader name={base.name} artists={base.artists} layout="mobile" />)
    expect(screen.getByRole('heading', { level: 1, name: base.name })).toBeTruthy()
    expect(screen.queryByText('2020')).toBeNull()
    expect(screen.queryByRole('button', { name: 'open-spotify' })).toBeNull()
  })

  it('renders album type badge in mobile layout when provided', () => {
    render(
      <AlbumHeader
        name={base.name}
        artists={base.artists}
        albumType={base.albumType}
        layout="mobile"
      />,
    )
    expect(screen.getByText(base.albumType)).toBeTruthy()
  })

  it('renders year and tracks in mobile layout when provided', () => {
    render(
      <AlbumHeader
        name={base.name}
        artists={base.artists}
        year={base.year}
        tracksCount={base.tracksCount}
        layout="mobile"
      />,
    )
    expect(screen.getByText('2020')).toBeTruthy()
    expect(screen.getByText('12 faixas')).toBeTruthy()
  })
})
