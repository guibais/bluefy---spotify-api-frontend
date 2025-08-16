import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Users, ExternalLink } from 'lucide-react'
import { useArtist, useArtistTopTracks, useArtistAlbums } from '../hooks/useSpotify'
import { useDebounce } from '../hooks/useDebounce'
import { TrackList } from '../components/organisms/TrackList/TrackList'
import { AlbumGrid } from '../components/organisms/AlbumGrid/AlbumGrid'
import { Button } from '../components/atoms/Button/Button'
import { Image } from '../components/atoms/Image/Image'
import { MobileLayout } from '../components/organisms/MobileLayout/MobileLayout'
 

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
      <>
        {/* Desktop Layout */}
        <div className="hidden md:block container py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-purplefy-white mb-2">
              Erro ao carregar artista
            </h3>
            <p className="text-purplefy-light-gray mb-4">
              {artistError.message}
            </p>
            <Link to="/">
              <Button variant="primary">Voltar para busca</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Layout */}
        <MobileLayout title="Erro" backTo="/">
          <div className="px-4 py-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-purplefy-white mb-2">
                Erro ao carregar
              </h3>
              <p className="text-purplefy-light-gray text-sm">
                {artistError.message}
              </p>
            </div>
          </div>
        </MobileLayout>
      </>
    )
  }

  if (artistLoading) {
    return (
      <>
        {/* Desktop Loading */}
        <div className="hidden md:block container py-8">
          <div className="skeleton h-8 w-24 mb-6" />
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="skeleton w-full md:w-80 aspect-square rounded-xl" />
            <div className="flex-1 space-y-4">
              <div className="skeleton h-12 w-3/4" />
              <div className="skeleton h-6 w-1/2" />
              <div className="skeleton h-6 w-2/3" />
            </div>
          </div>
        </div>

        {/* Mobile Loading */}
        <MobileLayout title="Carregando..." backTo="/">
          <div className="px-4 py-4">
            <div className="flex flex-col gap-4 mb-6">
              <div className="skeleton w-full aspect-square rounded-xl" />
              <div className="space-y-3">
                <div className="skeleton h-8 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            </div>
          </div>
        </MobileLayout>
      </>
    )
  }

  if (!artist) return null

  const imageUrl = artist.images[0]?.url

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:block container py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-purplefy-light-gray hover:text-purplefy-white transition-colors mb-6">
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
            <h1 className="text-4xl md:text-6xl font-bold text-purplefy-white mb-4">
              {artist.name}
            </h1>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-purplefy-light-gray">
                <Users className="w-5 h-5" />
                <span>{artist.followers.total.toLocaleString('pt-BR')} seguidores</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-purplefy-dark-gray rounded-full h-2 w-24">
                  <div 
                    className="bg-gradient-to-r from-purplefy-primary to-purplefy-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${artist.popularity}%` }}
                  />
                </div>
                <span className="text-sm text-purplefy-light-gray">
                  {artist.popularity}% popular
                </span>
              </div>
            </div>

            {artist.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {artist.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-purplefy-medium-gray text-purplefy-light-gray text-sm rounded-full border border-purplefy-primary/20"
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

        <div className="border-b border-purplefy-medium-gray mb-8">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('tracks')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'tracks'
                  ? 'border-purplefy-primary text-purplefy-primary'
                  : 'border-transparent text-purplefy-light-gray hover:text-purplefy-white'
              }`}
            >
              Principais Músicas
            </button>
            <button
              onClick={() => setActiveTab('albums')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'albums'
                  ? 'border-purplefy-primary text-purplefy-primary'
                  : 'border-transparent text-purplefy-light-gray hover:text-purplefy-white'
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
              <h2 className="text-2xl font-bold text-purplefy-white">Álbuns</h2>
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

      {/* Mobile Layout */}
      <MobileLayout title={artist.name} backTo="/" showTabs={false}>
        <div className="px-4 py-4">
          {/* Artist Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-48 h-48 mb-4">
              <Image
                src={imageUrl}
                alt={artist.name}
                className="w-full h-full rounded-xl shadow-lg"
              />
            </div>
            
            <h1 className="text-2xl font-bold text-purplefy-white mb-2">
              {artist.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-purplefy-light-gray text-sm">
                <Users className="w-4 h-4" />
                <span>{(artist.followers.total / 1000000).toFixed(1)}M</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="bg-purplefy-dark-gray rounded-full h-1.5 w-16">
                  <div 
                    className="bg-gradient-to-r from-purplefy-primary to-purplefy-secondary h-1.5 rounded-full"
                    style={{ width: `${artist.popularity}%` }}
                  />
                </div>
                <span className="text-xs text-purplefy-light-gray">
                  {artist.popularity}%
                </span>
              </div>
            </div>

            {artist.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center mb-4">
                {artist.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-1 bg-purplefy-medium-gray text-purplefy-light-gray text-xs rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <Button
              onClick={() => window.open(artist.external_urls.spotify, '_blank')}
              variant="primary"
              size="sm"
              className="inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir no Spotify
            </Button>
          </div>

          {/* Mobile Tabs */}
          <div className="flex bg-purplefy-medium-gray rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('tracks')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'tracks'
                  ? 'bg-purplefy-primary text-purplefy-white shadow-sm'
                  : 'text-purplefy-light-gray hover:text-purplefy-white'
              }`}
            >
              Músicas
            </button>
            <button
              onClick={() => setActiveTab('albums')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'albums'
                  ? 'bg-purplefy-primary text-purplefy-white shadow-sm'
                  : 'text-purplefy-light-gray hover:text-purplefy-white'
              }`}
            >
              Álbuns
            </button>
          </div>

          {/* Content */}
          {activeTab === 'tracks' && (
            <TrackList
              tracks={topTracks || []}
              loading={tracksLoading}
              title=""
            />
          )}

          {activeTab === 'albums' && (
            <div className="space-y-4">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Filtrar álbuns..."
                  value={search.albumFilter || ''}
                  onChange={(e) => handleAlbumFilterChange(e.target.value)}
                  className="input-field w-full"
                />
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
      </MobileLayout>
    </>
  )
}
