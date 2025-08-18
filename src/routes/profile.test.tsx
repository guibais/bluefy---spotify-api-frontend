import { renderAt } from '@/test-utils/router'
import { screen, fireEvent } from '@testing-library/react'
import * as m from '@/paraglide/messages.js'

const clearTokens = vi.fn()
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ isAuthenticated: true, clearTokens }) }))

const useMeMock = vi.fn()
const useMyPlaylistsMock = vi.fn()
vi.mock('@/hooks/useSpotify', async () => {
  const actual = await vi.importActual<any>('@/hooks/useSpotify')
  return {
    ...actual,
    useMe: () => useMeMock(),
    useMyPlaylists: (...args: any[]) => useMyPlaylistsMock(...args),
  }
})

vi.mock('@/components/organisms/MobileLayout/MobileLayout', () => ({
  MobileLayout: ({ title, children }: any) => (
    <section role="region" aria-label={title}>{children}</section>
  ),
}))

vi.mock('@/components/atoms', () => ({
  Button: ({ children, onClick, ...rest }: any) => (
    <button type="button" onClick={onClick} {...rest}>{children}</button>
  ),
  OpenInSpotifyButton: ({ url }: { url: string }) => (
    <a href={url} aria-label="Abrir no Spotify">Abrir no Spotify</a>
  ),
}))

vi.mock('@/components/molecules', async () => {
  const actual = await vi.importActual<any>('@/components/molecules')
  return {
    ...actual,
    LanguageSelector: () => (<div aria-label="Idioma" />),
    MiniPlaylistCard: ({ name }: { id: string; name: string }) => (
      <li role="listitem" aria-label={`Playlist ${name}`}>{name}</li>
    ),
  }
})

vi.mock('@/components/organisms', async () => {
  const actual = await vi.importActual<any>('@/components/organisms')
  return {
    ...actual,
    ProfileHeader: ({ name, subtitle, rightSlot }: any) => (
      <header>
        <h1>{name}</h1>
        <p>{subtitle}</p>
        <div>{rightSlot}</div>
      </header>
    ),
    DesktopHeader: ({ onLogout }: any) => (
      <header>
        <button type="button" onClick={onLogout}>{m.nav_logout()}</button>
      </header>
    ),
  }
})

const meBase = {
  id: 'user123',
  display_name: 'Usuário Teste',
  images: [{ url: 'http://img' }],
  email: 'u@t.com',
  country: 'BR',
  followers: { total: 10 },
  product: 'premium',
  external_urls: { spotify: 'https://open.spotify.com/user/user123' },
}

const playlistsPage = {
  pages: [
    {
      items: [
        { id: 'pl1', name: 'Playlist 1', images: [{ url: 'i1' }], tracks: { total: 5 }, external_urls: { spotify: '#' } },
        { id: 'pl2', name: 'Playlist 2', images: [{ url: 'i2' }], tracks: { total: 3 }, external_urls: { spotify: '#' } },
      ],
    },
  ],
}

describe('/profile route', () => {
  const reloadFn = vi.fn()
  const originalLocation = window.location

  beforeAll(() => {
    // @ts-expect-error override for tests
    delete window.location
    // @ts-expect-error override for tests
    window.location = { ...originalLocation, reload: reloadFn }
  })

  afterAll(() => {
    // @ts-expect-error restore after tests
    window.location = originalLocation
  })

  beforeEach(() => {
    clearTokens.mockReset()
    useMeMock.mockReset()
    useMyPlaylistsMock.mockReset()
  })

  it('exibe estado de erro quando falha ao carregar perfil', async () => {
    useMeMock.mockReturnValue({ data: undefined, isLoading: false, error: new Error('Falha no perfil') })
    useMyPlaylistsMock.mockReturnValue({ data: undefined, isLoading: false })
    renderAt('/profile')
    expect(await screen.findByRole('heading', { name: m.error_profile_load_title() })).toBeInTheDocument()
    expect(screen.getByText('Falha no perfil')).toBeInTheDocument()
  })

  it('renderiza skeletons quando carregando (desktop e mobile)', async () => {
    useMeMock.mockReturnValue({ data: undefined, isLoading: true, error: undefined })
    useMyPlaylistsMock.mockReturnValue({ data: undefined, isLoading: true })
    renderAt('/profile')
    expect(await screen.findByRole('region', { name: m.profile_title() })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: m.my_playlists() })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: m.playlists_title() })).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem').length).toBe(0)
    expect(screen.queryByRole('link', { name: 'Abrir no Spotify' })).not.toBeInTheDocument()
  })

  it('renderiza dados do perfil e playlists (desktop e mobile)', async () => {
    useMeMock.mockReturnValue({ data: meBase, isLoading: false, error: undefined })
    useMyPlaylistsMock.mockReturnValue({ data: playlistsPage, isLoading: false })
    renderAt('/profile')

    expect(await screen.findByRole('heading', { name: m.my_playlists() })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: m.playlists_title() })).toBeInTheDocument()

    const items = screen.getAllByRole('listitem')
    expect(items.length).toBeGreaterThan(0)

    expect(screen.getByRole('link', { name: 'Abrir no Spotify' })).toBeInTheDocument()

    const sairButtons = screen.getAllByRole('button', { name: m.nav_logout() })
    expect(sairButtons.length).toBeGreaterThan(0)
  })

  it('faz logout (chama clearTokens e recarrega a página)', async () => {
    useMeMock.mockReturnValue({ data: meBase, isLoading: false, error: undefined })
    useMyPlaylistsMock.mockReturnValue({ data: playlistsPage, isLoading: false })
    renderAt('/profile')

    const btn = await screen.findAllByRole('button', { name: m.nav_logout() })
    fireEvent.click(btn[0])
    expect(clearTokens).toHaveBeenCalled()
    expect(reloadFn).toHaveBeenCalled()
  })

  it('não renderiza botão do Spotify quando não há url externa', async () => {
    const meNoExternal = { ...meBase, external_urls: {} as any }
    useMeMock.mockReturnValue({ data: meNoExternal, isLoading: false, error: undefined })
    useMyPlaylistsMock.mockReturnValue({ data: playlistsPage, isLoading: false })
    renderAt('/profile')

    expect(screen.queryByRole('link', { name: 'Abrir no Spotify' })).not.toBeInTheDocument()
  })
})
