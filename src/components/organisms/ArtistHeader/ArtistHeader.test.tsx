import { render, screen } from '@testing-library/react'
import { ArtistHeader } from './ArtistHeader'

vi.mock('@/components/atoms', () => ({
  OpenInSpotifyButton: ({ url }: any) => <button aria-label="open-spotify" data-url={url} />,
}))

vi.mock('@/components/atoms/Image/Image', () => ({
  Image: ({ src, alt, className }: any) => <img src={src} alt={alt} className={className} />,
}))

describe('ArtistHeader', () => {
  const base = {
    name: 'Artista',
    imageUrl: '/artist.jpg',
    followers: 1234567,
    popularity: 87,
    genres: ['rock', 'pop'],
    externalUrl: 'https://s',
  }

  it('renders desktop layout with followers, popularity and genres', () => {
    render(<ArtistHeader {...base} />)
    expect(screen.getByRole('img', { name: base.name })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 1, name: base.name })).toBeTruthy()
    expect(screen.getByText(base.followers.toLocaleString())).toBeTruthy()

    expect(screen.getByText('rock')).toBeTruthy()
    expect(screen.getByText('pop')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'open-spotify' })).toBeTruthy()
  })

  it('renders mobile layout with compact values and without button when no externalUrl', () => {
    render(<ArtistHeader {...base} externalUrl={undefined} layout="mobile" />)
    expect(screen.getByRole('heading', { level: 1, name: base.name })).toBeTruthy()
    expect(screen.getByText('1.2M')).toBeTruthy()
    expect(screen.getByText(`${base.popularity}%`)).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'open-spotify' })).toBeNull()
  })
})
