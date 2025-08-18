import { render, screen, fireEvent } from '@testing-library/react'
import { AlbumGrid } from './AlbumGrid'

vi.mock('@/components/molecules', () => ({
  AlbumCard: ({ album, className }: any) => (
    <div data-testid="album" data-id={album.id} className={className} />
  ),
}))

describe('AlbumGrid', () => {
  it('shows loading skeletons', () => {
    const { container } = render(<AlbumGrid albums={[]} loading />)
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0)
  })

  it('shows empty state for artist', () => {
    render(<AlbumGrid albums={[]} emptyKind="artist" />)
    expect(screen.getByRole('heading', { level: 3, name: 'Nenhum álbum encontrado' })).toBeTruthy()
    expect(screen.getByText('Este artista ainda não possui álbuns disponíveis')).toBeTruthy()
  })

  it('shows empty state for search', () => {
    render(<AlbumGrid albums={[]} emptyKind="search" />)
    expect(screen.getByRole('heading', { level: 3, name: 'Nenhum álbum encontrado' })).toBeTruthy()
    expect(screen.getByText('Nenhum álbum corresponde à sua busca')).toBeTruthy()
  })

  it('renders albums and load more button', () => {
    const onLoadMore = vi.fn()
    const albums = [
      { id: 'a1' },
      { id: 'a2' },
    ] as any
    render(<AlbumGrid albums={albums} hasNextPage onLoadMore={onLoadMore} />)
    expect(screen.getAllByTestId('album').length).toBe(2)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(onLoadMore).toHaveBeenCalled()
  })

  it('shows loading label when loadingMore', () => {
    const albums = [{ id: 'a1' }] as any
    render(<AlbumGrid albums={albums} hasNextPage loadingMore />)
    expect(screen.getByRole('button').textContent).toBe('Carregando...')
  })
})
