import { createFileRoute } from '@tanstack/react-router'
import { BackButton, ErrorState } from '@/components'
import { useAlbum, useAlbumTracks } from '../hooks/useSpotify'
import { TrackList } from '../components/organisms/TrackList/TrackList'
import { BackLink } from '@/components/molecules'
import { AlbumHeader } from '@/components/organisms'
import { MobileLayout } from '../components/organisms/MobileLayout/MobileLayout'
import * as m from '@/paraglide/messages.js'

export const Route = createFileRoute('/album/$albumId')({
  component: AlbumPage,
})

function AlbumPage() {
  const { albumId } = Route.useParams()

  const { data: album, isLoading: albumLoading, error: albumError } = useAlbum(albumId)
  const { data: tracksData, isLoading: tracksLoading } = useAlbumTracks(albumId)

  if (albumError) {
    return (
      <div className="container py-8">
        <ErrorState 
          title={m.error_album_load_title()}
          message={albumError.message}
          action={<BackButton fallbackTo="/home" variant="primary">{m.back_to_search()}</BackButton>}
          size="lg"
        />
      </div>
    )
  }

  if (albumLoading) {
    return (
      <>
        <div className="hidden md:block container py-8">
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

  if (!album) return null

  const imageUrl = album.images[0]?.url
  const releaseYear = new Date(album.release_date).getFullYear()
  const tracks = tracksData?.items || []

  return (
    <>
      <div className="hidden md:block container py-8">
        <BackLink to="/home" label={m.back_to_search()} />

        <AlbumHeader
          name={album.name}
          imageUrl={imageUrl}
          albumType={album.album_type}
          artists={album.artists.map(a => ({ id: a.id, name: a.name }))}
          year={releaseYear}
          tracksCount={album.total_tracks}
          externalUrl={album.external_urls.spotify}
          layout="desktop"
        />

        <TrackList
          tracks={tracks}
          loading={tracksLoading}
          title={m.album_tracks_title()}
        />
      </div>

      <MobileLayout title={album.name} backTo="/home" showTabs={false}>
        <div className="px-4 py-4">
          <AlbumHeader
            name={album.name}
            imageUrl={imageUrl}
            albumType={album.album_type}
            artists={album.artists.map(a => ({ id: a.id, name: a.name }))}
            year={releaseYear}
            tracksCount={album.total_tracks}
            externalUrl={album.external_urls.spotify}
            layout="mobile"
          />

         
          <TrackList
            tracks={tracks}
            loading={tracksLoading}
            title={m.album_tracks_title()}
          />
        </div>
      </MobileLayout>
    </>
  )
}
