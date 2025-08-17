import { createFileRoute, Link } from '@tanstack/react-router'
import { ExternalLink, ArrowLeft, User } from 'lucide-react'
import { usePlaylist, usePlaylistTracks } from '@/hooks/useSpotify'
import { TrackList } from '@/components/organisms/TrackList/TrackList'
import { Button } from '@/components/atoms/Button/Button'
import { Image } from '@/components/atoms/Image/Image'
import { MobileLayout } from '@/components/organisms/MobileLayout/MobileLayout'

export const Route = createFileRoute('/playlist/$playlistId')({
  component: PlaylistPage,
})

function PlaylistHeader({
  name,
  imageUrl,
  ownerName,
  followers,
  externalUrl,
}: {
  name: string
  imageUrl?: string
  ownerName?: string | null
  followers?: number
  externalUrl?: string
}) {
  return (
    <div className="flex items-center justify-between gap-6 mb-10">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24">
          <Image src={imageUrl} alt={name} className="w-24 h-24 rounded-lg object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-purplefy-white">{name}</h1>
          <div className="flex items-center gap-3 text-purplefy-light-gray mt-2 text-sm">
            <span className="inline-flex items-center gap-1">
              <User className="w-4 h-4" />
              {ownerName || '-'}
            </span>
            <span>•</span>
            <span>{followers?.toLocaleString('pt-BR') ?? '-'} seguidores</span>
          </div>
        </div>
      </div>
      {externalUrl && (
        <Button onClick={() => window.open(externalUrl, '_blank')} variant="secondary" className="inline-flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Abrir no Spotify
        </Button>
      )}
    </div>
  )
}

function PlaylistPage() {
  const { playlistId } = Route.useParams()

  const { data: playlist, isLoading: playlistLoading, error: playlistError } = usePlaylist(playlistId)
  const { data: tracksData, isLoading: tracksLoading } = usePlaylistTracks(playlistId)

  if (playlistError) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-purplefy-white mb-2">Erro ao carregar playlist</h3>
          <p className="text-purplefy-light-gray mb-4">{(playlistError as Error).message}</p>
          <Link to="/profile">
            <Button variant="primary">Voltar</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (playlistLoading) {
    return (
      <>
        <div className="hidden md:block container py-8">
          <div className="skeleton h-8 w-24 mb-6" />
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="skeleton w-24 h-24 rounded-lg" />
            <div className="flex-1 space-y-4">
              <div className="skeleton h-12 w-3/4" />
              <div className="skeleton h-6 w-1/2" />
            </div>
          </div>
        </div>

        <MobileLayout title="Carregando..." backTo="/profile">
          <div className="px-4 py-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="skeleton w-16 h-16 rounded-lg" />
              <div className="space-y-2">
                <div className="skeleton h-6 w-32" />
                <div className="skeleton h-4 w-40" />
              </div>
            </div>
          </div>
        </MobileLayout>
      </>
    )
  }

  if (!playlist) return null

  const imageUrl = playlist.images?.[0]?.url
  const tracks = tracksData?.items || []

  return (
    <>
      <div className="hidden md:block container py-8">
        <Link to="/profile" className="inline-flex items-center gap-2 text-purplefy-light-gray hover:text-purplefy-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao perfil
        </Link>

        <PlaylistHeader
          name={playlist.name}
          imageUrl={imageUrl}
          ownerName={playlist.owner?.display_name}
          followers={(playlist as any)?.followers?.total}
          externalUrl={playlist.external_urls?.spotify}
        />

        <TrackList tracks={tracks} loading={tracksLoading} title="Faixas da Playlist" />
      </div>

      <MobileLayout title={playlist.name} backTo="/profile" showTabs={false}>
        <div className="px-4 py-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16">
              <Image src={imageUrl} alt={playlist.name} className="w-16 h-16 rounded-lg object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-purplefy-white">{playlist.name}</h1>
              <p className="text-purplefy-light-gray text-sm">{playlist.owner?.display_name || '-'}</p>
            </div>
          </div>

          <TrackList tracks={tracks} loading={tracksLoading} title="" />
        </div>
      </MobileLayout>
    </>
  )
}
