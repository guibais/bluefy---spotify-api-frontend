import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: (_path: string) => (opts: any) => ({
    ...opts,
    useParams: () => ({ playlistId: '123' }),
  }),
}))

vi.mock('@/hooks/useSpotify', () => ({
  usePlaylist: vi.fn(),
  usePlaylistTracks: vi.fn(),
}))

vi.mock('@/components', () => ({
  DetailTemplate: ({ title, header, children, backTo }: any) => (
    <div>
      {typeof title === 'string' ? <h1>{title}</h1> : null}
      {header}
      <div>{children}</div>
      <span aria-label="voltar-para">{backTo}</span>
    </div>
  ),
  BackButton: ({ children }: any) => <button type="button">{children ?? 'Voltar'}</button>,
  ErrorState: ({ message, action }: any) => <div role="alert">{message}{action}</div>,
}))

vi.mock('@/components/organisms/TrackList/TrackList', () => ({
  TrackList: ({ tracks, loading }: any) => (
    <div>
      {loading ? <p>Carregando...</p> : null}
      <ul>
        {(tracks ?? []).map((t: any, i: number) => (
          <li key={i}>{t?.track?.name ?? t?.name ?? `Faixa ${i}`}</li>
        ))}
      </ul>
    </div>
  ),
}))

vi.mock('@/components/molecules/PlaylistHeader/PlaylistHeader', () => ({
  PlaylistHeader: ({ name, ownerName, followers }: any) => (
    <div>
      <h2>{name}</h2>
      {ownerName ? <p>{ownerName}</p> : null}
      {followers ? <span>{followers}</span> : null}
    </div>
  ),
}))

import * as hooks from '@/hooks/useSpotify'
import { Route } from './playlist.$playlistId'

describe('/playlist/$playlistId route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza estado de erro com mensagem', () => {
    vi.mocked(hooks.usePlaylist).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Falhou ao carregar playlist'),
    } as any)
    vi.mocked(hooks.usePlaylistTracks).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    } as any)

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(screen.getByRole('alert')).toHaveTextContent('Falhou ao carregar playlist')
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renderiza estado de loading', () => {
    vi.mocked(hooks.usePlaylist).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    } as any)
    vi.mocked(hooks.usePlaylistTracks).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    } as any)

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(screen.getAllByText('Carregando...').length).toBeGreaterThanOrEqual(2)
  })

  it('retorna null quando playlist não existe (sem loading/erro)', () => {
    vi.mocked(hooks.usePlaylist).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    } as any)

    const Cmp = (Route as any).component
    const { container } = render(<Cmp />)

    expect(container.firstChild).toBeNull()
  })

  it('renderiza sucesso com tracks carregando', () => {
    vi.mocked(hooks.usePlaylist).mockReturnValue({
      data: {
        name: 'Minha Playlist',
        images: [{ url: 'img.jpg' }],
        owner: { display_name: 'Dono' },
        followers: { total: 42 },
        external_urls: { spotify: 'https://spotify.com' },
      },
      isLoading: false,
      error: undefined,
    } as any)
    vi.mocked(hooks.usePlaylistTracks).mockReturnValue({
      data: { items: [{ track: { name: 'Música 1' } }] },
      isLoading: true,
      error: undefined,
    } as any)

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Minha Playlist')
    expect(screen.getByText('Dono')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('renderiza sucesso com tracks carregadas', () => {
    vi.mocked(hooks.usePlaylist).mockReturnValue({
      data: {
        name: 'Minhas Faixas',
        images: [],
        owner: { display_name: 'Usuário' },
        followers: { total: 10 },
        external_urls: { spotify: '#' },
      },
      isLoading: false,
      error: undefined,
    } as any)
    vi.mocked(hooks.usePlaylistTracks).mockReturnValue({
      data: { items: [
        { track: { name: 'Faixa A' } },
        { track: { name: 'Faixa B' } },
      ] },
      isLoading: false,
      error: undefined,
    } as any)

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Minhas Faixas')
    expect(screen.getByText('Usuário')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('Faixa A')).toBeInTheDocument()
    expect(screen.getByText('Faixa B')).toBeInTheDocument()
  })
})
