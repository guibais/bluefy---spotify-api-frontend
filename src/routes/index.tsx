import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { SearchBar, ArtistGrid } from '@/components'
import { useSearchArtists } from '@/hooks/useSpotify'
import { useQueryParams } from '@/hooks/useQueryParams'
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
  const { params, updateParams } = useQueryParams<HomeSearchParams>()
  const [hasSearched, setHasSearched] = useState(!!params.q)

  const searchFilters: SearchFilters = {
    query: params.q || '',
    page: ((params.page as number) || 1) - 1,
    limit: 20,
  }

  const { data, isLoading, error } = useSearchArtists(searchFilters)

  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      updateParams({ q: query, page: 1 })
      setHasSearched(true)
    } else {
      updateParams({ q: undefined, page: undefined })
      setHasSearched(false)
    }
  }, [updateParams])

  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
          Descubra Música
        </h1>
        <p className="text-spotify-light-gray text-lg md:text-xl max-w-2xl mx-auto">
          Explore artistas, álbuns e músicas do Spotify. Encontre suas próximas descobertas musicais.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar
          placeholder="Buscar artistas..."
          onSearch={handleSearch}
          initialValue={params.q || ''}
        />
      </div>

      {error && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-spotify-white mb-2">
            Erro ao buscar artistas
          </h3>
          <p className="text-spotify-light-gray mb-4">
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
          <h3 className="text-xl font-semibold text-spotify-white mb-2">
            Comece sua busca
          </h3>
          <p className="text-spotify-light-gray">
            Digite o nome de um artista para começar a explorar
          </p>
        </div>
      )}
    </div>
  )
}
