import { render, screen } from '@testing-library/react'
import { PlaylistHeader } from './PlaylistHeader'

vi.mock('@/components/atoms', () => ({
  OpenInSpotifyButton: ({ url }: any) => <button aria-label="open" data-url={url} />,
}))

describe('PlaylistHeader', () => {
  it('renders basic info with placeholders and without external button', () => {
    render(<PlaylistHeader name="My List" />)
    expect(screen.getByRole('heading', { level: 1, name: 'My List' })).toBeTruthy()
    expect(screen.getByText('-')).toBeTruthy()
    const followerMatches = screen.getAllByText((_, node) => {
      const text = (node?.textContent || '').toLowerCase()
      return text.includes('seguidores')
    })
    expect(followerMatches.length).toBeGreaterThan(0)
    expect(screen.queryByRole('button', { name: 'open' })).toBeNull()
  })

  it('renders image alt, owner, followers formatted and external button', () => {
    render(
      <PlaylistHeader 
        name="Top Hits" 
        imageUrl="/i.png" 
        ownerName="Owner" 
        followers={12345} 
        externalUrl="https://s" 
      />
    )
    expect(screen.getByRole('img', { name: 'Top Hits' })).toBeTruthy()
    expect(screen.getByText('Owner')).toBeTruthy()
    expect(screen.getByText(/12,345/)).toBeTruthy()
    const btn = screen.getByRole('button', { name: 'open' }) as HTMLButtonElement
    expect(btn.getAttribute('data-url')).toBe('https://s')
  })
})
