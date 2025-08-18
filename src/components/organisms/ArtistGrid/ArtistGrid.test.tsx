import { render, screen } from '@testing-library/react'
import { ArtistGrid } from './ArtistGrid'

vi.mock('@/components/molecules', () => ({
  ArtistCard: ({ artist, className }: any) => (
    <div data-testid="artist" data-id={artist.id} className={className} />
  ),
}))

describe('ArtistGrid', () => {
  it('shows loading skeletons', () => {
    const { container } = render(<ArtistGrid artists={[]} loading />)
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0)
  })

  it('shows empty state', () => {
    render(<ArtistGrid artists={[]} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Nenhum artista encontrado'})).toBeTruthy()
    expect(screen.getByText('Tente buscar por outro nome ou termo')).toBeTruthy()
  })

  it('renders artists', () => {
    const artists = [
      { id: 'x1' },
      { id: 'x2' },
    ] as any
    render(<ArtistGrid artists={artists} />)
    expect(screen.getAllByTestId('artist').length).toBe(2)
  })
})
