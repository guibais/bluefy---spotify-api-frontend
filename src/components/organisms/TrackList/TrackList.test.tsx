import { render, screen } from '@testing-library/react'
import { TrackList } from './TrackList'

vi.mock('@/components/molecules', () => ({
  TrackItem: ({ track, index, showAlbum, className }: any) => (
    <div role="listitem" data-testid="track" data-id={track.id} data-index={index} data-show-album={showAlbum} className={className} />
  ),
}))

describe('TrackList', () => {
  it('renders loading skeletons with optional album', () => {
    const { container, rerender } = render(<TrackList tracks={[]} loading showAlbum />)
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0)
    rerender(<TrackList tracks={[]} loading />)
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0)
  })

  it('shows empty state', () => {
    render(<TrackList tracks={[]} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Nenhuma música encontrada' })).toBeTruthy()
    expect(screen.getByText('Não há faixas disponíveis no momento')).toBeTruthy()
  })

  it('renders list with title and items', () => {
    const tracks = [
      { id: 't1' },
      { id: 't2' },
    ] as any
    render(<TrackList tracks={tracks} title="Minhas Músicas" showAlbum />)
    expect(screen.getByRole('list', { name: 'Minhas Músicas' })).toBeTruthy()
    expect(screen.getAllByTestId('track').length).toBe(2)
  })

  it('uses default aria-label when no title', () => {
    const tracks = [{ id: 't1' }] as any
    render(<TrackList tracks={tracks} />)
    expect(screen.getByRole('list', { name: 'Músicas' })).toBeTruthy()
  })
})
