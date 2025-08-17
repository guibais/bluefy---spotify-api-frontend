import { createFileRoute, Link } from '@tanstack/react-router'
import { BackButton, ErrorState } from '@/components'
import { ArrowLeft, Calendar, ExternalLink, Disc } from 'lucide-react'
import { useAlbum, useAlbumTracks } from '../hooks/useSpotify'
import { TrackList } from '../components/organisms/TrackList/TrackList'
import { Button } from '../components/atoms/Button/Button'
import { Image } from '../components/atoms/Image/Image'
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
        <Link to="/home" className="inline-flex items-center gap-2 text-purplefy-light-gray hover:text-purplefy-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          {m.back_to_search()}
        </Link>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-full md:w-80">
            <Image
              src={imageUrl}
              alt={album.name}
              className="w-full aspect-square rounded-xl shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <span className="inline-block px-3 py-1 bg-purplefy-medium-gray text-purplefy-light-gray text-sm rounded-full capitalize mb-4">
              {album.album_type}
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-purplefy-white mb-4">
              {album.name}
            </h1>

            <p className="text-xl text-purplefy-light-gray mb-6">
              {m.by()} {album.artists.map((artist, idx) => (
                <span key={artist.id}>
                  <Link
                    to="/artist/$artistId"
                    params={{ artistId: artist.id }}
                    search={{ albumPage: 1 }}
                    className="hover:text-purplefy-white underline-offset-2 hover:underline"
                  >
                    {artist.name}
                  </Link>
                  {idx < album.artists.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>

            <div className="flex items-center gap-6 mb-6 text-purplefy-light-gray">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{releaseYear}</span>
              </div>

              <div className="flex items-center gap-2">
                <Disc className="w-5 h-5" />
                <span>{m.tracks_count({ count: album.total_tracks })}</span>
              </div>
            </div>

            <Button
              onClick={() => window.open(album.external_urls.spotify, '_blank')}
              variant="primary"
              className="inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              {m.open_in_spotify()}
            </Button>
          </div>
        </div>

        <TrackList
          tracks={tracks}
          loading={tracksLoading}
          title={m.album_tracks_title()}
        />
      </div>

      <MobileLayout title={album.name} backTo="/home" showTabs={false}>
        <div className="px-4 py-4">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-64 h-64 mb-4">
              <Image
                src={imageUrl}
                alt={album.name}
                className="w-full h-full rounded-xl shadow-lg"
              />
            </div>
            
            <span className="inline-block px-2 py-1 bg-purplefy-medium-gray text-purplefy-light-gray text-xs rounded-full capitalize mb-2">
              {album.album_type}
            </span>
            
            <h1 className="text-xl font-bold text-purplefy-white mb-2">
              {album.name}
            </h1>
            
            <p className="text-purplefy-light-gray text-sm mb-4">
              {m.by()} {album.artists.map((artist, idx) => (
                <span key={artist.id}>
                  <Link
                    to="/artist/$artistId"
                    params={{ artistId: artist.id }}
                    search={{ albumPage: 1 }}
                    className="hover:text-purplefy-white underline-offset-2 hover:underline"
                  >
                    {artist.name}
                  </Link>
                  {idx < album.artists.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>

            <div className="flex items-center gap-4 mb-4 text-purplefy-light-gray text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{releaseYear}</span>
              </div>

              <div className="flex items-center gap-1">
                <Disc className="w-4 h-4" />
                <span>{m.tracks_count({ count: album.total_tracks })}</span>
              </div>
            </div>

            <Button
              onClick={() => window.open(album.external_urls.spotify, '_blank')}
              variant="primary"
              size="sm"
              className="inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              {m.open_in_spotify()}
            </Button>
          </div>

         
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
