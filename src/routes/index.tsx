import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { SearchBar, ArtistGrid, SpotifyLogin } from '@/components'
import { useSearchArtists } from '@/hooks/useSpotify'
import { useAuth } from '@/hooks/useAuth'
import { MobileLayout } from '../components/organisms/MobileLayout/MobileLayout'
import type { SearchFilters } from '@/types'

type HomeSearchParams = {
  q?: string
  page?: number
}

export const Route = createFileRoute('/')({
  component: Home,
  validateSearch: (search: Record<string, unknown>): HomeSearchParams => ({
    q: typeof search.q === 'string' ? search.q : undefined,
    page: typeof search.page === 'number' ? search.page : 1,
  }),
})

function Home() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const [hasSearched, setHasSearched] = useState(!!search.q)
  const { isAuthenticated } = useAuth()

  const searchFilters: SearchFilters = {
    query: search.q || '',
    page: ((search.page as number) || 1) - 1,
    limit: 20,
  }

  const { data, isLoading, error } = useSearchArtists(searchFilters)

  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      navigate({
        search: { q: query, page: 1 }
      })
      setHasSearched(true)
    } else {
      navigate({
        search: { q: undefined, page: undefined }
      })
      setHasSearched(false)
    }
  }, [navigate])

  if (!isAuthenticated) {
    return (
      <>
        {/* Desktop Layout */}
        <div className="hidden md:block container py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
              Purplefy
            </h1>
            <p className="text-purplefy-light-gray text-lg md:text-xl max-w-2xl mx-auto mb-12">
              Descubra e explore música do Spotify de forma elegante e sofisticada
            </p>
          </div>
          <SpotifyLogin />
        </div>

        {/* Mobile Layout */}
        <MobileLayout title="Purplefy" showBack={false} showTabs={false}>
          <div className="px-4 py-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gradient mb-4">
                Purplefy
              </h1>
              <p className="text-purplefy-light-gray text-base max-w-sm mx-auto mb-8">
                Descubra e explore música do Spotify de forma elegante e sofisticada
              </p>
            </div>
            <SpotifyLogin />
          </div>
        </MobileLayout>
      </>
    )
  }

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:block container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            Descubra Música
          </h1>
          <p className="text-purplefy-light-gray text-lg md:text-xl max-w-2xl mx-auto">
            Explore artistas, álbuns e músicas do Spotify. Encontre suas próximas descobertas musicais.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            placeholder="Buscar artistas..."
            onSearch={handleSearch}
            initialValue={search.q || ''}
          />
        </div>

        {error && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-purplefy-white mb-2">
              Erro ao buscar artistas
            </h3>
            <p className="text-purplefy-light-gray mb-4">
              Verifique se você possui um token válido do Spotify
            </p>
            <p className="text-sm text-accent-500">
              {error.message}
            </p>
          </div>
        )}

        {hasSearched && !error && (
          <ArtistGrid
            artists={data?.items || []}
            loading={isLoading}
          />
        )}

        {!hasSearched && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-purplefy-white mb-2">
              Comece sua busca
            </h3>
            <p className="text-purplefy-light-gray">
              Digite o nome de um artista para começar a explorar
            </p>
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <MobileLayout title="Buscar" showBack={false}>
        <div className="px-4 py-4">
          <div className="mb-6">
            <SearchBar
              placeholder="Buscar artistas..."
              onSearch={handleSearch}
              initialValue={search.q || ''}
            />
          </div>

          {error && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-purplefy-white mb-2">
                Erro ao buscar
              </h3>
              <p className="text-purplefy-light-gray text-sm mb-4">
                Verifique sua conexão
              </p>
            </div>
          )}

          {hasSearched && !error && (
            <ArtistGrid
              artists={data?.items || []}
              loading={isLoading}
            />
          )}

          {!hasSearched && !error && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-lg font-semibold text-purplefy-white mb-2">
                Comece sua busca
              </h3>
              <p className="text-purplefy-light-gray text-sm">
                Digite o nome de um artista para começar
              </p>
            </div>
          )}
        </div>
      </MobileLayout>
    </>
  )
}
