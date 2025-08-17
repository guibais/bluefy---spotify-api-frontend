import { createFileRoute } from '@tanstack/react-router'
import { BackButton, ErrorState } from '@/components'
import { useArtist, useArtistTopTracks, useArtistAlbums, useNewReleases, useSearchAlbums } from '../hooks/useSpotify'
import { useDebounce } from '../hooks/useDebounce'
import { TrackList } from '../components/organisms/TrackList/TrackList'
import { AlbumGrid } from '../components/organisms/AlbumGrid/AlbumGrid'
import { MobileLayout } from '../components/organisms/MobileLayout/MobileLayout'
import { Input } from '@/components/atoms'
import { BackLink, Tabs } from '@/components/molecules'
import { ArtistHeader } from '@/components/organisms'
import * as m from '@/paraglide/messages.js'

type ArtistSearchParams = {
  albumFilter?: string
  albumPage: number
  tab?: 'tracks' | 'albums'
}

export const Route = createFileRoute('/artist/$artistId')({
  component: ArtistPage,
  validateSearch: (search: Record<string, unknown>): ArtistSearchParams => ({
    albumFilter: typeof search.albumFilter === 'string' ? search.albumFilter : undefined,
    albumPage: typeof search.albumPage === 'number' ? search.albumPage : 1,
    tab:
      search.tab === 'albums'
        ? 'albums'
        : search.tab === 'tracks'
          ? 'tracks'
          : undefined,
  }),
})

function ArtistPage() {
  const { artistId } = Route.useParams()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const activeTab: 'tracks' | 'albums' = (search.tab as 'tracks' | 'albums') ?? 'tracks'

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

  const { data: albumsSearch, isLoading: albumsSearchLoading } = useSearchAlbums({
    artistName: artist?.name,
    albumName: debouncedAlbumFilter || undefined,
    page: ((search.albumPage as number) || 1) - 1,
    limit: albumLimit,
  })

  const isFiltering = !!debouncedAlbumFilter
  const albums = isFiltering
    ? (albumsSearch?.items || [])
    : (albumsData?.pages.flatMap(page => page.items) || [])

  const { data: newReleasesData, isLoading: newReleasesLoading } = useNewReleases(12, 'BR')
  const newReleases = newReleasesData?.albums.items || []

  const handleAlbumFilterChange = (filter: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        albumFilter: filter || undefined,
        albumPage: 1,
      }),
    })
  }

  const handleLoadMoreAlbums = () => {
    fetchNextPage()
  }

  if (artistError) {
    return (
      <>
        <div className="hidden md:block container py-8">
          <ErrorState 
            title={m.error_artist_load_title()}
            message={artistError.message}
            action={<BackButton fallbackTo="/home" variant="primary">{m.back_label()}</BackButton>}
            size="lg"
          />
        </div>

        <MobileLayout title={m.error_title()} backTo="/home">
          <div className="px-4 py-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-purplefy-white mb-2">{m.error_loading_title()}</h3>
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

        <MobileLayout title={m.loading()} backTo="/home">
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
      <div className="hidden md:block container py-8">
        <BackLink to="/home" label={m.back_to_search()} />

        <ArtistHeader
          name={artist.name}
          imageUrl={imageUrl}
          followers={artist.followers.total}
          popularity={artist.popularity}
          genres={artist.genres}
          externalUrl={artist.external_urls.spotify}
          layout="desktop"
        />

        <div className="border-b border-purplefy-medium-gray mb-8">
          <Tabs
            items={[
              { id: 'tracks', label: m.top_tracks_title() },
              { id: 'albums', label: m.albums_title() },
            ]}
            activeId={activeTab}
            onChange={(id) =>
              navigate({ search: (prev) => ({ ...prev, tab: id as 'tracks' | 'albums' }) })
            }
          />
        </div>

        {activeTab === 'tracks' && (
          <TrackList
            tracks={topTracks || []}
            loading={tracksLoading}
            title={m.top_tracks_title()}
          />
        )}

        {activeTab === 'albums' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-purplefy-white">{m.albums_title()}</h2>
              <div className="w-full sm:w-auto">
                <Input
                  placeholder={m.filter_albums_placeholder()}
                  value={search.albumFilter || ''}
                  onChange={(e) => handleAlbumFilterChange(e.target.value)}
                  onClear={() => handleAlbumFilterChange('')}
                  showSearch
                  className="w-full sm:w-64"
                />
              </div>
            </div>

            <AlbumGrid
              albums={albums}
              loading={isFiltering ? albumsSearchLoading : albumsLoading}
              hasNextPage={isFiltering ? false : hasNextPage}
              onLoadMore={isFiltering ? undefined : handleLoadMoreAlbums}
              loadingMore={isFiltering ? false : isFetchingNextPage}
            />

            <div className="pt-4">
              <h2 className="text-2xl font-bold text-purplefy-white mb-4">{m.new_releases_title()}</h2>
              <AlbumGrid
                albums={newReleases}
                loading={newReleasesLoading}
                hasNextPage={false}
                onLoadMore={() => {}}
                loadingMore={false}
              />
            </div>
          </div>
        )}
      </div>

      <MobileLayout title={artist.name} backTo="/home" showTabs={false}>
        <div className="px-4 py-4">
          <ArtistHeader
            name={artist.name}
            imageUrl={imageUrl}
            followers={artist.followers.total}
            popularity={artist.popularity}
            genres={artist.genres}
            externalUrl={artist.external_urls.spotify}
            layout="mobile"
          />

          <div className="mb-4" aria-label={m.artist_tablist_label()}>
            <Tabs
              variant="block"
              items={[
                { id: 'tracks', label: m.tracks_title() },
                { id: 'albums', label: m.albums_title() },
              ]}
              activeId={activeTab}
              onChange={(id) =>
                navigate({ search: (prev) => ({ ...prev, tab: id as 'tracks' | 'albums' }) })
              }
            />
          </div>

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
                <Input
                  placeholder={m.filter_albums_placeholder()}
                  value={search.albumFilter || ''}
                  onChange={(e) => handleAlbumFilterChange(e.target.value)}
                  onClear={() => handleAlbumFilterChange('')}
                  showSearch
                  className="w-full"
                />
              </div>

              <AlbumGrid
                albums={albums}
                loading={isFiltering ? albumsSearchLoading : albumsLoading}
                hasNextPage={isFiltering ? false : hasNextPage}
                onLoadMore={isFiltering ? undefined : handleLoadMoreAlbums}
                loadingMore={isFiltering ? false : isFetchingNextPage}
              />

              <div className="pt-2">
                <h2 className="text-xl font-bold text-purplefy-white mb-3">{m.new_releases_title()}</h2>
                <AlbumGrid
                  albums={newReleases}
                  loading={newReleasesLoading}
                  hasNextPage={false}
                  onLoadMore={() => {}}
                  loadingMore={false}
                />
              </div>
            </div>
          )}
        </div>
      </MobileLayout>
    </>
  )
}
