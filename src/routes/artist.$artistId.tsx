import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, ExternalLink, Users } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button, Image } from '@/components/atoms'
import { AlbumGrid, TrackList } from '@/components/organisms'
import { useArtist, useArtistTopTracks, useArtistAlbums } from '@/hooks/useSpotify'
import { useDebounce } from '@/hooks/useDebounce'

type ArtistSearchParams = {
  albumFilter?: string
  albumPage: number
}

export const Route = createFileRoute('/artist/$artistId')({
  component: ArtistPage,
  validateSearch: (search: Record<string, unknown>): ArtistSearchParams => ({
    albumFilter: typeof search.albumFilter === 'string' ? search.albumFilter : undefined,
    albumPage: typeof search.albumPage === 'number' ? search.albumPage : 1,
  }),
})

function ArtistPage() {
  const { artistId } = Route.useParams()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const [activeTab, setActiveTab] = useState<'tracks' | 'albums'>('tracks')

  const { data: artist, isLoading: artistLoading, error: artistError } = useArtist(artistId)
  const { data: topTracks, isLoading: tracksLoading } = useArtistTopTracks(artistId)

  const albumLimit = 20
  const debouncedAlbumFilter = useDebounce(search.albumFilter, 500)

  const {
    data: albumsData,
    isLoading: albumsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useArtistAlbums(artistId, albumLimit, debouncedAlbumFilter)

  const albums = albumsData?.pages.flatMap(page => page.items) || []

  const handleAlbumFilterChange = (filter: string) => {
    navigate({
      search: {
        albumFilter: filter || undefined,
        albumPage: 1,
      },
    })
  }

  const handleLoadMoreAlbums = () => {
    fetchNextPage()
  }

  if (artistError) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-spotify-white mb-2">
            Erro ao carregar artista
          </h3>
          <p className="text-spotify-light-gray mb-4">
            {artistError.message}
          </p>
          <Link to="/">
            <Button variant="primary">Voltar para busca</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (artistLoading) {
    return (
      <div className="container py-8">
        <div className="skeleton h-8 w-24 mb-6" />
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="skeleton w-full md:w-80 aspect-square rounded-xl" />
          <div className="flex-1 space-y-4">
            <div className="skeleton h-12 w-3/4" />
            <div className="skeleton h-6 w-1/2" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!artist) return null

  const imageUrl = artist.images[0]?.url

  return (
    <div className="container py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-spotify-light-gray hover:text-spotify-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Voltar para busca
      </Link>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-80">
          <Image
            src={imageUrl}
            alt={artist.name}
            className="w-full aspect-square rounded-xl shadow-2xl"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-4xl md:text-6xl font-bold text-spotify-white mb-4">
            {artist.name}
          </h1>

          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-spotify-light-gray">
              <Users className="w-5 h-5" />
              <span>{artist.followers.total.toLocaleString('pt-BR')} seguidores</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-spotify-dark-gray rounded-full h-2 w-24">
                <div 
                  className="bg-spotify-green h-2 rounded-full transition-all duration-300"
                  style={{ width: `${artist.popularity}%` }}
                />
              </div>
              <span className="text-sm text-spotify-light-gray">
                {artist.popularity}% popular
              </span>
            </div>
          </div>

          {artist.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {artist.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-spotify-medium-gray text-spotify-light-gray text-sm rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          <Button
            onClick={() => window.open(artist.external_urls.spotify, '_blank')}
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir no Spotify
          </Button>
        </div>
      </div>

      <div className="border-b border-spotify-medium-gray mb-8">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('tracks')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'tracks'
                ? 'border-spotify-green text-spotify-green'
                : 'border-transparent text-spotify-light-gray hover:text-spotify-white'
            }`}
          >
            Principais Músicas
          </button>
          <button
            onClick={() => setActiveTab('albums')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'albums'
                ? 'border-spotify-green text-spotify-green'
                : 'border-transparent text-spotify-light-gray hover:text-spotify-white'
            }`}
          >
            Álbuns
          </button>
        </nav>
      </div>

      {activeTab === 'tracks' && (
        <TrackList
          tracks={topTracks || []}
          loading={tracksLoading}
          title="Principais Músicas"
        />
      )}

      {activeTab === 'albums' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-2xl font-bold text-spotify-white">Álbuns</h2>
            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Filtrar álbuns..."
                value={search.albumFilter || ''}
                onChange={(e) => handleAlbumFilterChange(e.target.value)}
                className="input-field w-full sm:w-64"
              />
            </div>
          </div>

          <AlbumGrid
            albums={albums}
            loading={albumsLoading}
            hasNextPage={hasNextPage}
            onLoadMore={handleLoadMoreAlbums}
            loadingMore={isFetchingNextPage}
          />
        </div>
      )}
    </div>
  )
}
