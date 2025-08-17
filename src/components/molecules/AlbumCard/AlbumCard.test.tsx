import { render, screen } from '@testing-library/react'
import { AlbumCard } from './AlbumCard'

const album: any = {
  id: '1',
  name: 'N',
  images: [{ url: '/i.png' }],
  release_date: '2020-01-01',
  total_tracks: 10,
  artists: [{ name: 'A' }],
  album_type: 'album'
}

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className, ...rest }: any) => (
    <a href={to} className={className} {...rest}>
      {children}
    </a>
  ),
}))

describe('AlbumCard', () => {
  it('renders link with aria-label and image', () => {
    render(<AlbumCard album={album} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('aria-label')).toBeTruthy()
    const img = screen.getByRole('img')
    expect(img).toBeTruthy()
  })
})
