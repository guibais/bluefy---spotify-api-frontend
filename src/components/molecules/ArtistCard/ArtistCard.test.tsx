import { render, screen } from '@testing-library/react'
import { ArtistCard } from './ArtistCard'

const artist: any = {
  id: '1',
  name: 'X',
  images: [{ url: '/i.png' }],
  followers: { total: 1 },
  popularity: 10,
  genres: ['g1', 'g2', 'g3']
}

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className, ...rest }: any) => (
    <a href={to} className={className} {...rest}>
      {children}
    </a>
  ),
}))

describe('ArtistCard', () => {
  it('renders link with aria-label and image', () => {
    render(<ArtistCard artist={artist} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('aria-label')).toBeTruthy()
    const img = screen.getByRole('img')
    expect(img).toBeTruthy()
  })
})
