import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink, Calendar, Disc } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button, Image } from '@/components/atoms'
import { TrackList } from '@/components/organisms'
import { useAlbum, useAlbumTracks } from '@/hooks/useSpotify'

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
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-spotify-white mb-2">
            Erro ao carregar álbum
          </h3>
          <p className="text-spotify-light-gray mb-4">
            {albumError.message}
          </p>
          <Link to="/">
            <Button variant="primary">Voltar para busca</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (albumLoading) {
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

  if (!album) return null

  const imageUrl = album.images[0]?.url
  const releaseYear = new Date(album.release_date).getFullYear()
  const tracks = tracksData?.items || []

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
            alt={album.name}
            className="w-full aspect-square rounded-xl shadow-2xl"
          />
        </div>

        <div className="flex-1">
          <span className="inline-block px-3 py-1 bg-spotify-medium-gray text-spotify-light-gray text-sm rounded-full capitalize mb-4">
            {album.album_type}
          </span>

          <h1 className="text-4xl md:text-6xl font-bold text-spotify-white mb-4">
            {album.name}
          </h1>

          <p className="text-xl text-spotify-light-gray mb-6">
            por {album.artists.map(artist => artist.name).join(', ')}
          </p>

          <div className="flex items-center gap-6 mb-6 text-spotify-light-gray">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{releaseYear}</span>
            </div>

            <div className="flex items-center gap-2">
              <Disc className="w-5 h-5" />
              <span>{album.total_tracks} faixas</span>
            </div>
          </div>

          <Button
            onClick={() => window.open(album.external_urls.spotify, '_blank')}
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir no Spotify
          </Button>
        </div>
      </div>

      <div className="border-t border-spotify-medium-gray pt-8">
        <TrackList
          tracks={tracks}
          loading={tracksLoading}
          title="Faixas do Álbum"
        />
      </div>
    </div>
  )
}
