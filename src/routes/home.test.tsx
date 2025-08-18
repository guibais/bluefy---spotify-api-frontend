import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: (path: string) => (opts: any) => ({ path, ...opts }),
  useLocation: () => ({ pathname: '/home', search: '', hash: '' }),
  Link: ({ children }: { children: any }) => <>{children}</>,
}))

vi.mock('@/hooks/useSpotify', () => ({
  useMyPlaylists: vi.fn(),
  useNewReleases: vi.fn(),
}))

import * as hooks from '@/hooks/useSpotify'
import { Route } from './home'

// Mock dos componentes para evitar dependências e foco no comportamento da rota
vi.mock('@/components', () => ({
  PageTemplate: ({ title, description, desktop, mobile }: any) => (
    <div>
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
      <div>{desktop}</div>
      <div>{mobile}</div>
    </div>
  ),
}))

vi.mock('@/components/molecules', () => ({
  Section: ({ title, children }: any) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
  PlaylistCard: ({ name, subtitle }: any) => (
    <div>
      <span>{name}</span>
      {subtitle ? <span>{subtitle}</span> : null}
    </div>
  ),
}))

// types local simples para evitar depender de types globais
type Image = { url?: string }

describe('/home route', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza título e descrição em português', async () => {
    ;(hooks.useMyPlaylists as any).mockReturnValue({ isLoading: true, data: undefined })
    ;(hooks.useNewReleases as any).mockReturnValue({ isLoading: true, data: undefined })

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(await screen.findByRole('heading', { name: 'Início' })).toBeInTheDocument()
    expect(screen.getByText('Descubra suas playlists e explore destaques do Spotify.')).toBeInTheDocument()
    expect(screen.getAllByText('Suas Playlists')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Novos Lançamentos')[0]).toBeInTheDocument()
    expect(screen.getByText('Sua experiência')).toBeInTheDocument()
  })

  it('renderiza listas quando carregado (playlists e lançamentos)', async () => {
    const playlistItems = Array.from({ length: 3 }).map((_, i) => ({
      id: `pl-${i}`,
      name: `Playlist ${i}`,
      images: [{ url: `https://img/${i}.jpg` }] as Image[],
      owner: { display_name: `Owner ${i}` },
      external_urls: { spotify: `https://spotify/playlist/${i}` },
    }))

    const albumItems = Array.from({ length: 3 }).map((_, i) => ({
      id: `al-${i}`,
      name: `Álbum ${i}`,
      images: [{ url: `https://img/a${i}.jpg` }] as Image[],
      artists: [{ name: `Artista ${i}` }],
      external_urls: { spotify: `https://spotify/album/${i}` },
    }))

    ;(hooks.useMyPlaylists as any).mockReturnValue({
      isLoading: false,
      data: { pages: [{ items: playlistItems }] },
    })

    ;(hooks.useNewReleases as any).mockReturnValue({
      isLoading: false,
      data: { albums: { items: albumItems } },
    })

    const Cmp = (Route as any).component
    render(<Cmp />)

    // Títulos das seções em português
    expect(await screen.findAllByText('Suas Playlists')).toHaveLength(2) // desktop e mobile
    expect(await screen.findAllByText('Novos Lançamentos')).toHaveLength(2)

    // Alguns cards de playlist e álbum (aparecem em desktop e mobile)
    expect(screen.getAllByText('Playlist 0').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('Owner 0').length).toBeGreaterThanOrEqual(2)

    expect(screen.getAllByText('Álbum 0').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('Artista 0').length).toBeGreaterThanOrEqual(2)
  })
})
