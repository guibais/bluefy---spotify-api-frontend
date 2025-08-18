import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

let currentSearch: any = {}
let currentParams: any = { artistId: 'artist-1' }
const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: (_path: string) => (opts: any) => ({
    ...opts,
    useParams: () => currentParams,
    useSearch: () => currentSearch,
    useNavigate: () => navigateMock,
  }),
}))

vi.mock('@/components', () => ({
  BackButton: ({ children }: any) => <button type="button">{children}</button>,
  ErrorState: ({ title, message, action }: any) => (
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
      <div>{action}</div>
    </div>
  ),
}))

vi.mock('@/components/molecules', () => ({
  BackLink: ({ label }: any) => <a href="#">{label}</a>,
  Tabs: ({ items, activeId, onChange, variant }: any) => (
    <div>
      <div data-variant={variant}>Abas</div>
      <ul>
        {items.map((it: any) => (
          <li key={it.id}>
            <button
              type="button"
              aria-current={activeId === it.id ? 'page' : undefined}
              onClick={() => onChange(it.id)}
            >
              {it.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  ),
}))

vi.mock('@/components/organisms', () => ({
  ArtistHeader: ({ name, layout }: any) => (
    <header>
      <h2>Artista: {name}</h2>
      <span>Layout: {layout}</span>
    </header>
  ),
}))

vi.mock('@/components/organisms/TrackList/TrackList', () => ({
  TrackList: ({ tracks, loading, title }: any) => (
    <section>
      <h3>{title || 'Faixas'}</h3>
      <div>{loading ? 'carregando...' : `itens: ${tracks.length}`}</div>
    </section>
  ),
}))

vi.mock('@/components/organisms/AlbumGrid/AlbumGrid', () => ({
  AlbumGrid: ({ albums, loading, hasNextPage, onLoadMore, loadingMore }: any) => {
    if (typeof onLoadMore === 'function') {
      onLoadMore()
    }
    return (
      <section>
        <h3>Álbuns</h3>
        <div>{loading ? 'carregando...' : `álbuns: ${albums.length}`}</div>
        <div>{loadingMore ? 'carregando mais...' : null}</div>
        {hasNextPage && onLoadMore ? (
          <button type="button" onClick={onLoadMore}>
            Carregar mais
          </button>
        ) : null}
      </section>
    )
  },
}))

vi.mock('@/components/organisms/MobileLayout/MobileLayout', () => ({
  MobileLayout: ({ title, children }: any) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}))

vi.mock('@/components/atoms', () => ({
  Input: ({ placeholder, value, onChange, onClear, showSearch, className }: any) => (
    <div>
      <input
        aria-label={placeholder}
        value={value}
        onChange={onChange}
        data-show-search={!!showSearch}
        className={className}
      />
      <button type="button" onClick={onClear}>Limpar</button>
    </div>
  ),
}))

vi.mock('@/hooks/useSpotify', () => ({
  useArtist: vi.fn(),
  useArtistTopTracks: vi.fn(),
  useArtistAlbums: vi.fn(),
  useNewReleases: vi.fn(),
  useSearchAlbums: vi.fn(),
}))

vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: (value: any) => value,
}))

import * as hooks from '@/hooks/useSpotify'
import { Route } from './artist.$artistId'

const buildAlbumsPage = (start: number, count: number) => ({
  items: Array.from({ length: count }).map((_, i) => ({ id: `alb-${start + i}` })),
})

const baseArtist = {
  name: 'Artista Exemplo',
  images: [{ url: 'https://img/1.jpg' }],
  followers: { total: 123 },
  popularity: 77,
  genres: ['pop'],
  external_urls: { spotify: 'https://spotify/artist/1' },
}

describe('/artist/$artistId route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    currentSearch = {}
    ;(hooks.useArtist as any).mockReturnValue({ data: undefined, isLoading: false, error: undefined })
    ;(hooks.useArtistTopTracks as any).mockReturnValue({ data: [], isLoading: false })
    ;(hooks.useArtistAlbums as any).mockReturnValue({
      data: { pages: [buildAlbumsPage(0, 0)] },
      isLoading: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    })
    ;(hooks.useSearchAlbums as any).mockReturnValue({ data: undefined, isLoading: false })
    ;(hooks.useNewReleases as any).mockReturnValue({ data: { albums: { items: [] } }, isLoading: false })
  })

  it('erro: mostra estados de erro em desktop e mobile', async () => {
    ;(hooks.useArtist as any).mockReturnValue({ data: undefined, isLoading: false, error: new Error('falha') })

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(await screen.findByText('Erro ao carregar artista')).toBeInTheDocument()
    expect(screen.getByText('Erro')).toBeInTheDocument()
    expect(screen.getAllByText('falha')[0]).toBeInTheDocument()
  })

  it('loading: exibe esqueleto e título de carregando no mobile', async () => {
    ;(hooks.useArtist as any).mockReturnValue({ data: undefined, isLoading: true, error: undefined })

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('tracks tab: renderiza cabeçalho e lista de faixas', async () => {
    ;(hooks.useArtist as any).mockReturnValue({ data: baseArtist, isLoading: false, error: undefined })
    ;(hooks.useArtistTopTracks as any).mockReturnValue({ data: [{ id: 't1' }, { id: 't2' }], isLoading: false })
    ;(hooks.useArtistAlbums as any).mockReturnValue({
      data: { pages: [buildAlbumsPage(0, 2)] },
      isLoading: false,
      hasNextPage: true,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    })
    ;(hooks.useSearchAlbums as any).mockReturnValue({ data: undefined, isLoading: false })
    ;(hooks.useNewReleases as any).mockReturnValue({ data: { albums: { items: [{ id: 'nr1' }] } }, isLoading: false })

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect((await screen.findAllByText(/Artista: Artista Exemplo/)).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Álbuns/)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/itens: 2/)[0]).toBeInTheDocument()
  })

  it('altera aba para álbuns (desktop e mobile): chama navigate com tab', async () => {
    ;(hooks.useArtist as any).mockReturnValue({ data: baseArtist, isLoading: false, error: undefined })
    ;(hooks.useArtistTopTracks as any).mockReturnValue({ data: [], isLoading: false })
    ;(hooks.useArtistAlbums as any).mockReturnValue({ data: { pages: [buildAlbumsPage(0, 1)] }, isLoading: false, hasNextPage: false, fetchNextPage: vi.fn(), isFetchingNextPage: false })
    ;(hooks.useSearchAlbums as any).mockReturnValue({ data: undefined, isLoading: false })
    ;(hooks.useNewReleases as any).mockReturnValue({ data: { albums: { items: [] } }, isLoading: false })

    const Cmp = (Route as any).component
    render(<Cmp />)

    const buttons = screen.getAllByRole('button', { name: /álbuns/i })
    buttons.forEach(btn => fireEvent.click(btn))

    expect(navigateMock).toHaveBeenCalled()
    const arg = navigateMock.mock.calls.at(-1)?.[0]
    expect(typeof arg?.search).toBe('function')
  })

  it('filtro de álbuns: onChange e limpar resetam pesquisa e página', async () => {
    currentSearch = { tab: 'albums', albumFilter: '', albumPage: 3 }

    ;(hooks.useArtist as any).mockReturnValue({ data: baseArtist, isLoading: false, error: undefined })
    ;(hooks.useArtistTopTracks as any).mockReturnValue({ data: [], isLoading: false })
    ;(hooks.useArtistAlbums as any).mockReturnValue({ data: { pages: [buildAlbumsPage(0, 1)] }, isLoading: false, hasNextPage: true, fetchNextPage: vi.fn(), isFetchingNextPage: false })
    ;(hooks.useSearchAlbums as any).mockReturnValue({ data: { items: [] }, isLoading: false })
    ;(hooks.useNewReleases as any).mockReturnValue({ data: { albums: { items: [] } }, isLoading: false })

    const Cmp = (Route as any).component
    render(<Cmp />)

    const input = screen.getAllByRole('textbox')[0]
    fireEvent.change(input, { target: { value: 'rock' } })

    expect(navigateMock).toHaveBeenCalled()
    let navArg = navigateMock.mock.calls.at(-1)?.[0]
    const nextSearch = navArg.search({ albumPage: 3 })
    expect(nextSearch.albumFilter).toBe('rock')
    expect(nextSearch.albumPage).toBe(1)

    const clearBtn = screen.getAllByRole('button', { name: 'Limpar' })[0]
    fireEvent.click(clearBtn)

    navArg = navigateMock.mock.calls.at(-1)?.[0]
    const clearedSearch = navArg.search({ albumFilter: 'rock', albumPage: 2 })
    expect(clearedSearch.albumFilter).toBeUndefined()
    expect(clearedSearch.albumPage).toBe(1)
  })

  it('lista de álbuns: quando filtrando usa busca e desabilita carregar mais', async () => {
    currentSearch = { tab: 'albums', albumFilter: 'pop' }

    ;(hooks.useArtist as any).mockReturnValue({ data: baseArtist, isLoading: false, error: undefined })
    ;(hooks.useArtistTopTracks as any).mockReturnValue({ data: [], isLoading: false })
    ;(hooks.useArtistAlbums as any).mockReturnValue({
      data: { pages: [buildAlbumsPage(0, 5)] },
      isLoading: false,
      hasNextPage: true,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    })
    ;(hooks.useSearchAlbums as any).mockReturnValue({ data: { items: [{ id: 's1' }, { id: 's2' }] }, isLoading: false })
    ;(hooks.useNewReleases as any).mockReturnValue({ data: { albums: { items: [{ id: 'nr' }] } }, isLoading: false })

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(await screen.findAllByText(/álbuns: 2/)).toHaveLength(2)
    expect(screen.queryByText('Carregar mais')).toBeNull()
  })

  it('lista de álbuns: sem filtro pagina e chama fetchNextPage', async () => {
    currentSearch = { tab: 'albums' }

    const fetchNext = vi.fn()
    ;(hooks.useArtist as any).mockReturnValue({ data: baseArtist, isLoading: false, error: undefined })
    ;(hooks.useArtistTopTracks as any).mockReturnValue({ data: [], isLoading: false })
    ;(hooks.useArtistAlbums as any).mockReturnValue({
      data: { pages: [buildAlbumsPage(0, 2), buildAlbumsPage(2, 1)] },
      isLoading: false,
      hasNextPage: true,
      fetchNextPage: fetchNext,
      isFetchingNextPage: false,
    })
    ;(hooks.useSearchAlbums as any).mockReturnValue({ data: undefined, isLoading: false })
    ;(hooks.useNewReleases as any).mockReturnValue({ data: { albums: { items: [] } }, isLoading: false })

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(await screen.findAllByText(/álbuns: 3/)).toHaveLength(2)

    const loadMore = screen.getAllByRole('button', { name: 'Carregar mais' })[0]
    fireEvent.click(loadMore)
    expect(fetchNext).toHaveBeenCalled()
  })

  it('sem artista e sem loading/erro: retorna null (nada renderizado)', async () => {
    ;(hooks.useArtist as any).mockReturnValue({ data: undefined, isLoading: false, error: undefined })

    const Cmp = (Route as any).component
    const { container } = render(<Cmp />)
    expect(container.firstChild).toBeNull()
  })

  it('validateSearch: cobre parse de albumFilter, albumPage e tab', () => {
    let parsed = (Route as any).validateSearch({})
    expect(parsed.albumFilter).toBeUndefined()
    expect(parsed.albumPage).toBe(1)
    expect(parsed.tab).toBeUndefined()

    parsed = (Route as any).validateSearch({ albumFilter: 'rock', albumPage: 3, tab: 'albums' })
    expect(parsed.albumFilter).toBe('rock')
    expect(parsed.albumPage).toBe(3)
    expect(parsed.tab).toBe('albums')

    parsed = (Route as any).validateSearch({ albumFilter: 10, albumPage: '2', tab: 'tracks' })
    expect(parsed.albumFilter).toBeUndefined()
    expect(parsed.albumPage).toBe(1)
    expect(parsed.tab).toBe('tracks')

    parsed = (Route as any).validateSearch({ tab: 'other' })
    expect(parsed.tab).toBeUndefined()
  })
})
