import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

let currentParams: any = { albumId: 'alb-1' }
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: (_path: string) => (opts: any) => ({
    ...opts,
    useParams: () => currentParams,
    useNavigate: () => vi.fn(),
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
}))

vi.mock('@/components/organisms', () => ({
  AlbumHeader: ({ name, layout, albumType, year, tracksCount }: any) => (
    <header>
      <h2>Álbum: {name}</h2>
      <span>Layout: {layout}</span>
      <div>Tipo: {albumType}</div>
      <div>Ano: {year}</div>
      <div>Faixas: {tracksCount}</div>
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

vi.mock('@/components/organisms/MobileLayout/MobileLayout', () => ({
  MobileLayout: ({ title, children }: any) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}))

vi.mock('@/hooks/useSpotify', () => ({
  useAlbum: vi.fn(),
  useAlbumTracks: vi.fn(),
}))

import * as hooks from '@/hooks/useSpotify'
import { Route } from './album.$albumId'

const baseAlbum = {
  name: 'Álbum Exemplo',
  images: [{ url: 'https://img/1.jpg' }],
  release_date: '2020-05-10',
  total_tracks: 10,
  album_type: 'album',
  artists: [{ id: 'a1', name: 'Artista 1' }],
  external_urls: { spotify: 'https://spotify/album/1' },
}

const baseTracks = {
  items: Array.from({ length: 3 }).map((_, i) => ({ id: `t${i}`, name: `Tr${i}` })),
}

describe('/album/$albumId route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(hooks.useAlbum as any).mockReturnValue({ data: undefined, isLoading: false, error: undefined })
    ;(hooks.useAlbumTracks as any).mockReturnValue({ data: { items: [] }, isLoading: false })
  })

  it('erro: exibe estado de erro com mensagem', async () => {
    ;(hooks.useAlbum as any).mockReturnValue({ data: undefined, isLoading: false, error: new Error('falha') })

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(await screen.findByText(/falha/)).toBeInTheDocument()
  })

  it('loading: exibe skeleton e título mobile', async () => {
    ;(hooks.useAlbum as any).mockReturnValue({ data: undefined, isLoading: true, error: undefined })

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('sem album e sem loading/erro: retorna null', async () => {
    ;(hooks.useAlbum as any).mockReturnValue({ data: undefined, isLoading: false, error: undefined })

    const Cmp = (Route as any).component
    const { container } = render(<Cmp />)
    expect(container.firstChild).toBeNull()
  })

  it('renderiza desktop e mobile com cabeçalho e lista de faixas', async () => {
    ;(hooks.useAlbum as any).mockReturnValue({ data: baseAlbum, isLoading: false, error: undefined })
    ;(hooks.useAlbumTracks as any).mockReturnValue({ data: baseTracks, isLoading: false })

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect((await screen.findAllByText(/Álbum: Álbum Exemplo/)).length).toBeGreaterThanOrEqual(1)

    expect(screen.getByText(/Voltar para busca/)).toBeInTheDocument()

    expect(screen.getAllByText(/itens: 3/)[0]).toBeInTheDocument()
  })

  it('tracks loading: exibe estado de carregando nas listas', async () => {
    ;(hooks.useAlbum as any).mockReturnValue({ data: baseAlbum, isLoading: false, error: undefined })
    ;(hooks.useAlbumTracks as any).mockReturnValue({ data: baseTracks, isLoading: true })

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(await screen.findAllByText(/carregando.../)).toHaveLength(2)
  })
})
