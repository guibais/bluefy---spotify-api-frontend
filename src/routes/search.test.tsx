import { renderAt } from '@/test-utils/router'
import { screen, fireEvent } from '@testing-library/react'

vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ isAuthenticated: true, clearTokens: vi.fn() }) }))

const useSearchArtistsMock = vi.fn()
vi.mock('@/hooks/useSpotify', () => ({
  useSearchArtists: (...args: any[]) => useSearchArtistsMock(...args)
}))

vi.mock('@/components', () => ({
  GridPageTemplate: ({ toolbar, children }: any) => (
    <main role="main">
      <div aria-label="Barra de pesquisa">{toolbar}</div>
      {children}
    </main>
  ),
  SearchBar: ({ placeholder, onSearch, initialValue }: any) => {
    const id = 'buscar-artistas-input'
    return (
      <div>
        <input id={id} aria-label={placeholder} defaultValue={initialValue} />
        <button type="button" onClick={() => onSearch((document.getElementById(id) as HTMLInputElement)?.value || '')}>Buscar</button>
        <button type="button" onClick={() => onSearch('')}>Limpar</button>
      </div>
    )
  },
  ArtistGrid: ({ artists, loading }: { artists: any[]; loading: boolean }) => (
    <section role="region" aria-label="Grade de artistas">
      <div aria-label="estado-carregando">{loading ? 'Carregando' : 'Pronto'}</div>
      <div aria-label="quantidade-artistas">{artists?.length ?? 0}</div>
    </section>
  ),
  ErrorState: ({ title, message }: { title: string; message: string }) => (
    <div role="alert">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  ),
}))

describe('/search route', () => {
  beforeEach(() => {
    useSearchArtistsMock.mockReset()
    useSearchArtistsMock.mockReturnValue({ data: { items: [] }, isLoading: false, error: undefined })
  })

  it('renderiza estado vazio inicialmente', async () => {
    renderAt('/search')
    expect(await screen.findByRole('heading', { name: 'Comece sua busca' })).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Grade de artistas' })).not.toBeInTheDocument()
  })

  it('realiza busca e mostra a grade de artistas', async () => {
    renderAt('/search')
    const input = await screen.findByRole('textbox', { name: 'Buscar artistas...' })
    fireEvent.change(input, { target: { value: 'adele' } })
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))
    await vi.waitFor(() => {
      expect(window.location.search.includes('q=adele')).toBe(true)
    })
    expect(await screen.findByRole('region', { name: 'Grade de artistas' })).toBeInTheDocument()
  })

  it('limpa a busca e volta ao estado vazio', async () => {
    renderAt('/search?q=rock')
    expect(await screen.findByRole('region', { name: 'Grade de artistas' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Limpar' }))
    await vi.waitFor(() => {
      expect(window.location.search).toBe('?page=1')
    })
    expect(await screen.findByRole('heading', { name: 'Comece sua busca' })).toBeInTheDocument()
  })

  it('exibe estado de erro quando a busca falha', async () => {
    useSearchArtistsMock.mockReturnValueOnce({ data: undefined, isLoading: false, error: new Error('Falha na busca') })
    renderAt('/search?q=erro')
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Falha na busca')).toBeInTheDocument()
  })
})
