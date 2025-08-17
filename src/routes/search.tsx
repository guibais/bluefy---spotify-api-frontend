import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { SearchBar, ArtistGrid, GridPageTemplate, ErrorState } from '@/components'
import { useSearchArtists } from '@/hooks/useSpotify'
import type { SearchFilters } from '@/types'

type HomeSearchParams = {
  q?: string
  page?: number
}

export const Route = createFileRoute('/search')({
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

  const searchFilters: SearchFilters = {
    query: search.q || '',
    page: ((search.page as number) || 1) - 1,
    limit: 20,
  }

  const { data: artists, isLoading, error } = useSearchArtists(searchFilters)

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


  return (
    <GridPageTemplate
      title="Descubra Artistas"
      description="Explore artistas do Spotify. Encontre suas próximas descobertas."
      showTabs={false}
      mobileShowBack={true}
      toolbar={
        <SearchBar
          placeholder="Buscar artistas..."
          onSearch={handleSearch}
          initialValue={search.q || ''}
        />
      }
    >
      {error && (
        <div className="py-8">
          <ErrorState
            title="Erro ao buscar artistas"
            message={error.message}
            size="lg"
          />
        </div>
      )}

      {hasSearched && !error && (
        <>
          <div className="mb-8">
            <ArtistGrid artists={artists?.items || []} loading={isLoading} />
          </div>
        </>
      )}

      {!hasSearched && !error && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold text-purplefy-white mb-2">Comece sua busca</h3>
          <p className="text-purplefy-light-gray">Digite o nome de um artista para começar a explorar</p>
        </div>
      )}
    </GridPageTemplate>
  )
}
