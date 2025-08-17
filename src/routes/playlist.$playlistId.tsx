import { createFileRoute } from '@tanstack/react-router'
import { User } from 'lucide-react'
import { usePlaylist, usePlaylistTracks } from '@/hooks/useSpotify'
import { TrackList } from '@/components/organisms/TrackList/TrackList'
import { BackButton, DetailTemplate, ErrorState } from '@/components'
import { Image } from '@/components/atoms/Image/Image'
import { OpenInSpotifyButton } from '@/components/atoms'
import * as m from '@/paraglide/messages.js'

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
            <span>{followers?.toLocaleString() ?? '-'} {m.followers_label()}</span>
          </div>
        </div>
      </div>
      {externalUrl && <OpenInSpotifyButton url={externalUrl} />}
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
        <ErrorState 
          title={m.error_playlist_load_title()}
          message={(playlistError as Error).message}
          action={<BackButton fallbackTo="/profile" variant="primary">{m.back_label()}</BackButton>}
          size="lg"
        />
      </div>
    )
  }

  if (playlistLoading) {
    return (
      <DetailTemplate title={m.loading()} backTo="/profile">
        <div className="flex items-center gap-6 mb-8">
          <div className="skeleton w-24 h-24 rounded-lg" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-8 w-1/2" />
            <div className="skeleton h-5 w-1/3" />
          </div>
        </div>

        <TrackList tracks={[]} loading title={m.playlist_tracks_title()} />
      </DetailTemplate>
    )
  }

  if (!playlist) return null

  const imageUrl = playlist.images?.[0]?.url
  const tracks = tracksData?.items || []

  return (
    <DetailTemplate
      title={playlist.name}
      backTo="/profile"
      header={
        <PlaylistHeader
          name={playlist.name}
          imageUrl={imageUrl}
          ownerName={playlist.owner?.display_name}
          followers={(playlist as any)?.followers?.total}
          externalUrl={playlist.external_urls?.spotify}
        />
      }
    >
      <TrackList tracks={tracks} loading={tracksLoading} title={m.playlist_tracks_title()} />
    </DetailTemplate>
  )
}
